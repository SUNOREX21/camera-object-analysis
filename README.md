# ObjectLens AI — AI Object Scanner & Physical Analyzer

ObjectLens AI is a modern Next.js web application that uses computer vision and AI to scan or upload images of physical objects and estimate their physical properties (weight, volume, dimensions, density, material, shape, and color).

## 🚀 How to Transfer & Run on Another Laptop / Account

### Method 1: Using GitHub (Recommended)

1. **Push code to GitHub from your current laptop**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of ObjectLens AI"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **On your new laptop**:
   ```bash
   git clone <your-github-repo-url>
   cd "camera object analysis"
   npm install
   npm run dev
   ```

---

### Method 2: Transfer via ZIP File (Drive / USB / Email)

1. **Compress project folder**:
   - Make sure **NOT** to include `node_modules` or `.next` folders (they can be reinstalled anytime).
   - Right-click the `camera object analysis` folder -> **Compress to ZIP**.

2. **On the new laptop**:
   - Extract the ZIP file to any folder.
   - Open Terminal / PowerShell in that folder.
   - Run:
     ```bash
     npm install
     npm run dev
     ```

---

## 🔑 Environment Setup (Optional Gemini API Key)

If you want live AI visual analysis using Google Gemini multimodal vision:

1. Create a `.env.local` file in the project root:
   ```env
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

*Note: If no API key is provided, ObjectLens AI operates out-of-the-box using its built-in realistic AI vision fallback model.*

---

## 🛠 Available Scripts

- `npm run dev` — Starts dev server at http://localhost:3000
- `npm run build` — Creates optimized production build
- `npm start` — Runs production server
