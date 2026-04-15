 POCKET PILOT — AI Finance Dashboard

Navigate your finances with the precision of a professional pilot.**

Pocket Pilot is a premium, AI-powered personal finance management dashboard designed to modernize traditional budgeting. 
It doesn't just track your numbers; it predicts your future spending behavior, guides you in real-time with conversational AI, and provides a stunning, high-contrast visual experience.
  Table of Contents
- [✨ Key Features](#-key-features)
- [🧠 Intelligence Engine (Deep Dive)](#-intelligence-engine-deep-dive)
- [🎨 Design Philosophy](#-design-philosophy)
- [🖥️ UI Breakdown](#️-ui-breakdown)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [🚀 Getting Started](#-getting-started)
- [📂 Project Structure](#-project-structure)
- [🛡️ Privacy & Security](#️-privacy--security)
- [🚧 Roadmap](#-roadmap)

 ✨ Key Features

 🧠 AI & Intelligent Insights
- **Financial Health Score**: A live 0-100 score calculated based on your savings rate, budget adherence, and debt-to-income ratio.
- **Pace Prediction**: AI forecasts when you will run out of budget for specific categories (e.g., *"Est. empty on the 22nd"*).
- **Spending Predictor**: Linear regression models that forecast your next month's total and category-wise spending.
- **AI Pilot Chat**: A conversational assistant that answers questions like *"Can I afford a new laptop?"* or *"Give me tips to save more."*

 📊 Advanced Visualization
- **Health Gauge**: A custom-drawn canvas gauge visualizing your financial stability.
- **Income vs. Expense Charts**: Smooth, interactive line charts showing your financial trajectory over 6 months.
- **Expense Donut Chart**: A clear breakdown of where your money goes every month.
- **Sparklines**: High-density trend indicators for every KPI card.

 🛡️ Tactical Tracking
- **Monthly Calendar**: A grid view of your daily income and expense activity.
- **Bill Tracker**: Never miss a utility payment again with dedicated due-date tracking.
- **Debt/EMI Tracker**: Progress bars that show exactly how close you are to becoming debt-free.
- **Recurring Engine**: Automatically processes your regular salary or rent payments every month.

🧠 Intelligence Engine (Deep Dive)

The "Pilot" logic is contained within `ai-engine.js`. Here is how the core algorithms work:

 💯 The Health Score Algorithm
The score is a weighted average of four critical financial pillars:
1. **Savings Rate (40%)**: Calculated as `(Income - Expenses) / Income`. A 20% savings rate scores a perfect 100 in this pillar.
2. **Budget Adherence (30%)**: Points are deducted for every category where spending exceeds the user-defined limit.
3. **Debt-to-Income (20%)**: Measures total outstanding debt against monthly income. Lower ratios yield higher scores.
4. **Goal Progress (10%)**: Average completion percentage across all active financial goals.

🚨 Pace Prediction
The algorithm uses **Spending Velocity**:
- `Daily Velocity = Spent so far / Current Day of Month`
- `Projected Total = Daily Velocity * Total Days in Month`
- If `Projected Total > Budget`, it calculates the **Exhaustion Day**: `Limit / Daily Velocity`.

🎨 Design Philosophy

Pocket Pilot uses an **Emerald & Gold** high-contrast theme, chosen specifically for the financial sector:
- **Emerald Green (`#00C87A`)**: Represents growth, profit, and positive "go" signals.
- **Warm Gold (`#F5A623`)**: Used for secondary accents, goals, and premium indicators.
- **Dark Charcoal (`#0B0D0F`)**: Provides a deep, professional foundation that makes the data pop.
- **Glassmorphism**: Subtle background blurs and translucent layers create a sense of depth and modern sophistication.

 🖥️ UI Breakdown

 1. The Global Sidebar
Quick navigation between the **Dashboard**, **Transactions**, **Goals**, **Calendar**, **Budget**, **Trackers** (Bills/Debts), **Tools**, and the **AI Pilot**.
 2. The Command Topbar
- **Currency Switcher**: Change the global currency symbol (₹, $, £, etc.) instantly.
- **Theme Toggle**: Switch between the default "Night Pilot" dark mode and a "Paper" light mode.
- **AI Status**: A real-time heartbeat indicator showing the AI engine is active.
 3. The Dashboard Workspace
- **KPI Row**: Four cards with animated count-ups and mini trend sparklines.
- **Growth Chart**: Large line chart for income vs. expense trends.
- **Insight Panels**: AI-generated suggestions, recent badges, and upcoming bills.

🛠️ Tech Stack & Architecture

- **Vanilla JavaScript (ES6+)**: No heavy frameworks like React or Vue. This ensures blistering fast load times and zero dependency overhead.
- **HTML5 Canvas**: Used for high-performance rendering of custom charts and the health gauge.
- **Pure CSS3**: Custom grid and flexbox layouts with CSS variable-based theming.
- **LocalStorage**: 100% of the data is stored in the browser. The app is fully functional offline.

🚀 Getting Started

1. **Launch**: Double-click the **`Start Pocket Pilot.bat`** file.
2. **Setup**: On first launch, the **Smart Onboarding** will ask for your name and income to calibrate your initial budgets.
3. **Tracking**: Add your income and expenses. Mark items as "Recurring" if they happen every month.
4. **Review**: Check the **Calendar** and **Trackers** to stay ahead of upcoming payments.
 📂 Project Structure

```text
finance-dashboard/
├── index.html        # Main UI shell & templates
├── style.css         # Design system & theme engine
├── app.js            # Core orchestration & UI rendering
├── ai-engine.js      # Predictive logic & Chatbot
├── charts.js         # Canvas-based charting library
├── server.js         # Lightweight local Node.js server
├── README.md         # This manual
└── Start Pocket Pilot.bat # One-click launcher
🛡️ Privacy & Security

**Your data is your business.**
Pocket Pilot does not have a backend database or an API that sends your data to the cloud. 
- **No Login Required**: No email or password needed.
- **No Tracking**: No cookies or analytics scripts.
- **Local Persistence**: If you clear your browser cache/data, your information will be reset (make sure to use the **CSV Export** to back up your data!).
 🚧 Roadmap
- [ ] **AI "What-If" Simulator**: Test major purchases before making them.
- [ ] **Bank CSV Auto-Parser**: Upload your bank statement for auto-categorization.
- [ ] **Mood Spending**: Track how your emotions affect your wallet.
- [ ] **FIRE Calculator**: Track your progress toward Financial Independence.

---

© 2026 Pocket Pilot — Built for the future
