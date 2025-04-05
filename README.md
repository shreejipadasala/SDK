#SDK-
# DataViz Pro - Automated Data Visualization Tool

**DataViz Pro** is a web-based tool that automates data visualization using a Django backend and React frontend. It allows users to upload CSV/JSON files, analyze the data, and generate insightful graphs automatically.

## 🔧 Features

- 📁 Upload CSV or JSON data files
- 📊 Auto-generated graphs using:
  - Matplotlib
  - Seaborn
  - mplfinance (candlestick charts)
- 📈 Select chart types: bar, line, scatter, histogram, candlestick, etc.
- 🧠 Bonus: AI-based chart recommendation (coming soon)
- 🔍 Data filtering and customization

---
#For Backend

1.Check Python Version

    python --version

2.Create Virtual Environment
    python -m venv venv
    .\venv\Scripts\activate

3.Install Django
    pip install django

4.Check Django Version
    python -m django --version

5.Create Django Project
    django-admin startproject myproject
    cd myproject

6.Run Development Server
    python manage.py runserver

7.Create Django App
    python manage.py startapp myapp

8.Apply Migrations
    python manage.py migrate

10.Create Superuser (Admin Login)
    python manage.py createsuperuser

11.Run Server Again
    python manage.py runserver



#For react

1.Create a New React App
    npx create-react-app my-app
    cd my-app

2.Start the Development Server
    npm start

#supabase database 

1. Install PostgreSQL Support in Django
    pip install psycopg2-binary

#setting.py  

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


3.Migrate Django Models
    python manage.py makemigrations
    python manage.py migrate

4.python manage.py runserver




##Python (Backend - Django)
##Install these Python libraries for data handling, visualization, and API creation:

pip install django
pip install djangorestframework
pip install pandas
pip install numpy
pip install matplotlib
pip install seaborn
pip install mplfinance

##requirements.txt
Django>=4.2
djangorestframework>=3.16
django-cors-headers>=4.2
pandas==2.2.1
numpy==1.26.4
matplotlib==3.8.3
seaborn==0.13.2
mplfinance==0.12.10b0
##Then install them using:
pip install -r requirements.txt

##Dependencies

pandas - Data manipulation

numpy - Numeric computations

matplotlib - Graph plotting

seaborn - Statistical visualization

mplfinance - Financial candlestick charts

djangorestframework - Django APIs




##JavaScript (Frontend - React)
##When you're in the frontend/ folder, install React and supporting libraries:
npx create-react-app frontend
cd frontend
npm install axios
npm install recharts

#Summary
Type	Library	Purpose
Backend	django	Django framework
Backend	djangorestframework	API creation
Backend	pandas	Data manipulation
Backend	numpy	Numerical operations
Backend	matplotlib	Plotting basic charts
Backend	seaborn	Advanced statistical charts
Backend	mplfinance	Candlestick/finance charts
Frontend axios	API calls
Frontend chart.js	Chart library (optional)
Frontend react-chartjs-2	React wrapper for Chart.js (optional)
Frontend recharts	Alternative charting lib (optional)


