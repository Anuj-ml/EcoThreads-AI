# EcoThreads AI 🌿

**Scan for Earth.**  
EcoThreads AI is a hybrid-AI web application designed to help consumers make more sustainable fashion choices. By scanning clothing items or tags, the app analyzes materials, manufacturing processes, and brand ethics to provide an instant "Eco-Score," carbon footprint analysis, and actionable care guides.

![Status](https://img.shields.io/badge/Status-Beta-blue)
![Tech](https://img.shields.io/badge/Stack-React_|_Gemini_|_TensorFlow-green)

---

## 🚀 Features

### 🔍 **Hybrid AI Analysis Pipeline**
A multi-stage inference engine designed for robustness and accuracy:
1.  **Visual Classification (Edge)**: Uses **TensorFlow.js (MobileNet)** running locally in the browser to detect fabric textures and item types (e.g., "Denim", "Jersey").
2.  **OCR Text Extraction (Edge)**: Uses **Tesseract.js** to read fabric composition tags (e.g., "100% Organic Cotton").
3.  **Fusion Engine (Cloud)**: Sends the combined local signals to **Google Gemini 2.5 Flash**, which acts as an expert sustainability auditor to generate a structured report.

### 📊 **Sustainability Dashboard**
-   **Eco-Score (0-100)**: Instant rating based on material impact, circularity, and brand ethics.
-   **Carbon Footprint**: Detailed breakdown of emissions (Material vs. Manufacturing vs. Transport) with real-world comparisons (e.g., "Equivalent to driving 5 miles").
-   **Water Usage**: Estimates water saved compared to conventional alternatives.

### 🛍️ **Actionable Insights**
-   **Smart Care Guide**: AI-generated washing and repair instructions specific to the detected fabric to extend garment lifespan.
-   **True Cost Calculator**: Estimate "Price Per Wear" based on durability predictions.
-   **Greener Alternatives**: Live search using Gemini Tools to find purchaseable, sustainable replacements.
-   **Recycling Locator**: Uses Geolocation and Google Maps Grounding to find the nearest textile recycling centers.

### 🎮 **Gamification**
-   Earn points for every scan.
-   Level up from "Seed" to "Forest".
-   Unlock badges like "Carbon Neutralizer" and "Eco Enthusiast".

### 📶 **Offline Mode**
-   Gracefully degrades to local-only analysis using heuristics if the internet connection is lost.

---

## 🛠️ Tech Stack

-   **Frontend**: React 19, TypeScript, Tailwind CSS.
-   **Generative AI**: Google GenAI SDK (`gemini-2.5-flash`).
-   **Edge AI**: TensorFlow.js, Tesseract.js.
-   **Tools**: HTML5-QRCode, Lucide React.
-   **Build**: ESM-based architecture (no complex bundler required for the provided file structure).

---

## 🏗️ Architecture

```mermaid
graph TD
    User[User Camera/Upload] --> TF[TensorFlow.js (Vision)]
    User --> OCR[Tesseract.js (Text)]
    TF --> Signals{Signal Fusion}
    OCR --> Signals
    Signals --> |"Denim + 100% Cotton"| Gemini[Gemini 2.5 Flash]
    
    subgraph Google Cloud
        Gemini --> Search[Google Search Tool]
        Gemini --> Maps[Google Maps Tool]
    end
    
    Gemini --> |JSON Report| App[React UI]
    App --> Storage[Local Storage (History/Gamification)]
```

---

## ⚙️ Setup & Installation

### Prerequisites
-   A Google AI Studio API Key with access to `gemini-2.5-flash` and Search/Maps tools.
-   Node.js (if running a local dev server) or a simple static server.

### Environment Variables
The application requires the API key to be available in the process environment.
In the code (`services/geminiService.ts`), it expects:
`process.env.API_KEY`

### Running Locally

1.  **Clone the files**:
    Ensure `index.html`, `index.tsx`, `App.tsx`, and the `services/` and `components/` folders are in your root directory.

2.  **Install Dependencies**:
    The project uses ES Modules via CDN (`esm.sh`) in `index.html`, so **no `npm install` is strictly necessary** to run the browser code.

3.  **Serve the Application**:
    You need a static file server that supports SPA routing or simple serving.
    
    Using Python:
    ```bash
    python3 -m http.server 8000
    ```
    
    Using Node (`serve`):
    ```bash
    npx serve .
    ```

4.  **Inject API Key**:
    Since this is a client-side app, strictly for development, you might need to manually replace `process.env.API_KEY` in `services/geminiService.ts` with your actual key string, or use a bundler (Vite/Parcel) that handles `process.env`.
    
    *Note: In a production environment, requests should be proxied through a backend to keep the API key secure.*

---

## 📱 Usage

1.  **Grant Permissions**: Allow Camera and Location access when prompted.
2.  **Scan**: Point your camera at a piece of clothing. Ensure good lighting.
3.  **Analyze**: Watch the loader as Vision, OCR, and Fusion engines process the data.
4.  **Review**: Explore the impact dashboard, check the carbon footprint, and see care instructions.
5.  **History**: View past scans in the History tab.

---

## 🔒 Privacy & Permissions

-   **Camera**: Used strictly for real-time analysis. Images are processed in memory and sent to Gemini API; they are not permanently stored on any server by this app.
-   **Location**: Used only when clicking "Locate Centers" to query Google Maps for nearby recycling points.

---

## 📄 License

MIT License.
