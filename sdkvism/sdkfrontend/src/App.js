import React, { useState, useRef, useEffect, useMemo } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // API Base URL configuration
  const API_BASE = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';

  const [file, setFile] = useState(null);
  const [graphType, setGraphType] = useState("line");
  const [graphImage, setGraphImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [xColumn, setXColumn] = useState("");
  const [yColumns, setYColumns] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  
  const [colors, setColors] = useState([]);
  const [applyAll, setApplyAll] = useState(false);
  
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const chartContainerRef = useRef(null);

  const defaultColors = useMemo(() => [
    '#4e79a7', '#f28e2b', '#e15759', '#76b7b2', 
    '#59a14f', '#edc948', '#b07aa1', '#ff9da7', 
    '#9c755f', '#bab0ac', '#ff5733', '#33ff57', 
    '#3377ff', '#ff33a1', '#a133ff', '#33fff5'
  ], []);

  const allChartTypes = [
    { type: "line", name: "📈 Line Chart", description: "Best for showing trends over time or ordered categories" },
    { type: "bar", name: "📊 Bar Chart", description: "Ideal for comparing quantities across different categories" },
    { type: "pie", name: "🥧 Pie Chart", description: "Effective for showing proportions of a whole (use with one Y column)" },
    { type: "area", name: "🌄 Area Chart", description: "Similar to line charts but emphasizes volume between axis and line" },
    { type: "scatter", name: "🔵 Scatter Plot", description: "Great for showing relationships between two numerical variables" },
    { type: "histogram", name: "📊 Histogram", description: "Shows distribution of numerical data" },
    { type: "box", name: "📦 Box & Whisker", description: "Displays distribution of data through quartiles" },
    { type: "violin", name: "🎻 Violin Plot", description: "Combines box plot and density trace for distribution visualization" },
    { type: "funnel", name: "🔽 Funnel Chart", description: "Shows progressive reduction of data through phases" },
    { type: "sunburst", name: "☀️ Sunburst Chart", description: "Hierarchical data visualization showing proportions" },
    { type: "waterfall", name: "💧 Waterfall Chart", description: "Illustrates how an initial value is affected by intermediate values" },
    { type: "combo", name: "🔄 Combo Chart", description: "Combines different chart types (needs at least 2 Y columns)" },
    { type: "stock", name: "📈 Stock Chart", description: "Specifically for financial data (needs Open, High, Low, Close)" }
  ];

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
    setRecommendations([]);
    setShowRecommendations(false);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_BASE}/sdkreact/upload_file/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setCategories(response.data.categories);
      setXColumn(response.data.categories[0] || "");
      const initialYColumns = [response.data.categories[1] || ""];
      setYColumns(initialYColumns);
      setColors(defaultColors.slice(0, initialYColumns.length));
      
      // Generate initial graph
      generateGraph(response.data.categories[0] || "", initialYColumns, "line");
      
      // Get AI recommendations
      getAIRecommendations(response.data.categories);
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage(error.response?.data?.error || "❌ File upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getAIRecommendations = async (columns) => {
    try {
      const response = await axios.post(`${API_BASE}/sdkreact/get_recommendations/`, {
        columns: columns
      });
      
      // Include all chart types in recommendations, with AI confidence for suggested ones
      const allRecs = allChartTypes.map(chart => {
        const aiRec = (response.data.recommendations || []).find(r => r.type === chart.type);
        return {
          type: chart.type,
          name: chart.name,
          description: chart.description,
          confidence: aiRec ? aiRec.confidence : 0
        };
      });
      
      setRecommendations(allRecs);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      // Fallback to all chart types if API fails
      setRecommendations(allChartTypes.map(chart => ({
        type: chart.type,
        name: chart.name,
        description: chart.description,
        confidence: 0
      })));
    }
  };

  const applyRecommendation = async (recommendedType) => {
    setGraphType(recommendedType);
    setShowRecommendations(false);
    await generateGraph(xColumn, yColumns, recommendedType);
  };

  const handleYColumnChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    setYColumns(selectedOptions);
    generateGraph(xColumn, selectedOptions, graphType);
  };

  const handleXColumnChange = (e) => {
    const newXColumn = e.target.value;
    setXColumn(newXColumn);
    generateGraph(newXColumn, yColumns, graphType);
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

  const handleGraphTypeChange = (e) => {
    const newType = e.target.value;
    setGraphType(newType);
    generateGraph(xColumn, yColumns, newType);
  };

  const generateGraph = async (xCol, yCols, type) => {
    if (!xCol || yCols.length === 0) {
      return;
    }
    
    if (['pie', 'sunburst', 'funnel', 'waterfall'].includes(type) && yCols.length > 1) {
      setErrorMessage(`⚠️ ${type.charAt(0).toUpperCase() + type.slice(1)} chart supports only one Y column`);
      return;
    }
    
    if (type === 'combo' && yCols.length < 2) {
      setErrorMessage("⚠️ Combo chart needs at least 2 Y columns");
      return;
    }
    
    if (type === 'stock' && yCols.length < 4) {
      setErrorMessage("⚠️ Stock chart requires Open, High, Low, Close columns");
      return;
    }
    
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE}/sdkreact/generate_graph/`, {
        graph_type: type,
        x_column: xCol,
        y_columns: yCols,
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
                  onChange={handleXColumnChange}
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
                <div className="chart-type-header">
                  <label>Chart Type:</label>
                  {recommendations.length > 0 && (
                    <button 
                      className="recommendation-btn"
                      onClick={() => setShowRecommendations(!showRecommendations)}
                    >
                      {showRecommendations ? "Hide Recommendations" : "Show All Recommendations"}
                    </button>
                  )}
                </div>
                
                {showRecommendations && recommendations.length > 0 && (
                  <div className="recommendations-container">
                    <h4>Chart Recommendations for Your Data:</h4>
                    <div className="recommendations-list">
                      {recommendations.map((rec, index) => (
                        <div key={index} className={`recommendation-item ${rec.confidence > 0 ? 'ai-recommended' : ''}`}>
                          <button
                            className={`recommendation-btn ${rec.confidence > 0 ? 'apply' : ''}`}
                            onClick={() => applyRecommendation(rec.type)}
                          >
                            {rec.name}
                            {rec.confidence > 0 && (
                              <span className="recommendation-confidence">
                                (AI: {Math.round(rec.confidence * 100)}%)
                              </span>
                            )}
                          </button>
                          <p className="recommendation-description">
                            {rec.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <select 
                  value={graphType} 
                  onChange={handleGraphTypeChange}
                  className="form-control"
                >
                  {allChartTypes.map(chart => (
                    <option key={chart.type} value={chart.type}>
                      {chart.name}
                    </option>
                  ))}
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