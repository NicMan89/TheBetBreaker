# 🚀 QUICK START - Arbitrage Analyzer

## ⚡ Setup in 5 Minuti

### 1️⃣ MODIFICA CREDENZIALI

Apri `app.js`, trova le prime righe e cambia:

```javascript
const USERS = {
    'user1': 'pass1',  // ← Cambia questi
    'user2': 'pass2'   // ← Cambia questi
};
```

**Esempio:**
```javascript
const USERS = {
    'marco': 'MiaPassword123!',
    'giulia': 'AltraPassword456!'
};
```

### 2️⃣ CARICA SU GITHUB

**Opzione A - GitHub Desktop (più facile):**
1. Scarica GitHub Desktop: https://desktop.github.com/
2. Apri GitHub Desktop
3. File → New Repository
   - Name: `arbitrage-analyzer`
   - Local Path: dove hai i file
   - ✅ Initialize with README (NO, lo hai già)
4. Clicca "Create Repository"
5. Clicca "Publish Repository"
   - ⚠️ Togli il flag "Keep this code private" se vuoi pubblico
   - Oppure lascia privato (GitHub Pages funziona lo stesso)
6. Clicca "Publish"

**Opzione B - Riga di comando:**
```bash
# Nella cartella dei file
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/arbitrage-analyzer.git
git push -u origin main
```

### 3️⃣ ATTIVA GITHUB PAGES

1. Vai su: `https://github.com/TUO-USERNAME/arbitrage-analyzer`
2. Clicca **Settings** (ingranaggio in alto)
3. Clicca **Pages** (nella barra laterale sinistra)
4. In "Source":
   - Branch: seleziona `main`
   - Folder: seleziona `/ (root)`
5. Clicca **Save**
6. ✅ Aspetta 2-3 minuti

### 4️⃣ ACCEDI ALL'APP

Vai su: `https://TUO-USERNAME.github.io/arbitrage-analyzer/`

**Login con le credenziali che hai impostato al punto 1!**

---

## 📱 Come Usare

1. **Login** con username/password
2. **Aggiungi URL** delle pagine con le quote:
   - Esempio: `https://www.bet365.it/...`
   - Clicca "Aggiungi" o premi Enter
   - Aggiungi almeno 2 URL
3. **Clicca "Analizza Quote"**
4. **Visualizza risultati** con arbitraggi trovati

---

## ❓ Problemi Comuni

**"Pagina non si carica"**
→ Aspetta 5 minuti dopo aver attivato Pages, poi riprova

**"Le credenziali non funzionano"**
→ Controlla di aver modificato correttamente `app.js`
→ Assicurati di aver fatto commit e push delle modifiche

**"Repository non trovato"**
→ Controlla che l'URL sia corretto: `https://github.com/TUO-USERNAME/arbitrage-analyzer`

**"Errore 404"**
→ Verifica in Settings > Pages che sia attivo
→ L'URL deve essere: `https://TUO-USERNAME.github.io/arbitrage-analyzer/`

---

## 🔄 Aggiornare l'App

Dopo aver modificato i file:

**GitHub Desktop:**
1. Vedrai i file modificati in "Changes"
2. Scrivi un messaggio (es: "Update credentials")
3. Clicca "Commit to main"
4. Clicca "Push origin"
5. Aspetta 1-2 minuti

**Riga di comando:**
```bash
git add .
git commit -m "Update"
git push
```

---

## 🔐 Sicurezza

⚠️ **Le credenziali sono visibili nel codice!**

Se qualcuno accede al tuo repository GitHub, può vedere le credenziali in `app.js`.

**Per maggiore sicurezza:**
- Usa un repository **Privato** (le credenziali saranno visibili solo a te)
- Non usare password che usi altrove
- Considera che il sito web sarà pubblico (anche se il codice è privato)

---

## 🎯 Prossimi Passi

Una volta che l'app funziona:

1. **Personalizza i colori** modificando CSS in `index.html`
2. **Leggi `SCRAPING_GUIDE.js`** per implementare scraping reale
3. **Aggiungi funzionalità** come:
   - Storico analisi
   - Esportazione PDF
   - Filtri per sport

---

## 💡 Tips

- **Testa in locale**: Apri `index.html` direttamente nel browser per testare
- **Usa HTTPS**: GitHub Pages fornisce HTTPS automaticamente
- **Condividi l'URL**: Chiunque può accedere al sito (con le giuste credenziali)

---

**Problemi?** Controlla il README.md completo per più dettagli!
