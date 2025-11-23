# 📤 Guida: Come Pubblicare l'App su GitHub

## Step 1: Creare un Repository su GitHub

1. Vai a [github.com/new](https://github.com/new)
2. Compila:
   - **Repository name**: `dioniso-caffe` (o simile)
   - **Description**: "Food delivery platform for Fisher employees"
   - **Visibility**: `Public` (per mostrarla al mondo)
   - **Initialize**: Lascia vuoto (usiamo il repo locale)
3. Clicca **"Create repository"**

Riceverai l'URL del repository: `https://github.com/YOUR_USERNAME/dioniso-caffe.git`

---

## Step 2: Configurare Git Localmente

Apri terminale e lancia questi comandi:

```bash
# Vai nella cartella del progetto
cd /path/to/dioniso-caffe

# Inizializza Git (se non già fatto)
git init

# Aggiungi il repository remoto
git remote add origin https://github.com/YOUR_USERNAME/dioniso-caffe.git

# Configura il branch principale
git branch -M main

# Aggiungi tutti i file
git add .

# Commita
git commit -m "Initial commit: Dioniso Caffè app v1.0.0"

# Pubblica su GitHub
git push -u origin main
```

---

## Step 3: Settare .env su GitHub (IMPORTANTE!)

⚠️ **ATTENZIONE**: NON pushare i file .env con le credenziali!

### Sono Già Protetti:
Il `.gitignore` contiene `.env`, quindi le tue credenziali NON saranno pushate.

### Per Usare l'App:
Chi clona il repository deve creare il suo `.env.local`:

```bash
# Dopo clone
cp .env.example .env.local

# E compilare le variabili:
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
DATABASE_URL=...
```

---

## Step 4: Aggiungere GitHub Secrets (Opzionale per Deploy)

Se vuoi deployare direttamente da GitHub:

1. Repository → Settings → Secrets and variables → Actions
2. Crea questi secrets:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_APP_ID`
   - `DATABASE_URL`

---

## Step 5: Aggiungere un GitHub Actions Workflow (Opzionale)

Crea `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Replit

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - name: Deploy to Replit
        run: |
          curl -X POST https://replit.com/api/deployments \
            -H "Authorization: Bearer ${{ secrets.REPLIT_TOKEN }}" \
            -d '{"commit": "${{ github.sha }}"}'
```

---

## Step 6: Verificare il Repository

Vai su `https://github.com/YOUR_USERNAME/dioniso-caffe` e verifica:

✅ Tutti i file presenti
✅ `.env` NON visibile (protetto da .gitignore)
✅ README.md visibile in home
✅ Commit history mostrata

---

## Step 7: Aggiornare i File per GitHub

Aggiungi questi file se mancano:

### `.env.example`
```bash
# Firebase (opzionale - per abbonamenti)
VITE_FIREBASE_API_KEY=your_key_here
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_APP_ID=your_app_id

# Database (obbligatorio)
DATABASE_URL=postgresql://user:password@host/database
```

### `CONTRIBUTING.md`
```markdown
# Contributing

Grazie per il contributo! Per modifiche:

1. Fork il repository
2. Crea branch feature (`git checkout -b feature/amazing`)
3. Commit (`git commit -m 'Add amazing feature'`)
4. Push (`git push origin feature/amazing`)
5. Apri Pull Request

## Requisiti
- Node.js 18+
- PostgreSQL
- Capire la struttura (leggi APP_DOCUMENTATION.md)
```

### `LICENSE`
```
MIT License

Copyright (c) 2025 Dioniso Caffè

Permission is hereby granted, free of charge...
[Vedi template MIT su github.com]
```

---

## Step 8: Comandi Útili per Mantenere il Repo

```bash
# Vedere status
git status

# Pushare cambiamenti
git add .
git commit -m "Descrizione cambio"
git push

# Pulire history locale
git log --oneline

# Tornare a versione precedente
git revert <commit-hash>
```

---

## Step 9: Aggiungere Topics su GitHub

Repository → About → Add Topics:
- `food-delivery`
- `react`
- `typescript`
- `express`
- `postgresql`
- `tailwindcss`

---

## Step 10: Promoter il Repository

### Share on Social Media
```
🍝 Ho pubblicato Dioniso Caffè su GitHub!
Una piattaforma moderna di food delivery per i dipendenti Fisher.
- 5 lingue (IT, EN, ES, NL, PL)
- Ordini + abbonamenti settimanali
- Dashboard amministrativa
- Responsive design

🔗 https://github.com/YOUR_USERNAME/dioniso-caffe
```

### Readme Header Professionale
```markdown
# 🍝 Dioniso Caffè - Fisher Edition

[![GitHub stars](https://img.shields.io/github/stars/YOUR_USERNAME/dioniso-caffe?style=social)](https://github.com/YOUR_USERNAME/dioniso-caffe)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Una piattaforma moderna di food delivery aziendale con supporto multilingue
```

---

## 🎯 Checklist Finale

- [ ] Repository creato su GitHub
- [ ] Git configurato localmente (`git remote add origin`)
- [ ] `.gitignore` verifica (`.env` non esposto)
- [ ] Prima push completata (`git push -u origin main`)
- [ ] README.md visibile su GitHub
- [ ] Topics aggiunti
- [ ] `.env.example` creato
- [ ] Link README ai file di documentazione
- [ ] Funzionalità testate su repository clonato

---

## ⚠️ Sicurezza

**NON PUSHARE MAI:**
- ❌ `.env` con credenziali
- ❌ `node_modules/` (usa .gitignore)
- ❌ Password hardcoded
- ❌ API keys reali

**SE PER SBAGLIO HO PUSHATO CREDENZIALI:**
```bash
# Rimuovi dal history
git filter-branch --tree-filter 'rm -f .env' HEAD

# Cambia le credenziali su tutti i servizi (Firebase, DB, etc.)

# Force push (attenzione!)
git push origin --force
```

---

## 📖 Ulteriori Risorse

- [GitHub Docs](https://docs.github.com)
- [Git Tutorial](https://git-scm.com/book/en/v2)
- [README Best Practices](https://www.makeareadme.com/)

---

**Fatto! La tua app è ora su GitHub pronta per il mondo! 🚀**
