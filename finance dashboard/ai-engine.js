/* ═══════════════════════════════════════════════════════════
   POCKET PILOT — AI Engine
   Spending Predictor + Real-time Guidance Chatbot
═══════════════════════════════════════════════════════════ */

const AIEngine = {

  /* ── Linear Regression: predict next value ─────────── */
  linearRegression(data) {
    const n = data.length;
    if (n < 2) return data[data.length - 1] || 0;
    const xs = data.map((_, i) => i);
    const meanX = xs.reduce((a, b) => a + b, 0) / n;
    const meanY = data.reduce((a, b) => a + b, 0) / n;
    let num = 0, den = 0;
    xs.forEach((x, i) => { num += (x - meanX) * (data[i] - meanY); den += (x - meanX) ** 2; });
    const slope     = den ? num / den : 0;
    const intercept = meanY - slope * meanX;
    return Math.max(0, slope * n + intercept);
  },

  /* ── Predict next month's total spending ────────────── */
  predictNextMonth(transactions) {
    const now   = new Date();
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({ year: d.getFullYear(), month: d.getMonth() });
    }

    const monthlySpend = months.map(({ year, month }) =>
      transactions
        .filter(t => t.type === 'expense' && new Date(t.date).getFullYear() === year && new Date(t.date).getMonth() === month)
        .reduce((s, t) => s + t.amount, 0)
    );

    return {
      predicted: Math.round(this.linearRegression(monthlySpend)),
      trend: monthlySpend,
    };
  },

  /* ── Predict per-category ───────────────────────────── */
  predictByCategory(transactions) {
    const cats = [...new Set(transactions.filter(t => t.type === 'expense').map(t => t.category))];
    const now   = new Date();
    const result = [];

    cats.forEach(cat => {
      const months = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const spend = transactions
          .filter(t => t.type === 'expense' && t.category === cat
                    && new Date(t.date).getFullYear() === d.getFullYear()
                    && new Date(t.date).getMonth()    === d.getMonth())
          .reduce((s, t) => s + t.amount, 0);
        months.push(spend);
      }
      const pred = Math.round(this.linearRegression(months));
      if (pred > 0) result.push({ category: cat, predicted: pred });
    });

    return result.sort((a, b) => b.predicted - a.predicted).slice(0, 4);
  },

  /* ── Generate AI Alerts ─────────────────────────────── */
  generateAlerts(transactions, budgets) {
    const alerts = [];
    const now    = new Date();

    Object.entries(budgets).forEach(([cat, limit]) => {
      const spent = transactions
        .filter(t => t.type === 'expense' && t.category === cat
                  && new Date(t.date).getMonth() === now.getMonth()
                  && new Date(t.date).getFullYear() === now.getFullYear())
        .reduce((s, t) => s + t.amount, 0);

      const pct = limit ? (spent / limit) : 0;
      if (pct > 0.9)
        alerts.push({ type: 'danger', msg: `⚠️ ${cat}: ${Math.round(pct*100)}% of budget used (₹${spent.toLocaleString()} of ₹${limit.toLocaleString()})` });
      else if (pct > 0.7)
        alerts.push({ type: 'warn',   msg: `🔶 ${cat}: ${Math.round(pct*100)}% of budget used — watch your spending!` });
    });

    /* Savings rate */
    const thisMonthIncome  = transactions.filter(t => t.type === 'income'  && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()).reduce((s,t)=>s+t.amount,0);
    const thisMonthExpense = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === now.getMonth() && new Date(t.date).getFullYear() === now.getFullYear()).reduce((s,t)=>s+t.amount,0);

    const savingsRate = thisMonthIncome > 0 ? (thisMonthIncome - thisMonthExpense) / thisMonthIncome : 0;
    if (savingsRate < 0.1 && thisMonthIncome > 0)
      alerts.push({ type: 'danger', msg: `🚨 Savings rate is only ${Math.round(savingsRate*100)}%! Aim for 20%+.` });
    else if (savingsRate >= 0.3)
      alerts.push({ type: 'good',   msg: `🎉 Great job! You're saving ${Math.round(savingsRate*100)}% of income this month.` });

    return alerts;
  },

  /* ── Generate Insights ──────────────────────────────── */
  generateInsights(transactions, goals, budgets) {
    const insights = [];
    const now = new Date();

    /* Biggest expense this month */
    const thisMonth = transactions.filter(t =>
      t.type === 'expense' &&
      new Date(t.date).getMonth() === now.getMonth() &&
      new Date(t.date).getFullYear() === now.getFullYear()
    );
    if (thisMonth.length) {
      const biggest = thisMonth.reduce((a,b) => a.amount > b.amount ? a : b);
      insights.push({ icon: '🔍', text: `Your biggest expense this month: <strong>${biggest.description}</strong> at ₹${biggest.amount.toLocaleString()}` });
    }

    /* Most spending category */
    const catTotals = {};
    thisMonth.forEach(t => { catTotals[t.category] = (catTotals[t.category]||0) + t.amount; });
    const topCat = Object.entries(catTotals).sort((a,b)=>b[1]-a[1])[0];
    if (topCat) insights.push({ icon: '📊', text: `Top spending category: <strong>${topCat[0]}</strong> — ₹${topCat[1].toLocaleString()}` });

    /* Goal closest to completion */
    if (goals.length) {
      const closest = [...goals].sort((a,b) => (b.saved/b.target) - (a.saved/a.target))[0];
      const pct = Math.round((closest.saved / closest.target) * 100);
      insights.push({ icon: '🎯', text: `Closest goal: <strong>${closest.name}</strong> is ${pct}% complete.` });
    }

    /* Day of month spending pace */
    const dayOfMonth = now.getDate();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
    const pace = thisMonth.reduce((s,t)=>s+t.amount,0) / dayOfMonth * daysInMonth;
    if (pace > 0) insights.push({ icon: '📅', text: `At current pace, you'll spend <strong>₹${Math.round(pace).toLocaleString()}</strong> this month.` });

    return insights;
  },

  /* ── Generate Recommended Actions ───────────────────── */
  generateActions(transactions, budgets, goals) {
    const actions = [];
    const now = new Date();
    const thisMonthExpense = transactions
      .filter(t => t.type === 'expense' && new Date(t.date).getMonth()===now.getMonth() && new Date(t.date).getFullYear()===now.getFullYear())
      .reduce((s,t)=>s+t.amount,0);
    const thisMonthIncome = transactions
      .filter(t => t.type === 'income' && new Date(t.date).getMonth()===now.getMonth() && new Date(t.date).getFullYear()===now.getFullYear())
      .reduce((s,t)=>s+t.amount,0);

    const savings = thisMonthIncome - thisMonthExpense;
    if (savings > 0 && goals.length) {
      const topGoal = [...goals].sort((a,b)=>(a.saved/a.target)-(b.saved/b.target))[0];
      const need = topGoal.target - topGoal.saved;
      actions.push(`Allocate ₹${Math.min(Math.round(savings*0.3), need).toLocaleString()} of savings to "${topGoal.name}"`);
    }

    Object.entries(budgets).forEach(([cat, limit]) => {
      const spent = transactions
        .filter(t => t.type==='expense' && t.category===cat && new Date(t.date).getMonth()===now.getMonth() && new Date(t.date).getFullYear()===now.getFullYear())
        .reduce((s,t)=>s+t.amount,0);
      if (spent > limit * 0.85) actions.push(`Cut ${cat} spending by ₹${Math.round(spent - limit*0.7).toLocaleString()} to stay on budget`);
    });

    if (thisMonthIncome > 0 && thisMonthIncome > thisMonthExpense * 1.5)
      actions.push('Consider investing surplus income in a SIP or FD this month');

    if (!actions.length) actions.push('Keep tracking your expenses — you\'re doing well!', 'Review budget limits to match your lifestyle');

    return actions.slice(0, 5);
  },

  /* ══════════════════════════════════════════════════════
     CONVERSATIONAL AI PILOT
  ══════════════════════════════════════════════════════ */

  /* Question trees for guided sessions */
  questionFlows: {
    budget: [
      { q: "What's your approximate total monthly income?", key: 'income' },
      { q: "What are your 3 biggest expense categories?", key: 'categories' },
      { q: "Do you have an emergency fund covering 3+ months of expenses?", key: 'emergency' },
    ],
    savings: [
      { q: "What's your primary savings goal right now?", key: 'goal' },
      { q: "How much can you set aside each month comfortably?", key: 'amount' },
      { q: "What's your target date to achieve this goal?", key: 'date' },
    ],
    spending: [
      { q: "Which category do you feel is your biggest spending trap?", key: 'trap' },
      { q: "Have you tried the 50/30/20 rule before?", key: 'rule' },
    ],
  },

  /* Main chat response generator */
  getResponse(userMsg, transactions, budgets, goals) {
    const msg   = userMsg.toLowerCase().trim();
    const now   = new Date();

    /* Compute relevant numbers */
    const totalIncome  = transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
    const totalExpense = transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
    const netSavings   = totalIncome - totalExpense;
    const thisMonthInc = transactions.filter(t=>t.type==='income' && new Date(t.date).getMonth()===now.getMonth()).reduce((s,t)=>s+t.amount,0);
    const thisMonthExp = transactions.filter(t=>t.type==='expense' && new Date(t.date).getMonth()===now.getMonth()).reduce((s,t)=>s+t.amount,0);
    const savingsRate  = thisMonthInc>0 ? Math.round((thisMonthInc-thisMonthExp)/thisMonthInc*100) : 0;

    /* Spending by category this month */
    const catSpend = {};
    transactions.filter(t=>t.type==='expense' && new Date(t.date).getMonth()===now.getMonth()).forEach(t=>{ catSpend[t.category]=(catSpend[t.category]||0)+t.amount; });
    const topCat = Object.entries(catSpend).sort((a,b)=>b[1]-a[1])[0];

    /* Intent matching */
    if (/(hello|hi|hey|start|begin)/i.test(msg))
      return `👋 Hello! I'm your **AI Pilot**, here to guide you to financial freedom.\n\nYou currently have **₹${totalIncome.toLocaleString()}** in total income recorded and **₹${totalExpense.toLocaleString()}** in expenses — netting **₹${netSavings.toLocaleString()}** in savings.\n\nWhat would you like to explore today?\n- 📊 Budget analysis\n- 🎯 Goal planning\n- 💡 Spending tips\n- 📈 Investment advice`;

    if (/(budget|spending|overspend)/i.test(msg)) {
      const alerts = this.generateAlerts(transactions, budgets);
      if (!alerts.length) return `✅ Your budgets look healthy this month! Your savings rate is **${savingsRate}%**.\n\nWant me to suggest optimized budget limits based on your spending patterns?`;
      return `Here's your budget status:\n\n${alerts.map(a=>a.msg).join('\n')}\n\n💡 **Tip:** Try the **50/30/20 rule** — 50% needs, 30% wants, 20% savings. Based on your income of ₹${thisMonthInc.toLocaleString()}, you should save ₹${Math.round(thisMonthInc*0.2).toLocaleString()} this month.`;
    }

    if (/(saving|save money|savings rate)/i.test(msg))
      return `📊 Your savings rate this month is **${savingsRate}%** (₹${(thisMonthInc-thisMonthExp).toLocaleString()}).\n\n${savingsRate >= 20 ? '🎉 Excellent! You\'re above the recommended 20% savings rate.' : `⚠️ Aim for at least 20%. You need to save ₹${Math.round(thisMonthInc*0.2 - (thisMonthInc-thisMonthExp)).toLocaleString()} more this month.`}\n\n**Quick wins to boost savings:**\n• Cut 2 dining-out sessions (saves ~₹800-1500)\n• Review subscriptions you don't use\n• Automate a monthly SIP`;

    if (/(goal|target|dream|plan)/i.test(msg)) {
      if (!goals.length) return `🎯 You have no goals set yet! Let's create one.\n\nCommon financial goals:\n• **Emergency Fund** — 3-6 months of expenses\n• **Vacation** — Plan your dream trip\n• **Home Down Payment** — Start building wealth\n\nTap **"+ New Goal"** in the Goals section to get started!`;
      const goalSummary = goals.map(g => `• **${g.icon} ${g.name}**: ${Math.round(g.saved/g.target*100)}% complete (₹${g.saved.toLocaleString()} of ₹${g.target.toLocaleString()})`).join('\n');
      return `🎯 Your current goals:\n\n${goalSummary}\n\nAt your current savings rate, I recommend allocating **₹${Math.round((thisMonthInc-thisMonthExp)*0.4).toLocaleString()}** per month toward your goals.`;
    }

    if (/(invest|sip|mutual fund|stock|fd)/i.test(msg))
      return `📈 Smart thinking! Here's a quick investment framework based on your finances:\n\n**Your Net Savings: ₹${netSavings.toLocaleString()}**\n\n• 🏦 **Emergency Fund first** (if not done) — 3-6 months of ₹${Math.round(totalExpense/6).toLocaleString()}/mo expenses\n• 📊 **SIP in Equity MF** — Start with ₹${Math.round(thisMonthInc*0.1).toLocaleString()}/month\n• 💰 **FD/Debt fund** — Park surplus for 3-6 months goals\n\n*I'm not a licensed advisor — always verify with a SEBI-registered professional.*`;

    if (/(predict|forecast|next month|future)/i.test(msg)) {
      const { predicted } = this.predictNextMonth(transactions);
      const catPreds      = this.predictByCategory(transactions);
      if (!predicted) return `📉 I need at least 2 months of transaction data to make accurate predictions. Keep adding your expenses!`;
      const catText = catPreds.map(c=>`• ${c.category}: ₹${c.predicted.toLocaleString()}`).join('\n');
      return `🤖 Based on your spending trends, here's my **next month forecast**:\n\n**Predicted Total Spend: ₹${predicted.toLocaleString()}**\n\nBreakdown:\n${catText}\n\n${predicted > thisMonthInc ? '⚠️ Warning: Predicted spend exceeds your income! Immediate action needed.' : '✅ Spend is within your income range — good position!'}`;
    }

    if (/(food|dining|restaurant|eat)/i.test(msg)) {
      const foodSpend = catSpend['Food'] || 0;
      const foodBudget = budgets['Food'] || 0;
      if (!foodSpend) return `🍔 No food expenses recorded this month. Start logging your dining expenses to get insights!`;
      return `🍔 **Food & Dining Analysis:**\n\nThis month: ₹${foodSpend.toLocaleString()}${foodBudget ? ` of ₹${foodBudget.toLocaleString()} budget (${Math.round(foodSpend/foodBudget*100)}%)` : ''}\n\n**Tips to cut food spending:**\n• Cook at home 3 more times/week — save ~₹2,000/month\n• Use grocery delivery apps with cashback\n• Meal prep on Sundays reduces impulse orders\n• Try the "lunch box" challenge for work days`;
    }

    if (/(transport|travel|commute|uber|auto)/i.test(msg)) {
      const transSpend = catSpend['Transport'] || 0;
      return `🚗 **Transport Spending:** ₹${transSpend.toLocaleString()} this month.\n\n**Optimization ideas:**\n• Use monthly transit passes if available\n• Carpooling can cut costs by 40-60%\n• Consider an e-bike for short commutes\n• Compare cab apps — Rapido/Ola vs Uber`;
    }

    if (/(tip|advice|suggestion|help|guide)/i.test(msg))
      return `💡 Here are your **personalized financial tips** right now:\n\n1. **50/30/20 Rule**: Based on ₹${thisMonthInc.toLocaleString()} income → save ₹${Math.round(thisMonthInc*0.2).toLocaleString()}/month\n2. ${topCat ? `**Cut ${topCat[0]}**: Your top spend at ₹${topCat[1].toLocaleString()} — try reducing by 20%` : 'Track all expenses to find your biggest leak'}\n3. **Automate savings**: Set up auto-debit on salary day\n4. **Review subscriptions**: Cancel what you don't use monthly\n5. **Emergency fund**: Keep 3-6 months of expenses liquid`;

    if (/(net worth|worth|wealth)/i.test(msg))
      return `💎 **Your Financial Snapshot:**\n\n• Total Income Tracked: ₹${totalIncome.toLocaleString()}\n• Total Expenses: ₹${totalExpense.toLocaleString()}\n• **Net Savings: ₹${netSavings.toLocaleString()}**\n• Savings Rate (this month): ${savingsRate}%\n\nTo build wealth faster:\n• Track *every* expense\n• Invest savings, don't just save\n• Set a goal to increase income by 10% annually`;

    if (/(50.30.20|rule|framework|percentage)/i.test(msg))
      return `📐 **The 50/30/20 Rule** applied to your income of ₹${thisMonthInc.toLocaleString()}:\n\n• 🏠 **50% Needs** → ₹${Math.round(thisMonthInc*0.5).toLocaleString()} (rent, food, bills)\n• 🎬 **30% Wants** → ₹${Math.round(thisMonthInc*0.3).toLocaleString()} (entertainment, shopping)\n• 💰 **20% Savings** → ₹${Math.round(thisMonthInc*0.2).toLocaleString()} (investments, goals)\n\nYou're currently spending **₹${thisMonthExp.toLocaleString()}** — that's ${Math.round(thisMonthExp/thisMonthInc*100)||0}% of income.`;

    /* Default fallback */
    const defaults = [
      `I can help you with:\n\n• 📊 **"Analyse my budget"** — Detailed breakdown\n• 🎯 **"How are my goals?"** — Goal progress\n• 📈 **"Predict next month"** — AI forecast\n• 💡 **"Give me tips"** — Personalized advice\n• 🏦 **"Investment advice"** — Where to grow money\n\nWhat would you like to explore?`,
      `Good question! Let me dig into your financial data...\n\nYou've logged **${transactions.length} transactions** so far. Your current savings rate is **${savingsRate}%** this month.\n\nTry asking me: *"What should I cut to save more?"* or *"How can I reach my goals faster?"*`,
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  },

  /* Quick question suggestions */
  getQuickQuestions(transactions, budgets, goals) {
    const now = new Date();
    const qs  = ["💡 Give me tips", "📈 Predict next month", "📊 Analyse my budget"];
    if (goals.length)    qs.push("🎯 How are my goals?");
    if (transactions.some(t=>t.type==='expense' && new Date(t.date).getMonth()===now.getMonth()))
      qs.push("🍔 Food spending?");
    qs.push("💰 50/30/20 rule", "🏦 Investment advice", "📉 Savings rate");
    return qs.slice(0, 5);
  },
};
