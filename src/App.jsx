import { useMemo, useState, useEffect } from "react";
import styles from "./App.module.css";

const cards = [
  {
    id: "life-goals",
    icon: "🎯",
    title: "Life goals",
    description: "Where you want to live, family plans, marriage timeline, ideal lifestyle",
  },
  {
    id: "money-goals",
    icon: "🏦",
    title: "Money goals",
    description: "Your retirement number, target retirement age, and what your dream life actually costs",
  },
  {
    id: "work-career",
    icon: "💼",
    title: "Work & career",
    description: "How many hours you want to work, what kind of work feels right, your career direction",
  },
  {
    id: "income-expenses",
    icon: "💰",
    title: "Income & expenses",
    description: "Your current income (before and after tax), monthly expenses, and car costs broken down",
  },
  {
    id: "education-future",
    icon: "🎓",
    title: "Education & future",
    description: "Degree plans, AI-proof career fields, and skills worth investing in right now",
  },
];

const lifeGoalsQuestions = [
  {
    q: "Where would you ideally like to live?",
    options: ["City, vibrant life", "Suburbs, family-friendly", "Small town / rural", "Undecided"],
  },
  {
    q: "Do you plan to have children?",
    options: ["Yes, soon", "Yes, later", "No", "Not sure"],
  },
  {
    q: "What kind of home do you prefer?",
    options: ["Apartment/Condo", "Detached house", "Townhouse", "Tiny home / Minimalist"],
  },
  {
    q: "What matters most in your ideal lifestyle?",
    options: ["Travel & experiences", "Stable family life", "Career growth", "Financial freedom"],
  },
  {
    q: "What is your timeline for major life changes?",
    options: ["0-2 years", "3-5 years", "5+ years", "No firm timeline"],
  },
];

const moneyGoalsQuestions = [
  {
    q: "How much do you want to have saved for retirement?",
    options: ["Less than $500k", "$500k - $1 million", "$1M - $3M", "$3M - $5M", "$5M+"],
  },
  {
    q: "What age do you want to retire or reach financial freedom?",
    options: ["Before 30", "30-35", "35-40", "40-50", "50+"],
  },
  {
    q: "What does your dream lifestyle cost per month?",
    options: ["Under $3,000", "$3,000 - $5,000", "$5,000 - $10,000", "$10,000+"],
  },
  {
    q: "Do you own or rent right now?",
    options: ["Renting", "Living with family", "Own a home", "Other"],
  },
  {
    q: "How would you rate your current financial knowledge?",
    options: ["Total beginner", "I know the basics", "Pretty comfortable", "I know what I am doing"],
  },
];

const workCareerQuestions = [
  {
    q: "How many hours per week do you ideally want to work?",
    options: ["Under 20 hours", "20-40 hours", "40-60 hours", "60+ hours, I am building something"],
  },
  {
    q: "What type of work feels most like you?",
    options: ["Working for myself", "Working for a company", "Mix of both", "Still figuring it out"],
  },
  {
    q: "What industry are you most drawn to?",
    options: ["Content creation / media", "Trades / skilled labor", "Sales / business", "Tech / digital", "Healthcare / service"],
  },
  {
    q: "What matters most to you in a career?",
    options: ["High income", "Freedom and flexibility", "Meaning and impact", "Status and recognition"],
  },
  {
    q: "Where are you in your career right now?",
    options: ["Just starting out", "In a job I want to leave", "Building something on the side", "Already on my path"],
  },
];

const incomeExpensesQuestions = [
  {
    q: "What is your monthly income before tax?",
    options: ["Under $2,000", "$2,000 - $4,000", "$4,000 - $6,000", "$6,000 - $10,000", "$10,000+"],
  },
  {
    q: "What is your monthly income after tax?",
    options: ["Under $1,500", "$1,500 - $3,000", "$3,000 - $5,000", "$5,000 - $8,000", "$8,000+"],
  },
  {
    q: "What are your total monthly living expenses?",
    options: ["Under $1,000", "$1,000 - $2,000", "$2,000 - $3,500", "$3,500 - $5,000", "$5,000+"],
  },
  {
    q: "How much do you spend on your car per month?",
    options: ["I do not have a car", "Under $300", "$300 - $600", "$600 - $1,000", "$1,000+"],
  },
  {
    q: "How much are you currently saving or investing each month?",
    options: ["Nothing yet", "Under $200", "$200 - $500", "$500 - $1,000", "$1,000+"],
  },
];

const educationFutureQuestions = [
  {
    q: "What is your current education level?",
    options: ["High school diploma", "Some college", "Associate degree", "Bachelors degree", "No formal degree"],
  },
  {
    q: "Are you planning to pursue any further education?",
    options: ["Yes, a degree", "Yes, a trade or certification", "Maybe, not sure yet", "No, learning on my own", "No plans"],
  },
  {
    q: "How important is it that your career is AI-proof?",
    options: ["Very important, it worries me", "Somewhat important", "Not that important", "I plan to use AI as a tool"],
  },
  {
    q: "Which of these skills are you most interested in building?",
    options: ["Content creation and personal brand", "A skilled trade", "Sales and persuasion", "Tech and software", "Investing and finance"],
  },
  {
    q: "What is your biggest barrier to earning more money right now?",
    options: ["I do not know where to start", "I lack the right skills", "I do not have enough time", "I need more confidence", "Nothing is stopping me"],
  },
];

function App() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [completed, setCompleted] = useState({});
  const [responses, setResponses] = useState({});
  const [showDashboard, setShowDashboard] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isProgressAnimating, setIsProgressAnimating] = useState(false);

  const totalSections = cards.length;
  const completeCount = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);
  const progress = Math.round((completeCount / totalSections) * 100);
  const isDashboardUnlocked = completeCount === totalSections;

  const persistCompleted = (next) => {
    try {
      localStorage.setItem("lp_completed", JSON.stringify(next));
    } catch (e) {}
  };

  const persistResponses = (next) => {
    try {
      localStorage.setItem("lp_responses", JSON.stringify(next));
    } catch (e) {}
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem("lp_completed");
      if (raw) setCompleted(JSON.parse(raw));
    } catch (e) {}
    try {
      const raw2 = localStorage.getItem("lp_responses");
      if (raw2) setResponses(JSON.parse(raw2));
    } catch (e) {}
  }, []);

  useEffect(() => {
    persistCompleted(completed);
  }, [completed]);

  useEffect(() => {
    persistResponses(responses);
  }, [responses]);

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(lifeGoalsQuestions.length).fill(null));
  const [mQIndex, setMQIndex] = useState(0);
  const [mAnswers, setMAnswers] = useState(Array(moneyGoalsQuestions.length).fill(null));
  const [wQIndex, setWQIndex] = useState(0);
  const [wAnswers, setWAnswers] = useState(Array(workCareerQuestions.length).fill(null));
  const [iQIndex, setIQIndex] = useState(0);
  const [iAnswers, setIAnswers] = useState(Array(incomeExpensesQuestions.length).fill(null));
  const [eQIndex, setEQIndex] = useState(0);
  const [eAnswers, setEAnswers] = useState(Array(educationFutureQuestions.length).fill(null));

  const onOpenQuiz = (card) => {
    setActiveQuiz(card);
    if (card.id === "life-goals") {
      setQIndex(0);
      setAnswers(Array(lifeGoalsQuestions.length).fill(null));
    }
    if (card.id === "money-goals") {
      setMQIndex(0);
      setMAnswers(Array(moneyGoalsQuestions.length).fill(null));
    }
    if (card.id === "work-career") {
      setWQIndex(0);
      setWAnswers(Array(workCareerQuestions.length).fill(null));
    }
    if (card.id === "income-expenses") {
      setIQIndex(0);
      setIAnswers(Array(incomeExpensesQuestions.length).fill(null));
    }
    if (card.id === "education-future") {
      setEQIndex(0);
      setEAnswers(Array(educationFutureQuestions.length).fill(null));
    }
  };

  const closeQuiz = () => setActiveQuiz(null);

  const markComplete = (id) => {
    setCompleted((prev) => {
      const next = { ...prev, [id]: true };
      persistCompleted(next);
      return next;
    });
    closeQuiz();
  };

  const updateResponses = (key, value) => {
    setResponses((prev) => {
      const next = { ...prev, [key]: value };
      persistResponses(next);
      return next;
    });
  };

  const selectOption = (optIndex) => {
    setAnswers((current) => {
      const next = [...current];
      next[qIndex] = optIndex;
      return next;
    });
  };

  const selectMoneyOption = (optIndex) => {
    setMAnswers((current) => {
      const next = [...current];
      next[mQIndex] = optIndex;
      return next;
    });
  };

  const selectWorkOption = (optIndex) => {
    setWAnswers((current) => {
      const next = [...current];
      next[wQIndex] = optIndex;
      return next;
    });
  };

  const selectIncomeOption = (optIndex) => {
    setIAnswers((current) => {
      const next = [...current];
      next[iQIndex] = optIndex;
      return next;
    });
  };

  const selectEducationOption = (optIndex) => {
    setEAnswers((current) => {
      const next = [...current];
      next[eQIndex] = optIndex;
      return next;
    });
  };

  const nextQuestion = () => {
    if (qIndex < lifeGoalsQuestions.length - 1) {
      setQIndex((value) => value + 1);
    }
  };

  const prevQuestion = () => {
    if (qIndex > 0) {
      setQIndex((value) => value - 1);
    } else {
      closeQuiz();
    }
  };

  const finishLifeQuiz = () => {
    updateResponses("life-goals", answers);
    markComplete("life-goals");
    setQIndex(0);
    setAnswers(Array(lifeGoalsQuestions.length).fill(null));
  };

  const nextMoneyQuestion = () => {
    if (mQIndex < moneyGoalsQuestions.length - 1) {
      setMQIndex((value) => value + 1);
    }
  };

  const prevMoneyQuestion = () => {
    if (mQIndex > 0) {
      setMQIndex((value) => value - 1);
    } else {
      closeQuiz();
    }
  };

  const finishMoneyQuiz = () => {
    updateResponses("money-goals", mAnswers);
    markComplete("money-goals");
    setMQIndex(0);
    setMAnswers(Array(moneyGoalsQuestions.length).fill(null));
  };

  const nextWorkQuestion = () => {
    if (wQIndex < workCareerQuestions.length - 1) {
      setWQIndex((value) => value + 1);
    }
  };

  const prevWorkQuestion = () => {
    if (wQIndex > 0) {
      setWQIndex((value) => value - 1);
    } else {
      closeQuiz();
    }
  };

  const finishWorkQuiz = () => {
    updateResponses("work-career", wAnswers);
    markComplete("work-career");
    setWQIndex(0);
    setWAnswers(Array(workCareerQuestions.length).fill(null));
  };

  const nextIncomeQuestion = () => {
    if (iQIndex < incomeExpensesQuestions.length - 1) {
      setIQIndex((value) => value + 1);
    }
  };

  const prevIncomeQuestion = () => {
    if (iQIndex > 0) {
      setIQIndex((value) => value - 1);
    } else {
      closeQuiz();
    }
  };

  const finishIncomeQuiz = () => {
    updateResponses("income-expenses", iAnswers);
    markComplete("income-expenses");
    setIQIndex(0);
    setIAnswers(Array(incomeExpensesQuestions.length).fill(null));
  };

  const nextEducationQuestion = () => {
    if (eQIndex < educationFutureQuestions.length - 1) {
      setEQIndex((value) => value + 1);
    }
  };

  const prevEducationQuestion = () => {
    if (eQIndex > 0) {
      setEQIndex((value) => value - 1);
    } else {
      closeQuiz();
    }
  };

  const finishEducationQuiz = () => {
    updateResponses("education-future", eAnswers);
    markComplete("education-future");
    setEQIndex(0);
    setEAnswers(Array(educationFutureQuestions.length).fill(null));
  };

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let rafId;
    const duration = 1500;
    const start = performance.now();
    const from = animatedProgress;
    const to = progress;
    setIsProgressAnimating(true);

    function step(now) {
      const elapsed = Math.min(now - start, duration);
      const t = elapsed / duration;
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      setAnimatedProgress(value);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(step);
      } else {
        setIsProgressAnimating(false);
      }
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  const moneyResp = responses["money-goals"] || null;
  const incomeResp = responses["income-expenses"] || null;

  const mapIncomeAfterTaxToNumber = (idx) => {
    const map = [1200, 2250, 4000, 6500, 9000];
    return map[idx] || 0;
  };

  const mapExpensesToNumber = (idx) => {
    const map = [800, 1500, 2750, 4250, 6000];
    return map[idx] || 0;
  };

  const mapCarCostToNumber = (idx) => {
    const map = [0, 150, 450, 800, 1200];
    return map[idx] || 0;
  };

  const afterTax = incomeResp ? mapIncomeAfterTaxToNumber(incomeResp[1]) : 0;
  const expenses = incomeResp ? mapExpensesToNumber(incomeResp[2]) : 0;
  const carCost = incomeResp ? mapCarCostToNumber(incomeResp[3]) : 0;
  const monthlySurplus = Math.max(0, Math.round(afterTax - expenses - carCost));

  const retirementAgeMap = [10, 13, 18, 26, 35];
  const retirementGoalMap = [400000, 750000, 2000000, 4000000, 6000000];
  const yearsToTarget = moneyResp ? (retirementAgeMap[moneyResp[1]] || 10) : 10;
  const retirementGoalAmount = moneyResp ? (retirementGoalMap[moneyResp[0]] || 4000000) : 4000000;
  const monthlyRate = 0.07 / 12;
  const numMonths = Math.max(1, yearsToTarget * 12);
  const requiredMonthly = Math.round(retirementGoalAmount * monthlyRate / (Math.pow(1 + monthlyRate, numMonths) - 1));
  const savingsProbability = monthlySurplus >= requiredMonthly ? 89 : monthlySurplus >= requiredMonthly * 0.5 ? 61 : 31;
  const savingProb = savingsProbability;
  const reqMonthly = requiredMonthly;

  const jobs = [
    { title: "High-end server", salary: "$52,000/yr" },
    { title: "Solar sales rep", salary: "$78,000/yr" },
    { title: "CDL truck driver", salary: "$68,000/yr" },
    { title: "IBEW apprentice", salary: "$61,000/yr" },
  ];

  const paths = [
    {
      label: "Consistent saving",
      pct: savingsProbability,
      color: "#1d9e75",
      detail: "Need $" + requiredMonthly.toLocaleString() + "/mo · You have $" + monthlySurplus.toLocaleString() + "/mo",
    },
    {
      label: "High income career",
      pct: 67,
      color: "#7f77dd",
      detail: "A trade or sales career could close your gap faster",
    },
    {
      label: "Entrepreneurship",
      pct: 12,
      color: "#ba7517",
      detail: "Highest upside, highest risk",
    },
  ];

  const isStrongPath = savingsProbability >= 50;
  const insightMessage = isStrongPath
    ? "You are on a strong path. Keep investing your surplus consistently and you will reach your goal."
    : "Your current surplus of $" + monthlySurplus.toLocaleString() + "/mo falls short of the $" + requiredMonthly.toLocaleString() + "/mo needed to hit your goal by your target age. The fastest path to closing this gap is increasing your income. See the jobs below.";

  if (showDashboard) {
    return (
      <div style={{ background: "#0a0a0f", minHeight: "100vh", color: "white", padding: 24, fontFamily: "Inter, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <button
            onClick={() => setShowDashboard(false)}
            style={{
              background: "#16161f",
              border: "none",
              color: "white",
              borderRadius: 12,
              padding: "10px 18px",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 600,
              appearance: "none",
            }}
          >
            ← Back
          </button>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>Your Life Path Dashboard</h1>
            <p style={{ margin: 0, color: "#9999aa", fontSize: 13 }}>Personalized for Tanner</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Retirement goal", value: moneyResp ? moneyGoalsQuestions[0].options[moneyResp[0]] : "Not set" },
            { label: "Target age", value: moneyResp ? moneyGoalsQuestions[1].options[moneyResp[1]] : "Not set" },
            { label: "Monthly surplus", value: "$" + monthlySurplus.toLocaleString() },
          ].map((metric) => (
            <div
              key={metric.label}
              style={{ background: "#12121a", border: "1px solid #2a2a3a", borderRadius: 12, padding: "16px 20px" }}
            >
              <p style={{ margin: "0 0 6px", fontSize: 12, color: "#9999aa" }}>{metric.label}</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 600 }}>{metric.value}</p>
            </div>
          ))}
        </div>

        <div style={{ background: "#12121a", border: "1px solid #2a2a3a", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#9999aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Monthly cash flow
          </p>
          {[
            { label: "Income after tax", val: "$" + afterTax.toLocaleString(), color: "white", bold: false },
            { label: "Expenses", val: "-$" + expenses.toLocaleString(), color: "#e24b4a", bold: false },
            { label: "Car costs", val: "-$" + carCost.toLocaleString(), color: "#e24b4a", bold: false },
            { label: "Available to save / invest", val: "$" + monthlySurplus.toLocaleString(), color: "#1d9e75", bold: true },
          ].map((row) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px 0",
                borderBottom: "1px solid #2a2a3a",
                ...(row.label === "Available to save / invest" ? { borderLeft: "4px solid #1d9e75", paddingLeft: 12 } : {}),
              }}
            >
              <span style={{ fontSize: 14, fontWeight: row.bold ? 600 : 400 }}>{row.label}</span>
              <span style={{ fontSize: 14, color: row.color, fontWeight: row.bold ? 600 : 400 }}>{row.val}</span>
            </div>
          ))}
        </div>

        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#9999aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Your paths to financial freedom
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 24 }}>
          {paths.map((p) => (
            <div
              key={p.label}
              style={{ background: "#12121a", borderRadius: 12, padding: "20px", borderLeft: "4px solid " + p.color }}
            >
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "#9999aa" }}>{p.label}</p>
              <p style={{ margin: '0 0 4px', fontSize: 52, fontWeight: 800, color: p.color }}>{p.pct}%</p>
              <p style={{ margin: "0 0 8px", fontSize: 12, color: "#9999aa" }}>chance of reaching goal</p>
              <p style={{ margin: 0, fontSize: 12, color: "#cccccc" }}>{p.detail}</p>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: '#666677', marginTop: 8, marginBottom: 24 }}>Returns calculated at 7% annually after inflation based on S&P 500 historical average</p>

        <div style={{ background: "#12121a", border: "1px solid #2a2a3a", borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#9999aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>
            What this means for you
          </p>
          <p style={{ fontSize: 14, color: '#cccccc', lineHeight: 1.6, margin: 0 }}>
            {savingProb < 50
              ? 'Your current surplus of $' + monthlySurplus.toLocaleString() + '/mo falls short of the $' + reqMonthly.toLocaleString() + '/mo needed to hit your goal by your target age. The fastest path to closing this gap is increasing your income. See the jobs below.'
              : 'You are on a strong path. Keep investing your surplus consistently and you will reach your goal.'}
          </p>
        </div>

        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#9999aa", textTransform: "uppercase", letterSpacing: "0.05em" }}>
          Highest paying jobs near you · no degree required
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {jobs.map((job) => (
            <div
              key={job.title}
              style={{
                background: "#12121a",
                border: "1px solid #2a2a3a",
                borderRadius: 12,
                padding: "16px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600 }}>{job.title}</p>
                <p style={{ margin: "0 0 8px", fontSize: 13, color: "#9999aa" }}>{job.salary}</p>
                <span style={{ background: "#0f2e1e", color: "#1d9e75", fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 500 }}>
                  No degree required
                </span>
              </div>
              <button
                style={{
                  background: "none",
                  border: "1px solid #2a2a3a",
                  color: "#9999aa",
                  borderRadius: 8,
                  padding: "8px 14px",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                Learn more
              </button>
            </div>
          ))}
        </div>

        <p style={{ margin: '24px 0 12px', fontSize: 13, color: '#9999aa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Your life timeline
        </p>
        <div style={{ background: '#12121a', border: '1px solid #2a2a3a', borderRadius: 12, padding: '32px 24px', marginBottom: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 10, left: 0, right: 0, height: 2, background: '#2a2a3a', zIndex: 0 }} />
            {[
              { label: 'Now', sub: 'Age 19', color: '#7f77dd' },
              { label: 'Build income', sub: 'Age 20-25', color: '#444455' },
              { label: 'Freedom target', sub: 'Before 30', color: '#1d9e75' },
              { label: 'Marriage', sub: 'Early 30s', color: '#444455' },
              { label: 'Kids', sub: 'Mid 30s', color: '#444455' },
            ].map(function(t) { return (
              <div key={t.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.color, marginBottom: 10, border: '3px solid #0a0a0f' }} />
                <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'white', textAlign: 'center' }}>{t.label}</p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#9999aa', textAlign: 'center' }}>{t.sub}</p>
              </div>
            ); })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.app} ${mounted ? styles.mounted : ""}`}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <header className={styles.header}>
          <div>
            <p className={styles.greeting}>Good morning,</p>
            <h1>Welcome, Tanner</h1>
          </div>
          <div className={styles.profileCard}>
            <span className={styles.profileBadge}>Profile {animatedProgress}% complete</span>
            <div className={styles.progressTrack} style={{ position: "relative" }}>
              <div
                className={`${styles.progressFill} ${isProgressAnimating ? styles.progressAnimating : ""}`}
                style={{ width: `${animatedProgress}%`, transition: "width 0.2s linear" }}
              />
              {animatedProgress === 0 && (
                <div style={{ position: "absolute", inset: 0, borderRadius: 999, animation: "progressPulse 1.2s ease-in-out infinite" }} />
              )}
            </div>
          </div>
        </header>

        <section className={styles.sectionIntro}>
          <div>
            <h2>Finish setting up your profile</h2>
            <p>Complete these to unlock your personalized life path</p>
          </div>
        </section>

        <main className={styles.cardsList}>
          {cards.map((card) => {
            const isComplete = completed[card.id];
            return (
              <article key={card.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>{card.icon}</div>
                  <div className={styles.cardCopy}>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                    <p className={styles.eta}>~2 min</p>
                  </div>
                  <span className={isComplete ? styles.statusComplete : styles.statusMuted}>
                    {isComplete ? "Complete ✓" : "Not started"}
                  </span>
                </div>
                <button
                  className={isComplete ? styles.reviewButton : styles.startButton}
                  onClick={() => onOpenQuiz(card)}
                >
                  {isComplete ? "Review →" : "Start →"}
                </button>
              </article>
            );
          })}

          <div className={`${styles.lockedSection} ${isDashboardUnlocked ? styles.lockedSectionOpen : ""}`}>
            <div className={styles.lockedCopy}>
              <span className={styles.lockIcon} aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#f6d86a" />
                  <path d="M7 10V8a5 5 0 0110 0v2" stroke="#f6d86a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="#f6d86a" strokeWidth="1.4" />
                </svg>
              </span>
              <div>
                {isDashboardUnlocked ? (
                  <>
                    <p>Your life path is ready</p>
                    <p className={styles.lockHint}>Everything is complete — your dashboard is unlocked.</p>
                  </>
                ) : (
                  <>
                    <p>Your life path dashboard unlocks after setup is complete</p>
                    <p className={styles.lockHint}>Complete all 5 sections to unlock</p>
                  </>
                )}
              </div>
            </div>
            {isDashboardUnlocked && (
              <button type="button" className={styles.dashboardButton} onClick={() => setShowDashboard(true)}>
                Open dashboard
              </button>
            )}
          </div>
        </main>
      </div>

      {activeQuiz && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <button className={styles.closeButton} onClick={closeQuiz}>
              ×
            </button>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div className={styles.modalIcon}>{activeQuiz.icon}</div>
              <h2>{activeQuiz.title}</h2>
              <p className={styles.modalSubtitle}>{activeQuiz.description}</p>

              {activeQuiz.id === "life-goals" && (
                <div style={{ width: "100%" }}>
                  <div className={styles.quizHeader}>
                    <div className={styles.questionCounter}>Question {qIndex + 1} of {lifeGoalsQuestions.length}</div>
                  </div>

                  <div className={styles.questionSlide} style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{lifeGoalsQuestions[qIndex].q}</div>
                    {lifeGoalsQuestions[qIndex].options.map((opt, oi) => (
                      <button
                        key={oi}
                        className={answers[qIndex] === oi ? `${styles.optionButton} ${styles.optionSelected}` : styles.optionButton}
                        onClick={() => selectOption(oi)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevQuestion}>Back</button>
                    {qIndex < lifeGoalsQuestions.length - 1 ? (
                      <button className={styles.nextButton} onClick={nextQuestion} disabled={answers[qIndex] === null}>
                        Next →
                      </button>
                    ) : (
                      <button className={styles.startButton} onClick={finishLifeQuiz} disabled={answers[qIndex] === null}>
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuiz.id === "money-goals" && (
                <div style={{ width: "100%" }}>
                  <div className={styles.quizHeader}>
                    <div className={styles.questionCounter}>Question {mQIndex + 1} of {moneyGoalsQuestions.length}</div>
                  </div>

                  <div className={styles.questionSlide} style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{moneyGoalsQuestions[mQIndex].q}</div>
                    {moneyGoalsQuestions[mQIndex].options.map((opt, oi) => (
                      <button
                        key={oi}
                        className={mAnswers[mQIndex] === oi ? `${styles.optionButton} ${styles.optionSelected}` : styles.optionButton}
                        onClick={() => selectMoneyOption(oi)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevMoneyQuestion}>Back</button>
                    {mQIndex < moneyGoalsQuestions.length - 1 ? (
                      <button className={styles.nextButton} onClick={nextMoneyQuestion} disabled={mAnswers[mQIndex] === null}>
                        Next →
                      </button>
                    ) : (
                      <button className={styles.startButton} onClick={finishMoneyQuiz} disabled={mAnswers[mQIndex] === null}>
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuiz.id === "work-career" && (
                <div style={{ width: "100%" }}>
                  <div className={styles.quizHeader}>
                    <div className={styles.questionCounter}>Question {wQIndex + 1} of {workCareerQuestions.length}</div>
                  </div>

                  <div className={styles.questionSlide} style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{workCareerQuestions[wQIndex].q}</div>
                    {workCareerQuestions[wQIndex].options.map((opt, oi) => (
                      <button
                        key={oi}
                        className={wAnswers[wQIndex] === oi ? `${styles.optionButton} ${styles.optionSelected}` : styles.optionButton}
                        onClick={() => selectWorkOption(oi)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevWorkQuestion}>Back</button>
                    {wQIndex < workCareerQuestions.length - 1 ? (
                      <button className={styles.nextButton} onClick={nextWorkQuestion} disabled={wAnswers[wQIndex] === null}>
                        Next →
                      </button>
                    ) : (
                      <button className={styles.startButton} onClick={finishWorkQuiz} disabled={wAnswers[wQIndex] === null}>
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuiz.id === "income-expenses" && (
                <div style={{ width: "100%" }}>
                  <div className={styles.quizHeader}>
                    <div className={styles.questionCounter}>Question {iQIndex + 1} of {incomeExpensesQuestions.length}</div>
                  </div>

                  <div className={styles.questionSlide} style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{incomeExpensesQuestions[iQIndex].q}</div>
                    {incomeExpensesQuestions[iQIndex].options.map((opt, oi) => (
                      <button
                        key={oi}
                        className={iAnswers[iQIndex] === oi ? `${styles.optionButton} ${styles.optionSelected}` : styles.optionButton}
                        onClick={() => selectIncomeOption(oi)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevIncomeQuestion}>Back</button>
                    {iQIndex < incomeExpensesQuestions.length - 1 ? (
                      <button className={styles.nextButton} onClick={nextIncomeQuestion} disabled={iAnswers[iQIndex] === null}>
                        Next →
                      </button>
                    ) : (
                      <button className={styles.startButton} onClick={finishIncomeQuiz} disabled={iAnswers[iQIndex] === null}>
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuiz.id === "education-future" && (
                <div style={{ width: "100%" }}>
                  <div className={styles.quizHeader}>
                    <div className={styles.questionCounter}>Question {eQIndex + 1} of {educationFutureQuestions.length}</div>
                  </div>

                  <div className={styles.questionSlide} style={{ marginTop: 12 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{educationFutureQuestions[eQIndex].q}</div>
                    {educationFutureQuestions[eQIndex].options.map((opt, oi) => (
                      <button
                        key={oi}
                        className={eAnswers[eQIndex] === oi ? `${styles.optionButton} ${styles.optionSelected}` : styles.optionButton}
                        onClick={() => selectEducationOption(oi)}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevEducationQuestion}>Back</button>
                    {eQIndex < educationFutureQuestions.length - 1 ? (
                      <button className={styles.nextButton} onClick={nextEducationQuestion} disabled={eAnswers[eQIndex] === null}>
                        Next →
                      </button>
                    ) : (
                      <button className={styles.startButton} onClick={finishEducationQuiz} disabled={eAnswers[eQIndex] === null}>
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
