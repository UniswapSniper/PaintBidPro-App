# PaintBidPro

PaintBidPro is a multi-platform solution designed for painting contractors. It combines high-fidelity site scanning (iOS), detailed project management (Web), and conversational AI assistance (ChatGPT) into one cohesive ecosystem.

## The Ecosystem

PaintBidPro operates as a **unified platform** where your data follows you across all devices:

*   **iOS App (The Field Expert):** Use LiDAR scanning and voice-guided measurements to capture job site data with high precision.
*   **Web Dashboard (The Command Center):** Manage clients, refine bids, send professional invoices, and track your business metrics from any browser.
*   **ChatGPT App (The Assistant):** Interact with your business data using natural language. Draft proposals, check your schedule, or analyze project costs via the Model Context Protocol (MCP).

## Universal Access & Entitlements

*   **One Account:** Your single login works across iOS, Web, and ChatGPT.
*   **Synced Data:** Bids created on your phone are immediately available for review on the web or via ChatGPT.
*   **Cross-Platform Premium:** Purchasing a subscription on the iOS App Store automatically unlocks pro features on the Web and ChatGPT interfaces.

## Technology Stack

*   **Backend:** Next.js (App Router) with Vercel Postgres.
*   **Mobile:** React Native (Expo) with RoomPlan (LiDAR).
*   **AI:** OpenAI GPT-4, Model Context Protocol (MCP) for tool-calling, and custom TTS/STT.

## Getting Started

### Prerequisites

*   Node.js (v18+)
*   iOS Device with LiDAR (for mobile scanning)
*   Vercel Postgres credentials

### Installation

1.  **Clone the repo:**
    ```bash
    git clone https://github.com/UniswapSniper/PaintBidPro-App.git
    cd PaintBidPro-App
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # and for mobile
    cd mobile && npm install
    ```

3.  **Run Development Servers:**

    *   **Web API & Dashboard:**
        ```bash
        npm run dev
        ```
    *   **Mobile App:**
        ```bash
        cd mobile
        npx expo start
        ```

## Deployment

The Web API and Dashboard are optimized for deployment on **Vercel**. The mobile app is distributed via the **Apple App Store**.

# Force rebuild
