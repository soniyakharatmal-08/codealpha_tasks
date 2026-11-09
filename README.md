# Language Translation Tool

A beginner-friendly full-stack web app for translating text with a React frontend and an Express backend. The backend uses the free MyMemory Translation API by default, so no paid cloud account or API key is required for normal local use.

## Features

- Enter text and translate it between common languages
- Source and target language selectors with Auto Detect support
- Real backend translation request through MyMemory
- Small cleanup pass that swaps common bookish words for everyday wording
- Copy translated text to clipboard
- Browser text-to-speech for translated text
- Swap source and target languages
- Clear/reset controls
- Loading, success, and friendly error states
- 5000 character limit with live counter
- Accessible labels, keyboard-friendly controls, and visible focus states
- Backend validation and clean JSON API responses

## Technologies Used

- Frontend: React, Vite, JavaScript, CSS
- Backend: Node.js, Express.js
- API: MyMemory Translation API

## Folder Structure

```text
language-translation-tool/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── routes/
│   ├── services/
│   ├── tests/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── .gitignore
└── README.md
```

## Prerequisites

Install Node.js 18 or newer from https://nodejs.org/.

Check installation:

```bash
node --version
npm --version
```

## Installation

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

## Environment Setup

Create a backend `.env` file from the example:

```bash
cd server
copy .env.example .env
```

On macOS/Linux:

```bash
cp .env.example .env
```

MyMemory does not require an API key for basic usage. Keep `.env` on the backend only. Never place API keys in frontend files.

## How To Run

Start the backend:

```bash
cd server
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## API Endpoints

### GET `/api/health`

Returns:

```json
{
  "status": "ok"
}
```

### POST `/api/translate`

Request:

```json
{
  "text": "Hello, how are you?",
  "source": "en",
  "target": "hi"
}
```

Response:

```json
{
  "success": true,
  "translatedText": "नमस्ते, आप कैसे हैं?"
}
```

## Translation API Information

The server calls Google Translate first and falls back to MyMemory from `server/services/translationService.js`. API-specific logic is isolated there so the provider can later be replaced without rewriting the route.

After a provider returns text, the backend lightly cleans up common bookish words in supported languages so the result sounds more like normal everyday speech.

For Auto Detect, the frontend sends `auto` as the source. The backend translates that into MyMemory's supported `auto|target` language pair.

## Tests

Run backend tests:

```bash
cd server
npm test
```

The tests cover health checks, successful translation flow with a mocked provider, empty input, same source/target validation, invalid languages, and overly long input.

## Troubleshooting

- If the frontend cannot connect, make sure the backend is running on port `5000`.
- If CORS fails, check `CLIENT_ORIGIN` in `server/.env`.
- If MyMemory rate limits requests, wait and try again.
- If text-to-speech does not work, check that your browser supports the Web Speech API.
- If clipboard copy fails, use a modern browser and access the app through `localhost`.

## Future Improvements

- Add saved translation history
- Add user accounts
- Add Google Translate or Microsoft Translator provider support
- Add automatic language detection display
- Add more languages
