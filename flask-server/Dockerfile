# FROM python:3.9-slim

# WORKDIR /app

# COPY . .

# RUN pip install -r requirements.txt

# CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]


# Backend Dockerfile
FROM python:3.9-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the requirements file first to leverage Docker caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the project into the container
COPY . .

# Set environment variables for Flask
ENV FLASK_APP=app.py
ENV FLASK_ENV=development
ENV FLASK_DEBUG=1 

# Expose the port the app runs on
EXPOSE 5000

# Command to run the Flask app and enable hot-reload
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
