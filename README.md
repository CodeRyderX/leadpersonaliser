# ColdPersonaliser

Upload any CSV of leads and get unique, natural-sounding personalised cold email opening lines powered by Claude AI.

## Features

- Upload any CSV — no assumptions about column names
- Live SSE progress while Claude writes each opening line
- Download enriched CSV with all original columns preserved plus a `personalised_line` column
- Light and dark mode

## Stack

- **Backend**: Python 3.11+, FastAPI, Anthropic Python SDK, pandas
- **Frontend**: React 18, Vite 5, Tailwind CSS 3

## Getting started

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).
