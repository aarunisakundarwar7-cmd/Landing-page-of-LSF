import React, { useState, useEffect } from "react";

const COLORS = {
  primary: "#355872",
  secondary: "#7AAACE",
  accent: "#9CD5FF",
  background: "#F7F8F0",
  white: "#ffffff",
};

const SERVICES = [
  {
    name: "Electrician",
    description:
      "Get reliable electricians for wiring, repairs, installations and electrical maintenance.",
    image:
      "https://images.pexels.com/photos/5767595/pexels-photo-5767595.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Professional electrician working on wiring",
  },
  {
    name: "Plumber",
    description:
      "Find skilled plumbers for pipe repairs, leaks, installations and other plumbing needs.",
    image:
      "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Plumber installing steel pipes",
  },
  {
    name: "House Cleaning",
    description:
      "Book trusted professionals for home cleaning, deep cleaning and regular maintenance.",
    image:
      "https://images.pexels.com/photos/16509869/pexels-photo-16509869.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Housekeeper cleaning a home",
  },
  {
    name: "Carpenter",
    description:
      "Connect with skilled carpenters for furniture, repairs, installations and custom woodwork.",
    image:
      "https://images.pexels.com/photos/6790066/pexels-photo-6790066.jpeg?auto=compress&cs=tinysrgb&h=650&w=940",
    alt: "Carpenter working on wood in a workshop",
  },
];

const FEATURES = [
  {
    title: "GPS Tracking",
    description:
      "Find nearby service providers and track service locations using GPS-based location technology.",
    icon: "📍",
  },
  {
    title: "Integrated Payment System",
    description:
      "Make secure and convenient payments through an integrated payment system.",
    icon: "💳",
  },
  {
    title: "Language Translation",
    description:
      "Communicate more easily with service providers using language translation support.",
    icon: "🌐",
  },
  {
    title: "Smart Recommendations",
    description:
      "Get personalized service recommendations based on your needs, preferences and location.",
    icon: "🤖",
  },
];

const STEPS = [
  { title: "Search", description: "Choose the service you need." },
  {
    title: "Find Nearby Providers",
    description: "Discover service providers near your location.",
  },
  {
    title: "Book a Service",
    description: "Select a provider and schedule your service.",
  },
  {
    title: "Pay & Review",
    description: "Complete payment and share your experience.",
  },
];

const BENEFITS = [
  "Find nearby professionals",
  "Easy service discovery",
  "Convenient booking",
  "Secure payments",
  "Location-based recommendations",
  "Better communication",
];

const NAV_LINKS = [
  { label: "Home", target: "home" },
  { label: "Services", target: "services" },
  { label: "Features", target: "features" },
  { label: "How It Works", target: "how" },
  { label: "About", target: "about" },
];

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: ${COLORS.background}; color: ${COLORS.primary}; }

  .lsf-container { width: 100%; overflow-x: hidden; }

  /* NAVBAR */
  .lsf-navbar {
    position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;
    background: ${COLORS.primary};
    padding: 0.85rem 2rem;
    box-shadow: 0 2px 12px rgba(0,0,0,0.15);
    transition: all 0.3s ease;
  }
  .lsf-nav-inner {
    max-width: 1200px; margin: 0 auto;
    display: flex; align-items: center; justify-content: space-between;
  }
  .lsf-logo {
    display: flex; align-items: center; gap: 0.6rem;
    font-size: 1.3rem; font-weight: 700; color: ${COLORS.white};
    cursor: pointer;
  }
  .lsf-logo-icon {
    width: 38px; height: 38px; border-radius: 10px;
    background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.secondary});
    display: flex; align-items: center; justify-content: center;
    font-size: 1.2rem;
  }
  .lsf-nav-links { display: flex; gap: 2rem; align-items: center; }
  .lsf-nav-links a {
    color: ${COLORS.background}; text-decoration: none; font-size: 1rem;
    font-weight: 500; transition: color 0.25s ease; cursor: pointer;
    position: relative;
  }
  .lsf-nav-links a::after {
    content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px;
    background: ${COLORS.accent}; transition: width 0.3s ease;
  }
  .lsf-nav-links a:hover { color: ${COLORS.accent}; }
  .lsf-nav-links a:hover::after { width: 100%; }
  .lsf-nav-actions { display: flex; gap: 0.75rem; align-items: center; }
  .lsf-btn {
    border: none; cursor: pointer; font-size: 0.95rem; font-weight: 600;
    border-radius: 8px; padding: 0.55rem 1.4rem; transition: all 0.25s ease;
    font-family: inherit;
  }
  .lsf-btn-outline {
    background: transparent; color: ${COLORS.white};
    border: 2px solid ${COLORS.secondary};
  }
  .lsf-btn-outline:hover { background: ${COLORS.secondary}; }
  .lsf-btn-primary {
    background: ${COLORS.accent}; color: ${COLORS.primary};
  }
  .lsf-btn-primary:hover { background: ${COLORS.white}; transform: translateY(-1px); }
  .lsf-btn-solid {
    background: ${COLORS.primary}; color: ${COLORS.white};
  }
  .lsf-btn-solid:hover { background: ${COLORS.secondary}; transform: translateY(-1px); }

  .lsf-hamburger {
    display: none; flex-direction: column; gap: 5px; cursor: pointer;
    background: none; border: none; padding: 4px;
  }
  .lsf-hamburger span {
    width: 26px; height: 3px; background: ${COLORS.white}; border-radius: 2px;
    transition: all 0.3s ease;
  }
  .lsf-hamburger.open span:nth-child(1) { transform: translateY(8px) rotate(45deg); }
  .lsf-hamburger.open span:nth-child(2) { opacity: 0; }
  .lsf-hamburger.open span:nth-child(3) { transform: translateY(-8px) rotate(-45deg); }

  .lsf-mobile-menu {
    display: none; flex-direction: column; gap: 0.5rem;
    padding: 1rem 2rem; background: ${COLORS.primary};
  }
  .lsf-mobile-menu.open { display: flex; }
  .lsf-mobile-menu a {
    color: ${COLORS.background}; text-decoration: none; font-size: 1.05rem;
    font-weight: 500; padding: 0.6rem 0; border-bottom: 1px solid rgba(122,170,206,0.3);
    transition: color 0.25s ease; cursor: pointer;
  }
  .lsf-mobile-menu a:hover { color: ${COLORS.accent}; }
  .lsf-mobile-actions { display: flex; gap: 0.75rem; margin-top: 1rem; }

  /* HERO */
  .lsf-hero {
    padding: 7rem 2rem 4rem; min-height: 100vh;
    display: flex; align-items: center;
    background: linear-gradient(170deg, ${COLORS.background} 0%, #eef3ed 100%);
    position: relative; overflow: hidden;
  }
  .lsf-hero-deco1 {
    position: absolute; top: -80px; right: -80px; width: 400px; height: 400px;
    border-radius: 50%; background: ${COLORS.accent}; opacity: 0.12;
  }
  .lsf-hero-deco2 {
    position: absolute; bottom: -60px; left: -60px; width: 300px; height: 300px;
    border-radius: 50%; background: ${COLORS.secondary}; opacity: 0.1;
  }
  .lsf-hero-inner {
    max-width: 1200px; margin: 0 auto; width: 100%;
    display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: center;
    position: relative; z-index: 1;
  }
  .lsf-hero-text h1 {
    font-size: 3rem; line-height: 1.15; color: ${COLORS.primary};
    margin-bottom: 1.25rem; font-weight: 800;
  }
  .lsf-hero-text p {
    font-size: 1.2rem; line-height: 1.6; color: #5a7080; margin-bottom: 2rem;
  }
  .lsf-hero-cta { display: flex; gap: 1rem; flex-wrap: wrap; }
  .lsf-hero-cta .lsf-btn { padding: 0.8rem 2rem; font-size: 1.05rem; }
  .lsf-hero-image-wrap {
    position: relative; border-radius: 20px; overflow: hidden;
    box-shadow: 0 20px 50px rgba(53,88,114,0.25);
  }
  .lsf-hero-image-wrap img { width: 100%; height: 420px; object-fit: cover; display: block; }
  .lsf-hero-badge {
    position: absolute; bottom: 1.25rem; left: 1.25rem;
    background: ${COLORS.white}; border-radius: 14px; padding: 0.8rem 1.2rem;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    display: flex; align-items: center; gap: 0.6rem;
  }
  .lsf-hero-badge-icon {
    width: 40px; height: 40px; border-radius: 10px;
    background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.secondary});
    display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
  }
  .lsf-hero-badge-text { font-size: 0.85rem; font-weight: 700; color: ${COLORS.primary}; line-height: 1.3; }
  .lsf-hero-badge-text small { display: block; font-weight: 400; color: #5a7080; font-size: 0.75rem; }

  /* SECTION SHARED */
  .lsf-section { padding: 4.5rem 2rem; }
  .lsf-section-inner { max-width: 1200px; margin: 0 auto; }
  .lsf-section-header { text-align: center; margin-bottom: 3rem; }
  .lsf-section-header h2 {
    font-size: 2.3rem; color: ${COLORS.primary}; font-weight: 800; margin-bottom: 0.75rem;
  }
  .lsf-section-header p { font-size: 1.15rem; color: #5a7080; }
  .lsf-section-header .lsf-underline {
    width: 70px; height: 4px; border-radius: 2px; margin: 1rem auto 0;
    background: linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.accent});
  }

  /* SERVICES */
  .lsf-services-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.75rem;
  }
  .lsf-service-card {
    background: ${COLORS.white}; border-radius: 18px; overflow: hidden;
    box-shadow: 0 6px 20px rgba(53,88,114,0.1);
    transition: all 0.35s ease; border: 1px solid rgba(122,170,206,0.15);
    display: flex; flex-direction: column;
  }
  .lsf-service-card:hover {
    transform: translateY(-8px); box-shadow: 0 16px 40px rgba(53,88,114,0.2);
  }
  .lsf-service-img-wrap { width: 100%; height: 180px; overflow: hidden; }
  .lsf-service-img-wrap img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
  .lsf-service-card:hover .lsf-service-img-wrap img { transform: scale(1.07); }
  .lsf-service-body { padding: 1.3rem; display: flex; flex-direction: column; flex-grow: 1; }
  .lsf-service-body h3 { font-size: 1.25rem; color: ${COLORS.primary}; margin-bottom: 0.6rem; }
  .lsf-service-body p { font-size: 0.92rem; line-height: 1.55; color: #5a7080; margin-bottom: 1.25rem; flex-grow: 1; }
  .lsf-service-btn {
    background: ${COLORS.secondary}; color: ${COLORS.white}; border: none;
    padding: 0.6rem 1.2rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; transition: all 0.25s ease; align-self: flex-start; font-family: inherit;
  }
  .lsf-service-btn:hover { background: ${COLORS.primary}; }

  /* FEATURES */
  .lsf-features-section { background: #eef3ed; }
  .lsf-features-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.75rem;
  }
  .lsf-feature-card {
    background: ${COLORS.white}; border-radius: 18px; padding: 2rem 1.5rem;
    text-align: center; box-shadow: 0 6px 20px rgba(53,88,114,0.08);
    transition: all 0.35s ease; border: 1px solid rgba(122,170,206,0.12);
  }
  .lsf-feature-card:hover {
    transform: translateY(-6px); box-shadow: 0 16px 40px rgba(53,88,114,0.18);
    border-color: ${COLORS.secondary};
  }
  .lsf-feature-icon {
    width: 70px; height: 70px; border-radius: 16px; margin: 0 auto 1.25rem;
    background: linear-gradient(135deg, ${COLORS.accent}, ${COLORS.secondary});
    display: flex; align-items: center; justify-content: center; font-size: 2rem;
    box-shadow: 0 6px 16px rgba(122,170,206,0.35);
  }
  .lsf-feature-card h3 { font-size: 1.15rem; color: ${COLORS.primary}; margin-bottom: 0.75rem; }
  .lsf-feature-card p { font-size: 0.9rem; line-height: 1.55; color: #5a7080; }

  /* HOW IT WORKS */
  .lsf-steps-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.5rem;
    position: relative;
  }
  .lsf-steps-line {
    position: absolute; top: 40px; left: 10%; right: 10%; height: 3px;
    background: linear-gradient(90deg, ${COLORS.secondary}, ${COLORS.accent}, ${COLORS.secondary});
    z-index: 0; border-radius: 2px;
  }
  .lsf-step-card { text-align: center; position: relative; z-index: 1; }
  .lsf-step-circle {
    width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 1.25rem;
    background: ${COLORS.primary}; color: ${COLORS.white};
    display: flex; align-items: center; justify-content: center;
    font-size: 1.8rem; font-weight: 800;
    border: 4px solid ${COLORS.background};
    box-shadow: 0 6px 20px rgba(53,88,114,0.25);
    transition: all 0.3s ease;
  }
  .lsf-step-card:hover .lsf-step-circle {
    background: ${COLORS.secondary}; transform: scale(1.08);
  }
  .lsf-step-card h3 { font-size: 1.15rem; color: ${COLORS.primary}; margin-bottom: 0.5rem; }
  .lsf-step-card p { font-size: 0.9rem; color: #5a7080; padding: 0 0.5rem; }

  /* BENEFITS */
  .lsf-benefits-section { background: ${COLORS.primary}; color: ${COLORS.white}; }
  .lsf-benefits-section .lsf-section-header h2 { color: ${COLORS.white}; }
  .lsf-benefits-section .lsf-section-header p { color: ${COLORS.accent}; }
  .lsf-benefits-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem;
    max-width: 900px; margin: 0 auto;
  }
  .lsf-benefit-item {
    display: flex; align-items: center; gap: 0.75rem;
    background: rgba(255,255,255,0.08); border-radius: 12px; padding: 1.1rem 1.3rem;
    transition: all 0.3s ease;
  }
  .lsf-benefit-item:hover { background: rgba(255,255,255,0.15); transform: translateX(4px); }
  .lsf-benefit-check {
    width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
    background: ${COLORS.accent}; color: ${COLORS.primary};
    display: flex; align-items: center; justify-content: center;
    font-size: 0.9rem; font-weight: 800;
  }
  .lsf-benefit-item span { font-size: 1rem; font-weight: 500; }

  /* CTA */
  .lsf-cta {
    padding: 4rem 2rem;
  }
  .lsf-cta-box {
    max-width: 900px; margin: 0 auto; text-align: center;
    background: linear-gradient(135deg, ${COLORS.primary} 0%, #2c4759 100%);
    border-radius: 24px; padding: 3.5rem 2rem; position: relative; overflow: hidden;
    box-shadow: 0 20px 50px rgba(53,88,114,0.3);
  }
  .lsf-cta-deco1 {
    position: absolute; top: -50px; right: -50px; width: 200px; height: 200px;
    border-radius: 50%; background: ${COLORS.accent}; opacity: 0.1;
  }
  .lsf-cta-deco2 {
    position: absolute; bottom: -60px; left: -40px; width: 180px; height: 180px;
    border-radius: 50%; background: ${COLORS.secondary}; opacity: 0.1;
  }
  .lsf-cta-box h2 { font-size: 2rem; color: ${COLORS.white}; margin-bottom: 1rem; position: relative; z-index: 1; }
  .lsf-cta-box p { font-size: 1.1rem; color: ${COLORS.accent}; margin-bottom: 2rem; position: relative; z-index: 1; }
  .lsf-cta-buttons { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }
  .lsf-cta-buttons .lsf-btn { padding: 0.85rem 2.2rem; font-size: 1.05rem; }

  /* FOOTER */
  .lsf-footer { background: ${COLORS.primary}; color: ${COLORS.background}; padding: 3rem 2rem 1.5rem; }
  .lsf-footer-inner { max-width: 1200px; margin: 0 auto; }
  .lsf-footer-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    flex-wrap: wrap; gap: 2rem; margin-bottom: 2rem;
  }
  .lsf-footer-brand { max-width: 320px; }
  .lsf-footer-brand h3 {
    display: flex; align-items: center; gap: 0.6rem; font-size: 1.3rem; margin-bottom: 0.75rem; color: ${COLORS.white};
  }
  .lsf-footer-brand p { font-size: 0.95rem; line-height: 1.55; color: ${COLORS.accent}; }
  .lsf-footer-links { display: flex; flex-wrap: wrap; gap: 1.5rem; }
  .lsf-footer-links a {
    color: ${COLORS.background}; text-decoration: none; font-size: 0.95rem;
    transition: color 0.25s ease; cursor: pointer;
  }
  .lsf-footer-links a:hover { color: ${COLORS.accent}; }
  .lsf-footer-socials { display: flex; gap: 0.75rem; }
  .lsf-social-btn {
    width: 38px; height: 38px; border-radius: 10px; border: none; cursor: pointer;
    background: rgba(255,255,255,0.1); color: ${COLORS.white}; font-size: 1rem;
    display: flex; align-items: center; justify-content: center; transition: all 0.25s ease;
    font-family: inherit;
  }
  .lsf-social-btn:hover { background: ${COLORS.accent}; color: ${COLORS.primary}; }
  .lsf-footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.12); padding-top: 1.5rem; text-align: center;
    font-size: 0.88rem; color: ${COLORS.accent};
  }

  /* RESPONSIVE */
  @media (max-width: 1024px) {
    .lsf-services-grid { grid-template-columns: repeat(2, 1fr); }
    .lsf-features-grid { grid-template-columns: repeat(2, 1fr); }
    .lsf-steps-grid { grid-template-columns: repeat(2, 1fr); gap: 2.5rem; }
    .lsf-steps-line { display: none; }
    .lsf-benefits-grid { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 860px) {
    .lsf-nav-links { display: none; }
    .lsf-nav-actions { display: none; }
    .lsf-hamburger { display: flex; }
    .lsf-hero-inner { grid-template-columns: 1fr; gap: 2rem; }
    .lsf-hero-text h1 { font-size: 2.3rem; }
    .lsf-hero-text p { font-size: 1.05rem; }
    .lsf-hero-image-wrap img { height: 320px; }
    .lsf-section-header h2 { font-size: 1.8rem; }
    .lsf-cta-box h2 { font-size: 1.6rem; }
  }

  @media (max-width: 560px) {
    .lsf-hero { padding: 6rem 1.25rem 3rem; }
    .lsf-section { padding: 3.5rem 1.25rem; }
    .lsf-services-grid { grid-template-columns: 1fr; }
    .lsf-features-grid { grid-template-columns: 1fr; }
    .lsf-steps-grid { grid-template-columns: 1fr; }
    .lsf-benefits-grid { grid-template-columns: 1fr; }
    .lsf-hero-text h1 { font-size: 1.9rem; }
    .lsf-hero-cta { flex-direction: column; }
    .lsf-hero-cta .lsf-btn { width: 100%; text-align: center; }
    .lsf-cta-buttons { flex-direction: column; }
    .lsf-cta-buttons .lsf-btn { width: 100%; }
    .lsf-footer-top { flex-direction: column; }
    .lsf-footer-links { gap: 1rem; }
  }

  @keyframes lsf-fade-up {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .lsf-animate { animation: lsf-fade-up 0.7s ease both; }
`;

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = (id) => {
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleLogin = () => console.log("Login clicked");
  const handleSignUp = () => console.log("Sign Up clicked");
  const handleFindProvider = (service) => console.log("Find provider for:", service);
  const handleBecomeProvider = () => console.log("Become a Service Provider clicked");
  const handleSocial = (platform) => console.log("Social clicked:", platform);

  const navLinkStyle = scrolled
    ? { boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }
    : {};

  return (
    <div className="lsf-container">
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="lsf-navbar" style={navLinkStyle} role="navigation" aria-label="Main navigation">
        <div className="lsf-nav-inner">
          <div className="lsf-logo" onClick={() => scrollToSection("home")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && scrollToSection("home")}>
            <div className="lsf-logo-icon" aria-hidden="true">🔧</div>
            <span>Local Service Finder</span>
          </div>

          <div className="lsf-nav-links" role="menubar">
            {NAV_LINKS.map((link) => (
              <a key={link.target} role="menuitem" onClick={() => scrollToSection(link.target)}>
                {link.label}
              </a>
            ))}
          </div>

          <div className="lsf-nav-actions">
            <button className="lsf-btn lsf-btn-outline" onClick={handleLogin}>Login</button>
            <button className="lsf-btn lsf-btn-primary" onClick={handleSignUp}>Sign Up</button>
          </div>

          <button
            className={`lsf-hamburger ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div className={`lsf-mobile-menu ${menuOpen ? "open" : ""}`}>
        {NAV_LINKS.map((link) => (
          <a key={link.target} onClick={() => scrollToSection(link.target)}>
            {link.label}
          </a>
        ))}
        <div className="lsf-mobile-actions">
          <button className="lsf-btn lsf-btn-outline" style={{ flex: 1 }} onClick={() => { setMenuOpen(false); handleLogin(); }}>Login</button>
          <button className="lsf-btn lsf-btn-primary" style={{ flex: 1 }} onClick={() => { setMenuOpen(false); handleSignUp(); }}>Sign Up</button>
        </div>
      </div>

      {/* HERO */}
      <section id="home" className="lsf-hero">
        <div className="lsf-hero-deco1" aria-hidden="true"></div>
        <div className="lsf-hero-deco2" aria-hidden="true"></div>
        <div className="lsf-hero-inner">
          <div className="lsf-hero-text lsf-animate">
            <h1>Find Trusted Local Services Near You</h1>
            <p>Connect with reliable local professionals for your everyday service needs — quickly, easily and conveniently.</p>
            <div className="lsf-hero-cta">
              <button className="lsf-btn lsf-btn-solid" onClick={() => scrollToSection("services")}>
                Find a Service
              </button>
              <button className="lsf-btn lsf-btn-outline" style={{ borderColor: COLORS.secondary, color: COLORS.secondary }} onClick={handleBecomeProvider}>
                Become a Service Provider
              </button>
            </div>
          </div>
          <div className="lsf-hero-image-wrap lsf-animate">
            <img
              src="https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
              alt="Service professional fixing a light bulb using a toolbox"
              loading="eager"
            />
            <div className="lsf-hero-badge">
              <div className="lsf-hero-badge-icon" aria-hidden="true">⭐</div>
              <div className="lsf-hero-badge-text">
                Trusted Pros
                <small>Near you, ready to help</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="lsf-section">
        <div className="lsf-section-inner">
          <div className="lsf-section-header">
            <h2>Our Services</h2>
            <p>Find trusted professionals for your everyday needs.</p>
            <div className="lsf-underline"></div>
          </div>
          <div className="lsf-services-grid">
            {SERVICES.map((service) => (
              <article key={service.name} className="lsf-service-card">
                <div className="lsf-service-img-wrap">
                  <img src={service.image} alt={service.alt} loading="lazy" />
                </div>
                <div className="lsf-service-body">
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <button className="lsf-service-btn" onClick={() => handleFindProvider(service.name)}>
                    Find Provider
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="lsf-section lsf-features-section">
        <div className="lsf-section-inner">
          <div className="lsf-section-header">
            <h2>Why Choose Local Service Finder?</h2>
            <p>Everything you need to find and manage local services conveniently.</p>
            <div className="lsf-underline"></div>
          </div>
          <div className="lsf-features-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="lsf-feature-card">
                <div className="lsf-feature-icon" aria-hidden="true">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="lsf-section">
        <div className="lsf-section-inner">
          <div className="lsf-section-header">
            <h2>How It Works</h2>
            <p>Find and book a local service provider in four simple steps.</p>
            <div className="lsf-underline"></div>
          </div>
          <div className="lsf-steps-grid">
            <div className="lsf-steps-line" aria-hidden="true"></div>
            {STEPS.map((step, i) => (
              <div key={step.title} className="lsf-step-card">
                <div className="lsf-step-circle">{i + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="about" className="lsf-section lsf-benefits-section">
        <div className="lsf-section-inner">
          <div className="lsf-section-header">
            <h2>Your Local Services, Simplified</h2>
            <p>Everything you need to connect with the right professionals.</p>
            <div className="lsf-underline"></div>
          </div>
          <div className="lsf-benefits-grid">
            {BENEFITS.map((benefit) => (
              <div key={benefit} className="lsf-benefit-item">
                <div className="lsf-benefit-check" aria-hidden="true">✓</div>
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="lsf-cta">
        <div className="lsf-cta-box">
          <div className="lsf-cta-deco1" aria-hidden="true"></div>
          <div className="lsf-cta-deco2" aria-hidden="true"></div>
          <h2>Need a Service? Find the Right Professional Today.</h2>
          <p>Discover reliable local service providers near you with Local Service Finder.</p>
          <div className="lsf-cta-buttons">
            <button className="lsf-btn lsf-btn-primary" onClick={() => scrollToSection("services")}>Find a Service</button>
            <button className="lsf-btn lsf-btn-outline" onClick={handleBecomeProvider}>Join as a Service Provider</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lsf-footer">
        <div className="lsf-footer-inner">
          <div className="lsf-footer-top">
            <div className="lsf-footer-brand">
              <h3>
                <span className="lsf-logo-icon" aria-hidden="true">🔧</span>
                Local Service Finder
              </h3>
              <p>Connecting you with trusted local professionals.</p>
            </div>

            <nav className="lsf-footer-links" aria-label="Footer navigation">
              <a onClick={() => scrollToSection("home")}>Home</a>
              <a onClick={() => scrollToSection("services")}>Services</a>
              <a onClick={() => scrollToSection("features")}>Features</a>
              <a onClick={() => scrollToSection("how")}>How It Works</a>
              <a onClick={() => scrollToSection("about")}>About</a>
              <a onClick={() => console.log("Contact clicked")}>Contact</a>
            </nav>

            <div className="lsf-footer-socials">
              <button className="lsf-social-btn" aria-label="Facebook" onClick={() => handleSocial("Facebook")}>f</button>
              <button className="lsf-social-btn" aria-label="Twitter" onClick={() => handleSocial("Twitter")}>t</button>
              <button className="lsf-social-btn" aria-label="Instagram" onClick={() => handleSocial("Instagram")}>ig</button>
              <button className="lsf-social-btn" aria-label="LinkedIn" onClick={() => handleSocial("LinkedIn")}>in</button>
            </div>
          </div>

          <div className="lsf-footer-bottom">
            © 2026 Local Service Finder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
