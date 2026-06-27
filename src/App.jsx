import { useMemo, useState, useEffect } from 'react';
import styles from './App.module.css';

const cards = [
  {
    id: 'life-goals',
    icon: '🎯',
    title: 'Life goals',
    description: 'Where you want to live, family plans, marriage timeline, ideal lifestyle',
  },
  {
    id: 'money-goals',
    icon: '🏦',
    title: 'Money goals',
    description: 'Your retirement number, target retirement age, and what your dream life actually costs',
  },
  {
    id: 'work-career',
    icon: '💼',
    title: 'Work & career',
    description: 'How many hours you want to work, what kind of work feels right, your career direction',
  },
  {
    id: 'income-expenses',
    icon: '💰',
    title: 'Income & expenses',
    description: 'Your current income (before and after tax), monthly expenses, and car costs broken down',
  },
  {
    id: 'education-future',
    icon: '🎓',
    title: 'Education & future',
    description: 'Degree plans, AI-proof career fields, and skills worth investing in right now',
  },
];

function App() {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [completed, setCompleted] = useState({});
  const [mounted, setMounted] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const [isProgressAnimating, setIsProgressAnimating] = useState(false);

  const totalSections = cards.length;
  const completeCount = useMemo(() => Object.values(completed).filter(Boolean).length, [completed]);
  const progress = Math.round((completeCount / totalSections) * 100);

  const openQuiz = (card) => {
    setActiveQuiz(card);
    // reset quiz state when opening specific quizzes
    if (card.id === 'life-goals') {
      setQIndex(0);
      setAnswers(Array(lifeGoalsQuestions.length).fill(null));
    }
    if (card.id === 'money-goals') {
      setMQIndex(0);
      setMAnswers(Array(moneyGoalsQuestions.length).fill(null));
    }
    if (card.id === 'work-career') {
      setWQIndex(0);
      setWAnswers(Array(workCareerQuestions.length).fill(null));
    }
    if (card.id === 'income-expenses') {
      setIQIndex(0);
      setIAnswers(Array(incomeExpensesQuestions.length).fill(null));
    }
    if (card.id === 'education-future') {
      setEQIndex(0);
      setEAnswers(Array(educationFutureQuestions.length).fill(null));
    }
  };
  const closeQuiz = () => setActiveQuiz(null);
  const markComplete = (id) => {
    setCompleted((prev) => {
      const next = { ...prev, [id]: true };
      try {
        localStorage.setItem('lp_completed', JSON.stringify(next));
      } catch (e) {}
      return next;
    });
    closeQuiz();
  };

  // load completed from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('lp_completed');
      if (raw) setCompleted(JSON.parse(raw));
    } catch (e) {}
  }, []);

  // Life Goals quiz questions
  const lifeGoalsQuestions = [
    {
      q: 'Where would you ideally like to live?',
      options: ['City, vibrant life', 'Suburbs, family-friendly', 'Small town / rural', 'Undecided']
    },
    {
      q: 'Do you plan to have children?',
      options: ['Yes, soon', 'Yes, later', 'No', 'Not sure']
    },
    {
      q: 'What kind of home do you prefer?',
      options: ['Apartment/Condo', 'Detached house', 'Townhouse', 'Tiny home / Minimalist']
    },
    {
      q: 'What matters most in your ideal lifestyle?',
      options: ['Travel & experiences', 'Stable family life', 'Career growth', 'Financial freedom']
    },
    {
      q: 'What is your timeline for major life changes?',
      options: ['0-2 years', '3-5 years', '5+ years', 'No firm timeline']
    }
  ];

  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(lifeGoalsQuestions.length).fill(null));

  const selectOption = (optIndex) => {
    setAnswers((a) => {
      const copy = [...a];
      copy[qIndex] = optIndex;
      return copy;
    });
  };

  const nextQuestion = () => {
    if (qIndex < lifeGoalsQuestions.length - 1) setQIndex((i) => i + 1);
  };

  const prevQuestion = () => {
    if (qIndex > 0) setQIndex((i) => i - 1);
    else closeQuiz();
  };

  const finishQuiz = () => {
    // For now we just mark complete and close
    markComplete('life-goals');
    // reset quiz state for next time
    setQIndex(0);
    setAnswers(Array(lifeGoalsQuestions.length).fill(null));
  };

  // Money Goals quiz questions
  const moneyGoalsQuestions = [
    {
      q: 'How much do you want to have saved for retirement?',
      options: ['Less than $500k', '$500k - $1 million', '$1M - $3M', '$3M - $5M', '$5M+']
    },
    {
      q: 'What age do you want to retire or reach financial freedom?',
      options: ['Before 30', '30-35', '35-40', '40-50', '50+']
    },
    {
      q: 'What does your dream lifestyle cost per month?',
      options: ['Under $3,000', '$3,000 - $5,000', '$5,000 - $10,000', '$10,000+']
    },
    {
      q: 'Do you own or rent right now?',
      options: ['Renting', 'Living with family', 'Own a home', 'Other']
    },
    {
      q: 'How would you rate your current financial knowledge?',
      options: ['Total beginner', 'I know the basics', 'Pretty comfortable', 'I know what I am doing']
    }
  ];

  const [mQIndex, setMQIndex] = useState(0);
  const [mAnswers, setMAnswers] = useState(Array(moneyGoalsQuestions.length).fill(null));

  const selectMoneyOption = (optIndex) => {
    setMAnswers((a) => {
      const copy = [...a];
      copy[mQIndex] = optIndex;
      return copy;
    });
  };

  const nextMoneyQuestion = () => {
    if (mQIndex < moneyGoalsQuestions.length - 1) setMQIndex((i) => i + 1);
  };

  const prevMoneyQuestion = () => {
    if (mQIndex > 0) setMQIndex((i) => i - 1);
    else closeQuiz();
  };

  const finishMoneyQuiz = () => {
    markComplete('money-goals');
    setMQIndex(0);
    setMAnswers(Array(moneyGoalsQuestions.length).fill(null));
  };

  // Work & Career quiz questions
  const workCareerQuestions = [
    {
      q: 'How many hours per week do you ideally want to work?',
      options: ['Under 20 hours', '20-40 hours', '40-60 hours', '60+ hours, I am building something']
    },
    {
      q: 'What type of work feels most like you?',
      options: ['Working for myself', 'Working for a company', 'Mix of both', 'Still figuring it out']
    },
    {
      q: 'What industry are you most drawn to?',
      options: ['Content creation / media', 'Trades / skilled labor', 'Sales / business', 'Tech / digital', 'Healthcare / service']
    },
    {
      q: 'What matters most to you in a career?',
      options: ['High income', 'Freedom and flexibility', 'Meaning and impact', 'Status and recognition']
    },
    {
      q: 'Where are you in your career right now?',
      options: ['Just starting out', 'In a job I want to leave', 'Building something on the side', 'Already on my path']
    }
  ];

  const [wQIndex, setWQIndex] = useState(0);
  const [wAnswers, setWAnswers] = useState(Array(workCareerQuestions.length).fill(null));

  const selectWorkOption = (optIndex) => {
    setWAnswers((a) => {
      const copy = [...a];
      copy[wQIndex] = optIndex;
      return copy;
    });
  };

  const nextWorkQuestion = () => {
    if (wQIndex < workCareerQuestions.length - 1) setWQIndex((i) => i + 1);
  };

  const prevWorkQuestion = () => {
    if (wQIndex > 0) setWQIndex((i) => i - 1);
    else closeQuiz();
  };

  const finishWorkQuiz = () => {
    markComplete('work-career');
    setWQIndex(0);
    setWAnswers(Array(workCareerQuestions.length).fill(null));
  };

  // Income & Expenses quiz questions
  const incomeExpensesQuestions = [
    {
      q: 'What is your monthly income before tax?',
      options: ['Under $2,000', '$2,000 - $4,000', '$4,000 - $6,000', '$6,000 - $10,000', '$10,000+']
    },
    {
      q: 'What is your monthly income after tax?',
      options: ['Under $1,500', '$1,500 - $3,000', '$3,000 - $5,000', '$5,000 - $8,000', '$8,000+']
    },
    {
      q: 'What are your total monthly living expenses?',
      options: ['Under $1,000', '$1,000 - $2,000', '$2,000 - $3,500', '$3,500 - $5,000', '$5,000+']
    },
    {
      q: 'How much do you spend on your car per month? (payment, gas, insurance, maintenance)',
      options: ['I do not have a car', 'Under $300', '$300 - $600', '$600 - $1,000', '$1,000+']
    },
    {
      q: 'How much are you currently saving or investing each month?',
      options: ['Nothing yet', 'Under $200', '$200 - $500', '$500 - $1,000', '$1,000+']
    }
  ];

  const [iQIndex, setIQIndex] = useState(0);
  const [iAnswers, setIAnswers] = useState(Array(incomeExpensesQuestions.length).fill(null));

  const selectIncomeOption = (optIndex) => {
    setIAnswers((a) => {
      const copy = [...a];
      copy[iQIndex] = optIndex;
      return copy;
    });
  };

  const nextIncomeQuestion = () => {
    if (iQIndex < incomeExpensesQuestions.length - 1) setIQIndex((i) => i + 1);
  };

  const prevIncomeQuestion = () => {
    if (iQIndex > 0) setIQIndex((i) => i - 1);
    else closeQuiz();
  };

  const finishIncomeQuiz = () => {
    markComplete('income-expenses');
    setIQIndex(0);
    setIAnswers(Array(incomeExpensesQuestions.length).fill(null));
  };

  // Education & Future quiz questions
  const educationFutureQuestions = [
    {
      q: 'What is your current education level?',
      options: ['High school diploma', 'Some college', 'Associate degree', 'Bachelor\'s degree', 'No formal degree']
    },
    {
      q: 'Are you planning to pursue any further education?',
      options: ['Yes, a degree', 'Yes, a trade or certification', 'Maybe, not sure yet', 'No, learning on my own', 'No plans']
    },
    {
      q: 'How important is it that your career is AI-proof?',
      options: ['Very important, it worries me', 'Somewhat important', 'Not that important', 'I plan to use AI as a tool']
    },
    {
      q: 'Which of these skills are you most interested in building?',
      options: ['Content creation and personal brand', 'A skilled trade', 'Sales and persuasion', 'Tech and software', 'Investing and finance']
    },
    {
      q: 'What is your biggest barrier to earning more money right now?',
      options: ['I do not know where to start', 'I lack the right skills', 'I do not have enough time', 'I need more confidence', 'Nothing is stopping me']
    }
  ];

  const [eQIndex, setEQIndex] = useState(0);
  const [eAnswers, setEAnswers] = useState(Array(educationFutureQuestions.length).fill(null));

  const selectEducationOption = (optIndex) => {
    setEAnswers((a) => {
      const copy = [...a];
      copy[eQIndex] = optIndex;
      return copy;
    });
  };

  const nextEducationQuestion = () => {
    if (eQIndex < educationFutureQuestions.length - 1) setEQIndex((i) => i + 1);
  };

  const prevEducationQuestion = () => {
    if (eQIndex > 0) setEQIndex((i) => i - 1);
    else closeQuiz();
  };

  const finishEducationQuiz = () => {
    markComplete('education-future');
    setEQIndex(0);
    setEAnswers(Array(educationFutureQuestions.length).fill(null));
  };

  // trigger mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 10);
    return () => clearTimeout(t);
  }, []);

  // animate progress fill over 1.5s ease-out using requestAnimationFrame whenever `progress` changes
  useEffect(() => {
    let rafId;
    const duration = 1500;
    const start = performance.now();
    const from = animatedProgress; // start from current displayed value
    const to = progress;
    setIsProgressAnimating(true);

    function step(now) {
      const elapsed = Math.min(now - start, duration);
      const t = elapsed / duration;
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      const value = Math.round(from + (to - from) * eased);
      setAnimatedProgress(value);
      if (elapsed < duration) {
        rafId = requestAnimationFrame(step);
      }
      else {
        // animation finished
        setIsProgressAnimating(false);
      }
    }

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [progress]);

  return (
    <div className={`${styles.app} ${mounted ? styles.mounted : ''}`}>
      <div className={styles.pageWrapper}>
        <header className={styles.header}>
          <div>
            <p className={styles.greeting}>Good morning,</p>
            <h1>Welcome, Tanner</h1>
          </div>
          <div className={styles.profileCard}>
            <span className={styles.profileBadge}>Profile {animatedProgress}% complete</span>
            <div className={styles.progressTrack} style={{ position: 'relative' }}>
              <div
                className={`${styles.progressFill} ${isProgressAnimating ? styles.progressAnimating : ''}`}
                style={{ width: `${animatedProgress}%`, transition: 'width 0.2s linear' }}
              />
              {animatedProgress === 0 && (
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: 999, animation: 'progressPulse 1.2s ease-in-out infinite'
                }} />
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
                  <span
                    className={
                      isComplete ? styles.statusComplete : styles.statusMuted
                    }
                  >
                    {isComplete ? 'Complete ✓' : 'Not started'}
                  </span>
                </div>
                <button
                  className={isComplete ? styles.reviewButton : styles.startButton}
                  onClick={() => openQuiz(card)}
                >
                  {isComplete ? 'Review →' : 'Start →'}
                </button>
              </article>
            );
          })}

          <div className={`${styles.lockedSection} ${completeCount === totalSections ? styles.lockedSectionOpen : ''}`}>
            <div className={styles.lockedCopy}>
              <span className={styles.lockIcon} aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path d="M12 17a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill="#f6d86a" />
                  <path d="M7 10V8a5 5 0 0110 0v2" stroke="#f6d86a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="4" y="10" width="16" height="10" rx="2" stroke="#f6d86a" strokeWidth="1.4" />
                </svg>
              </span>
              <div>
                {completeCount === totalSections ? (
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
            <div className={styles.lockPreview}>
              {completeCount === totalSections && (
                <button className={styles.dashboardButton}>View my dashboard →</button>
              )}
            </div>
          </div>
        </main>
      </div>

      {activeQuiz && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}> 
            <button className={styles.closeButton} onClick={closeQuiz}>×</button>
            <div className={styles.modalBody}>
              <div className={styles.modalIcon}>{activeQuiz.icon}</div>
              <h2>{activeQuiz.title}</h2>
              <p className={styles.modalSubtitle}>{activeQuiz.description}</p>

              {activeQuiz.id === 'life-goals' && (
                <div style={{ width: '100%' }}>
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

                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevQuestion}>Back</button>
                    {qIndex < lifeGoalsQuestions.length - 1 ? (
                      <button
                        className={styles.nextButton}
                        onClick={nextQuestion}
                        disabled={answers[qIndex] === null}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        className={styles.startButton}
                        onClick={finishQuiz}
                        disabled={answers[qIndex] === null}
                      >
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuiz.id === 'money-goals' && (
                <div style={{ width: '100%' }}>
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

                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevMoneyQuestion}>Back</button>
                    {mQIndex < moneyGoalsQuestions.length - 1 ? (
                      <button
                        className={styles.nextButton}
                        onClick={nextMoneyQuestion}
                        disabled={mAnswers[mQIndex] === null}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        className={styles.startButton}
                        onClick={finishMoneyQuiz}
                        disabled={mAnswers[mQIndex] === null}
                      >
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuiz.id === 'work-career' && (
                <div style={{ width: '100%' }}>
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

                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevWorkQuestion}>Back</button>
                    {wQIndex < workCareerQuestions.length - 1 ? (
                      <button
                        className={styles.nextButton}
                        onClick={nextWorkQuestion}
                        disabled={wAnswers[wQIndex] === null}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        className={styles.startButton}
                        onClick={finishWorkQuiz}
                        disabled={wAnswers[wQIndex] === null}
                      >
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuiz.id === 'income-expenses' && (
                <div style={{ width: '100%' }}>
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

                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevIncomeQuestion}>Back</button>
                    {iQIndex < incomeExpensesQuestions.length - 1 ? (
                      <button
                        className={styles.nextButton}
                        onClick={nextIncomeQuestion}
                        disabled={iAnswers[iQIndex] === null}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        className={styles.startButton}
                        onClick={finishIncomeQuiz}
                        disabled={iAnswers[iQIndex] === null}
                      >
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuiz.id === 'education-future' && (
                <div style={{ width: '100%' }}>
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

                  <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                    <button className={styles.backButton} onClick={prevEducationQuestion}>Back</button>
                    {eQIndex < educationFutureQuestions.length - 1 ? (
                      <button
                        className={styles.nextButton}
                        onClick={nextEducationQuestion}
                        disabled={eAnswers[eQIndex] === null}
                      >
                        Next →
                      </button>
                    ) : (
                      <button
                        className={styles.startButton}
                        onClick={finishEducationQuiz}
                        disabled={eAnswers[eQIndex] === null}
                      >
                        Save & finish
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeQuiz.id !== 'life-goals' && activeQuiz.id !== 'money-goals' && activeQuiz.id !== 'work-career' && activeQuiz.id !== 'income-expenses' && activeQuiz.id !== 'education-future' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
                  <div style={{ fontSize: 22 }}>⏳</div>
                  <p className={styles.modalComing}>Questions for this section are being built. Check back soon.</p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className={styles.backButton} onClick={closeQuiz}>Back</button>
                    <button className={styles.startButton} disabled>Save & continue</button>
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
