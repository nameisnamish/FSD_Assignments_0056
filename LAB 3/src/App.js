import React, { useState, useEffect } from 'react';
import './App.css';
import { portfolioData } from './data/portfolioData';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Intersection Observer setup for scroll reveal transitions on all elements
  useEffect(() => {
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
        }
      });
    };

    const observerOptions = {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    
    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(portfolioData.personalInfo.email);
    showToast('Email address copied to clipboard');
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  return (
    <div className="app-wrapper">
      <div className="portfolio-container">
        
        {/* TOP MINI BAR */}
        <header className="top-nav-bar reveal-on-scroll">
          <div className="top-brand">
            {portfolioData.personalInfo.subtitle}
          </div>
          <div className="status-pill-top">
            {portfolioData.personalInfo.status} <span className="star-icon">✦</span>
          </div>
        </header>

        {/* HERO SECTION WITH GIANT "PORTFOLIO" TEXT & USER PORTRAIT */}
        <section className="hero-wrapper">
          {/* Giant Background Watermark Text */}
          <div className="giant-portfolio-bg reveal-on-scroll">PORTFOLIO</div>

          <div className="hero-content-grid">
            
            {/* LEFT HERO TEXT BLOCK */}
            <div className="hero-left reveal-on-scroll delay-1">
              <span className="script-hello">Hello, I'm</span>
              <h1 className="hero-name-title">{portfolioData.personalInfo.name}</h1>
              <p className="hero-sub-crimson">{portfolioData.personalInfo.title}</p>
              <p className="hero-bio-para">{portfolioData.personalInfo.bio}</p>
              <div className="worldwide-pill">
                <i className="fa-solid fa-globe"></i> AVAILABLE WORLDWIDE
              </div>
            </div>

            {/* CENTER PORTRAIT FRAME */}
            <div className="hero-portrait-col reveal-on-scroll delay-2">
              <div className="portrait-frame">
                <img
                  src={process.env.PUBLIC_URL + '/hero_img.jpeg'}
                  alt={portfolioData.personalInfo.name}
                  className="portrait-img"
                  onError={(e) => {
                    e.target.src = process.env.PUBLIC_URL + '/profile.jpg';
                  }}
                />
                <div className="portrait-glow-badge">
                  <i className="fa-solid fa-sparkles star-badge-icon"></i>
                  <span>Turning ideas into powerful digital experiences.</span>
                </div>
              </div>
            </div>

            {/* RIGHT STATS COLUMN */}
            <div className="hero-right-stats reveal-on-scroll delay-3">
              {portfolioData.personalInfo.stats.map((st, i) => (
                <div key={i} className={`stat-item-ref reveal-on-scroll delay-${i + 1}`}>
                  <div className="stat-num-ref">{st.number}</div>
                  <div className="stat-lbl-ref">{st.label}</div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* SELECTED PROJECTS SECTION */}
        <section className="section-wrapper">
          <div className="section-top-bar reveal-on-scroll">
            <h2 className="section-heading-ref">SELECTED PROJECTS</h2>
            <a href="#contact" className="link-all-projects">
              VIEW ALL PROJECTS <i className="fa-solid fa-arrow-right"></i>
            </a>
          </div>

          <div className="projects-row-ref">
            {portfolioData.projects.map((proj, idx) => (
              <div
                key={proj.num}
                className={`project-card-ref reveal-on-scroll delay-${idx + 1}`}
                onClick={() => setSelectedProject(proj)}
              >
                <div className="project-img-box">
                  <img
                    src={process.env.PUBLIC_URL + proj.image}
                    alt={proj.title}
                    className="project-img-preview"
                  />
                </div>
                <div className="project-meta-bottom">
                  <div className="project-num-red">{proj.num}</div>
                  <div className="project-details-text">
                    <div className="project-title-ref">{proj.title}</div>
                    <div className="project-cat-ref">{proj.category}</div>
                  </div>
                  <i className="fa-solid fa-arrow-right project-arrow-ref"></i>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3-COLUMN MIDDLE SECTION: EDUCATION & SKILLS | WORK PROCESS | CRIMSON QUOTE */}
        <section className="section-wrapper">
          <div className="three-col-grid">

            {/* COL 1: EDUCATION & SKILLS */}
            <div className="middle-box reveal-on-scroll delay-1">
              <h3 className="sub-title-red">EDUCATION & SKILLS</h3>
              
              <div style={{ marginBottom: '24px' }}>
                {portfolioData.education.map((edu, idx) => (
                  <div key={idx} className="edu-item">
                    <span className="edu-year">{edu.period}</span>
                    <div className="edu-degree">{edu.degree}</div>
                    <div className="edu-school">{edu.institution}</div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--crimson-main)', letterSpacing: '0.06em', marginBottom: '8px' }}>
                  SKILLS
                </div>
                <div className="skills-pills-ref">
                  {portfolioData.skills.map((sk, i) => (
                    <span key={i} className="skill-tag-ref">{sk}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* COL 2: WORK PROCESS */}
            <div className="middle-box reveal-on-scroll delay-2">
              <h3 className="sub-title-red">WORK PROCESS</h3>
              <div className="process-list">
                {portfolioData.workProcess.map((proc, pIdx) => (
                  <div key={proc.num} className={`process-item reveal-on-scroll delay-${pIdx + 1}`}>
                    <div className="process-num">{proc.num}</div>
                    <div className="process-icon-circle">
                      <i className={proc.icon}></i>
                    </div>
                    <div className="process-text">
                      <div className="process-title-text">{proc.title}</div>
                      <div className="process-desc-text">{proc.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* COL 3: CRIMSON QUOTE CARD */}
            <div className="middle-box crimson-quote-box reveal-on-scroll delay-3">
              <div>
                <div className="quote-mark">“</div>
                <p className="quote-body-text">
                  Good design is not just how it looks, but how it works.
                </p>
                <div className="signature-text">Namish</div>
              </div>
              <div className="quote-cta-sub">
                LET'S CREATE SOMETHING GREAT TOGETHER. ✦
              </div>
            </div>

          </div>
        </section>

        {/* BOTTOM CONTACT SECTION */}
        <section id="contact" className="contact-section-ref reveal-on-scroll">
          <div>
            <h2 className="contact-left-title">
              LET'S WORK <br />
              <span>TOGETHER ✦</span>
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, maxWidth: '400px' }}>
              I'm currently open for new projects and engineering collaborations. Let's build something amazing that drives results.
            </p>
            <div className="contact-list-ref">
              <div className="contact-item-link" onClick={copyEmail}>
                <div className="contact-icon-box"><i className="fa-regular fa-envelope"></i></div>
                <span>{portfolioData.personalInfo.email}</span>
              </div>
              <div className="contact-item-link">
                <div className="contact-icon-box"><i className="fa-solid fa-globe"></i></div>
                <span>{portfolioData.personalInfo.website}</span>
              </div>
              <div className="contact-item-link">
                <div className="contact-icon-box"><i className="fa-solid fa-phone"></i></div>
                <span>{portfolioData.personalInfo.phone}</span>
              </div>
              <div className="contact-item-link">
                <div className="contact-icon-box"><i className="fa-solid fa-location-dot"></i></div>
                <span>{portfolioData.personalInfo.location}</span>
              </div>
            </div>
          </div>

          <div style={{ textAlignment: 'right' }}>
            <div style={{
              background: '#14141a',
              border: '1px solid var(--bg-card-border)',
              borderRadius: '20px',
              padding: '24px',
              textAlign: 'center'
            }}>
              <i className="fa-solid fa-laptop-code" style={{ fontSize: '3.5rem', color: 'var(--crimson-main)', marginBottom: '16px' }}></i>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '8px' }}>WE DESIGN DIGITAL EXPERIENCES</div>
              <button
                className="btn-action"
                onClick={copyEmail}
                style={{
                  background: 'var(--crimson-main)',
                  color: '#fff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  marginTop: '12px'
                }}
              >
                Get In Touch ✦
              </button>
            </div>
          </div>
        </section>

      </div>

      {/* PROJECT PREVIEW MODAL */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)} style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '20px', zIndex: 1000
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: '#121216',
            border: '1px solid rgba(230, 0, 35, 0.4)',
            borderRadius: '24px',
            maxWidth: '550px', width: '100%',
            padding: '30px', position: 'relative'
          }}>
            <button onClick={() => setSelectedProject(null)} style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'none', border: 'none', color: '#a0a0a5',
              fontSize: '1.4rem', cursor: 'pointer'
            }}>
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div style={{ color: 'var(--crimson-main)', fontSize: '0.8rem', fontWeight: 800, marginBottom: '6px' }}>
              PROJECT {selectedProject.num}
            </div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '12px' }}>{selectedProject.title}</h2>
            <p style={{ fontSize: '0.9rem', color: '#a0a0a5', marginBottom: '20px', lineHeight: 1.5 }}>
              {selectedProject.summary}
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {selectedProject.tags.map((t, i) => (
                <span key={i} style={{
                  fontSize: '0.72rem', padding: '4px 12px',
                  background: 'rgba(230, 0, 35, 0.1)', color: '#ff758c',
                  borderRadius: '20px', border: '1px solid rgba(230, 0, 35, 0.3)'
                }}>{t}</span>
              ))}
            </div>
            <button onClick={() => setSelectedProject(null)} style={{
              background: 'var(--crimson-main)', color: '#fff',
              border: 'none', padding: '10px 24px', borderRadius: '30px',
              fontWeight: 700, cursor: 'pointer'
            }}>
              Close Specs
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div style={{
          position: 'fixed', bottom: '30px', right: '30px',
          background: 'var(--crimson-main)', color: '#fff',
          padding: '12px 24px', borderRadius: '30px',
          fontWeight: 700, fontSize: '0.88rem', zIndex: 2000,
          boxShadow: '0 10px 30px rgba(230, 0, 35, 0.5)'
        }}>
          <i className="fa-solid fa-check"></i> {toastMessage}
        </div>
      )}
    </div>
  );
}

export default App;
