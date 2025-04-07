# 📊 SDK - DataViz Pro

**DataViz Pro** is a web-based tool that automates data visualization using a Django backend and React frontend. It allows users to upload CSV/JSON files, analyze the data, and generate insightful graphs automatically.

---

## 🔧 Features

- Upload CSV or JSON data files  
- Auto-generated graphs using:
  - Matplotlib  
  - Seaborn  
  - mplfinance (candlestick charts)  
- Select chart types: bar, line, scatter, histogram, candlestick, etc.  
- Data filtering and customization  
- AI-based chart recommendation (coming soon)  

---

## Backend Setup (Django)

### 1. Check Python Version

```bash
python --version
```

### 2. Create Virtual Environment

```bash
python -m venv venv
.env\Scripts\ctivate
```

### 3. Install Django

```bash
pip install django
```

### 4. Check Django Version

```bash
python -m django --version
```

### 5. Create Django Project

```bash
django-admin startproject myproject
cd myproject
```

### 6. Run Development Server

```bash
python manage.py runserver
```

### 7. Create Django App

```bash
python manage.py startapp myapp
```

### 8. Apply Migrations

```bash
python manage.py migrate
```

### 9. Create Superuser

```bash
python manage.py createsuperuser
```

### 10. Run Server Again

```bash
python manage.py runserver
```

---

## Frontend Setup (React)

### 1. Create React App

```bash
npx create-react-app frontend
cd frontend
```

### 2. Start Development Server

```bash
npm start
```

---

## Supabase Database Setup

### 1. Install PostgreSQL Support

```bash
pip install psycopg2-binary
```

### 2. Configure `settings.py`

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'your_database_name',
        'USER': 'your_database_user',
        'PASSWORD': 'your_database_password',
        'HOST': 'your_host.supabase.co',
        'PORT': '5432',
    }
}
```

### 3. Migrate Django Models

```bash
python manage.py makemigrations
python manage.py migrate
```

### 4. Run the Server

```bash
python manage.py runserver
```

---

## Python Requirements

Install these Python libraries for data handling, visualization, and API creation:

```bash
pip install django
pip install djangorestframework
pip install pandas
pip install numpy
pip install matplotlib
pip install seaborn
pip install mplfinance
```

---

###  `requirements.txt`

```
Django>=4.2
djangorestframework>=3.16
django-cors-headers>=4.2
pandas==2.2.1
numpy==1.26.4
matplotlib==3.8.3
seaborn==0.13.2
mplfinance==0.12.10b0
```

Install all dependencies:

```bash
pip install -r requirements.txt
```

---

##  Dependencies

| Type     | Library             | Purpose                           |
|----------|---------------------|-----------------------------------|
| Backend  | django              | Django framework                  |
| Backend  | djangorestframework | API creation                      |
| Backend  | pandas              | Data manipulation                 |
| Backend  | numpy               | Numerical operations              |
| Backend  | matplotlib          | Plotting basic charts             |
| Backend  | seaborn             | Advanced statistical charts       |
| Backend  | mplfinance          | Candlestick/finance charts        |
| Frontend | axios               | API calls                         |
| Frontend | recharts            | React-based charting library      |

##Images

![image](https://github.com/user-attachments/assets/9ff68646-68fc-458c-b3a9-a3c7242542ba)
![image](https://github.com/user-attachments/assets/a5435d17-6c88-44e3-9c34-48e51d0ea793)


