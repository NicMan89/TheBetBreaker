// ============================================
// ARBITRAGE ANALYZER v2.7 - OVER/UNDER UPDATE
// ============================================

// CONFIGURAZIONE
const API_KEY = '1747c23c4226411b632e76e5e376958d';
const API_URL = 'https://api.the-odds-api.com/v4/sports';

// Bookmakers disponibili
const BOOKMAKERS = [
    { id: 'bet365', name: 'Bet365', url: 'https://www.bet365.it' },
    { id: 'snai', name: 'SNAI', url: 'https://www.snai.it' },
    { id: 'sisal', name: 'Sisal', url: 'https://www.sisal.it' },
    { id: 'eurobet', name: 'Eurobet', url: 'https://www.eurobet.it' },
    { id: 'williamhill', name: 'William Hill', url: 'https://www.williamhill.it' },
    { id: 'betfair', name: 'Betfair', url: 'https://www.betfair.it' },
    { id: 'lottomatica', name: 'Lottomatica', url: 'https://www.lottomatica.it' },
    { id: 'goldbet', name: 'GoldBet', url: 'https://www.goldbet.it' },
    { id: 'unibet', name: 'Unibet', url: 'https://www.unibet.it' },
    { id: 'pinnacle', name: 'Pinnacle', url: 'https://www.pinnacle.com' },
    { id: 'sport888', name: '888sport', url: 'https://www.888sport.it' },
    { id: 'marathonbet', name: 'Marathon Bet', url: 'https://www.marathonbet.it' }
];

// Password hash SHA-256
const USERS = {
    'NicMan89': '774e797343ecca2d15f4055c809c7f3449c391cf2580f704e6c7abcaf9fdf765', // Hash di CR7
    'Davide': 'eacc0d256abdfb52314d28592fd9cb8ce8e06dbae1c519ca3a258b1c2973c831'  // Hash di Davide_001
};

// Dati simulati quando API non disponibile
let useSimulatedData = false;
let apiCallCount = 0;
const API_LIMIT = 500;

// ============================================
// FUNZIONI UTILITÀ
// ============================================

async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Inserisci username e password');
        return;
    }
    
    const hash = await sha256(password);
    
    if (USERS[username] && USERS[username] === hash) {
        document.getElementById('loginScreen').style.display = 'none';
        document.getElementById('mainApp').style.display = 'block';
        document.getElementById('userDisplay').textContent = username;
        loadSelectedBookmakers();
        loadBonuses();
    } else {
        alert('Credenziali non valide');
    }
}

function logout() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('mainApp').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
}

// ============================================
// GESTIONE BOOKMAKER SELEZIONATI
// ============================================

function toggleBookmaker(bookmaker) {
    const selected = getSelectedBookmakers();
    const index = selected.indexOf(bookmaker);
    
    if (index > -1) {
        selected.splice(index, 1);
    } else {
        selected.push(bookmaker);
    }
    
    localStorage.setItem('selectedBookmakers', JSON.stringify(selected));
    updateBookmakerUI();
}

function getSelectedBookmakers() {
    const saved = localStorage.getItem('selectedBookmakers');
    return saved ? JSON.parse(saved) : BOOKMAKERS.map(b => b.id);
}

function loadSelectedBookmakers() {
    updateBookmakerUI();
}

function updateBookmakerUI() {
    const container = document.getElementById('bookmakersGrid');
    const selected = getSelectedBookmakers();
    
    container.innerHTML = BOOKMAKERS.map(bookmaker => {
        const isSelected = selected.includes(bookmaker.id);
        return `
            <div class="bookmaker-card ${isSelected ? 'selected' : ''}" 
                 onclick="toggleBookmaker('${bookmaker.id}')">
                <div class="bookmaker-name">${bookmaker.name}</div>
                <div class="bookmaker-status">${isSelected ? '✓ Selezionato' : 'Non selezionato'}</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('selectedCount').textContent = selected.length;
}

// ============================================
// GESTIONE BONUS
// ============================================

function loadBonuses() {
    const bonuses = JSON.parse(localStorage.getItem('userBonuses') || '[]');
    renderBonusList(bonuses);
}

function saveBonuses(bonuses) {
    localStorage.setItem('userBonuses', JSON.stringify(bonuses));
}

function addBonus() {
    const bookmaker = document.getElementById('bonusBookmaker').value;
    const amount = document.getElementById('bonusAmount').value;
    const requirements = document.getElementById('bonusRequirements').value;
    
    if (!bookmaker || !amount) {
        alert('Compila tutti i campi obbligatori');
        return;
    }
    
    const bonuses = JSON.parse(localStorage.getItem('userBonuses') || '[]');
    bonuses.push({
        id: Date.now(),
        bookmaker,
        amount: parseFloat(amount),
        requirements,
        addedDate: new Date().toISOString(),
        status: 'active'
    });
    
    saveBonuses(bonuses);
    loadBonuses();
    
    // Reset form
    document.getElementById('bonusBookmaker').value = '';
    document.getElementById('bonusAmount').value = '';
    document.getElementById('bonusRequirements').value = '';
}

function deleteBonus(id) {
    if (!confirm('Eliminare questo bonus?')) return;
    
    const bonuses = JSON.parse(localStorage.getItem('userBonuses') || '[]');
    const filtered = bonuses.filter(b => b.id !== id);
    saveBonuses(filtered);
    loadBonuses();
}

function toggleBonusStatus(id) {
    const bonuses = JSON.parse(localStorage.getItem('userBonuses') || '[]');
    const bonus = bonuses.find(b => b.id === id);
    if (bonus) {
        bonus.status = bonus.status === 'active' ? 'completed' : 'active';
        saveBonuses(bonuses);
        loadBonuses();
    }
}

function renderBonusList(bonuses) {
    const container = document.getElementById('bonusList');
    
    if (bonuses.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.6);">Nessun bonus aggiunto. Usa il form sopra per aggiungerne uno.</p>';
        return;
    }
    
    container.innerHTML = bonuses.map(bonus => `
        <div class="bonus-card ${bonus.status}">
            <div class="bonus-header">
                <h3>${bonus.bookmaker}</h3>
                <span class="bonus-amount">€${bonus.amount.toFixed(2)}</span>
            </div>
            <div class="bonus-requirements">${bonus.requirements || 'Nessun requisito specificato'}</div>
            <div class="bonus-date">Aggiunto il: ${new Date(bonus.addedDate).toLocaleDateString('it-IT')}</div>
            <div class="bonus-actions">
                <button onclick="toggleBonusStatus(${bonus.id})" class="btn-small">
                    ${bonus.status === 'active' ? '✓ Segna completato' : '↻ Riattiva'}
                </button>
                <button onclick="deleteBonus(${bonus.id})" class="btn-small btn-danger">
                    🗑 Elimina
                </button>
            </div>
        </div>
    `).join('');
}

// ============================================
// RICERCA ARBITRAGGI CON API
// ============================================

async function searchArbitrages() {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '<div class="loading">🔍 Ricerca arbitraggi in corso...</div>';
    
    try {
        const selectedBookmakers = getSelectedBookmakers();
        if (selectedBookmakers.length < 2) {
            resultsDiv.innerHTML = '<p style="color: #ff6b6b; text-align: center;">Seleziona almeno 2 bookmaker per trovare arbitraggi!</p>';
            return;
        }
        
        // Verifica limite API
        if (apiCallCount >= API_LIMIT) {
            console.log('Limite API raggiunto, uso dati simulati');
            useSimulatedData = true;
        }
        
        let arbitrages = [];
        
        if (useSimulatedData) {
            arbitrages = generateSimulatedArbitrages(selectedBookmakers);
        } else {
            try {
                arbitrages = await fetchRealArbitrages(selectedBookmakers);
                apiCallCount++;
            } catch (error) {
                console.error('Errore API, fallback a dati simulati:', error);
                useSimulatedData = true;
                arbitrages = generateSimulatedArbitrages(selectedBookmakers);
            }
        }
        
        displayResults(arbitrages);
        
    } catch (error) {
        console.error('Errore ricerca:', error);
        resultsDiv.innerHTML = '<p style="color: #ff6b6b;">Errore durante la ricerca. Riprova.</p>';
    }
}

async function fetchRealArbitrages(selectedBookmakers) {
    const arbitrages = [];
    
    // Sport da controllare
    const sports = [
        { key: 'soccer_italy_serie_a', name: 'Serie A' },
        { key: 'tennis_atp', name: 'ATP Tennis' },
        { key: 'basketball_nba', name: 'NBA' }
    ];
    
    for (const sport of sports) {
        // Cerca arbitraggi H2H (classici)
        const h2hArbs = await fetchMarketArbitrages(sport, 'h2h', selectedBookmakers);
        arbitrages.push(...h2hArbs);
        
        // **NUOVO: Cerca arbitraggi OVER/UNDER**
        if (sport.key.includes('soccer')) {
            const totalsArbs = await fetchTotalsArbitrages(sport, selectedBookmakers);
            arbitrages.push(...totalsArbs);
        }
    }
    
    return arbitrages.sort((a, b) => b.profitPercentage - a.profitPercentage);
}

async function fetchMarketArbitrages(sport, market, selectedBookmakers) {
    const url = `${API_URL}/${sport.key}/odds/?apiKey=${API_KEY}&regions=eu&markets=${market}&oddsFormat=decimal`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        const arbitrages = [];
        
        for (const event of data) {
            const eventArbs = findArbitragesInEvent(event, selectedBookmakers, market);
            arbitrages.push(...eventArbs);
        }
        
        return arbitrages;
    } catch (error) {
        console.error(`Errore fetching ${market}:`, error);
        return [];
    }
}

// **NUOVA FUNZIONE: Fetch arbitraggi Over/Under**
async function fetchTotalsArbitrages(sport, selectedBookmakers) {
    const url = `${API_URL}/${sport.key}/odds/?apiKey=${API_KEY}&regions=eu&markets=totals&oddsFormat=decimal`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        const arbitrages = [];
        
        for (const event of data) {
            const totalsArbs = findTotalsArbitrages(event, selectedBookmakers);
            arbitrages.push(...totalsArbs);
        }
        
        return arbitrages;
    } catch (error) {
        console.error('Errore fetching totals:', error);
        return [];
    }
}

// **NUOVA FUNZIONE: Trova arbitraggi Over/Under per tutti i valori**
function findTotalsArbitrages(event, selectedBookmakers) {
    const arbitrages = [];
    
    // Raggruppa quote per valore di gol (0.5, 1.5, 2.5, 3.5, 4.5, ecc.)
    const totalsByPoint = {};
    
    event.bookmakers.forEach(bookmaker => {
        // Salta se non è nei bookmaker selezionati
        const bookmakerId = mapBookmakerName(bookmaker.title);
        if (!selectedBookmakers.includes(bookmakerId)) return;
        
        const market = bookmaker.markets.find(m => m.key === 'totals');
        if (!market) return;
        
        market.outcomes.forEach(outcome => {
            const point = outcome.point; // es. 2.5, 1.5, ecc.
            const type = outcome.name;   // "Over" o "Under"
            
            if (!totalsByPoint[point]) {
                totalsByPoint[point] = { over: [], under: [] };
            }
            
            if (type === 'Over') {
                totalsByPoint[point].over.push({
                    bookmaker: bookmakerId,
                    bookmakerName: bookmaker.title,
                    odd: outcome.price
                });
            } else if (type === 'Under') {
                totalsByPoint[point].under.push({
                    bookmaker: bookmakerId,
                    bookmakerName: bookmaker.title,
                    odd: outcome.price
                });
            }
        });
    });
    
    // Cerca arbitraggi per ogni valore di gol
    Object.entries(totalsByPoint).forEach(([point, quotes]) => {
        const { over, under } = quotes;
        
        // Trova migliore Over e migliore Under
        if (over.length > 0 && under.length > 0) {
            const bestOver = over.reduce((max, q) => q.odd > max.odd ? q : max);
            const bestUnder = under.reduce((max, q) => q.odd > max.odd ? q : max);
            
            // Controlla se c'è arbitraggio
            const inverseSum = (1 / bestOver.odd) + (1 / bestUnder.odd);
            
            if (inverseSum < 1) {
                const profitPercentage = ((1 / inverseSum) - 1) * 100;
                
                if (profitPercentage >= 0.5) {
                    const totalStake = 100;
                    const stakeOver = (totalStake / inverseSum) * (1 / bestOver.odd);
                    const stakeUnder = (totalStake / inverseSum) * (1 / bestUnder.odd);
                    const profit = (stakeOver * bestOver.odd) - totalStake;
                    
                    arbitrages.push({
                        type: 'over_under',
                        sport: 'Calcio',
                        event: `${event.home_team} vs ${event.away_team}`,
                        market: `Over/Under ${point} gol`,
                        quotes: [
                            {
                                bookmaker: bestOver.bookmakerName,
                                outcome: `Over ${point}`,
                                odd: parseFloat(bestOver.odd.toFixed(2)),
                                stake: parseFloat(stakeOver.toFixed(2))
                            },
                            {
                                bookmaker: bestUnder.bookmakerName,
                                outcome: `Under ${point}`,
                                odd: parseFloat(bestUnder.odd.toFixed(2)),
                                stake: parseFloat(stakeUnder.toFixed(2))
                            }
                        ],
                        profit: parseFloat(profit.toFixed(2)),
                        profitPercentage: parseFloat(profitPercentage.toFixed(2)),
                        totalStake: totalStake,
                        commenceTime: event.commence_time
                    });
                }
            }
        }
    });
    
    return arbitrages;
}

function findArbitragesInEvent(event, selectedBookmakers, market) {
    const arbitrages = [];
    const quotes = [];
    
    event.bookmakers.forEach(bookmaker => {
        const bookmakerId = mapBookmakerName(bookmaker.title);
        if (!selectedBookmakers.includes(bookmakerId)) return;
        
        const marketData = bookmaker.markets.find(m => m.key === market);
        if (!marketData) return;
        
        marketData.outcomes.forEach(outcome => {
            quotes.push({
                bookmaker: bookmakerId,
                bookmakerName: bookmaker.title,
                outcome: outcome.name,
                odd: outcome.price
            });
        });
    });
    
    // Determina tipo di arbitraggio (2-vie o 3-vie)
    const outcomes = [...new Set(quotes.map(q => q.outcome))];
    
    if (outcomes.length === 3) {
        // Calcio 3-vie (1-X-2)
        const arb = find3WayArbitrage(event, quotes);
        if (arb) arbitrages.push(arb);
    } else if (outcomes.length === 2) {
        // Tennis/Basket 2-vie
        const arb = find2WayArbitrage(event, quotes);
        if (arb) arbitrages.push(arb);
    }
    
    return arbitrages;
}

function find3WayArbitrage(event, quotes) {
    // Trova migliori quote per 1, X, 2
    const outcomes = ['1', 'X', '2'];
    const bestQuotes = {};
    
    outcomes.forEach(outcome => {
        const filtered = quotes.filter(q => q.outcome === outcome || 
                                           (outcome === '1' && q.outcome === event.home_team) ||
                                           (outcome === '2' && q.outcome === event.away_team) ||
                                           (outcome === 'X' && q.outcome === 'Draw'));
        if (filtered.length > 0) {
            bestQuotes[outcome] = filtered.reduce((max, q) => q.odd > max.odd ? q : max);
        }
    });
    
    if (Object.keys(bestQuotes).length !== 3) return null;
    
    const inverseSum = (1 / bestQuotes['1'].odd) + (1 / bestQuotes['X'].odd) + (1 / bestQuotes['2'].odd);
    
    if (inverseSum >= 1) return null;
    
    const profitPercentage = ((1 / inverseSum) - 1) * 100;
    if (profitPercentage < 0.5) return null;
    
    const totalStake = 100;
    const stake1 = (totalStake / inverseSum) * (1 / bestQuotes['1'].odd);
    const stakeX = (totalStake / inverseSum) * (1 / bestQuotes['X'].odd);
    const stake2 = (totalStake / inverseSum) * (1 / bestQuotes['2'].odd);
    const profit = (stake1 * bestQuotes['1'].odd) - totalStake;
    
    return {
        type: '3way',
        sport: 'Calcio',
        event: `${event.home_team} vs ${event.away_team}`,
        market: '1X2',
        quotes: [
            {
                bookmaker: bestQuotes['1'].bookmakerName,
                outcome: '1 (Casa)',
                odd: parseFloat(bestQuotes['1'].odd.toFixed(2)),
                stake: parseFloat(stake1.toFixed(2))
            },
            {
                bookmaker: bestQuotes['X'].bookmakerName,
                outcome: 'X (Pareggio)',
                odd: parseFloat(bestQuotes['X'].odd.toFixed(2)),
                stake: parseFloat(stakeX.toFixed(2))
            },
            {
                bookmaker: bestQuotes['2'].bookmakerName,
                outcome: '2 (Trasferta)',
                odd: parseFloat(bestQuotes['2'].odd.toFixed(2)),
                stake: parseFloat(stake2.toFixed(2))
            }
        ],
        profit: parseFloat(profit.toFixed(2)),
        profitPercentage: parseFloat(profitPercentage.toFixed(2)),
        totalStake: totalStake,
        commenceTime: event.commence_time
    };
}

function find2WayArbitrage(event, quotes) {
    if (quotes.length < 2) return null;
    
    const outcomes = [...new Set(quotes.map(q => q.outcome))];
    if (outcomes.length !== 2) return null;
    
    const best1 = quotes.filter(q => q.outcome === outcomes[0])
                        .reduce((max, q) => q.odd > max.odd ? q : max);
    const best2 = quotes.filter(q => q.outcome === outcomes[1])
                        .reduce((max, q) => q.odd > max.odd ? q : max);
    
    const inverseSum = (1 / best1.odd) + (1 / best2.odd);
    
    if (inverseSum >= 1) return null;
    
    const profitPercentage = ((1 / inverseSum) - 1) * 100;
    if (profitPercentage < 0.5) return null;
    
    const totalStake = 100;
    const stake1 = (totalStake / inverseSum) * (1 / best1.odd);
    const stake2 = (totalStake / inverseSum) * (1 / best2.odd);
    const profit = (stake1 * best1.odd) - totalStake;
    
    return {
        type: '2way',
        sport: event.sport_title || 'Tennis',
        event: `${outcomes[0]} vs ${outcomes[1]}`,
        market: 'H2H',
        quotes: [
            {
                bookmaker: best1.bookmakerName,
                outcome: outcomes[0],
                odd: parseFloat(best1.odd.toFixed(2)),
                stake: parseFloat(stake1.toFixed(2))
            },
            {
                bookmaker: best2.bookmakerName,
                outcome: outcomes[1],
                odd: parseFloat(best2.odd.toFixed(2)),
                stake: parseFloat(stake2.toFixed(2))
            }
        ],
        profit: parseFloat(profit.toFixed(2)),
        profitPercentage: parseFloat(profitPercentage.toFixed(2)),
        totalStake: totalStake,
        commenceTime: event.commence_time
    };
}

function mapBookmakerName(name) {
    const mapping = {
        'Bet365': 'bet365',
        'SNAI': 'snai',
        'Sisal': 'sisal',
        'Eurobet': 'eurobet',
        'William Hill': 'williamhill',
        'Betfair': 'betfair',
        'Lottomatica': 'lottomatica',
        'GoldBet': 'goldbet',
        'Unibet': 'unibet',
        'Pinnacle': 'pinnacle',
        '888sport': 'sport888',
        'Marathon Bet': 'marathonbet'
    };
    
    return mapping[name] || name.toLowerCase().replace(/\s+/g, '');
}

// ============================================
// DATI SIMULATI (FALLBACK)
// ============================================

function generateSimulatedArbitrages(selectedBookmakers) {
    if (selectedBookmakers.length < 2) return [];
    
    const arbitrages = [];
    
    // Calcio - 3 vie
    const soccerMatches = [
        { home: 'Juventus', away: 'Inter', time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
        { home: 'Milan', away: 'Napoli', time: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) },
        { home: 'Roma', away: 'Lazio', time: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000) }
    ];
    
    soccerMatches.forEach(match => {
        // Arbitraggio 3-vie classico
        const arb3way = generateSimulated3Way(match, selectedBookmakers);
        if (arb3way) arbitrages.push(arb3way);
        
        // **NUOVO: Arbitraggi Over/Under per diversi valori**
        const totals = [0.5, 1.5, 2.5, 3.5, 4.5];
        totals.forEach(point => {
            const arbTotal = generateSimulatedOverUnder(match, point, selectedBookmakers);
            if (arbTotal) arbitrages.push(arbTotal);
        });
    });
    
    // Tennis - 2 vie
    const tennisMatches = [
        { player1: 'Sinner', player2: 'Alcaraz', time: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000) },
        { player1: 'Djokovic', player2: 'Medvedev', time: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) }
    ];
    
    tennisMatches.forEach(match => {
        const arb = generateSimulated2Way(match, 'Tennis', selectedBookmakers);
        if (arb) arbitrages.push(arb);
    });
    
    return arbitrages.sort((a, b) => b.profitPercentage - a.profitPercentage);
}

function generateSimulated3Way(match, selectedBookmakers) {
    // Genera quote realistiche per 1-X-2
    const baseOdd1 = 2.0 + Math.random() * 3.0;
    const baseOddX = 3.0 + Math.random() * 1.5;
    const baseOdd2 = 2.0 + Math.random() * 3.0;
    
    // Aggiungi variazione tra bookmaker
    const book1 = selectedBookmakers[Math.floor(Math.random() * selectedBookmakers.length)];
    const book2 = selectedBookmakers[Math.floor(Math.random() * selectedBookmakers.length)];
    const book3 = selectedBookmakers[Math.floor(Math.random() * selectedBookmakers.length)];
    
    const odd1 = (baseOdd1 * (1 + (Math.random() * 0.15 - 0.05))).toFixed(2);
    const oddX = (baseOddX * (1 + (Math.random() * 0.15 - 0.05))).toFixed(2);
    const odd2 = (baseOdd2 * (1 + (Math.random() * 0.15 - 0.05))).toFixed(2);
    
    const inverseSum = (1 / odd1) + (1 / oddX) + (1 / odd2);
    
    // Forza arbitraggio circa 50% delle volte
    if (inverseSum >= 1 && Math.random() > 0.5) {
        return null;
    }
    
    const adjustedInverseSum = Math.min(inverseSum, 0.97);
    const profitPercentage = ((1 / adjustedInverseSum) - 1) * 100;
    
    if (profitPercentage < 0.5) return null;
    
    const totalStake = 100;
    const stake1 = (totalStake / adjustedInverseSum) * (1 / odd1);
    const stakeX = (totalStake / adjustedInverseSum) * (1 / oddX);
    const stake2 = (totalStake / adjustedInverseSum) * (1 / odd2);
    const profit = (stake1 * odd1) - totalStake;
    
    const bookmakerName = (id) => BOOKMAKERS.find(b => b.id === id)?.name || id;
    
    return {
        type: '3way',
        sport: 'Calcio',
        event: `${match.home} vs ${match.away}`,
        market: '1X2',
        quotes: [
            {
                bookmaker: bookmakerName(book1),
                outcome: '1 (Casa)',
                odd: parseFloat(odd1),
                stake: parseFloat(stake1.toFixed(2))
            },
            {
                bookmaker: bookmakerName(book2),
                outcome: 'X (Pareggio)',
                odd: parseFloat(oddX),
                stake: parseFloat(stakeX.toFixed(2))
            },
            {
                bookmaker: bookmakerName(book3),
                outcome: '2 (Trasferta)',
                odd: parseFloat(odd2),
                stake: parseFloat(stake2.toFixed(2))
            }
        ],
        profit: parseFloat(profit.toFixed(2)),
        profitPercentage: parseFloat(profitPercentage.toFixed(2)),
        totalStake: totalStake,
        commenceTime: match.time.toISOString()
    };
}

// **NUOVA FUNZIONE: Genera Over/Under simulati**
function generateSimulatedOverUnder(match, point, selectedBookmakers) {
    // Quote realistiche basate sul valore
    let baseOver, baseUnder;
    
    switch(point) {
        case 0.5:
            baseOver = 1.05 + Math.random() * 0.1;
            baseUnder = 8.0 + Math.random() * 4.0;
            break;
        case 1.5:
            baseOver = 1.25 + Math.random() * 0.2;
            baseUnder = 3.5 + Math.random() * 1.5;
            break;
        case 2.5:
            baseOver = 1.70 + Math.random() * 0.4;
            baseUnder = 2.0 + Math.random() * 0.5;
            break;
        case 3.5:
            baseOver = 2.3 + Math.random() * 0.6;
            baseUnder = 1.50 + Math.random() * 0.3;
            break;
        case 4.5:
            baseOver = 3.5 + Math.random() * 1.5;
            baseUnder = 1.25 + Math.random() * 0.15;
            break;
        default:
            baseOver = 2.0;
            baseUnder = 2.0;
    }
    
    const bookOver = selectedBookmakers[Math.floor(Math.random() * selectedBookmakers.length)];
    const bookUnder = selectedBookmakers[Math.floor(Math.random() * selectedBookmakers.length)];
    
    const oddOver = (baseOver * (1 + (Math.random() * 0.15 - 0.05))).toFixed(2);
    const oddUnder = (baseUnder * (1 + (Math.random() * 0.15 - 0.05))).toFixed(2);
    
    const inverseSum = (1 / oddOver) + (1 / oddUnder);
    
    // Arbitraggio solo se matematicamente possibile
    if (inverseSum >= 1) {
        // Forza arbitraggio per alcuni valori (20% probabilità)
        if (Math.random() > 0.2) return null;
        
        // Aggiusta leggermente per creare arbitraggio
        const adjustment = 1.03;
        const adjustedOddOver = (oddOver * adjustment).toFixed(2);
        const adjustedInverseSum = (1 / adjustedOddOver) + (1 / oddUnder);
        
        if (adjustedInverseSum >= 1) return null;
        
        const profitPercentage = ((1 / adjustedInverseSum) - 1) * 100;
        if (profitPercentage < 0.5) return null;
        
        const totalStake = 100;
        const stakeOver = (totalStake / adjustedInverseSum) * (1 / adjustedOddOver);
        const stakeUnder = (totalStake / adjustedInverseSum) * (1 / oddUnder);
        const profit = (stakeOver * adjustedOddOver) - totalStake;
        
        const bookmakerName = (id) => BOOKMAKERS.find(b => b.id === id)?.name || id;
        
        return {
            type: 'over_under',
            sport: 'Calcio',
            event: `${match.home} vs ${match.away}`,
            market: `Over/Under ${point} gol`,
            quotes: [
                {
                    bookmaker: bookmakerName(bookOver),
                    outcome: `Over ${point}`,
                    odd: parseFloat(adjustedOddOver),
                    stake: parseFloat(stakeOver.toFixed(2))
                },
                {
                    bookmaker: bookmakerName(bookUnder),
                    outcome: `Under ${point}`,
                    odd: parseFloat(oddUnder),
                    stake: parseFloat(stakeUnder.toFixed(2))
                }
            ],
            profit: parseFloat(profit.toFixed(2)),
            profitPercentage: parseFloat(profitPercentage.toFixed(2)),
            totalStake: totalStake,
            commenceTime: match.time.toISOString()
        };
    }
    
    const profitPercentage = ((1 / inverseSum) - 1) * 100;
    if (profitPercentage < 0.5) return null;
    
    const totalStake = 100;
    const stakeOver = (totalStake / inverseSum) * (1 / oddOver);
    const stakeUnder = (totalStake / inverseSum) * (1 / oddUnder);
    const profit = (stakeOver * oddOver) - totalStake;
    
    const bookmakerName = (id) => BOOKMAKERS.find(b => b.id === id)?.name || id;
    
    return {
        type: 'over_under',
        sport: 'Calcio',
        event: `${match.home} vs ${match.away}`,
        market: `Over/Under ${point} gol`,
        quotes: [
            {
                bookmaker: bookmakerName(bookOver),
                outcome: `Over ${point}`,
                odd: parseFloat(oddOver),
                stake: parseFloat(stakeOver.toFixed(2))
            },
            {
                bookmaker: bookmakerName(bookUnder),
                outcome: `Under ${point}`,
                odd: parseFloat(oddUnder),
                stake: parseFloat(stakeUnder.toFixed(2))
            }
        ],
        profit: parseFloat(profit.toFixed(2)),
        profitPercentage: parseFloat(profitPercentage.toFixed(2)),
        totalStake: totalStake,
        commenceTime: match.time.toISOString()
    };
}

function generateSimulated2Way(match, sport, selectedBookmakers) {
    const baseOdd1 = 1.70 + Math.random() * 0.8;
    const baseOdd2 = 1.70 + Math.random() * 0.8;
    
    const book1 = selectedBookmakers[Math.floor(Math.random() * selectedBookmakers.length)];
    const book2 = selectedBookmakers[Math.floor(Math.random() * selectedBookmakers.length)];
    
    const odd1 = (baseOdd1 * (1 + (Math.random() * 0.15 - 0.05))).toFixed(2);
    const odd2 = (baseOdd2 * (1 + (Math.random() * 0.15 - 0.05))).toFixed(2);
    
    const inverseSum = (1 / odd1) + (1 / odd2);
    
    if (inverseSum >= 1 && Math.random() > 0.3) {
        return null;
    }
    
    const adjustedInverseSum = Math.min(inverseSum, 0.98);
    const profitPercentage = ((1 / adjustedInverseSum) - 1) * 100;
    
    if (profitPercentage < 0.5) return null;
    
    const totalStake = 100;
    const stake1 = (totalStake / adjustedInverseSum) * (1 / odd1);
    const stake2 = (totalStake / adjustedInverseSum) * (1 / odd2);
    const profit = (stake1 * odd1) - totalStake;
    
    const bookmakerName = (id) => BOOKMAKERS.find(b => b.id === id)?.name || id;
    
    return {
        type: '2way',
        sport: sport,
        event: `${match.player1} vs ${match.player2}`,
        market: 'H2H',
        quotes: [
            {
                bookmaker: bookmakerName(book1),
                outcome: match.player1,
                odd: parseFloat(odd1),
                stake: parseFloat(stake1.toFixed(2))
            },
            {
                bookmaker: bookmakerName(book2),
                outcome: match.player2,
                odd: parseFloat(odd2),
                stake: parseFloat(stake2.toFixed(2))
            }
        ],
        profit: parseFloat(profit.toFixed(2)),
        profitPercentage: parseFloat(profitPercentage.toFixed(2)),
        totalStake: totalStake,
        commenceTime: match.time.toISOString()
    };
}

// ============================================
// VISUALIZZAZIONE RISULTATI
// ============================================

function displayResults(arbitrages) {
    const resultsDiv = document.getElementById('results');
    
    if (arbitrages.length === 0) {
        resultsDiv.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <p style="font-size: 18px; color: #ff6b6b;">
                    ❌ Nessun arbitraggio trovato con i bookmaker selezionati
                </p>
                <p style="font-size: 14px; color: #ff6b6b; margin-top: 15px;">
                    Prova a selezionare più bookmaker o riprova più tardi
                </p>
            </div>
        `;
        return;
    }
    
    const html = `
        <div style="text-align: center; margin-bottom: 25px;">
            <h2 style="color: #4CAF50; margin-bottom: 10px;">
                ✅ ${arbitrages.length} Arbitraggi Trovati
            </h2>
            <p style="color: rgba(255,255,255,0.7); font-size: 14px;">
                ${useSimulatedData ? '🔶 Dati simulati (API non disponibile)' : '🟢 Dati reali da The-Odds-API'}
            </p>
        </div>
        ${arbitrages.map(arb => generateArbitrageCard(arb)).join('')}
    `;
    
    resultsDiv.innerHTML = html;
}

function generateArbitrageCard(arb) {
    // Badge tipo arbitraggio
    let typeBadge = '';
    let typeIcon = '';
    
    if (arb.type === 'over_under') {
        typeBadge = '⚽ CALCIO - OVER/UNDER';
        typeIcon = '📊';
    } else if (arb.type === '3way') {
        typeBadge = '⚽ CALCIO - 3 VIE (1-X-2)';
        typeIcon = '⚽';
    } else if (arb.type === '2way') {
        typeBadge = `${arb.sport === 'Tennis' ? '🎾' : '🏀'} ${arb.sport.toUpperCase()} - 2 VIE`;
        typeIcon = arb.sport === 'Tennis' ? '🎾' : '🏀';
    }
    
    // Warning per profitti sospetti
    let warningHtml = '';
    if (arb.profitPercentage > 10) {
        warningHtml = `
            <div style="background: rgba(255, 152, 0, 0.2); padding: 12px; border-radius: 8px; margin-bottom: 15px; border-left: 4px solid #ff9800;">
                <strong style="color: #fff; font-size: 14px;">⚠️ ATTENZIONE: Arbitraggio Sospetto</strong>
                <p style="font-size: 12px; color: rgba(255,255,255,0.9); margin-top: 5px; margin-bottom: 0;">
                    Profitto ${arb.profitPercentage}% è molto alto. Verifica le quote sui siti prima di puntare.
                </p>
            </div>
        `;
    }
    
    // Data evento
    let eventTimeHtml = '';
    if (arb.commenceTime) {
        const date = new Date(arb.commenceTime);
        const dateStr = date.toLocaleDateString('it-IT', { 
            day: '2-digit', 
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
        eventTimeHtml = `<div style="font-size: 13px; color: rgba(255,255,255,0.8); margin-top: 5px;">📅 ${dateStr}</div>`;
    }
    
    // Link bookmaker
    const bookmakerLinks = arb.quotes.map(q => {
        const bookmaker = BOOKMAKERS.find(b => b.name === q.bookmaker);
        const url = bookmaker ? bookmaker.url : '#';
        return `<a href="${url}" target="_blank" style="color: #64B5F6; text-decoration: none;">🔗 ${q.bookmaker}</a>`;
    }).join(' • ');
    
    // Quote HTML
    const quotesHtml = arb.quotes.map((q, index) => `
        <div class="quote-card">
            <div class="quote-bookmaker">${q.bookmaker}</div>
            <div class="quote-outcome">${q.outcome}</div>
            <div class="quote-odd">Quota: <strong>${q.odd}</strong></div>
            <div class="quote-stake">Punta: <strong>€${q.stake}</strong></div>
        </div>
    `).join('');
    
    return `
        <div class="arbitrage-card">
            <div class="arb-header">
                <div class="arb-type-badge">${typeBadge}</div>
                <div class="arb-profit">+${arb.profitPercentage}%</div>
            </div>
            
            ${warningHtml}
            
            <div class="arb-event">
                <div style="font-size: 18px; font-weight: bold; color: #fff;">
                    ${typeIcon} ${arb.event}
                </div>
                <div style="font-size: 14px; color: rgba(255,255,255,0.7); margin-top: 3px;">
                    ${arb.market}
                </div>
                ${eventTimeHtml}
            </div>
            
            <div class="arb-quotes">
                ${quotesHtml}
            </div>
            
            <div class="arb-summary">
                <div class="summary-row">
                    <span>Investimento Totale:</span>
                    <strong>€${arb.totalStake.toFixed(2)}</strong>
                </div>
                <div class="summary-row">
                    <span>Profitto Garantito:</span>
                    <strong style="color: #4CAF50;">€${arb.profit.toFixed(2)}</strong>
                </div>
                <div class="summary-row">
                    <span>ROI:</span>
                    <strong style="color: #4CAF50;">${arb.profitPercentage.toFixed(2)}%</strong>
                </div>
            </div>
            
            <div class="arb-links">
                <strong>🔗 Link Diretti:</strong><br>
                ${bookmakerLinks}
            </div>
        </div>
    `;
}

// ============================================
// CALCOLATORI
// ============================================

function showCalculator(type) {
    // Nascondi tutti i calcolatori
    document.querySelectorAll('.calculator').forEach(calc => {
        calc.style.display = 'none';
    });
    
    // Mostra calcolatore selezionato
    document.getElementById(`calc-${type}`).style.display = 'block';
}

function calculateArbitrage() {
    const odd1 = parseFloat(document.getElementById('arb-odd1').value);
    const odd2 = parseFloat(document.getElementById('arb-odd2').value);
    const stake = parseFloat(document.getElementById('arb-stake').value);
    
    if (!odd1 || !odd2 || !stake) {
        alert('Compila tutti i campi');
        return;
    }
    
    const inverseSum = (1 / odd1) + (1 / odd2);
    
    if (inverseSum >= 1) {
        document.getElementById('arb-result').innerHTML = `
            <div style="background: rgba(244, 67, 54, 0.2); padding: 15px; border-radius: 8px; border-left: 4px solid #f44336;">
                <strong style="color: #f44336;">❌ NON è un arbitraggio</strong><br>
                <span style="font-size: 13px;">La somma degli inversi è ${inverseSum.toFixed(4)} (deve essere < 1)</span>
            </div>
        `;
        return;
    }
    
    const profitPercentage = ((1 / inverseSum) - 1) * 100;
    const stake1 = (stake / inverseSum) * (1 / odd1);
    const stake2 = (stake / inverseSum) * (1 / odd2);
    const profit = (stake1 * odd1) - stake;
    
    document.getElementById('arb-result').innerHTML = `
        <div style="background: rgba(76, 175, 80, 0.2); padding: 20px; border-radius: 8px; border-left: 4px solid #4CAF50;">
            <h3 style="color: #4CAF50; margin-top: 0;">✅ Arbitraggio Valido</h3>
            
            <div style="margin: 15px 0;">
                <strong>Puntate:</strong><br>
                • Quota ${odd1}: <strong>€${stake1.toFixed(2)}</strong><br>
                • Quota ${odd2}: <strong>€${stake2.toFixed(2)}</strong>
            </div>
            
            <div style="margin: 15px 0;">
                <strong>Profitto Garantito:</strong><br>
                • Importo: <strong style="color: #4CAF50;">€${profit.toFixed(2)}</strong><br>
                • Percentuale: <strong style="color: #4CAF50;">${profitPercentage.toFixed(2)}%</strong>
            </div>
            
            <div style="font-size: 12px; color: rgba(255,255,255,0.7); margin-top: 10px;">
                Investimento totale: €${stake.toFixed(2)} • ROI: ${profitPercentage.toFixed(2)}%
            </div>
        </div>
    `;
}

function calculateBonus() {
    const bonus = parseFloat(document.getElementById('bonus-amount').value);
    const rollover = parseFloat(document.getElementById('bonus-rollover').value);
    const backOdd = parseFloat(document.getElementById('bonus-back').value);
    const layOdd = parseFloat(document.getElementById('bonus-lay').value);
    
    if (!bonus || !rollover || !backOdd || !layOdd) {
        alert('Compila tutti i campi');
        return;
    }
    
    const requiredStake = bonus * rollover;
    const layStake = (requiredStake * backOdd) / layOdd;
    const totalRisk = requiredStake + layStake;
    const potentialWin = requiredStake * backOdd;
    const potentialLoss = layStake * (layOdd - 1);
    
    const netProfit = potentialWin - totalRisk;
    const profitPercentage = (netProfit / bonus) * 100;
    
    document.getElementById('bonus-result').innerHTML = `
        <div style="background: rgba(33, 150, 243, 0.2); padding: 20px; border-radius: 8px; border-left: 4px solid #2196F3;">
            <h3 style="color: #2196F3; margin-top: 0;">📊 Strategia Bonus Extraction</h3>
            
            <div style="margin: 15px 0;">
                <strong>Puntate richieste:</strong><br>
                • Back (bookmaker): <strong>€${requiredStake.toFixed(2)}</strong> @ ${backOdd}<br>
                • Lay (exchange): <strong>€${layStake.toFixed(2)}</strong> @ ${layOdd}
            </div>
            
            <div style="margin: 15px 0;">
                <strong>Analisi rischio:</strong><br>
                • Investimento totale: €${totalRisk.toFixed(2)}<br>
                • Se vinci back: +€${(potentialWin - totalRisk).toFixed(2)}<br>
                • Se vinci lay: +€${(requiredStake - potentialLoss).toFixed(2)}
            </div>
            
            <div style="margin: 15px 0;">
                <strong>Risultato atteso:</strong><br>
                • Profitto netto: <strong style="color: #4CAF50;">€${netProfit.toFixed(2)}</strong><br>
                • ROI sul bonus: <strong>${profitPercentage.toFixed(2)}%</strong>
            </div>
        </div>
    `;
}

function calculateKelly() {
    const probability = parseFloat(document.getElementById('kelly-prob').value) / 100;
    const odd = parseFloat(document.getElementById('kelly-odd').value);
    const bankroll = parseFloat(document.getElementById('kelly-bankroll').value);
    
    if (!probability || !odd || !bankroll) {
        alert('Compila tutti i campi');
        return;
    }
    
    const q = 1 - probability;
    const b = odd - 1;
    
    const kellyFraction = (b * probability - q) / b;
    
    if (kellyFraction <= 0) {
        document.getElementById('kelly-result').innerHTML = `
            <div style="background: rgba(244, 67, 54, 0.2); padding: 15px; border-radius: 8px; border-left: 4px solid #f44336;">
                <strong style="color: #f44336;">❌ NON puntare</strong><br>
                <span style="font-size: 13px;">Il Kelly Criterion suggerisce di non effettuare questa puntata (valore atteso negativo)</span>
            </div>
        `;
        return;
    }
    
    const fullKellyStake = bankroll * kellyFraction;
    const halfKellyStake = fullKellyStake * 0.5;
    const quarterKellyStake = fullKellyStake * 0.25;
    
    document.getElementById('kelly-result').innerHTML = `
        <div style="background: rgba(156, 39, 176, 0.2); padding: 20px; border-radius: 8px; border-left: 4px solid #9C27B0;">
            <h3 style="color: #9C27B0; margin-top: 0;">🎯 Kelly Criterion</h3>
            
            <div style="margin: 15px 0;">
                <strong>Puntata suggerita:</strong><br>
                • <strong>Full Kelly:</strong> €${fullKellyStake.toFixed(2)} (${(kellyFraction * 100).toFixed(2)}% del bankroll)<br>
                • <strong>Half Kelly:</strong> €${halfKellyStake.toFixed(2)} (più conservativa)<br>
                • <strong>Quarter Kelly:</strong> €${quarterKellyStake.toFixed(2)} (molto conservativa)
            </div>
            
            <div style="margin: 15px 0; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px;">
                <strong>💡 Raccomandazione:</strong><br>
                <span style="font-size: 13px;">
                    Si consiglia Half o Quarter Kelly per ridurre la varianza e proteggere il bankroll.
                </span>
            </div>
        </div>
    `;
}

function calculateMatched() {
    const backStake = parseFloat(document.getElementById('matched-back-stake').value);
    const backOdd = parseFloat(document.getElementById('matched-back-odd').value);
    const layOdd = parseFloat(document.getElementById('matched-lay-odd').value);
    const commission = parseFloat(document.getElementById('matched-commission').value) / 100;
    
    if (!backStake || !backOdd || !layOdd) {
        alert('Compila tutti i campi obbligatori');
        return;
    }
    
    const layStake = (backStake * backOdd) / layOdd;
    const liability = layStake * (layOdd - 1);
    
    // Scenario 1: Vince back
    const backWin = backStake * (backOdd - 1);
    const layLoss = liability;
    const netIfBackWins = backWin - layLoss;
    
    // Scenario 2: Vince lay
    const backLoss = backStake;
    const layWin = layStake * (1 - commission);
    const netIfLayWins = layWin - backLoss;
    
    const avgProfit = (netIfBackWins + netIfLayWins) / 2;
    
    document.getElementById('matched-result').innerHTML = `
        <div style="background: rgba(255, 152, 0, 0.2); padding: 20px; border-radius: 8px; border-left: 4px solid #FF9800;">
            <h3 style="color: #FF9800; margin-top: 0;">🔄 Matched Betting</h3>
            
            <div style="margin: 15px 0;">
                <strong>Puntate:</strong><br>
                • Back: €${backStake.toFixed(2)} @ ${backOdd}<br>
                • Lay: €${layStake.toFixed(2)} @ ${layOdd}<br>
                • Liability: €${liability.toFixed(2)}
            </div>
            
            <div style="margin: 15px 0;">
                <strong>Scenari:</strong><br>
                • Se vince back: ${netIfBackWins >= 0 ? '+' : ''}€${netIfBackWins.toFixed(2)}<br>
                • Se vince lay: ${netIfLayWins >= 0 ? '+' : ''}€${netIfLayWins.toFixed(2)}
            </div>
            
            <div style="margin: 15px 0;">
                <strong>Profitto medio:</strong><br>
                <strong style="color: ${avgProfit >= 0 ? '#4CAF50' : '#f44336'};">
                    ${avgProfit >= 0 ? '+' : ''}€${avgProfit.toFixed(2)}
                </strong>
            </div>
        </div>
    `;
}

// ============================================
// INIZIALIZZAZIONE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Setup login enter key
    document.getElementById('password').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') login();
    });
    
    // Mostra primo calcolatore
    showCalculator('arbitrage');
});
