import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [graphType, setGraphType] = useState("line");
  const [graphImage, setGraphImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [xColumn, setXColumn] = useState("");
  const [yColumns, setYColumns] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Color selection state
  const [colors, setColors] = useState([]);
  const [applyAll, setApplyAll] = useState(false);
  
  // Zoom and pan state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const chartContainerRef = useRef(null);

  // Memoized default color palette
  const defaultColors = useMemo(() => [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', 
    '#59a14f', '#edc948', '#b07aa1', '#ff9da7', 
    '#9c755f', '#bab0ac', '#ff5733', '#33ff57', 
    '#3377ff', '#ff33a1', '#a133ff', '#33fff5'
  ], []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage("❌ Please select a file first");
      return;
    }
    
    setIsLoading(true);
    setErrorMessage("");
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/sdkreact/upload_file/", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setCategories(response.data.categories);
      setXColumn(response.data.categories[0] || "");
      const initialYColumns = [response.data.categories[1] || ""];
      setYColumns(initialYColumns);
      setColors(defaultColors.slice(0, initialYColumns.length));
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage(error.response?.data?.error || "❌ File upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Update colors when yColumns change
  useEffect(() => {
    if (yColumns.length > 0) {
      setColors(prevColors => {
        if (applyAll && prevColors.length > 0) {
          return Array(yColumns.length).fill(prevColors[0]);
        } else {
          const newColors = [...prevColors];
          while (newColors.length < yColumns.length) {
            newColors.push(defaultColors[newColors.length % defaultColors.length]);
          }
          return newColors.slice(0, yColumns.length);
        }
      });
    }
  }, [yColumns, applyAll, defaultColors]);

  const handleYColumnChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setYColumns(selectedOptions);
  };

  const handleColorChange = (index, newColor) => {
    setColors(prevColors => {
      const updatedColors = [...prevColors];
      updatedColors[index] = newColor;
      if (applyAll) {
        return updatedColors.map(() => newColor);
      }
      return updatedColors;
    });
  };

  const generateGraph = async () => {
    if (!xColumn || yColumns.length === 0) {
      setErrorMessage("⚠️ Please select both X and Y axes.");
      return;
    }
    
    if (['pie', 'sunburst', 'funnel', 'waterfall'].includes(graphType) && yColumns.length > 1) {
      setErrorMessage(`⚠️ ${graphType.charAt(0).toUpperCase() + graphType.slice(1)} chart supports only one Y column`);
      return;
    }
    
    if (graphType === 'combo' && yColumns.length < 2) {
      setErrorMessage("⚠️ Combo chart needs at least 2 Y columns");
      return;
    }
    
    if (graphType === 'stock' && yColumns.length < 4) {
      setErrorMessage("⚠️ Stock chart requires Open, High, Low, Close columns");
      return;
    }
    
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/sdkreact/generate_graph/", {
        graph_type: graphType,
        x_column: xColumn,
        y_columns: yColumns,
        colors: colors,
        color_all: applyAll
      });

      if (response.data.graph) {
        setGraphImage(`data:image/png;base64,${response.data.graph}`);
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    } catch (error) {
      console.error("Error generating graph:", error);
      setErrorMessage(error.response?.data?.error || "❌ Something went wrong while generating the graph.");
      setGraphImage("");
    } finally {
      setIsLoading(false);
    }
  };

  // Zoom and pan handlers
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY * -0.002;
    setScale(prev => Math.min(Math.max(0.5, prev + delta), 3));
  };

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; 
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      container.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="container">
      <h1>📊 DataViz Pro</h1>
      <p className="subtitle">Visualize your data with beautiful charts</p>

      <div className="app-content">
        <div className="controls-section">
          <div className="upload-section">
            <h2>1. Upload Your Data</h2>
            <div className="file-input-container">
              <input 
                type="file" 
                id="file-upload"
                onChange={handleFileChange} 
                accept=".csv,.json"
              />
              <label htmlFor="file-upload" className="file-upload-label">
                {file ? file.name : "Choose a file (CSV or JSON)"}
              </label>
              <button 
                className="upload-btn" 
                onClick={handleUpload}
                disabled={!file || isLoading}
              >
                {isLoading ? "⏳ Uploading..." : "🚀 Upload File"}
              </button>
            </div>
          </div>

          {categories.length > 0 && (
            <div className="configuration-section">
              <h2>2. Configure Your Chart</h2>
              
              <div className="form-group">
                <label>X-Axis Column:</label>
                <select 
                  value={xColumn} 
                  onChange={(e) => setXColumn(e.target.value)}
                  className="form-control"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Y-Axis Column(s):</label>
                <select 
                  multiple 
                  value={yColumns} 
                  onChange={handleYColumnChange}
                  className="form-control multi-select"
                  size={Math.min(5, categories.length)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <small className="hint">Hold Ctrl/Cmd to select multiple</small>
              </div>

              <div className="form-group">
                <label>Chart Type:</label>
                <select 
                  value={graphType} 
                  onChange={(e) => setGraphType(e.target.value)}
                  className="form-control"
                >
                  <option value="line">📈 Line Chart</option>
                  <option value="bar">📊 Bar Chart</option>
                  <option value="pie">🥧 Pie Chart</option>
                  <option value="area">🌄 Area Chart</option>
                  <option value="scatter">🔵 Scatter Plot</option>
                  <option value="histogram">📊 Histogram</option>
                  <option value="box">📦 Box & Whisker</option>
                  <option value="violin">🎻 Violin Plot</option>
                  <option value="funnel">🔽 Funnel Chart</option>
                  <option value="sunburst">☀️ Sunburst Chart</option>
                  <option value="waterfall">💧 Waterfall Chart</option>
                  <option value="combo">🔄 Combo Chart</option>
                  <option value="stock">📈 Stock Chart</option>
                </select>
              </div>

              <div className="color-selection-section">
                <label className="apply-all-checkbox">
                  <input 
                    type="checkbox" 
                    checked={applyAll}
                    onChange={(e) => setApplyAll(e.target.checked)}
                  />
                  Apply first color to all series
                </label>
                
                <div className="color-dropdowns">
                  {yColumns.map((column, index) => (
                    <div key={index} className="color-dropdown-item">
                      <label>{column}:</label>
                      <select
                        value={colors[index] || defaultColors[index % defaultColors.length]}
                        onChange={(e) => handleColorChange(index, e.target.value)}
                        className="color-select"
                      >
                        {defaultColors.map((color, colorIndex) => (
                          <option 
                            key={colorIndex} 
                            value={color}
                            style={{ backgroundColor: color }}
                          >
                            {color}
                          </option>
                        ))}
                      </select>
                      <div 
                        className="color-preview"
                        style={{ backgroundColor: colors[index] || defaultColors[index % defaultColors.length] }}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className="generate-btn" 
                onClick={generateGraph}
                disabled={isLoading}
              >
                {isLoading ? "⏳ Generating..." : "🎨 Generate Chart"}
              </button>
            </div>
          )}

          {errorMessage && (
            <div className={`alert ${errorMessage.includes("❌") ? "alert-error" : "alert-warning"}`}>
              {errorMessage}
            </div>
          )}
        </div>

        {graphImage && (
          <div className="chart-section">
            <h2>
              3. Your Visualization 
              <button onClick={resetView} className="reset-view-btn">
                Reset View
              </button>
            </h2>
            <div className="zoom-controls">
              <button onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}>-</button>
              <span>Zoom: {(scale * 100).toFixed(0)}%</span>
              <button onClick={() => setScale(prev => Math.min(3, prev + 0.1))}>+</button>
            </div>
            <div className="chart-responsive-container">
              <div 
                className="chart-container"
                ref={chartContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ 
                  cursor: isDragging ? 'grabbing' : 'grab',
                  transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                  transformOrigin: '0 0'
                }}
              >
                <img 
                  src={graphImage} 
                  alt="Generated chart" 
                  className="chart-image"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


export default App;