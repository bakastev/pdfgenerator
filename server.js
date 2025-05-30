require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS nur für die gewünschten Domains erlauben
app.use(cors({
  origin: ['https://zypernlifestyle.com', 'https://app.zypernlifestyle.com']
}));

app.use(bodyParser.json());

// API-Key Middleware
app.use((req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.API_KEY) {
    return res.status(401).json({ error: 'Ungültiger API-Schlüssel' });
  }
  next();
});

// Templates auflisten
app.get('/templates', (req, res) => {
  const templatesDir = path.join(__dirname, 'templates');
  fs.readdir(templatesDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Fehler beim Lesen der Templates' });
    const templates = files.filter(f => f.endsWith('.hbs'));
    res.json({ templates });
  });
});

// PDF generieren
app.post('/generate-pdf', async (req, res) => {
  const { template, data } = req.body;
  if (!template) return res.status(400).json({ error: 'Template-Name fehlt' });
  const templatePath = path.join(__dirname, 'templates', template);
  if (!fs.existsSync(templatePath)) return res.status(404).json({ error: 'Template nicht gefunden' });

  try {
    const html = fs.readFileSync(templatePath, 'utf8');
    const compiled = handlebars.compile(html);
    const htmlContent = compiled(data || {});

    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    res.set({ 'Content-Type': 'application/pdf' });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler bei der PDF-Erstellung' });
  }
});

app.listen(PORT, () => {
  console.log(`PDF-Service läuft auf Port ${PORT}`);
}); 