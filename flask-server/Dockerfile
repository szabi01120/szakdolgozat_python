# Használd az official Python image-et
FROM python:3.9-slim

# Beállítjuk a munkakönyvtárat az alkalmazás számára
WORKDIR /app

# Másold be a Python kódot és a csomagokat
COPY . .

# Telepítsd a szükséges csomagokat
RUN pip install --no-cache-dir -r requirements.txt

# Indítsd el a Gunicorn szervert a Flask alkalmazáshoz
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "app:app"]
