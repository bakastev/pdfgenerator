require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// PDF aus HTML generieren
app.post('/generate-pdf', async (req, res) => {
  const { html, options } = req.body;
  if (!html) return res.status(400).json({ error: 'HTML fehlt' });
  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfBuffer = await page.pdf(options || { format: 'A4' });
    await browser.close();
    res.set({ 'Content-Type': 'application/pdf' });
    res.send(pdfBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Fehler bei der PDF-Erstellung' });
  }
});

app.get('/', (req, res) => {
  res.send('PDF Generator Service läuft!');
});

app.listen(PORT, () => {
  console.log(`PDF-Service läuft auf Port ${PORT}`);
}); 