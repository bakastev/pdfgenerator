# PDF Generator Microservice

Dieser Service wandelt HTML in PDF um (Puppeteer, Docker, Coolify-ready).

## Setup

1. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
2. Service lokal starten:
   ```bash
   docker compose up --build
   ```

## API

### POST /generate-pdf
- **Body:**
  ```json
  {
    "html": "<h1>Hallo Welt</h1>",
    "options": { "format": "A4" }
  }
  ```
- **Antwort:** PDF (Content-Type: application/pdf)

## Docker
- Nutzt das offizielle Puppeteer-Image
- Keine Volumes nötig

## Deployment
- Einfaches Git-Push & Coolify-Deploy 