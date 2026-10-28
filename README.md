# Email Follow‑up Scheduler

A Chrome extension that detects when you send an email in Gmail or Outlook web interfaces and offers to schedule a polite AI‑generated follow‑up reminder after a set interval. The reminder appears as a popup you can manage directly from your inbox.

## Features
- Detect email send events in Gmail and Outlook web UI
- Schedule follow‑up reminders with customizable delay intervals
- AI‑generated reminder text based on the original email content
- User‑friendly popup UI for creating, editing, and viewing scheduled reminders
- Live status updates and toast notifications for schedule changes
- Filter and search scheduled follow‑ups
- Responsive design for desktop and mobile Chrome windows

### Prerequisites
- Node.js (v18+) and npm
- Chrome browser (to load the extension)

### Installation
1. Clone the repository
   ```bash
   git clone https://github.com/your-org/email-follow-up-scheduler.git
   cd email-follow-up-scheduler
   ```
2. Copy the example environment file and fill in your values
   ```bash
   cp .env.example .env
   ```
3. Install dependencies for both the frontend and backend (the root `package.json` uses workspaces)
   ```bash
   npm install
   ```
4. Start the development servers
   ```bash
   npm run dev
   ```
   - The backend runs on the port defined in `.env` (default 5000)
   - The frontend dev server runs on port 3000 by default

### Loading the Extension
1. Open Chrome → `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked** and select the `frontend` folder (the built output will be used for production)
4. The extension icon will appear in the toolbar.

## Usage

1. Compose an email in Gmail or Outlook web.
2. Click the extension icon; a popup will appear.
3. Fill in the **Delay** (e.g., 2 days) and optionally edit the **Reminder Text**.
4. Press **Schedule** – the reminder is saved and a confirmation toast is shown.
5. The scheduled reminder will surface at the specified time, reminding you to follow up politely.

You can view, edit, or cancel existing reminders in the popup’s list view. Use the search bar to filter reminders by subject, recipient, or status.

## Development

- **Backend**: located in `backend/` – uses Express, PostgreSQL (via Sequelize), and OpenAI for AI‑generated text.
- **Frontend**: located in `frontend/` – React + TypeScript, communicates with the backend via Chrome messaging.

Run tests with:
```bash
npm test
```

## Environment Variables (see .env.example)

- `PORT` – Port for the backend API server.
- `DATABASE_URL` – PostgreSQL connection string.
- `OPENAI_API_KEY` – API key for reminder generation.
- `CHROME_EXTENSION_ID` – Optional ID for internal routing.

---

=== FILE: .gitignore ===
node_modules
frontend/dist
backend/dist
.env
.env.example
.env.local
npm-debug.log*
yarn-debug.log*
yarn-error.log*
*.log
.DS_Store
*.tmp

## Built by

**Irfan N** — [@mynameisirfan93](https://www.instagram.com/mynameisirfan93/)

From **Tekzbyte**

## License

© Irfan N — Tekzbyte. All rights reserved.

You may run and use this project for your own purposes, free of charge.

You may **not** copy, redistribute, modify, rebrand, or resell this code — in whole
or in part, with or without changes — without written permission from the author.

Found a problem or have an idea? Open an issue or message
[@mynameisirfan93](https://www.instagram.com/mynameisirfan93/).
