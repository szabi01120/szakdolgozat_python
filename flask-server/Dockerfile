FROM python:3.9-slim

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]


# FROM python:3.9-slim

# WORKDIR /app

# COPY requirements.txt .

# RUN pip install --no-cache-dir -r requirements.txt

# COPY . .

# ENV FLASK_APP=app.py
# ENV FLASK_ENV=development
# ENV FLASK_DEBUG=1 

# EXPOSE 5000

# CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
