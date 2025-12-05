// ESEMPIO DI IMPLEMENTAZIONE SCRAPING REALE
// Questo file NON è incluso nell'applicazione principale
// È una guida per implementare lo scraping vero

// ========================================
// IMPORTANTE: LIMITAZIONI BROWSER
// ========================================
// Lo scraping diretto da browser ha limitazioni:
// 1. CORS: I siti bloccano richieste cross-origin
// 2. Rate limiting: Troppi requests vengono bloccati
// 3. JavaScript rendering: Molti siti usano JS per mostrare quote
//
// SOLUZIONI:
// A) Usare un proxy CORS (es: cors-anywhere)
// B) Creare un backend Node.js che faccia lo scraping
// C) Usare API ufficiali quando disponibili

// ========================================
// OPZIONE A: PROXY CORS (più semplice)
// ========================================

const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

async function fetchWithProxy(url) {
    try {
        const response = await fetch(CORS_PROXY + url);
        const html = await response.text();
        return html;
    } catch (error) {
        console.error('Errore fetch:', error);
        throw new Error('Impossibile caricare la pagina');
    }
}

// Esempio di parsing per Bet365
async function scrapeBet365(url) {
    const html = await fetchWithProxy(url);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Cerca elementi con le quote (classe varia per sito)
    const odds = [];
    const oddsElements = doc.querySelectorAll('.odds-value, .price, [class*="odd"]');
    
    oddsElements.forEach(element => {
        const value = parseFloat(element.textContent.trim());
        if (!isNaN(value) && value > 1) {
            odds.push(value);
        }
    });
    
    return {
        bookmaker: 'Bet365',
        odds: odds,
        url: url
    };
}

// Esempio generico di parsing
function parseOddsFromHTML(html, bookmakerName) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const results = {
        bookmaker: bookmakerName,
        matches: []
    };
    
    // Pattern comuni per trovare quote:
    // - Numeri decimali tra 1.01 e 100.00
    // - Dentro elementi con classi tipo "odd", "quota", "price"
    
    const oddsRegex = /\b(\d{1,2}\.\d{2})\b/g;
    const matches = html.match(oddsRegex);
    
    if (matches) {
        results.odds = matches.map(m => parseFloat(m))
                              .filter(v => v >= 1.01 && v <= 100);
    }
    
    return results;
}

// ========================================
// OPZIONE B: BACKEND NODE.JS (più robusto)
// ========================================

// backend/server.js
/*
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/scrape', async (req, res) => {
    const { url } = req.body;
    
    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });
        
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Estrai quote usando selettori CSS
        const odds = await page.evaluate(() => {
            const elements = document.querySelectorAll('.odds-value, .price');
            return Array.from(elements).map(el => {
                const value = parseFloat(el.textContent.trim());
                return isNaN(value) ? null : value;
            }).filter(v => v !== null);
        });
        
        await browser.close();
        
        res.json({
            success: true,
            odds: odds,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
*/

// Nel frontend chiameresti:
async function scrapeWithBackend(url) {
    const response = await fetch('http://localhost:3000/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url })
    });
    
    const data = await response.json();
    return data;
}

// ========================================
// OPZIONE C: API UFFICIALI (ideale)
// ========================================

// The Odds API (gratis per uso limitato)
const ODDS_API_KEY = 'YOUR_API_KEY_HERE';
const ODDS_API_URL = 'https://api.the-odds-api.com/v4/sports';

async function fetchOddsFromAPI(sport = 'soccer') {
    const url = `${ODDS_API_URL}/${sport}/odds/?apiKey=${ODDS_API_KEY}&regions=eu&markets=h2h`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        return data.map(event => ({
            sport: event.sport_title,
            homeTeam: event.home_team,
            awayTeam: event.away_team,
            commence_time: event.commence_time,
            bookmakers: event.bookmakers.map(bookmaker => ({
                name: bookmaker.title,
                homeOdd: bookmaker.markets[0].outcomes.find(o => o.name === event.home_team)?.price,
                awayOdd: bookmaker.markets[0].outcomes.find(o => o.name === event.away_team)?.price,
                drawOdd: bookmaker.markets[0].outcomes.find(o => o.name === 'Draw')?.price
            }))
        }));
    } catch (error) {
        console.error('Errore API:', error);
        throw error;
    }
}

// ========================================
// CALCOLO ARBITRAGGI (logica reale)
// ========================================

function calculateArbitrage(odds) {
    // odds = [
    //   { bookmaker: 'Bet365', outcome: 'Home', value: 2.50 },
    //   { bookmaker: 'SNAI', outcome: 'Away', value: 3.20 }
    // ]
    
    const inverseSums = [];
    
    // Per ogni combinazione di quote
    for (let i = 0; i < odds.length; i++) {
        for (let j = i + 1; j < odds.length; j++) {
            const inverseSum = (1 / odds[i].value) + (1 / odds[j].value);
            
            // Se la somma degli inversi è < 1, c'è arbitraggio!
            if (inverseSum < 1) {
                const profit = ((1 / inverseSum) - 1) * 100;
                const totalStake = 100; // €100 di esempio
                
                const stake1 = (totalStake / inverseSum) * (1 / odds[i].value);
                const stake2 = (totalStake / inverseSum) * (1 / odds[j].value);
                
                inverseSums.push({
                    hasArbitrage: true,
                    profitPercentage: profit.toFixed(2),
                    odds: [odds[i], odds[j]],
                    stakes: [stake1.toFixed(2), stake2.toFixed(2)],
                    totalStake: totalStake,
                    guaranteedProfit: (stake1 * odds[i].value - totalStake).toFixed(2)
                });
            }
        }
    }
    
    return inverseSums;
}

// Esempio completo di analisi
async function analyzeRealOdds(urls) {
    const allOdds = [];
    
    // Raccolta dati da tutti gli URL
    for (const url of urls) {
        try {
            // Determina quale bookmaker dall'URL
            let bookmaker = 'Unknown';
            if (url.includes('bet365')) bookmaker = 'Bet365';
            else if (url.includes('snai')) bookmaker = 'SNAI';
            else if (url.includes('sisal')) bookmaker = 'Sisal';
            // ... altri bookmaker
            
            const html = await fetchWithProxy(url);
            const odds = parseOddsFromHTML(html, bookmaker);
            allOdds.push(...odds.odds.map(value => ({
                bookmaker: bookmaker,
                value: value,
                url: url
            })));
            
        } catch (error) {
            console.error(`Errore scraping ${url}:`, error);
        }
    }
    
    // Cerca arbitraggi
    const arbitrages = calculateArbitrage(allOdds);
    
    return arbitrages;
}

// ========================================
// SELETTORI COMUNI PER BOOKMAKER
// ========================================

const BOOKMAKER_SELECTORS = {
    'bet365': {
        odds: '.gl-Participant_General, .od-OddsButton_Odds',
        teams: '.gl-Participant_Name',
        sport: '.sph-SportLabel'
    },
    'snai': {
        odds: '.quota-value, .odd-value',
        teams: '.team-name',
        sport: '.sport-name'
    },
    'sisal': {
        odds: '.odds, .quota',
        teams: '.match-team',
        sport: '.sport-category'
    }
    // Aggiungi altri bookmaker...
};

function getSelectorsForUrl(url) {
    for (const [bookmaker, selectors] of Object.entries(BOOKMAKER_SELECTORS)) {
        if (url.includes(bookmaker)) {
            return { bookmaker, ...selectors };
        }
    }
    return null;
}

// ========================================
// BEST PRACTICES
// ========================================

/*
1. RISPETTA I TERMINI DI SERVIZIO
   - Leggi i ToS dei siti prima di fare scraping
   - Molti siti vietano lo scraping automatico
   - Considera di usare API ufficiali quando disponibili

2. RATE LIMITING
   - Non fare troppe richieste troppo velocemente
   - Aggiungi delay tra le richieste (1-2 secondi)
   - Usa headers User-Agent realistici

3. ERROR HANDLING
   - Gestisci sempre errori di network
   - Timeout per richieste lunghe
   - Retry logic per fallimenti temporanei

4. CACHING
   - Salva risultati per evitare richieste duplicate
   - Le quote cambiano, ma non ogni secondo
   - Cache di 30-60 secondi è ragionevole

5. PRIVACY
   - Non salvare dati personali degli utenti
   - Non tracciare comportamenti
   - Sii trasparente su cosa fa il tuo tool
*/

// ========================================
// ESEMPIO COMPLETO CON BEST PRACTICES
// ========================================

class OddsScraper {
    constructor() {
        this.cache = new Map();
        this.cacheDuration = 60000; // 60 secondi
        this.requestDelay = 1500; // 1.5 secondi tra richieste
        this.lastRequest = 0;
    }
    
    async scrape(url) {
        // Check cache
        if (this.cache.has(url)) {
            const cached = this.cache.get(url);
            if (Date.now() - cached.timestamp < this.cacheDuration) {
                console.log('Using cached data for', url);
                return cached.data;
            }
        }
        
        // Rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequest;
        if (timeSinceLastRequest < this.requestDelay) {
            await new Promise(resolve => 
                setTimeout(resolve, this.requestDelay - timeSinceLastRequest)
            );
        }
        
        try {
            this.lastRequest = Date.now();
            
            const response = await fetch(CORS_PROXY + url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                },
                timeout: 10000 // 10 secondi timeout
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            const data = this.parseHTML(html, url);
            
            // Update cache
            this.cache.set(url, {
                data: data,
                timestamp: Date.now()
            });
            
            return data;
            
        } catch (error) {
            console.error('Scraping failed:', error);
            
            // Retry once dopo 3 secondi
            if (!error.retry) {
                await new Promise(resolve => setTimeout(resolve, 3000));
                error.retry = true;
                return this.scrape(url);
            }
            
            throw error;
        }
    }
    
    parseHTML(html, url) {
        const selectors = getSelectorsForUrl(url);
        if (!selectors) {
            throw new Error('Bookmaker non supportato');
        }
        
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const odds = Array.from(doc.querySelectorAll(selectors.odds))
            .map(el => parseFloat(el.textContent.trim()))
            .filter(v => !isNaN(v) && v >= 1.01 && v <= 100);
        
        return {
            bookmaker: selectors.bookmaker,
            odds: odds,
            timestamp: new Date().toISOString()
        };
    }
}

// Uso:
// const scraper = new OddsScraper();
// const data = await scraper.scrape('https://www.bet365.it/...');
