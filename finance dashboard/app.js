/* ═══════════════════════════════════════════════════════════
   POCKET PILOT — Core App Logic
═══════════════════════════════════════════════════════════ */

/* ── State ──────────────────────────────────────────────── */
let state = {
  transactions: [],
  goals:        [],
  budgets:      {},
  bills:        [],
  debts:        [],
  badges:       [],
  settings: {
    theme:    'dark',
    currency: '₹',
    firstRun: true
  },
  userProfile: {
    name: '',
    income: 0,
    mainGoal: ''
  },
  entryType:    'income',
  selectedIcon: '🏖',
};

/* ── Demo seed data ─────────────────────────────────────── */
const DEMO_TRANSACTIONS = [
  // 6 months of demo data
  // Month -5
  { id:'d1',  type:'income',  description:'Salary',         amount:75000, category:'Salary',        date: monthDate(-5, 1)  },
  { id:'d2',  type:'expense', description:'Rent',           amount:18000, category:'Rent',          date: monthDate(-5, 3)  },
  { id:'d3',  type:'expense', description:'Groceries',      amount:6200,  category:'Food',          date: monthDate(-5, 8)  },
  { id:'d4',  type:'expense', description:'Netflix',        amount:649,   category:'Entertainment', date: monthDate(-5, 10) },
  { id:'d5',  type:'expense', description:'Petrol',         amount:3200,  category:'Transport',     date: monthDate(-5, 12) },
  { id:'d6',  type:'expense', description:'Electricity',    amount:2100,  category:'Bills',         date: monthDate(-5, 15) },

  // Month -4
  { id:'d7',  type:'income',  description:'Salary',         amount:75000, category:'Salary',        date: monthDate(-4, 1)  },
  { id:'d8',  type:'income',  description:'Freelance Work', amount:12000, category:'Freelance',     date: monthDate(-4, 14) },
  { id:'d9',  type:'expense', description:'Rent',           amount:18000, category:'Rent',          date: monthDate(-4, 3)  },
  { id:'d10', type:'expense', description:'Zomato Orders',  amount:4800,  category:'Food',          date: monthDate(-4, 9)  },
  { id:'d11', type:'expense', description:'Clothes',        amount:3500,  category:'Shopping',      date: monthDate(-4, 18) },
  { id:'d12', type:'expense', description:'Gym',            amount:1500,  category:'Health',        date: monthDate(-4, 5)  },
  { id:'d13', type:'expense', description:'Cab rides',      amount:2800,  category:'Transport',     date: monthDate(-4, 20) },

  // Month -3
  { id:'d14', type:'income',  description:'Salary',         amount:78000, category:'Salary',        date: monthDate(-3, 1)  },
  { id:'d15', type:'expense', description:'Rent',           amount:18000, category:'Rent',          date: monthDate(-3, 3)  },
  { id:'d16', type:'expense', description:'Dining Out',     amount:7200,  category:'Food',          date: monthDate(-3, 15) },
  { id:'d17', type:'expense', description:'Amazon',         amount:5600,  category:'Shopping',      date: monthDate(-3, 22) },
  { id:'d18', type:'expense', description:'Doctor Visit',   amount:1200,  category:'Health',        date: monthDate(-3, 11) },
  { id:'d19', type:'expense', description:'Electricity',    amount:2400,  category:'Bills',         date: monthDate(-3, 16) },
  { id:'d20', type:'expense', description:'Ola',            amount:3100,  category:'Transport',     date: monthDate(-3, 25) },

  // Month -2
  { id:'d21', type:'income',  description:'Salary',         amount:78000, category:'Salary',        date: monthDate(-2, 1)  },
  { id:'d22', type:'income',  description:'Bonus',          amount:20000, category:'Other Income',  date: monthDate(-2, 15) },
  { id:'d23', type:'expense', description:'Rent',           amount:18000, category:'Rent',          date: monthDate(-2, 3)  },
  { id:'d24', type:'expense', description:'Groceries',      amount:5800,  category:'Food',          date: monthDate(-2, 10) },
  { id:'d25', type:'expense', description:'Laptop Bag',     amount:2200,  category:'Shopping',      date: monthDate(-2, 20) },
  { id:'d26', type:'expense', description:'Insurance',      amount:8000,  category:'Bills',         date: monthDate(-2, 8)  },
  { id:'d27', type:'expense', description:'Petrol',         amount:2900,  category:'Transport',     date: monthDate(-2, 17) },
  { id:'d28', type:'expense', description:'Movie + Dinner', amount:2800,  category:'Entertainment', date: monthDate(-2, 28) },

  // Month -1
  { id:'d29', type:'income',  description:'Salary',         amount:78000, category:'Salary',        date: monthDate(-1, 1)  },
  { id:'d30', type:'income',  description:'Freelance',      amount:15000, category:'Freelance',     date: monthDate(-1, 20) },
  { id:'d31', type:'expense', description:'Rent',           amount:18000, category:'Rent',          date: monthDate(-1, 3)  },
  { id:'d32', type:'expense', description:'Zomato',         amount:8900,  category:'Food',          date: monthDate(-1, 12) },
  { id:'d33', type:'expense', description:'Shopping Spree', amount:9200,  category:'Shopping',      date: monthDate(-1, 22) },
  { id:'d34', type:'expense', description:'Electricity',    amount:2600,  category:'Bills',         date: monthDate(-1, 15) },
  { id:'d35', type:'expense', description:'Cab',            amount:3400,  category:'Transport',     date: monthDate(-1, 27) },

  // This month
  { id:'d36', type:'income',  description:'Salary',         amount:80000, category:'Salary',        date: monthDate(0, 1)   },
  { id:'d37', type:'expense', description:'Rent',           amount:18000, category:'Rent',          date: monthDate(0, 3)   },
  { id:'d38', type:'expense', description:'Groceries',      amount:4200,  category:'Food',          date: monthDate(0, 8)   },
  { id:'d39', type:'expense', description:'Spotify',        amount:119,   category:'Entertainment', date: monthDate(0, 6)   },
  { id:'d40', type:'expense', description:'Petrol',         amount:2500,  category:'Transport',     date: monthDate(0, 11)  },
];

const DEMO_GOALS = [
  { id:'g1', name:'Emergency Fund', icon:'💰', target:300000, saved:145000, date: futureDate(12) },
  { id:'g2', name:'Goa Vacation',   icon:'🏖', target:50000,  saved:22000,  date: futureDate(4)  },
  { id:'g3', name:'New Laptop',     icon:'📱', target:80000,  saved:35000,  date: futureDate(6)  },
];

const DEMO_BUDGETS = {
  Food:          12000,
  Transport:     5000,
  Shopping:      8000,
  Bills:         6000,
  Entertainment: 3000,
  Health:        3000,
  Rent:          18000,
};

/* ── Date helpers ───────────────────────────────────────── */
function monthDate(offset, day) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset);
  d.setDate(day);
  return d.toISOString().split('T')[0];
}
function futureDate(months) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString().split('T')[0];
}
function fmtDate(str) {
  return new Date(str).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' });
}
function fmtCur(n) { return (state.settings?.currency || '₹') + Number(n).toLocaleString('en-IN'); }

/* ── Persist to localStorage ───────────────────────────── */
function saveState() {
  localStorage.setItem('pp_state', JSON.stringify({
    transactions: state.transactions,
    goals:        state.goals,
    budgets:      state.budgets,
    bills:        state.bills,
    debts:        state.debts,
    badges:       state.badges,
    settings:     state.settings,
    userProfile:  state.userProfile
  }));
}
function loadState() {
  const raw = localStorage.getItem('pp_state');
  if (raw) {
    const s = JSON.parse(raw);
    state.transactions = s.transactions || [];
    state.goals        = s.goals        || [];
    state.budgets      = s.budgets      || {};
    state.bills        = s.bills        || [];
    state.debts        = s.debts        || [];
    state.badges       = s.badges       || [];
    state.settings     = s.settings     || { theme:'dark', currency:'₹', firstRun:true };
    state.userProfile  = s.userProfile  || { name:'', income:0, mainGoal:'' };

    /* Apply theme */
    if (state.settings.theme === 'light') document.body.classList.add('light-mode');
  } else {
    state.transactions = [...DEMO_TRANSACTIONS];
    state.goals        = [...DEMO_GOALS];
    state.budgets      = { ...DEMO_BUDGETS };
    state.settings     = { theme:'dark', currency:'₹', firstRun:true };
    saveState();
  }
}

/* ══════════════════════════════════════════════════════════
   SPLASH SCREEN
══════════════════════════════════════════════════════════ */
function enterDashboard() {
  const splash = document.getElementById('splash-screen');
  splash.classList.add('exit');
  setTimeout(() => {
    splash.style.display = 'none';
    document.getElementById('app').classList.remove('hidden');
    initApp();
  }, 850);
}

/* Auto-dismiss splash after 3.8s */
setTimeout(enterDashboard, 3800);

/* ══════════════════════════════════════════════════════════
   APP INIT
══════════════════════════════════════════════════════════ */
function initApp() {
  loadState();
  processRecurring();
  setPageDate();
  renderDashboard();
  renderTransactions();
  renderGoals();
  renderBudget();
  initPilot();
  if (state.settings.firstRun) {
    openModal('onboarding-modal');
  }

  /* Resize → redraw charts */
  window.addEventListener('resize', debounce(() => {
    if (document.getElementById('section-dashboard').classList.contains('active')) {
      renderCharts();
      renderHealthScore();
    }
  }, 300));
}

/* ── Theme & Settings ───────────────────────────────────── */
function toggleTheme() {
  state.settings.theme = state.settings.theme === 'dark' ? 'light' : 'dark';
  document.body.classList.toggle('light-mode');
  saveState();
  renderCharts(); // Redraw with new colors
  renderHealthScore();
}

function changeCurrency() {
  state.settings.currency = document.getElementById('currency-select').value;
  saveState();
  initApp(); // Full refresh to update all labels
}

/* ── Onboarding ─────────────────────────────────────────── */
function nextOBStep(step) {
  document.getElementById('step-1').style.display = 'none';
  document.getElementById('step-2').style.display = step === 2 ? 'block' : 'none';
}

function finishOnboarding() {
  const name = document.getElementById('ob-name').value.trim() || 'Pilot';
  const inc  = parseFloat(document.getElementById('ob-income').value) || 0;

  state.userProfile.name = name;
  state.userProfile.income = inc;
  state.settings.firstRun = false;

  /* Suggest budgets based on 50/30/20 */
  if (inc > 0) {
    state.budgets['Food']      = Math.round(inc * 0.15);
    state.budgets['Rent']      = Math.round(inc * 0.30);
    state.budgets['Bills']     = Math.round(inc * 0.10);
    state.budgets['Transport'] = Math.round(inc * 0.05);
  }

  document.getElementById('user-name-display').textContent = `Hello, ${name}!`;
  saveState();
  closeModal('onboarding-modal');
  initApp();
  showToast(`Welcome aboard, ${name}!`, 'success');
}

function setPageDate() {
  const d = new Date();
  document.getElementById('page-date').textContent = d.toLocaleDateString('en-IN', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
}

/* ══════════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════════ */
function renderDashboard() {
  renderKPIs();
  renderCharts();
  renderPrediction();
  renderBudgetDash();
  renderHealthScore();
  renderMiniBadges();
  renderMiniBills();
}

/* ── KPI Cards ──────────────────────────────────────────── */
function renderKPIs() {
  const now  = new Date();
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const calcMonth = (type, y, m) => state.transactions
    .filter(t => t.type===type && new Date(t.date).getFullYear()===y && new Date(t.date).getMonth()===m)
    .reduce((s,t)=>s+t.amount,0);

  const incNow  = calcMonth('income',  now.getFullYear(), now.getMonth());
  const incPrev = calcMonth('income',  prev.getFullYear(), prev.getMonth());
  const expNow  = calcMonth('expense', now.getFullYear(), now.getMonth());
  const expPrev = calcMonth('expense', prev.getFullYear(), prev.getMonth());
  const savNow  = incNow - expNow;
  const totalInc = state.transactions.filter(t=>t.type==='income').reduce((s,t)=>s+t.amount,0);
  const totalExp = state.transactions.filter(t=>t.type==='expense').reduce((s,t)=>s+t.amount,0);
  const netWorth = totalInc - totalExp + state.goals.reduce((s,g)=>s+g.saved,0);

  const pctChange = (now, prev) => prev>0 ? Math.round((now-prev)/prev*100) : 0;
  const savingsRate = incNow>0 ? Math.round(savNow/incNow*100) : 0;

  animateCount('total-income',  incNow);
  animateCount('total-expense', expNow);
  animateCount('total-savings', savNow);
  animateCount('total-networth',netWorth);

  const incChg = pctChange(incNow, incPrev);
  document.getElementById('income-change').textContent  = `${incChg>=0?'+':''}${incChg}% vs last month`;
  document.getElementById('income-change').className    = `kpi-change ${incChg>=0?'positive':'negative'}`;

  const expChg = pctChange(expNow, expPrev);
  document.getElementById('expense-change').textContent = `${expChg>=0?'+':''}${expChg}% vs last month`;
  document.getElementById('expense-change').className   = `kpi-change ${expChg<=0?'positive':'negative'}`;

  document.getElementById('savings-rate').textContent   = `${savingsRate}% savings rate`;
  document.getElementById('savings-rate').className     = `kpi-change ${savingsRate>=20?'positive':savingsRate>=10?'':'negative'}`;

  /* Sparklines */
  const sparkInc  = [], sparkExp = [], sparkSav = [], sparkNW = [];
  for (let i=5; i>=0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const inc = calcMonth('income',  d.getFullYear(), d.getMonth());
    const exp = calcMonth('expense', d.getFullYear(), d.getMonth());
    sparkInc.push(inc); sparkExp.push(exp); sparkSav.push(inc-exp); sparkNW.push(inc-exp);
  }
  Charts.drawSparkline('spark-income',  sparkInc, '#10b981');
  Charts.drawSparkline('spark-expense', sparkExp, '#ef4444');
  Charts.drawSparkline('spark-savings', sparkSav, '#4f8ef7');
  Charts.drawSparkline('spark-networth',sparkNW,  '#f59e0b');
}

/* ── Animated count-up ──────────────────────────────────── */
function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  const start    = 0;
  const duration = 1200;
  const startTs  = performance.now();
  const update   = (ts) => {
    const progress = Math.min((ts - startTs) / duration, 1);
    const ease     = 1 - Math.pow(1 - progress, 3);
    el.textContent = '₹' + Math.round(start + (target - start) * ease).toLocaleString('en-IN');
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

/* ── Charts ─────────────────────────────────────────────── */
function renderCharts() {
  const now    = new Date();
  const months = [], incData = [], expData = [];
  for (let i=5; i>=0; i--) {
    const d   = new Date(now.getFullYear(), now.getMonth()-i, 1);
    const inc = state.transactions.filter(t=>t.type==='income'  && new Date(t.date).getFullYear()===d.getFullYear() && new Date(t.date).getMonth()===d.getMonth()).reduce((s,t)=>s+t.amount,0);
    const exp = state.transactions.filter(t=>t.type==='expense' && new Date(t.date).getFullYear()===d.getFullYear() && new Date(t.date).getMonth()===d.getMonth()).reduce((s,t)=>s+t.amount,0);
    months.push(d.toLocaleDateString('en-IN', { month:'short' }));
    incData.push(inc); expData.push(exp);
  }
  setTimeout(() => Charts.drawMainChart('main-chart', months, incData, expData), 50);
}

/* ── AI Prediction Panel ─────────────────────────────────── */
function renderPrediction() {
  const { predicted } = AIEngine.predictNextMonth(state.transactions);
  const catPreds      = AIEngine.predictByCategory(state.transactions);
  const alerts        = AIEngine.generateAlerts(state.transactions, state.budgets);

  document.getElementById('pred-amount').textContent = fmtCur(predicted);

  const thisMonthInc = state.transactions
    .filter(t=>t.type==='income' && new Date(t.date).getMonth()===new Date().getMonth())
    .reduce((s,t)=>s+t.amount,0);

  const note = predicted > thisMonthInc && thisMonthInc > 0
    ? `⚠️ Exceeds this month's income of ${fmtCur(thisMonthInc)}`
    : predicted === 0 ? 'Add more transactions for a prediction'
    : `Within income range — ${Math.round((1 - predicted/thisMonthInc)*100)}% surplus expected`;
  document.getElementById('pred-note').textContent = note;

  /* Category bars */
  const container = document.getElementById('prediction-cats');
  container.innerHTML = '';
  const maxPred = catPreds.length ? Math.max(...catPreds.map(c=>c.predicted)) : 1;
  catPreds.forEach(c => {
    const pct  = Math.round((c.predicted / maxPred) * 100);
    const color = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#4f8ef7';
    container.innerHTML += `
      <div class="pred-cat-row">
        <div class="pred-cat-label">
          <span class="pred-cat-name">${c.category}</span>
          <span class="pred-cat-amt">${fmtCur(c.predicted)}</span>
        </div>
        <div class="pred-bar-track">
          <div class="pred-bar-fill" style="width:${pct}%;background:${color}"></div>
        </div>
      </div>`;
  });

  /* AI Alert */
  const alertEl = document.getElementById('ai-alert');
  const alertTxt = document.getElementById('ai-alert-text');
  const dangerAlert = alerts.find(a => a.type === 'danger');
  if (dangerAlert) {
    alertTxt.textContent = dangerAlert.msg;
    alertEl.style.display = 'flex';
  } else { alertEl.style.display = 'none'; }
}

/* ── Budget Dashboard ────────────────────────────────────── */
function renderBudgetDash() {
  const now = new Date();
  const container = document.getElementById('budget-dash-list');
  container.innerHTML = '';

  const budgetCats = Object.entries(state.budgets).slice(0, 5);
  if (!budgetCats.length) { container.innerHTML = '<div class="empty-state"><span>📋</span><p>No budgets set yet</p></div>'; return; }

  budgetCats.forEach(([cat, limit]) => {
    const spent = state.transactions
      .filter(t=>t.type==='expense'&&t.category===cat&&new Date(t.date).getMonth()===now.getMonth()&&new Date(t.date).getFullYear()===now.getFullYear())
      .reduce((s,t)=>s+t.amount,0);
    const pct   = limit ? Math.min(Math.round(spent/limit*100), 100) : 0;
    const cls   = pct >= 90 ? 'danger' : pct >= 70 ? 'warn' : 'safe';
    container.innerHTML += `
      <div class="budget-item">
        <div class="budget-item-row">
          <span class="budget-item-name">${cat}</span>
          <span class="budget-item-vals">${fmtCur(spent)} / ${fmtCur(limit)}</span>
        </div>
        <div class="budget-track">
          <div class="budget-fill ${cls}" style="width:${pct}%"></div>
        </div>
      </div>`;
  });
}

/* ── Goals Dashboard ─────────────────────────────────────── */
function renderGoalsDash() {
  const container = document.getElementById('goals-dash-list');
  container.innerHTML = '';

  if (!state.goals.length) { container.innerHTML = '<div class="empty-state"><span>🎯</span><p>No goals yet — create one!</p></div>'; return; }

  state.goals.slice(0, 3).forEach(g => {
    const pct = Math.round((g.saved / g.target) * 100);
    container.innerHTML += `
      <div class="goal-dash-item">
        <span class="goal-dash-icon">${g.icon}</span>
        <div class="goal-dash-body">
          <div class="goal-dash-name">${g.name}</div>
          <div class="goal-dash-sub">${fmtCur(g.saved)} of ${fmtCur(g.target)}</div>
        </div>
        <span class="goal-dash-pct">${pct}%</span>
      </div>`;
  });
}

/* ══════════════════════════════════════════════════════════
   TRANSACTIONS
══════════════════════════════════════════════════════════ */
function renderTransactions() {
  const container = document.getElementById('transactions-list');
  const filterType = document.getElementById('filter-type')?.value || 'all';
  const filterCat  = document.getElementById('filter-cat')?.value  || 'all';

  /* Populate category filter */
  const catSel = document.getElementById('filter-cat');
  if (catSel) {
    const cats = [...new Set(state.transactions.map(t=>t.category))].sort();
    const currentCat = catSel.value;
    catSel.innerHTML = '<option value="all">All Categories</option>' + cats.map(c=>`<option value="${c}" ${c===currentCat?'selected':''}>${c}</option>`).join('');
  }

  let txns = [...state.transactions].sort((a,b) => new Date(b.date) - new Date(a.date));
  if (filterType !== 'all') txns = txns.filter(t=>t.type===filterType);
  if (filterCat  !== 'all') txns = txns.filter(t=>t.category===filterCat);

  if (!txns.length) { container.innerHTML = '<div class="empty-state"><span>💳</span><p>No transactions found</p></div>'; return; }

  const catIcons = { Salary:'💼', Freelance:'🖥', Investment:'📈', 'Other Income':'💰', Food:'🍔', Transport:'🚗', Shopping:'🛍', Bills:'💡', Health:'🏥', Entertainment:'🎬', Education:'📚', Rent:'🏠', Other:'📋' };

  container.innerHTML = txns.map(t => `
    <div class="txn-item">
      <div class="txn-icon ${t.type}-icon">${catIcons[t.category]||'💳'}</div>
      <div class="txn-desc">
        <strong>${t.description}</strong>
        <span>${t.category}</span>
      </div>
      <span class="txn-amount ${t.type}">${t.type==='income'?'+':'-'}${fmtCur(t.amount)}</span>
      <span class="txn-date">${fmtDate(t.date)}</span>
      <button class="txn-del" onclick="deleteTransaction('${t.id}')" title="Delete">✕</button>
    </div>`).join('');
}

function deleteTransaction(id) {
  state.transactions = state.transactions.filter(t=>t.id!==id);
  saveState();
  renderDashboard();
  renderTransactions();
  showToast('Transaction deleted', 'info');
}

/* ══════════════════════════════════════════════════════════
   GOALS
══════════════════════════════════════════════════════════ */
function renderGoals() {
  const container = document.getElementById('goals-grid');
  container.innerHTML = '';

  if (!state.goals.length) {
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><span>🎯</span><p>No goals yet. Create your first financial goal!</p></div>';
    return;
  }

  state.goals.forEach(g => {
    const pct      = Math.min(100, Math.round((g.saved / g.target) * 100));
    const daysLeft = Math.max(0, Math.round((new Date(g.date) - new Date()) / 86400000));
    const monthly  = daysLeft > 0 ? Math.round((g.target - g.saved) / (daysLeft / 30)) : 0;

    container.innerHTML += `
      <div class="goal-card">
        <button class="goal-del-btn" onclick="deleteGoal('${g.id}')">✕</button>
        <div class="goal-card-icon">${g.icon}</div>
        <div class="goal-card-name">${g.name}</div>
        <div class="goal-dates">Target: ${fmtDate(g.date)} · ${daysLeft} days left</div>
        <div class="goal-amounts">
          <span class="goal-saved">${fmtCur(g.saved)}</span>
          <span class="goal-target">of ${fmtCur(g.target)}</span>
        </div>
        <div class="goal-progress-track">
          <div class="goal-progress-fill" style="width:${pct}%"></div>
        </div>
        <div class="goal-pct">${pct}% complete</div>
        ${monthly > 0 ? `<div class="goal-monthly">Save ${fmtCur(monthly)}/month to hit goal</div>` : ''}
      </div>`;
  });
}

function deleteGoal(id) {
  state.goals = state.goals.filter(g=>g.id!==id);
  saveState(); renderGoals(); renderGoalsDash();
  showToast('Goal removed', 'info');
}

/* ══════════════════════════════════════════════════════════
   BUDGET
══════════════════════════════════════════════════════════ */
const catIcons2 = { Food:'🍔', Transport:'🚗', Shopping:'🛍', Bills:'💡', Health:'🏥', Entertainment:'🎬', Education:'📚', Rent:'🏠', Other:'📋', Salary:'💼', Freelance:'🖥' };

function renderBudget() {
  const now = new Date();
  const container = document.getElementById('budget-grid');
  container.innerHTML = '';

  const entries = Object.entries(state.budgets);
  if (!entries.length) {
    container.innerHTML = '<div class="empty-state" style="grid-column:1/-1"><span>📊</span><p>No budgets set. Create your first budget limit!</p></div>';
    return;
  }

  entries.forEach(([cat, limit]) => {
    const spent = state.transactions
      .filter(t=>t.type==='expense'&&t.category===cat&&new Date(t.date).getMonth()===now.getMonth()&&new Date(t.date).getFullYear()===now.getFullYear())
      .reduce((s,t)=>s+t.amount,0);

    const pace = AIEngine.getPaceStats(cat, spent, limit);
    const pct  = limit ? Math.min(Math.round(spent/limit*100),100) : 0;
    const cls  = pct >= 90 ? 'danger' : pct >= 70 ? 'warn' : 'safe';
    const fill = pct >= 90 ? '#ef4444' : pct >= 70 ? '#f59e0b' : '#10b981';

    let paceInfo = '';
    if (pace && pace.isOverPaced) {
        paceInfo = `<div class="pace-tag danger">⚠️ Est. empty: ${pace.exhaustionDay}${getDaySuffix(pace.exhaustionDay)}</div>`;
    } else if (pace && pace.isWarning) {
        paceInfo = `<div class="pace-tag warn">⚡ Pace: High</div>`;
    }

    container.innerHTML += `
      <div class="budget-cat-card">
        <div class="budget-cat-header">
          <div class="budget-cat-name">${cat}</div>
          <div class="budget-cat-icon">${catIcons2[cat]||'📋'}</div>
        </div>
        ${paceInfo}
        <div class="budget-cat-amounts">
          <span class="bc-spent">${fmtCur(spent)} spent</span>
          <span class="bc-budget">of ${fmtCur(limit)}</span>
        </div>
        <div class="budget-track">
          <div class="budget-cat-fill" style="width:${pct}%;background:${fill}"></div>
        </div>
        <div class="budget-cat-pct ${cls}">${pct}% used ${pct>=90?'⚠️':pct>=70?'🔶':'✅'}</div>
        <button class="budget-edit-btn" onclick="editBudget('${cat}', ${limit})">Edit Limit</button>
      </div>`;
  });
}

function getDaySuffix(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
        case 1:  return "st";
        case 2:  return "nd";
        case 3:  return "rd";
        default: return "th";
    }
}

function editBudget(cat, current) {
  document.getElementById('budget-cat').value    = cat;
  document.getElementById('budget-amount').value = current;
  openModal('budget-modal');
}

/* ══════════════════════════════════════════════════════════
   AI PILOT CHAT
══════════════════════════════════════════════════════════ */
function initPilot() {
  renderInsights();
  renderActions();
  renderQuickQuestions();
  /* Welcome message */
  if (!document.querySelector('.msg')) {
    setTimeout(() => {
      addMessage('pilot', `✦ Welcome to **Pocket Pilot**! I'm your AI financial co-pilot.\n\nI've analysed your financial data and I'm ready to help you make smarter money decisions.\n\nAsk me anything — from budgeting help to investment advice. Or tap one of the quick questions below to get started! 🚀`);
    }, 300);
  }
}

function renderInsights() {
  const insights = AIEngine.generateInsights(state.transactions, state.goals, state.budgets);
  const container = document.getElementById('ai-insights-list');
  container.innerHTML = insights.map(i => `<div class="insight-item"><span class="insight-icon">${i.icon}</span><span>${i.text}</span></div>`).join('');
  if (!insights.length) container.innerHTML = '<div class="insight-item"><span class="insight-icon">💡</span><span>Add transactions to generate insights.</span></div>';
}

function renderActions() {
  const actions = AIEngine.generateActions(state.transactions, state.budgets, state.goals);
  const container = document.getElementById('ai-actions-list');
  container.innerHTML = actions.map(a => `<div class="action-item"><div class="action-dot"></div><span>${a}</span></div>`).join('');
}

function renderQuickQuestions() {
  const qs = AIEngine.getQuickQuestions(state.transactions, state.budgets, state.goals);
  const container = document.getElementById('quick-questions');
  container.innerHTML = qs.map(q => `<button class="quick-q" onclick="askQuick('${q.replace(/'/g,"\\'")}')"><span>${q}</span></button>`).join('');
}

function askQuick(q) {
  document.getElementById('chat-input').value = q;
  sendChatMessage();
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  const msg   = input.value.trim();
  if (!msg) return;
  input.value = '';
  addMessage('user', msg);
  showTyping();

  const delay = 800 + Math.random() * 600;
  setTimeout(() => {
    removeTyping();
    const response = AIEngine.getResponse(msg, state.transactions, state.budgets, state.goals);
    addMessage('pilot', response);
    renderQuickQuestions();
  }, delay);
}

function addMessage(role, text) {
  const container = document.getElementById('chat-messages');
  const avatar    = role === 'pilot' ? '✦' : 'HP';
  const time      = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });

  /* Convert **bold** and line breaks */
  const formatted = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n/g, '<br>');

  const el = document.createElement('div');
  el.className = `msg ${role}`;
  el.innerHTML = `
    <div class="msg-avatar">${avatar}</div>
    <div>
      <div class="msg-bubble">${formatted}</div>
      <div class="msg-time">${time}</div>
    </div>`;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function showTyping() {
  const container = document.getElementById('chat-messages');
  const el = document.createElement('div');
  el.className = 'msg pilot'; el.id = 'typing-msg';
  el.innerHTML = `<div class="msg-avatar">✦</div><div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  container.appendChild(el);
  container.scrollTop = container.scrollHeight;
}

function removeTyping() {
  document.getElementById('typing-msg')?.remove();
}

function clearChat() {
  document.getElementById('chat-messages').innerHTML = '';
  setTimeout(() => addMessage('pilot', '✦ Chat cleared! How can I help you with your finances?'), 200);
}

/* ══════════════════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════════════════ */
function openAddModal() {
  document.getElementById('entry-date').value = new Date().toISOString().split('T')[0];
  setType('income');
  openModal('add-modal');
}
function openGoalModal()   { openModal('goal-modal'); }
function openBudgetModal() { openModal('budget-modal'); }

function openModal(id)  { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

function setType(type) {
  state.entryType = type;
  document.getElementById('type-income').classList.toggle('active',  type==='income');
  document.getElementById('type-expense').classList.toggle('active', type==='expense');

  /* Show relevant categories */
  const cat = document.getElementById('entry-cat');
  const incCats  = ['Salary','Freelance','Investment','Other Income'];
  const expCats  = ['Food','Transport','Shopping','Bills','Health','Entertainment','Education','Rent','Other'];
  const relevant = type==='income' ? incCats : expCats;
  Array.from(cat.options).forEach(o => o.hidden = !relevant.includes(o.value));
  cat.value = relevant[0];
}

function addTransaction() {
  const desc   = document.getElementById('entry-desc').value.trim();
  const amount = parseFloat(document.getElementById('entry-amount').value);
  const date   = document.getElementById('entry-date').value;
  const cat    = document.getElementById('entry-cat').value;

  if (!desc)        { showToast('Please enter a description', 'error'); return; }
  if (!amount || amount <= 0) { showToast('Please enter a valid amount', 'error'); return; }
  if (!date)        { showToast('Please select a date', 'error'); return; }

  const isRecurring = document.getElementById('entry-recurring').checked;

  state.transactions.push({
    id: 'tx_'+Date.now(),
    type: state.entryType,
    description: desc,
    amount,
    category: cat,
    date,
    recurring: isRecurring
  });

  /* Recurring alert */
  if (isRecurring) showToast('Recurring entry set!', 'info');

  /* Budget alert check */
  if (state.entryType === 'expense') {
      const budgetLimit = state.budgets[cat];
      if (budgetLimit) {
          const spent = state.transactions.filter(t => t.category === cat && new Date(t.date).getMonth() === new Date().getMonth()).reduce((s,t)=>s+t.amount,0);
          if (spent > budgetLimit) showToast(`🚨 Budget Exceeded for ${cat}!`, 'error');
          else if (spent > budgetLimit * 0.8) showToast(`⚠️ 80% of ${cat} budget used`, 'warn');
      }
  }

  saveState();
  closeModal('add-modal');
  document.getElementById('entry-desc').value   = '';
  document.getElementById('entry-amount').value = '';
  renderDashboard();
  renderTransactions();
  renderInsights();
  renderActions();
  showToast(`${state.entryType === 'income' ? 'Income' : 'Expense'} added successfully!`, 'success');
}

function addGoal() {
  const name   = document.getElementById('goal-name').value.trim();
  const target = parseFloat(document.getElementById('goal-target').value);
  const saved  = parseFloat(document.getElementById('goal-saved').value) || 0;
  const date   = document.getElementById('goal-date').value;
  const icon   = state.selectedIcon;

  if (!name)        { showToast('Please enter a goal name', 'error'); return; }
  if (!target || target <= 0) { showToast('Please enter a valid target amount', 'error'); return; }
  if (!date)        { showToast('Please select a target date', 'error'); return; }

  state.goals.push({ id:'g_'+Date.now(), name, icon, target, saved, date });
  saveState();
  closeModal('goal-modal');
  document.getElementById('goal-name').value   = '';
  document.getElementById('goal-target').value = '';
  document.getElementById('goal-saved').value  = '';
  renderGoals();
  renderGoalsDash();
  showToast('Goal created! 🎯', 'success');
}

function setBudget() {
  const cat    = document.getElementById('budget-cat').value;
  const amount = parseFloat(document.getElementById('budget-amount').value);
  if (!amount || amount <= 0) { showToast('Please enter a valid budget amount', 'error'); return; }
  state.budgets[cat] = amount;
  saveState();
  closeModal('budget-modal');
  document.getElementById('budget-amount').value = '';
  renderBudget();
  renderBudgetDash();
  renderPrediction();
  showToast(`Budget set for ${cat}!`, 'success');
}

function selectIcon(el) {
  document.querySelectorAll('.icon-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  state.selectedIcon = el.dataset.icon;
}

/* ══════════════════════════════════════════════════════════
   NAVIGATION
══════════════════════════════════════════════════════════ */
function switchSection(name, linkEl) {
  event?.preventDefault();
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById(`section-${name}`).classList.add('active');
  if (linkEl) linkEl.classList.add('active');

  const titles = { dashboard:'Dashboard', transactions:'Transactions', goals:'Financial Goals', budget:'Budget Planner', pilot:'AI Pilot' };
  document.getElementById('page-title').textContent = titles[name] || name;

  if (name === 'dashboard') renderDashboard();
  if (name === 'calendar')  renderCalendar();
  if (name === 'trackers')  renderTrackers();
  if (name === 'pilot')     { renderInsights(); renderActions(); renderQuickQuestions(); }
}

/* ── New Feature Handlers ───────────────────────────────── */
function renderHealthScore() {
  const score = AIEngine.calculateHealthScore(state);
  animateHealthCount(score);
  Charts.drawGauge('health-gauge', score);
}

function animateHealthCount(target) {
    const el = document.getElementById('health-val');
    let current = 0;
    const interval = setInterval(() => {
        if (current >= target) clearInterval(interval);
        else {
            current++;
            el.textContent = current;
            if (current > 80) el.style.color = '#00c87a';
            else if (current > 50) el.style.color = '#f5a623';
            else el.style.color = '#ff4d6d';
        }
    }, 15);
}

function renderCalendar() {
  const container = document.getElementById('calendar-grid');
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  document.getElementById('cal-month-year').textContent = now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  container.innerHTML = 'MTWTFSS'.split('').map(d => `<div class="cal-day-label">${d}</div>`).join('');

  for (let i = 0; i < firstDay; i++) container.innerHTML += '<div></div>';

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const txns = state.transactions.filter(t => t.date === dateStr);
    const hasIn = txns.some(t => t.type === 'income');
    const hasOut = txns.some(t => t.type === 'expense');
    const isToday = d === now.getDate();

    container.innerHTML += `
      <div class="cal-day ${isToday ? 'today' : ''}">
        <span class="cal-date">${d}</span>
        <div class="cal-dots">
          ${hasIn ? '<div class="cal-dot dot-in"></div>' : ''}
          ${hasOut ? '<div class="cal-dot dot-out"></div>' : ''}
        </div>
      </div>`;
  }
}

function renderTrackers() {
  renderBills();
  renderDebts();
}

function renderBills() {
    const container = document.getElementById('full-bills-list');
    container.innerHTML = state.bills.length ? state.bills.map(b => `
      <div class="txn-item">
        <div class="txn-icon expense-icon">📅</div>
        <div class="txn-desc"><strong>${b.name}</strong><span>Due: ${fmtDate(b.date)}</span></div>
        <span class="txn-amount expense">${fmtCur(b.amount)}</span>
        <button class="btn-ghost" onclick="payBill('${b.id}')">Pay</button>
      </div>`).join('') : '<p style="text-align:center;padding:20px;color:var(--text-3)">No bills tracked.</p>';

    document.getElementById('mini-bills').innerHTML = state.bills.slice(0, 2).map(b => `
       <div style="display:flex;justify-content:space-between;font-size:0.8rem;margin-bottom:8px">
          <span>${b.name}</span><strong>${fmtCur(b.amount)}</strong>
       </div>`).join('');
}

function renderDebts() {
    const container = document.getElementById('full-debts-list');
    container.innerHTML = state.debts.length ? state.debts.map(d => {
       const pct = Math.round(( (d.total - d.left) / d.total ) * 100);
       return `
        <div class="txn-item" style="flex-direction:column;align-items:stretch;gap:8px">
          <div style="display:flex;justify-content:space-between">
             <strong>${d.name}</strong><span>${fmtCur(d.left)} left</span>
          </div>
          <div class="budget-track"><div class="budget-fill safe" style="width:${pct}%"></div></div>
          <div style="font-size:0.75rem;color:var(--text-3)">${pct}% Paid Off</div>
        </div>`;
    }).join('') : '<p style="text-align:center;padding:20px;color:var(--text-3)">No debts tracked.</p>';
}

function addBill() {
    const name = document.getElementById('bill-name').value;
    const amount = parseFloat(document.getElementById('bill-amount').value);
    const date = document.getElementById('bill-date').value;
    if (!name || !amount || !date) return showToast('Fill all fields', 'error');
    state.bills.push({ id:'b'+Date.now(), name, amount, date });
    saveState(); closeModal('bill-modal'); renderTrackers(); renderMiniBills();
}

function addDebt() {
    const name = document.getElementById('debt-name').value;
    const total = parseFloat(document.getElementById('debt-total').value);
    const left = parseFloat(document.getElementById('debt-left').value);
    if (!name || !total || !left) return showToast('Fill all fields', 'error');
    state.debts.push({ id:'d'+Date.now(), name, total, left });
    saveState(); closeModal('debt-modal'); renderTrackers();
}

function calcSIP() {
    const p = parseFloat(document.getElementById('sip-monthly').value) || 0;
    const r = (parseFloat(document.getElementById('sip-rate').value) || 0) / 100 / 12;
    const n = (parseFloat(document.getElementById('sip-years').value) || 0) * 12;
    if (p && r && n) {
        const val = p * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
        document.getElementById('sip-result').textContent = fmtCur(Math.round(val));
    }
}

function downloadCSV() {
    let csv = "Date,Type,Description,Category,Amount\n";
    state.transactions.forEach(t => {
        csv += `${t.date},${t.type},"${t.description}",${t.category},${t.amount}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PocketPilot_Report_${new Date().toISOString().slice(0,7)}.csv`;
    a.click();
}

function renderMiniBadges() {
    const score = AIEngine.calculateHealthScore(state);
    const earned = [];
    if (state.transactions.length > 5) earned.push({i:'🚀',n:'Rookie'});
    if (score > 80) earned.push({i:'💎',n:'Master'});
    if (state.goals.some(g=>g.saved>=g.target)) earned.push({i:'🏆',n:'Crusher'});
    if (state.transactions.length > 50) earned.push({i:'🔥',n:'Legend'});

    document.getElementById('mini-badges').innerHTML = earned.map(b => `
      <div class="badge earned"><div class="badge-icon">${b.i}</div><div class="badge-name">${b.n}</div></div>`).join('');
}

function renderMiniBills() { renderBills(); }

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('collapsed');
}

/* ══════════════════════════════════════════════════════════
   TOAST
══════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg, type = 'info') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className   = `toast ${type} show`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

/* ── Recurring Engine ───────────────────────────────────── */
function processRecurring() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const recurringItems = state.transactions.filter(t => t.recurring);
    let added = false;

    recurringItems.forEach(item => {
        // Find if this item exists in current month
        const exists = state.transactions.some(t =>
            t.description === item.description &&
            t.amount === item.amount &&
            new Date(t.date).getMonth() === currentMonth &&
            new Date(t.date).getFullYear() === currentYear
        );

        if (!exists) {
            const newDate = new Date(item.date);
            newDate.setMonth(currentMonth);
            newDate.setFullYear(currentYear);

            state.transactions.push({
                ...item,
                id: 'tx_rec_' + Date.now() + Math.random(),
                date: newDate.toISOString().split('T')[0]
            });
            added = true;
        }
    });

    if (added) {
        saveState();
        showToast('Processed recurring transactions', 'info');
    }
}

/* ── Utility ───────────────────────────────────────────── */
function debounce(fn, ms) {
  let t; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
