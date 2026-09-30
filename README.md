# KisanSeva AI • Smart Farmer & Dark Storage Management Platform

An enterprise-grade, multi-view, interactive web application simulating a production agriculture and precision cold chain logistics platform. Designed for Indian agricultural ecosystems (featuring Pune, Nashik, and Satara regional corridors).

![KisanSeva AI Platform](https://img.shields.io/badge/Platform-KisanSeva%20AI-emerald?style=for-the-badge)
![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript)

---

## 🚀 Key Features

### 🌾 Role 1: Farmer Portal
- **Overview Dashboard:** Real-time visibility into active stored commodity lots, average shelf-life countdowns, quality health indices, and storage alerts.
- **Crop Longevity & Storage Decay Simulator:** Interactive temperature (10°C–40°C) and humidity (20%–90%) sliders, dynamic SVG radial health gauge (Green → Yellow → Red), predictive shelf-life decay curves, and threshold alert banners (mold onset, sprout dormancy break).
- **Dark Storage & Cold Hub Finder:** Interactive simulated radar map and GPS grid for facilities in Pune, Nashik, and Satara. Direct booking modal with instant storage & IoT fee calculation and celebratory confetti.
- **Cultivation & Life-Cycle Timeline:** 6-stage interactive stepper (Soil Prep → Sowing → Precision Irrigation → Pest Shield → Harvest & Curing → Dark Storage Transfer) with agronomic checklists and Maharashtra agro-climatic advisories.
- **Mandi Price Intelligence & Arbitrage:** Real-time modal prices from Lasalgaon, Pune, Satara, and Vashi APMCs. Interactive ROI calculator showing net profits from holding crops in dark storage vs. immediate distress sales.

### 🏭 Role 2: Dark Storage Owner Portal
- **Warehouse Facility Overview:** Facility occupancy gauge, revenue tracking, and a visual grid of Storage Bays (Bay 1 to Bay 8) with live temperature, humidity, and status indicators.
- **Live Telemetry & Climate Override Control:** Manual setpoint control (Target Temp & Humidity), HVAC simulation, and real-time MQTT sensor heartbeat log. Emergency overrides for rapid pre-cooling, high-flow aeration, and ozone micro-dosing.
- **Space Requests & Booking Management:** Real-time bidirectional synchronization with farmer requests. Approve or decline incoming bookings with automatic bay allocation and facility capacity updates.
- **Occupancy & Revenue Analytics:** Historical vs. projected occupancy bar charts, stored commodity mix donut chart, and operational unit economics.

### ⚡ Bidirectional Cross-Role State
- State is synchronized locally via `localStorage`. A booking request submitted in the Farmer Portal immediately appears in the Storage Owner's booking management view, and approving it updates facility capacity and creates an active lot in the Farmer's dashboard.

---

## 🛠️ Tech Stack
- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS v4, custom glassmorphism, radar scan animations, and glowing telemetry indicators
- **Icons:** Lucide React
- **Visuals & Charts:** Dynamic SVG line/bar/donut charts and speedometers
- **Feedback:** Canvas Confetti

---

## 📦 Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/vishwajeetpawar123/BIE_PROJECT.git

# Navigate into project directory
cd noble-hawking

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173) to explore the platform.

### Production Build
```bash
npm run build
```
