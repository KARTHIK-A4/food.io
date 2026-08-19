import React from 'react'

export default function HeroSection({ onNavigate, onQuickAdd, featuredHot, featuredCold }) {
  return (
    <section className="hero-master">
      {/* Background ambient lighting */}
      <div className="hero-glow-1"></div>
      <div className="hero-glow-2"></div>

      <div className="hero-grid">
        {/* Left Column: Story & CTAs */}
        <div className="hero-text-col">
          <div className="hero-pill-badge">
            <span className="fire-icon">🔥</span>
            <span>Artisanal Coffee & Chilled Beverages</span>
          </div>

          <h1 className="hero-main-title">
            Freshly Brewed <span className="title-highlight">Happiness</span> in Every Single Sip.
          </h1>

          <p className="hero-subtext">
            Experience the rich tradition of South Indian Kumbakonam Degree Coffee, comforting herbal teas, and slow-shaken icy cold brews made from farm-fresh dairy and ethically sourced beans.
          </p>

          {/* Quick Action Buttons */}
          <div className="hero-cta-group">
            <button 
              className="btn-hero-primary"
              onClick={() => onNavigate('hot')}
            >
              ☕ Explore Hot Brews
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => onNavigate('cold')}
            >
              🧊 Chilled Refreshers
            </button>
            <button 
              className="btn-hero-accent"
              onClick={() => onNavigate('weekly')}
            >
              🌟 1-Week Specials
            </button>
          </div>

          {/* Social Proof Counters */}
          <div className="hero-stats-row">
            <div className="hero-stat-card">
              <div className="stat-num">15+</div>
              <div className="stat-label">Handcrafted Brews</div>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-card">
              <div className="stat-num">4.9 ★</div>
              <div className="stat-label">10,000+ Reviews</div>
            </div>
            <div className="hero-stat-divider"></div>
            <div className="hero-stat-card">
              <div className="stat-num">⚡ 3 Mins</div>
              <div className="stat-label">Average Prep Time</div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Hot & Cold Showcase Dual Card */}
        <div className="hero-visual-col">
          <div className="showcase-duo-wrapper">
            {/* Hot Coffee Showcase Card */}
            {featuredHot && (
              <div className="hero-feature-card card-steam">
                <div className="hero-card-badge hot-tag">☕ Trending Hot</div>
                <div className="hero-img-box">
                  <img src={featuredHot.image} alt={featuredHot.name} />
                </div>
                <div className="hero-card-info">
                  <h4>{featuredHot.name}</h4>
                  <div className="hero-card-price-row">
                    <span className="hero-price">₹{featuredHot.price}</span>
                    <span className="hero-rating">★ {featuredHot.rating}</span>
                  </div>
                  <button 
                    className="hero-quick-add"
                    onClick={() => onQuickAdd(featuredHot)}
                  >
                    Quick Add +
                  </button>
                </div>
              </div>
            )}

            {/* Cold Drink Showcase Card */}
            {featuredCold && (
              <div className="hero-feature-card card-frost">
                <div className="hero-card-badge cold-tag">🧊 Trending Cold</div>
                <div className="hero-img-box">
                  <img src={featuredCold.image} alt={featuredCold.name} />
                </div>
                <div className="hero-card-info">
                  <h4>{featuredCold.name}</h4>
                  <div className="hero-card-price-row">
                    <span className="hero-price">₹{featuredCold.price}</span>
                    <span className="hero-rating">★ {featuredCold.rating}</span>
                  </div>
                  <button 
                    className="hero-quick-add"
                    onClick={() => onQuickAdd(featuredCold)}
                  >
                    Quick Add +
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
