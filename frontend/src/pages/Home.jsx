import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const features = [
    { icon: '🎯', title: 'Step-by-step Visualization', desc: 'Every comparison, swap, and pointer movement is animated clearly so you actually understand what\'s happening.' },
    { icon: '⚡', title: 'Full Playback Controls', desc: 'Play, pause, step forward/backward, adjust speed — you control the pace of learning.' },
    { icon: '💾', title: 'Save Configurations', desc: 'Save your custom array inputs and algorithm settings. Reload and re-run any time.' },
    { icon: '📊', title: 'Performance Metrics', desc: 'See real comparisons, swaps, execution time, and complexity analysis for every run.' },
    { icon: '📜', title: 'Execution History', desc: 'Full log of every algorithm you\'ve ever run — filterable, searchable, and detailed.' },
    { icon: '🌙', title: 'Dark & Light Mode', desc: 'Easy on your eyes at any time of day. Switch themes with one click from the navbar.' },
  ];

  const algorithms = [
    {
      cat: '🔄 Sorting', color: '#6366f1',
      items: [
        { name: 'Bubble Sort',     free: true  },
        { name: 'Insertion Sort',  free: false },
        { name: 'Selection Sort',  free: false },
        { name: 'Quick Sort',      free: false },
        { name: 'Merge Sort',      free: false },
        { name: 'Heap Sort',       free: false },
        { name: 'Shell Sort',      free: false },
        { name: 'Counting Sort',   free: false },
      ]
    },
    {
      cat: '🔍 Searching', color: '#06b6d4',
      items: [
        { name: 'Binary Search',          free: true  },
        { name: 'Linear Search',          free: false },
        { name: 'Jump Search',            free: false },
        { name: 'Interpolation Search',   free: false },
      ]
    },
  ];

  const steps = [
    { icon: '✍️', title: 'Create Account', desc: 'Sign up for free — takes 30 seconds' },
    { icon: '🎛️', title: 'Pick an Algorithm', desc: 'Choose from 12 sorting and searching algorithms' },
    { icon: '▶️', title: 'Enter Your Data', desc: 'Type in any array and watch it run step-by-step' },
    { icon: '📈', title: 'Analyse Results', desc: 'Review metrics, save configs, track your history' },
  ];

  return (
    <div className="home-page">

      {/* ── HERO ── */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">✨ Interactive Algorithm Learning Platform</div>

          <h1 className="hero-title">
            Master Algorithms Through<br />
            <span className="gradient-text">Interactive Visualization</span>
          </h1>

          <p className="hero-subtitle">
            Watch sorting and searching algorithms execute step-by-step with<br />
            beautiful animations. Save configs, track history, and learn faster.
          </p>

          <div className="hero-cta">
            <Link to="/register">
              <button className="btn-hero-primary">Get Started — It's Free</button>
            </Link>
            <Link to="/login">
              <button className="btn-hero-outline">I have an account</button>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="hero-stat"><strong>12</strong><span>Algorithms</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>4</strong><span>Categories</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>Free</strong><span>Forever</span></div>
            <div className="hero-stat-divider" />
            <div className="hero-stat"><strong>∞</strong><span>Executions</span></div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section section-light">
        <div className="container">
          <div className="section-label">Simple Process</div>
          <h2 className="section-title">How It Works</h2>
          <p className="section-sub">From zero to visualizing algorithms in under a minute</p>

          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={s.title} className="step-card">
                <div className="step-number">{i + 1}</div>
                <div className="step-icon">{s.icon}</div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ALGORITHMS ── */}
      <section className="section section-alt">
        <div className="container">
          <div className="section-label">Algorithm Library</div>
          <h2 className="section-title">What You Can Visualize</h2>
          <p className="section-sub">2 algorithms free to try — sign up to unlock all 12</p>

          <div className="algo-categories">
            {algorithms.map(cat => (
              <div key={cat.cat} className="algo-category" style={{ '--cat-color': cat.color }}>
                <h3 className="algo-cat-title">{cat.cat}</h3>
                <div className="algo-items">
                  {cat.items.map(item => (
                    <div key={item.name} className={`algo-item ${item.free ? 'free' : 'locked'}`}>
                      <span className="algo-item-icon">{item.free ? '✅' : '🔒'}</span>
                      <span className="algo-item-name">{item.name}</span>
                      {item.free && <span className="free-badge">Free</span>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="unlock-cta">
            <p>Sign up to unlock all algorithms — it's completely free</p>
            <Link to="/register">
              <button className="btn-hero-primary">Unlock All Algorithms</button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section section-light">
        <div className="container">
          <div className="section-label">Platform Features</div>
          <h2 className="section-title">Everything You Need to Learn</h2>

          <div className="features-grid">
            {features.map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="final-cta">
        <div className="container">
          <h2>Ready to Actually Understand Algorithms?</h2>
          <p>Join thousands of students and developers who learn by seeing, not just reading.</p>
          <div className="hero-cta">
            <Link to="/register">
              <button className="btn-hero-primary">Create Free Account →</button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;