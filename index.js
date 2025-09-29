import express from 'express';
import puppeteer from 'puppeteer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/start-server', async (req, res) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const USERNAME = process.env.USERNAME;
    const PASSWORD = process.env.PASSWORD;

    await page.goto('https://aternos.org/go/', { waitUntil: 'networkidle2' });

    // Connexion
    await page.goto('https://aternos.org/servers/', { waitUntil: 'networkidle2' });
    await page.type('#user', USERNAME);
    await page.type('#password', PASSWORD);
    await page.click('#login');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    // Démarrage du serveur
    await page.goto('https://aternos.org/server/', { waitUntil: 'networkidle2' });
    await page.waitForSelector('.server-status');
    const status = await page.$eval('.server-status', el => el.textContent.trim());

    if (status === 'Offline') {
      await page.click('#start');
      await page.waitForSelector('.server-status', { timeout: 15000 });
    }

    await browser.close();
    res.json({ success: true, message: 'Serveur lancé avec succès.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Erreur lors du démarrage du serveur.' });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur backend lancé sur le port ${PORT}`);
});
