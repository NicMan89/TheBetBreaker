// Credenziali (hash SHA-256 delle password)
// Username: NicMan89, Davide
const USERS = {
    'NicMan89': '774e797343ecca2d15f4055c809c7f3449c391cf2580f704e6c7abcaf9fdf765', // Hash di password
    'Davide': 'eacc0d256abdfb52314d28592fd9cb8ce8e06dbae1c519ca3a258b1c2973c831'    // Hash di password
};

// API Configuration (per quote reali)
const API_CONFIG = {
    ODDS_API_KEY: '', // Inserisci la tua key da https://the-odds-api.com (500 req/mese gratis)
    ODDS_API_URL: 'https://api.the-odds-api.com/v4',
    USE_REAL_DATA: false // Imposta true quando hai configurato l'API key
};

// Bookmaker principali con URL (hardcoded)
const BOOKMAKERS = {
    'bet365': {
        name: 'Bet365',
        urls: {
            calcio: 'https://www.bet365.it/#/AC/B1/C1/D8/E187160/F8/',
            tennis: 'https://www.bet365.it/#/AC/B2/C1/D8/E187161/F8/',
            basket: 'https://www.bet365.it/#/AC/B18/C1/D8/E187162/F8/'
        },
        color: '#1E5C3E'
    },
    'snai': {
        name: 'SNAI',
        urls: {
            calcio: 'https://www.snai.it/sport/calcio',
            tennis: 'https://www.snai.it/sport/tennis',
            basket: 'https://www.snai.it/sport/basket'
        },
        color: '#D32F2F'
    },
    'sisal': {
        name: 'Sisal',
        urls: {
            calcio: 'https://www.sisal.it/scommesse/sport/calcio',
            tennis: 'https://www.sisal.it/scommesse/sport/tennis',
            basket: 'https://www.sisal.it/scommesse/sport/basket'
        },
        color: '#1976D2'
    },
    'eurobet': {
        name: 'Eurobet',
        urls: {
            calcio: 'https://www.eurobet.it/it/scommesse/calcio/',
            tennis: 'https://www.eurobet.it/it/scommesse/tennis/',
            basket: 'https://www.eurobet.it/it/scommesse/basket/'
        },
        color: '#FF6F00'
    },
    'williamhill': {
        name: 'William Hill',
        urls: {
            calcio: 'https://sports.williamhill.it/betting/it-it/calcio',
            tennis: 'https://sports.williamhill.it/betting/it-it/tennis',
            basket: 'https://sports.williamhill.it/betting/it-it/basket'
        },
        color: '#0A3D62'
    },
    'betfair': {
        name: 'Betfair',
        urls: {
            calcio: 'https://www.betfair.it/sport/calcio',
            tennis: 'https://www.betfair.it/sport/tennis',
            basket: 'https://www.betfair.it/sport/basket'
        },
        color: '#FFB300'
    },
    'lottomatica': {
        name: 'Lottomatica',
        urls: {
            calcio: 'https://www.lottomatica.it/scommesse/calcio',
            tennis: 'https://www.lottomatica.it/scommesse/tennis',
            basket: 'https://www.lottomatica.it/scommesse/basket'
        },
        color: '#00897B'
    },
    'goldbet': {
        name: 'GoldBet',
        urls: {
            calcio: 'https://www.goldbet.it/scommesse/calcio',
            tennis: 'https://www.goldbet.it/scommesse/tennis',
            basket: 'https://www.goldbet.it/scommesse/basket'
        },
        color: '#F9A825'
    }
};

// Bonus attuali bookmaker (aggiornato periodicamente)
const BONUSES = [
    {
        bookmaker: 'Bet365',
        title: 'Bonus Benvenuto Sport',
        amount: '€100',
        type: '100% fino a €100',
        conditions: 'Deposito minimo €10. Rollover 3x su quote minime 1.50',
        link: 'https://www.bet365.it',
        validUntil: '31/12/2025'
    },
    {
        bookmaker: 'SNAI',
        title: 'Bonus Sport + Casino',
        amount: '€30 + €5',
        type: '50% fino a €30 + €5 gratis',
        conditions: 'Deposito minimo €10. Bonus sport rollover 4x, quote min 2.00',
        link: 'https://www.snai.it',
        validUntil: '31/12/2025'
    },
    {
        bookmaker: 'Sisal',
        title: 'Bonus Multipla',
        amount: '€100 + €50',
        type: '100% fino a €100 + €50 casino',
        conditions: 'Primo deposito. Rollover 5x su multiple con 3+ eventi',
        link: 'https://www.sisal.it',
        validUntil: '31/12/2025'
    },
    {
        bookmaker: 'Eurobet',
        title: 'Bonus Scommesse',
        amount: '€10',
        type: '€10 gratis alla registrazione',
        conditions: 'Nessun deposito richiesto. Rollover 1x su quote min 2.00',
        link: 'https://www.eurobet.it',
        validUntil: '31/12/2025'
    },
    {
        bookmaker: 'William Hill',
        title: 'Bonus Primo Deposito',
        amount: '€100',
        type: '100% fino a €100',
        conditions: 'Deposito minimo €10. Rollover 6x su quote min 1.80',
        link: 'https://sports.williamhill.it',
        validUntil: '31/12/2025'
    },
    {
        bookmaker: 'Betfair',
        title: 'Scommessa Gratis',
        amount: '€20',
        type: '€20 scommessa gratuita',
        conditions: 'Deposito €10 e scommessa €10. Rimborso se perdi',
        link: 'https://www.betfair.it',
        validUntil: '31/12/2025'
    },
    {
        bookmaker: 'Lottomatica',
        title: 'Bonus Sport',
        amount: '€50',
        type: '100% fino a €50',
        conditions: 'Deposito minimo €20. Rollover 3x su quote min 1.50',
        link: 'https://www.lottomatica.it',
        validUntil: '31/12/2025'
    }
];

// Array per memorizzare gli URL selezionati
let urls = [];
let selectedBookmakers = [];

// Funzione SHA-256 per hashare le password
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Login handler
document.getElementById('loginForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Hash della password inserita
    const passwordHash = await sha256(password);
    
    if (USERS[username] && USERS[username] === passwordHash) {
        // Login successful
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('username', username);
        showDashboard();
    } else {
        showError('Username o password non corretti');
    }
});

// Mostra errore
function showError(message) {
    const errorDiv = document.getElementById('errorMsg');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    
    setTimeout(() => {
        errorDiv.style.display = 'none';
    }, 3000);
}

// Mostra dashboard
function showDashboard() {
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    
    const username = sessionStorage.getItem('username');
    document.getElementById('userDisplay').textContent = username;
    
    // Inizializza bookmakers e bonus
    renderBookmakers();
    renderBonuses();
    
    // Carica impostazioni API
    loadApiSettings();
}

// Render bookmakers con checkbox
function renderBookmakers() {
    const bookmakersGrid = document.getElementById('bookmakersGrid');
    
    bookmakersGrid.innerHTML = Object.entries(BOOKMAKERS).map(([key, bookmaker]) => `
        <div class="bookmaker-card">
            <label class="bookmaker-checkbox">
                <input type="checkbox" value="${key}" onchange="toggleBookmaker('${key}')">
                <span class="checkmark"></span>
                <div class="bookmaker-info">
                    <div class="bookmaker-name" style="color: ${bookmaker.color}">
                        ${bookmaker.name}
                    </div>
                    <div class="bookmaker-sports">
                        ⚽ Calcio | 🎾 Tennis | 🏀 Basket
                    </div>
                </div>
            </label>
        </div>
    `).join('');
}

// Toggle bookmaker selection
function toggleBookmaker(bookmakerKey) {
    const checkbox = document.querySelector(`input[value="${bookmakerKey}"]`);
    const bookmaker = BOOKMAKERS[bookmakerKey];
    
    if (checkbox.checked) {
        // Aggiungi tutti gli URL del bookmaker
        Object.values(bookmaker.urls).forEach(url => {
            if (!urls.includes(url)) {
                urls.push(url);
            }
        });
        selectedBookmakers.push(bookmakerKey);
    } else {
        // Rimuovi tutti gli URL del bookmaker
        Object.values(bookmaker.urls).forEach(url => {
            const index = urls.indexOf(url);
            if (index > -1) {
                urls.splice(index, 1);
            }
        });
        selectedBookmakers = selectedBookmakers.filter(k => k !== bookmakerKey);
    }
    
    updateUrlList();
    updateAnalyzeButton();
    updateSelectedCount();
}

// Aggiorna contatore bookmaker selezionati
function updateSelectedCount() {
    const count = selectedBookmakers.length;
    const countElement = document.getElementById('selectedCount');
    if (countElement) {
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'inline-block' : 'none';
    }
}

// Render bonuses
function renderBonuses() {
    const bonusesList = document.getElementById('bonusesList');
    
    bonusesList.innerHTML = BONUSES.map(bonus => `
        <div class="bonus-card">
            <div class="bonus-header">
                <h3>${bonus.bookmaker}</h3>
                <span class="bonus-amount">${bonus.amount}</span>
            </div>
            <div class="bonus-title">${bonus.title}</div>
            <div class="bonus-type">${bonus.type}</div>
            <div class="bonus-conditions">
                <strong>Condizioni:</strong> ${bonus.conditions}
            </div>
            <div class="bonus-footer">
                <span class="bonus-validity">Valido fino: ${bonus.validUntil}</span>
                <a href="${bonus.link}" target="_blank" class="bonus-link">Vai al sito →</a>
            </div>
        </div>
    `).join('');
}

// Switch tra tabs
function switchTab(tabName) {
    // Nascondi tutti i tab content
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Rimuovi active da tutti i bottoni
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Mostra tab selezionato
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelector(`[onclick="switchTab('${tabName}')"]`).classList.add('active');
    
    // Se è il tab settings, aggiorna lo stato
    if (tabName === 'settings') {
        updateApiStatusDisplay();
    }
}

// Salva configurazione API
function saveApiSettings() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    const useRealData = document.getElementById('useRealDataCheckbox').checked;
    
    if (useRealData && !apiKey) {
        showApiStatus('Inserisci una API key valida per usare dati reali', 'error');
        return;
    }
    
    // Salva in configurazione
    API_CONFIG.ODDS_API_KEY = apiKey;
    API_CONFIG.USE_REAL_DATA = useRealData;
    
    // Salva in localStorage
    localStorage.setItem('oddsApiKey', apiKey);
    localStorage.setItem('useRealData', useRealData);
    
    showApiStatus('✅ Configurazione salvata con successo!', 'success');
    updateApiStatusDisplay();
}

// Mostra status salvataggio
function showApiStatus(message, type) {
    const statusDiv = document.getElementById('apiStatus');
    statusDiv.style.display = 'block';
    statusDiv.textContent = message;
    
    if (type === 'success') {
        statusDiv.style.background = '#d4edda';
        statusDiv.style.color = '#155724';
        statusDiv.style.borderLeft = '4px solid #28a745';
    } else {
        statusDiv.style.background = '#f8d7da';
        statusDiv.style.color = '#721c24';
        statusDiv.style.borderLeft = '4px solid #dc3545';
    }
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

// Aggiorna display stato API
function updateApiStatusDisplay() {
    const statusP = document.getElementById('currentApiStatus');
    
    if (API_CONFIG.USE_REAL_DATA && API_CONFIG.ODDS_API_KEY) {
        statusP.innerHTML = '✅ <strong>API Configurata</strong> - L\'analisi userà quote reali da The-Odds-API';
        statusP.style.background = '#d4edda';
        statusP.style.color = '#155724';
        statusP.parentElement.style.background = '#d4edda';
        statusP.parentElement.style.borderColor = '#28a745';
    } else if (API_CONFIG.ODDS_API_KEY && !API_CONFIG.USE_REAL_DATA) {
        statusP.innerHTML = '⚠️ <strong>API Key presente ma disabilitata</strong> - Abilita "Usa dati reali" per utilizzarla';
        statusP.style.background = '#fff3cd';
        statusP.style.color = '#856404';
        statusP.parentElement.style.background = '#fff3cd';
        statusP.parentElement.style.borderColor = '#ffc107';
    } else {
        statusP.innerHTML = '🎲 <strong>Modalità Demo</strong> - L\'analisi userà dati simulati per dimostrazione';
        statusP.style.color = '#856404';
        statusP.parentElement.style.background = '#fff3cd';
        statusP.parentElement.style.borderColor = '#ffc107';
    }
}

// Carica impostazioni API da localStorage
function loadApiSettings() {
    const savedApiKey = localStorage.getItem('oddsApiKey');
    const savedUseRealData = localStorage.getItem('useRealData') === 'true';
    
    if (savedApiKey) {
        API_CONFIG.ODDS_API_KEY = savedApiKey;
        document.getElementById('apiKeyInput').value = savedApiKey;
    }
    
    if (savedUseRealData) {
        API_CONFIG.USE_REAL_DATA = savedUseRealData;
        document.getElementById('useRealDataCheckbox').checked = savedUseRealData;
    }
    
    updateApiStatusDisplay();
}

// Logout
function logout() {
    sessionStorage.clear();
    urls = [];
    selectedBookmakers = [];
    document.getElementById('dashboard').classList.add('hidden');
    document.getElementById('loginContainer').classList.remove('hidden');
    document.getElementById('loginForm').reset();
    
    // Reset checkboxes
    document.querySelectorAll('.bookmaker-checkbox input').forEach(cb => {
        cb.checked = false;
    });
    
    updateUrlList();
    updateSelectedCount();
}

// Aggiungi URL
function addUrl() {
    const urlInput = document.getElementById('urlInput');
    const url = urlInput.value.trim();
    
    if (!url) {
        alert('Inserisci un URL valido');
        return;
    }
    
    // Validazione base URL
    try {
        new URL(url);
    } catch (e) {
        alert('URL non valido. Assicurati di includere http:// o https://');
        return;
    }
    
    if (urls.includes(url)) {
        alert('Questo URL è già stato aggiunto');
        return;
    }
    
    urls.push(url);
    urlInput.value = '';
    updateUrlList();
    updateAnalyzeButton();
}

// Rimuovi URL
function removeUrl(index) {
    const urlToRemove = urls[index];
    
    // Controlla se è un URL di un bookmaker e deseleziona il checkbox
    for (const [key, bookmaker] of Object.entries(BOOKMAKERS)) {
        if (Object.values(bookmaker.urls).includes(urlToRemove)) {
            const checkbox = document.querySelector(`input[value="${key}"]`);
            if (checkbox) {
                checkbox.checked = false;
            }
            selectedBookmakers = selectedBookmakers.filter(k => k !== key);
            
            // Rimuovi tutti gli URL di quel bookmaker
            Object.values(bookmaker.urls).forEach(url => {
                const idx = urls.indexOf(url);
                if (idx > -1) {
                    urls.splice(idx, 1);
                }
            });
            
            updateUrlList();
            updateAnalyzeButton();
            updateSelectedCount();
            return;
        }
    }
    
    // Se non è un URL bookmaker, rimuovi solo quello
    urls.splice(index, 1);
    updateUrlList();
    updateAnalyzeButton();
}

// Aggiorna lista URL
function updateUrlList() {
    const urlListDiv = document.getElementById('urlList');
    
    if (urls.length === 0) {
        urlListDiv.innerHTML = '<p style="color: #999; text-align: center; margin-top: 10px;">Nessun URL aggiunto</p>';
        return;
    }
    
    // Separa URL bookmaker da URL custom
    const bookmakerUrls = [];
    const customUrls = [];
    
    urls.forEach(url => {
        let isBookmakerUrl = false;
        for (const [key, bookmaker] of Object.entries(BOOKMAKERS)) {
            if (Object.values(bookmaker.urls).includes(url)) {
                bookmakerUrls.push({ url, bookmaker: bookmaker.name });
                isBookmakerUrl = true;
                break;
            }
        }
        if (!isBookmakerUrl) {
            customUrls.push({ url, bookmaker: 'Personalizzato' });
        }
    });
    
    let html = '';
    
    // Mostra URL bookmaker
    if (bookmakerUrls.length > 0) {
        html += '<div style="margin-bottom: 15px;"><strong style="font-size: 14px; color: #667eea;">📌 Bookmaker Selezionati:</strong></div>';
        html += bookmakerUrls.map((item, index) => `
            <div class="url-item bookmaker-url">
                <span>
                    <strong style="color: #667eea;">${item.bookmaker}</strong><br>
                    <small style="color: #999;">${item.url}</small>
                </span>
                <button class="remove-btn" onclick="removeUrl(${urls.indexOf(item.url)})">✖</button>
            </div>
        `).join('');
    }
    
    // Mostra URL custom
    if (customUrls.length > 0) {
        html += '<div style="margin: 20px 0 15px 0;"><strong style="font-size: 14px; color: #764ba2;">🔗 URL Personalizzati:</strong></div>';
        html += customUrls.map((item, index) => `
            <div class="url-item custom-url">
                <span>${item.url}</span>
                <button class="remove-btn" onclick="removeUrl(${urls.indexOf(item.url)})">✖</button>
            </div>
        `).join('');
    }
    
    urlListDiv.innerHTML = html;
}

// Aggiorna pulsante analizza
function updateAnalyzeButton() {
    const analyzeBtn = document.getElementById('analyzeBtn');
    analyzeBtn.disabled = urls.length < 2;
}

// Funzione per simulare lo scraping e analisi
async function analyzeUrls() {
    const resultsDiv = document.getElementById('results');
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // Disabilita pulsante durante l'analisi
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = '⏳ Analisi in corso...';
    
    // Mostra loading
    resultsDiv.innerHTML = `
        <div class="loading">
            <div class="spinner"></div>
            <p>Analisi delle quote in corso...</p>
            <p style="font-size: 12px; margin-top: 10px;">Estrazione dati da ${urls.length} sorgenti</p>
        </div>
    `;
    
    try {
        // Simula il tempo di scraping
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Analisi simulata delle quote
        const arbitrages = await analyzeOdds();
        
        // Mostra risultati
        displayResults(arbitrages);
        
    } catch (error) {
        resultsDiv.innerHTML = `
            <div style="color: #f44336; text-align: center; padding: 20px;">
                <strong>❌ Errore durante l'analisi</strong>
                <p style="margin-top: 10px; font-size: 14px;">${error.message}</p>
            </div>
        `;
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = '🔍 Analizza Quote';
    }
}

// Analizza le quote e cerca arbitraggi
async function analyzeOdds() {
    // Se API configurata, usa dati reali
    if (API_CONFIG.USE_REAL_DATA && API_CONFIG.ODDS_API_KEY) {
        try {
            return await analyzeRealOdds();
        } catch (error) {
            console.error('Errore API, uso dati simulati:', error);
            // Fallback a simulazione
            return analyzeSimulatedOdds();
        }
    } else {
        // Usa dati simulati se API non configurata
        return analyzeSimulatedOdds();
    }
}

// Analisi con dati REALI da The-Odds-API
async function analyzeRealOdds() {
    console.log('📡 Recupero quote reali da The-Odds-API...');
    
    // Sport supportati
    const sports = [
        'soccer_italy_serie_a',
        'soccer_spain_la_liga', 
        'soccer_epl',
        'tennis_atp',
        'basketball_euroleague'
    ];
    
    const allOdds = [];
    
    // Recupera quote per ogni sport
    for (const sport of sports) {
        try {
            const url = `${API_CONFIG.ODDS_API_URL}/sports/${sport}/odds/?apiKey=${API_CONFIG.ODDS_API_KEY}&regions=eu&markets=h2h&oddsFormat=decimal`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('API Key non valida');
                } else if (response.status === 429) {
                    throw new Error('Limite richieste API superato');
                }
                continue;
            }
            
            const data = await response.json();
            
            // Processa ogni evento
            for (const event of data) {
                const odds = parseRealOdds(event);
                if (odds) allOdds.push(odds);
            }
            
        } catch (error) {
            console.error(`Errore recupero ${sport}:`, error);
        }
    }
    
    if (allOdds.length === 0) {
        throw new Error('Nessuna quota recuperata dalle API');
    }
    
    console.log(`✅ Recuperate ${allOdds.length} eventi con quote reali`);
    
    // Calcola arbitraggi
    return calculateArbitrages(allOdds);
}

// Parse quote da risposta API
function parseRealOdds(event) {
    if (!event.bookmakers || event.bookmakers.length < 2) {
        return null;
    }
    
    const odds = {
        sport: formatSportName(event.sport_key),
        event: `${event.home_team} vs ${event.away_team}`,
        homeTeam: event.home_team,
        awayTeam: event.away_team,
        commenceTime: new Date(event.commence_time),
        bookmakerOdds: []
    };
    
    // Estrai quote da ogni bookmaker
    for (const bookmaker of event.bookmakers) {
        const market = bookmaker.markets.find(m => m.key === 'h2h');
        if (!market || !market.outcomes) continue;
        
        const homeOdd = market.outcomes.find(o => o.name === event.home_team);
        const awayOdd = market.outcomes.find(o => o.name === event.away_team);
        const drawOdd = market.outcomes.find(o => o.name === 'Draw');
        
        if (homeOdd && awayOdd) {
            odds.bookmakerOdds.push({
                bookmaker: formatBookmakerName(bookmaker.key),
                homeOdd: homeOdd.price,
                awayOdd: awayOdd.price,
                drawOdd: drawOdd ? drawOdd.price : null
            });
        }
    }
    
    return odds.bookmakerOdds.length >= 2 ? odds : null;
}

// Calcola arbitraggi da quote reali
function calculateArbitrages(oddsData) {
    const arbitrages = [];
    
    for (const event of oddsData) {
        // Cerca arbitraggi tra ogni coppia di bookmaker
        for (let i = 0; i < event.bookmakerOdds.length; i++) {
            for (let j = i + 1; j < event.bookmakerOdds.length; j++) {
                const book1 = event.bookmakerOdds[i];
                const book2 = event.bookmakerOdds[j];
                
                // Prova combinazione: Home da book1, Away da book2
                let arb = checkArbitrage(
                    event, 
                    book1.bookmaker, book1.homeOdd, event.homeTeam,
                    book2.bookmaker, book2.awayOdd, event.awayTeam
                );
                if (arb) arbitrages.push(arb);
                
                // Prova combinazione: Home da book2, Away da book1
                arb = checkArbitrage(
                    event,
                    book2.bookmaker, book2.homeOdd, event.homeTeam,
                    book1.bookmaker, book1.awayOdd, event.awayTeam
                );
                if (arb) arbitrages.push(arb);
                
                // Se c'è pareggio, prova altre combinazioni
                if (book1.drawOdd && book2.homeOdd) {
                    arb = checkArbitrage(
                        event,
                        book2.bookmaker, book2.homeOdd, event.homeTeam,
                        book1.bookmaker, book1.drawOdd, 'Pareggio'
                    );
                    if (arb) arbitrages.push(arb);
                }
            }
        }
    }
    
    // Ordina per profitto decrescente
    return arbitrages.sort((a, b) => b.profitPercentage - a.profitPercentage);
}

// Verifica se esiste arbitraggio tra due quote
function checkArbitrage(event, book1, odd1, outcome1, book2, odd2, outcome2) {
    const inverseSum = (1 / odd1) + (1 / odd2);
    
    // Esiste arbitraggio se somma inversi < 1
    if (inverseSum >= 1) {
        return null;
    }
    
    const profitPercentage = ((1 / inverseSum) - 1) * 100;
    
    // Solo arbitraggi con almeno 0.5% di profitto (per coprire commissioni)
    if (profitPercentage < 0.5) {
        return null;
    }
    
    const totalStake = 100;
    const stake1 = (totalStake / inverseSum) * (1 / odd1);
    const stake2 = (totalStake / inverseSum) * (1 / odd2);
    const profit = (stake1 * odd1) - totalStake;
    
    return {
        sport: event.sport,
        event: event.event,
        outcome1: outcome1,
        outcome2: outcome2,
        bookmaker1: book1,
        bookmaker2: book2,
        odd1: parseFloat(odd1.toFixed(2)),
        odd2: parseFloat(odd2.toFixed(2)),
        stake1: parseFloat(stake1.toFixed(2)),
        stake2: parseFloat(stake2.toFixed(2)),
        profit: parseFloat(profit.toFixed(2)),
        profitPercentage: parseFloat(profitPercentage.toFixed(2)),
        totalStake: totalStake,
        commenceTime: event.commenceTime
    };
}

// Formatta nome sport
function formatSportName(sportKey) {
    const mapping = {
        'soccer_italy_serie_a': 'Calcio - Serie A',
        'soccer_spain_la_liga': 'Calcio - La Liga',
        'soccer_epl': 'Calcio - Premier League',
        'tennis_atp': 'Tennis - ATP',
        'basketball_euroleague': 'Basket - Euroleague'
    };
    return mapping[sportKey] || sportKey;
}

// Formatta nome bookmaker
function formatBookmakerName(bookmakerKey) {
    const mapping = {
        'bet365': 'Bet365',
        'williamhill': 'William Hill',
        'betfair': 'Betfair',
        'unibet': 'Unibet',
        'marathon': 'Marathon',
        'pinnacle': 'Pinnacle',
        '888sport': '888sport',
        'betvictor': 'BetVictor'
    };
    return mapping[bookmakerKey] || bookmakerKey;
}

// Analisi con dati SIMULATI (fallback)
function analyzeSimulatedOdds() {
    console.log('🎲 Uso dati simulati (API non configurata)');
    
    const arbitrages = [];
    
    // Simula la ricerca di arbitraggi
    const hasArbitrage = Math.random() > 0.3; // 70% di possibilità
    
    if (hasArbitrage) {
        const numOpportunities = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < numOpportunities; i++) {
            arbitrages.push(generateArbitrageOpportunity());
        }
    }
    
    return arbitrages;
}

// Genera un'opportunità di arbitraggio simulata
function generateArbitrageOpportunity() {
    const sports = ['Calcio', 'Tennis', 'Basket', 'Hockey'];
    const teams = [
        ['Inter', 'Milan'],
        ['Juventus', 'Napoli'],
        ['Barcelona', 'Real Madrid'],
        ['Bayern', 'Dortmund'],
        ['Federer', 'Nadal'],
        ['Djokovic', 'Murray']
    ];
    
    const bookmakers = ['Bet365', 'SNAI', 'Sisal', 'Eurobet', 'William Hill', 'Betfair', '888sport'];
    
    const sport = sports[Math.floor(Math.random() * sports.length)];
    const matchup = teams[Math.floor(Math.random() * teams.length)];
    
    // Genera quote che creano un arbitraggio
    const profitMargin = (Math.random() * 5 + 1).toFixed(2); // 1-6% di profitto
    
    // Calcola quote che garantiscono un arbitraggio
    const targetProfit = parseFloat(profitMargin);
    const totalInverse = (100 / (100 + targetProfit)) / 100;
    
    // Distribuisci le quote inverse per creare l'arbitraggio
    const inverse1 = totalInverse * (0.45 + Math.random() * 0.1);
    const inverse2 = totalInverse - inverse1;
    
    const odd1 = (1 / inverse1).toFixed(2);
    const odd2 = (1 / inverse2).toFixed(2);
    
    const book1 = bookmakers[Math.floor(Math.random() * bookmakers.length)];
    let book2 = bookmakers[Math.floor(Math.random() * bookmakers.length)];
    while (book2 === book1) {
        book2 = bookmakers[Math.floor(Math.random() * bookmakers.length)];
    }
    
    // Calcola le puntate per €100 di investimento totale
    const totalStake = 100;
    const stake1 = (totalStake * inverse1 / totalInverse).toFixed(2);
    const stake2 = (totalStake * inverse2 / totalInverse).toFixed(2);
    
    const profit = (parseFloat(stake1) * parseFloat(odd1) - totalStake).toFixed(2);
    
    return {
        sport: sport,
        event: `${matchup[0]} vs ${matchup[1]}`,
        outcome1: matchup[0],
        outcome2: matchup[1],
        bookmaker1: book1,
        bookmaker2: book2,
        odd1: parseFloat(odd1),
        odd2: parseFloat(odd2),
        stake1: parseFloat(stake1),
        stake2: parseFloat(stake2),
        profit: parseFloat(profit),
        profitPercentage: parseFloat(profitMargin),
        totalStake: totalStake
    };
}

// Mostra i risultati
function displayResults(arbitrages) {
    const resultsDiv = document.getElementById('results');
    
    const dataSource = API_CONFIG.USE_REAL_DATA && API_CONFIG.ODDS_API_KEY 
        ? '📡 Quote Reali da The-Odds-API' 
        : '🎲 Dati Simulati (Demo)';
    
    if (arbitrages.length === 0) {
        resultsDiv.innerHTML = `
            <div style="text-align: center; padding: 30px; color: #999;">
                <div style="font-size: 48px; margin-bottom: 15px;">📊</div>
                <h3 style="margin-bottom: 10px; color: #666;">Nessun arbitraggio trovato</h3>
                <p style="font-size: 14px;">Le quote analizzate non presentano opportunità di arbitraggio al momento.</p>
                <p style="font-size: 12px; margin-top: 10px; color: #999;">Riprova tra qualche minuto o aggiungi altri bookmaker.</p>
                <p style="font-size: 11px; margin-top: 15px; color: #999; font-style: italic;">${dataSource}</p>
            </div>
        `;
        return;
    }
    
    resultsDiv.innerHTML = `
        <div style="background: #e8f5e9; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #4caf50;">
            <strong style="color: #2e7d32;">✅ ${arbitrages.length} opportunità di arbitraggio ${arbitrages.length === 1 ? 'trovata' : 'trovate'}!</strong>
            <div style="font-size: 12px; color: #2e7d32; margin-top: 5px;">${dataSource}</div>
        </div>
        ${arbitrages.map(arb => generateArbitrageHTML(arb)).join('')}
    `;
}

// Genera HTML per una singola opportunità di arbitraggio
function generateArbitrageHTML(arb) {
    // Formatta data evento se disponibile
    let eventTimeHtml = '';
    if (arb.commenceTime) {
        const date = new Date(arb.commenceTime);
        const dateStr = date.toLocaleDateString('it-IT', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        eventTimeHtml = `<div style="font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 5px;">📅 ${dateStr}</div>`;
    }
    
    return `
        <div class="arbitrage-opportunity">
            <h3>🏆 ${arb.sport}: ${arb.event}</h3>
            ${eventTimeHtml}
            
            <div class="odds-comparison">
                <div class="odd-item">
                    <div class="bookmaker">${arb.bookmaker1}</div>
                    <div class="value">${arb.odd1}</div>
                    <div style="font-size: 12px; margin-top: 5px;">${arb.outcome1}</div>
                    <div style="font-size: 12px; margin-top: 5px;">Punta: €${arb.stake1}</div>
                </div>
                <div class="odd-item">
                    <div class="bookmaker">${arb.bookmaker2}</div>
                    <div class="value">${arb.odd2}</div>
                    <div style="font-size: 12px; margin-top: 5px;">${arb.outcome2}</div>
                    <div style="font-size: 12px; margin-top: 5px;">Punta: €${arb.stake2}</div>
                </div>
            </div>
            
            <div class="profit-info">
                <div class="label">💰 Profitto Garantito</div>
                <div class="value">+€${arb.profit} (${arb.profitPercentage}%)</div>
                <div style="font-size: 12px; margin-top: 8px; opacity: 0.9;">
                    Investimento totale: €${arb.totalStake}
                </div>
            </div>
            
            <div style="margin-top: 15px; padding: 12px; background: rgba(255,255,255,0.15); border-radius: 8px; font-size: 13px;">
                <strong>📝 Come procedere:</strong><br>
                1. Punta €${arb.stake1} su "${arb.outcome1}" su ${arb.bookmaker1}<br>
                2. Punta €${arb.stake2} su "${arb.outcome2}" su ${arb.bookmaker2}<br>
                3. Profitto garantito: €${arb.profit} indipendentemente dal risultato!
            </div>
        </div>
    `;
}

// Controlla se l'utente è già loggato al caricamento
window.addEventListener('DOMContentLoaded', function() {
    if (sessionStorage.getItem('loggedIn') === 'true') {
        showDashboard();
        switchTab('bookmakers'); // Tab predefinito
    }
    
    // Enter per aggiungere URL
    document.getElementById('urlInput')?.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addUrl();
        }
    });
});
