# LaporCepat — AI-Powered Disaster Reporting System

> Citizen Portal x BPBD Command Center, connected by artificial intelligence in real-time.

**Live Demo:** [lapor-cepat.vercel.app](https://lapor-cepat.vercel.app)

---

## Background

Indonesia ranks second among the most disaster-prone countries in the world with a vulnerability score of 43.5%. Yet the existing emergency reporting system still relies on manual phone calls to BPBD call centers: slow, prone to miscommunication, and unstructured.

**LaporCepat** was built to answer one question: _how can a panicked citizen accurately convey an emergency situation to the response team, as fast as possible?_

---

## Solution: AI Triage Pipeline

Citizens do not need to fill out forms. They simply **speak** and AI handles the rest.

```
[Citizen Voice] -> [Whisper STT] -> [Gemini LLM Triage] -> [BPBD Dashboard]
     |                                      |
[Field Photo]                     Automatic extraction:
[GPS Coordinates]                 - Disaster type
                                  - Victim estimate
                                  - Priority level (CRITICAL/HIGH/MEDIUM/LOW)
                                  - Survival instructions for victims
                                  - Hoax detection
```

---

## Key Features

**Citizen Portal (`/lapor`)**

- Voice recording directly in the browser, transcribed via Whisper Large V3
- Text mode (silent) for situations where speaking is not possible
- Automatic GPS with fallback to IP geolocation
- Field photo upload with automatic compression
- Confirmation page with AI analysis preview before submitting
- Evacuation status tracking via report ID

**BPBD Dashboard (`/dashboard`)**

- Real-time triage queue via Server-Sent Events (Firestore `onSnapshot`)
- Automatic audio alert when a new critical report arrives
- Status filters: Pending / Dispatched / Resolved
- Interactive spatial map (Leaflet) with priority filter
- Full report detail: AI transcript, photo, coordinates, reporter contact
- Command actions: dispatch TRC, mark as resolved

---

## Technical Architecture

| Layer                  | Technology                                |
| ---------------------- | ----------------------------------------- |
| Frontend               | Nuxt 4, Vue 3, Tailwind CSS               |
| AI Speech-to-Text      | Groq Whisper Large V3                     |
| AI Triage and Analysis | Google Gemini 2.5 Flash                   |
| Database               | Firebase Firestore                        |
| Realtime               | Server-Sent Events + Firestore onSnapshot |
| Geolocation            | Browser GPS API + IP Geolocation fallback |
| Map                    | Leaflet.js + OpenStreetMap (CartoDB)      |
| Deployment             | Vercel (Serverless Node.js)               |

---

## How It Works (Demo Flow)

1. Open `/lapor` and allow GPS and microphone access
2. Press **TAP AND START SPEAKING**, describe the emergency verbally
3. AI processes the audio and extracts location, disaster type, and victim count
4. Review the AI analysis on the confirmation page
5. Submit and the report appears on the BPBD dashboard in real-time
6. BPBD operator views the report at `/dashboard` and dispatches TRC
7. Citizen tracks status at `/status/[id]`

---

## Local Setup

```bash
# Clone and install
git clone https://github.com/szuryuu/lapor-cepat
cd lapor-cepat
bun install

# Setup environment
cp .env.example .env
# Fill in all variables in .env

# Run dev server
bun run dev
```

### Environment Variables

```env
BPBD_PIN=              # PIN for operator dashboard login
GROQ_API_KEY=          # Groq API (Whisper STT)
GEMINI_API_KEY=        # Google Gemini API
FIREBASE_SERVICE_ACCOUNT= # Firebase service account JSON (stringified)

NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=
```

---

## Security

- Rate limiting per IP via Firestore (3 requests per minute)
- File type and size validation (audio max 5MB, photo max 600KB after compression)
- Dashboard authentication via PIN + cookie session
- Input sanitization (XML escaping) before sending to LLM
- Reports enter as `DRAFT` status and only become active after citizen confirmation
- AI fallback chain: Gemini 2.5 Flash falls back to Gemini 2.0 Flash on quota exhaustion

---
