# Dhia Studio — Founder-led Video Editing Portfolio

Personal portfolio website for **Dhia Eddine Ouchene** (Founder & Solo Video Editor at **Dhia Studio**).

Positioned for educational creators, coaches, consultants, personal brands, and YouTubers looking for retention-focused video editing and paid trial collaborations.

- **Domain:** [dhiaeddine.studio](https://dhiaeddine.studio)
- **Contact:** [dhia@dhiaeddine.studio](mailto:dhia@dhiaeddine.studio)

---

## 🚀 Quick Start

### 1. Run with Node.js Server
```bash
# Install dependencies (Express, CORS, Nodemailer, Dotenv)
npm install

# Start local server
npm start
```
Open `http://localhost:3000` in your browser.

### 2. Static Preview (Without Node.js backend)
You can directly open `index.html` in any browser or use VS Code Live Server / Python HTTP server:
```bash
python -m http.server 8000
```

---

## 🖼️ Required Assets & Recommendations

| Asset | File Path | Recommended Dimensions | Description |
|---|---|---|---|
| **Founder Portrait** | `assets/dhia-portrait.jpg` | **600 × 750 px** (4:5) or **800 × 1000 px** | High-resolution photo of Dhia Eddine for the Hero & About sections. |
| **Social Sharing (OG) Image** | `assets/og-image.jpg` | **1200 × 630 px** (1.91:1) | Preview image displayed when sharing `https://dhiaeddine.studio` on Twitter, LinkedIn, Discord, and iMessage. |
| **Brand Logo / Favicon** | `assets/logo.png` | **512 × 512 px** | Dhia Studio circular emblem. |

---

## ⚙️ Contact Form Configuration

The contact form supports dual delivery methods:

1. **Web3Forms (Free & Serverless):**
   - In `index.html`, form submissions use Web3Forms API key.
   - You can update `access_key` with your free key from [web3forms.com](https://web3forms.com).

2. **Node.js Express + SMTP:**
   - Copy `.env.example` to `.env`.
   - Add your SMTP credentials (e.g. Gmail App Password).
   - Inbound inquiries will be formatted and mailed to `dhia@dhiaeddine.studio`.

3. **Mailto Fallback:**
   - If network or API delivery fails, the form automatically launches the client's default mail client with pre-filled fields directed to `dhia@dhiaeddine.studio`.

---

## 📁 Repository Structure

```
Dhia Studio/
├── assets/
│   ├── logo.png               # Brand icon & logo mark
│   ├── dhia-portrait.jpg      # (TODO: Add portrait here)
│   └── og-image.jpg           # (TODO: Add social share image here)
├── index.html                 # Main single-page portfolio
├── editors.html               # Redirect to main portfolio
├── server.js                  # Express backend & email handler
├── email_templates.txt        # Plain-text & email formatting templates
├── vercel.json                # Vercel static deployment config
├── .env.example               # Environment variables template
└── package.json               # Node.js project manifest
```