# 💎 Arbitrage Analyzer - Sistema di Analisi Quote Sportive

Applicazione web per l'analisi delle quote sportive e il calcolo degli arbitraggi.

## 🚀 Caratteristiche

- ✅ Login con credenziali hardcoded (2 utenti)
- 📊 Inserimento URL di pagine con quote sportive
- 💰 Calcolo automatico opportunità di arbitraggio
- 🎯 Calcolo puntate ottimali per profitto garantito
- 📱 Design responsive e moderno
- 🔒 Sessione persistente (sessionStorage)

## 📦 File Inclusi

- `index.html` - Interfaccia utente principale
- `app.js` - Logica applicazione JavaScript
- `README.md` - Questo file

## 🔧 Configurazione

### Modifica Credenziali

Apri `app.js` e modifica le credenziali nella sezione iniziale:

```javascript
const USERS = {
    'user1': 'pass1',  // Cambia questi valori
    'user2': 'pass2'   // Cambia questi valori
};
```

**Esempio:**
```javascript
const USERS = {
    'marco': 'sicurezza123',
    'luca': 'password456'
};
```

## 🌐 Hosting su GitHub Pages

### Opzione 1: Repository Nuovo

1. **Crea un nuovo repository su GitHub:**
   - Vai su https://github.com/new
   - Nome: `arbitrage-analyzer` (o quello che preferisci)
   - Imposta come **Privato** se vuoi mantenere il codice privato
   - Clicca "Create repository"

2. **Carica i file:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TUO-USERNAME/arbitrage-analyzer.git
   git push -u origin main
   ```

3. **Attiva GitHub Pages:**
   - Vai nelle Settings del repository
   - Sezione "Pages" nella sidebar sinistra
   - Source: seleziona "main" branch e "/" (root)
   - Clicca "Save"

4. **Accedi all'app:**
   - Dopo qualche minuto: `https://TUO-USERNAME.github.io/arbitrage-analyzer/`

### Opzione 2: Repository Esistente

Se hai già un repository:

```bash
cd tuo-repository
# Copia i file index.html e app.js nella root o in una cartella
git add .
git commit -m "Add arbitrage analyzer"
git push
```

Poi attiva GitHub Pages come sopra.

## 🔐 Sicurezza

⚠️ **IMPORTANTE:**

1. **Le credenziali sono nel codice sorgente** - Chiunque abbia accesso al codice può vederle
2. Per un'applicazione pubblica, considera di:
   - Usare un backend con autenticazione reale
   - Implementare rate limiting
   - Usare HTTPS (GitHub Pages lo fornisce automaticamente)

3. **Repository Privato:** Se usi un repo privato, solo tu e i collaboratori potrete vedere il codice, ma il sito sarà comunque pubblico

## 💻 Utilizzo

1. **Login:**
   - Inserisci username e password
   - Clicca "Accedi"

2. **Aggiungere URL:**
   - Inserisci l'URL completo della pagina con le quote (es: `https://www.bet365.it/...`)
   - Clicca "Aggiungi" o premi Enter
   - Ripeti per tutti i bookmaker che vuoi analizzare

3. **Analizzare:**
   - Clicca "Analizza Quote"
   - Attendi l'analisi (2-3 secondi)
   - Visualizza le opportunità di arbitraggio trovate

4. **Rimuovere URL:**
   - Clicca sul pulsante "✖ Rimuovi" accanto a un URL per eliminarlo

## 🎯 Funzionamento

L'applicazione attualmente utilizza **dati simulati** per dimostrare il funzionamento. I calcoli di arbitraggio sono reali, ma le quote sono generate casualmente.

### Per Implementare Scraping Reale:

Dovrai modificare la funzione `analyzeOdds()` in `app.js` per:

1. **Fetch delle pagine** (richiede un proxy per CORS):
```javascript
const response = await fetch(url);
const html = await response.text();
```

2. **Parsing HTML:** Estrarre le quote usando regex o parser

3. **Calcolo arbitraggi:** Il codice attuale già include la logica di calcolo

**Nota:** Lo scraping diretto da browser è limitato da CORS. Soluzioni:
- Usare un proxy CORS (es: `https://cors-anywhere.herokuapp.com/`)
- Implementare un backend che faccia lo scraping
- Usare API ufficiali se disponibili

## 📊 Output Esempio

L'analisi mostra per ogni arbitraggio:
- 🏆 Sport e evento
- 💰 Quote dai bookmaker
- 📈 Puntate ottimali
- 💵 Profitto garantito (€ e %)
- 📝 Istruzioni passo-passo

## 🛠️ Personalizzazione

### Modifica Stili

Modifica il CSS in `<style>` dentro `index.html`:
- Colori gradiente: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- Font: `font-family: 'Segoe UI', ...`
- Dimensioni: `max-width`, `padding`, etc.

### Aggiungere Funzionalità

Puoi estendere `app.js` per:
- Salvare storico analisi (localStorage)
- Esportare risultati in CSV/PDF
- Notifiche browser per nuovi arbitraggi
- Grafici statistiche
- Filtri per sport/bookmaker

## 🐛 Troubleshooting

**"URL non valido"**
- Assicurati che l'URL inizi con `http://` o `https://`

**"Nessun arbitraggio trovato"**
- Normale! L'app simula una ricerca e non sempre trova opportunità
- Con dati reali, gli arbitraggi sono rari (1-5% delle analisi)

**Pagina bianca dopo deploy**
- Aspetta 5-10 minuti dopo l'attivazione di GitHub Pages
- Controlla che i file siano nella root del repository
- Verifica i log in Settings > Pages

## 📝 Licenza

Questo progetto è per uso personale ed educativo.

## ⚠️ Disclaimer

Questo strumento è fornito "as is" solo a scopo educativo. L'autore non è responsabile per:
- Perdite finanziarie
- Violazioni dei termini di servizio dei bookmaker
- Uso improprio del software

Verifica sempre le quote sui siti ufficiali prima di effettuare puntate.

## 🤝 Supporto

Per problemi o domande, apri una Issue nel repository.

---

**Fatto con ❤️ per gli appassionati di arbitraggio sportivo**
