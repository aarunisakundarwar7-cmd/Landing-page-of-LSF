import React, { useState, useMemo } from "react";
import "./landing.css";

/* ================= MOCK DATA ================= */

const PROVIDERS = {
  Electrician: ["Marcus T.", "Ravi K.", "Daniel P.", "Sofia R."],
  Plumber: ["Alex M.", "Hugo L.", "Jenna S.", "Omar B."],
  "House Cleaning": ["Priya N.", "Lena H.", "Frankie W.", "Mia C."],
  Carpenter: ["Tomás G.", "Ethan B.", "Anika V.", "Hassan D."],
};

const RAW_REVIEWS = [
  {
    id: 1,
    user: "Olivia Carter",
    initials: "OC",
    color: "#9CD5FF",
    location: "Downtown, 1.2 miles away",
    service: "Plumber",
    provider: "Alex M.",
    rating: 5,
    timeAgo: "2 days ago",
    text: "Arrived within 30 minutes, fixed a leaking pipe under the kitchen sink quickly and cleanly. Alex explained what went wrong and prevented future issues. Fair price and very professional — exactly what you hope for when something urgent breaks.",
    helpful: 28,
    booking: "BK-10428",
  },
  {
    id: 2,
    user: "Marcus Hill",
    initials: "MH",
    color: "#7AAACE",
    location: "Riverside, 3.4 miles away",
    service: "Electrician",
    provider: "Marcus T.",
    rating: 4,
    timeAgo: "5 days ago",
    text: "Rewired our living-room outlets and installed new LED fixtures. Work was clean and tidy, finished a bit later than expected but communication throughout was excellent. Would book again for our next electrical job.",
    helpful: 14,
    booking: "BK-10315",
  },
  {
    id: 3,
    user: "Saanvi Patel",
    initials: "SP",
    color: "#9CD5FF",
    location: "Northgate, 1.8 miles away",
    service: "House Cleaning",
    provider: "Priya N.",
    rating: 5,
    timeAgo: "1 week ago",
    text: "Outstanding deep clean of our two-bedroom apartment. Every corner was spotless, even the baseboards and window tracks. Priya brought her own supplies and was incredibly courteous. Booking my next monthly visit already.",
    helpful: 41,
    booking: "BK-10276",
  },
  {
    id: 4,
    user: "Diego Romero",
    initials: "DR",
    color: "#7AAACE",
    location: "Westside, 4.1 miles away",
    service: "Carpenter",
    provider: "Tomás G.",
    rating: 5,
    timeAgo: "1 week ago",
    text: "Built a custom bookshelf to fit an awkward corner alcove. The craftsmanship is beautiful and the finish matches our existing furniture perfectly. Pricing was transparent and reasonable for the quality delivered.",
    helpful: 22,
    booking: "BK-10241",
  },
  {
    id: 5,
    user: "Aisha Bennett",
    initials: "AB",
    color: "#9CD5FF",
    location: "Uptown, 0.9 miles away",
    service: "Electrician",
    provider: "Ravi K.",
    rating: 5,
    timeAgo: "2 weeks ago",
    text: "Punctual, friendly and very knowledgeable. Diagnosed a tricky breaker-box issue that two other electricians had missed. Will absolutely use Ravi again for any future electrical work.",
    helpful: 33,
    booking: "BK-10188",
  },
  {
    id: 6,
    user: "Liam O'Connor",
    initials: "LO",
    color: "#7AAACE",
    location: "Lakeshore, 2.7 miles away",
    service: "Plumber",
    provider: "Hugo L.",
    rating: 3,
    timeAgo: "2 weeks ago",
    text: "Replaced a bathroom faucet. Work itself is fine but he arrived 40 minutes late without much notice. Quality of the install is good, communication could improve.",
    helpful: 9,
    booking: "BK-10144",
  },
  {
    id: 7,
    user: "Noor Khan",
    initials: "NK",
    color: "#9CD5FF",
    location: "Old Town, 1.5 miles away",
    service: "House Cleaning",
    provider: "Lena H.",
    rating: 4,
    timeAgo: "3 weeks ago",
    text: "Reliable and thorough. Lena is very punctual and pays attention to detail. Slightly missed a couple of spots behind furniture but overall a great experience.",
    helpful: 11,
    booking: "BK-10098",
  },
  {
    id: 8,
    user: "Felix Andersen",
    initials: "FA",
    color: "#7AAACE",
    location: "Harborview, 5.6 miles away",
    service: "Carpenter",
    provider: "Ethan B.",
    rating: 5,
    timeAgo: "3 weeks ago",
    text: "Repaired our deck and reinforced a sagging section. Ethan explained the structural problem clearly before starting and finished ahead of schedule. Highly recommended.",
    helpful: 19,
    booking: "BK-10023",
  },
  {
    id: 9,
    user: "Hana Watanabe",
    initials: "HW",
    color: "#9CD5FF",
    location: "Midtown, 1.0 miles away",
    service: "Plumber",
    provider: "Jenna S.",
    rating: 2,
    timeAgo: "1 month ago",
    text: "Was meant to fix a slow-draining kitchen sink. It still drains slowly. She was polite but the issue is not actually resolved. Hoping a follow-up visit fixes it properly.",
    helpful: 6,
    booking: "BK-09912",
  },
  {
    id: 10,
    user: "Theodore Brooks",
    initials: "TB",
    color: "#7AAACE",
    location: "South End, 4.3 miles away",
    service: "Electrician",
    provider: "Daniel P.",
    rating: 5,
    timeAgo: "1 month ago",
    text: "Installed outdoor lighting across our patio and walkway. Daniel suggested better placements than we originally planned and the result looks fantastic. Very professional from start to finish.",
    helpful: 17,
    booking: "BK-09847",
  },
  {
    id: 11,
    user: "Marisol Vega",
    initials: "MV",
    color: "#9CD5FF",
    location: "Garden District, 2.0 miles away",
    service: "House Cleaning",
    provider: "Frankie W.",
    rating: 5,
    timeAgo: "1 month ago",
    text: "Fantastic move-out clean. The landlord inspection passed with zero issues and we got our full deposit back. Frankie was attentive, efficient and friendly.",
    helpful: 25,
    booking: "BK-09806",
  },
  {
    id: 12,
    user: "Aarav Singh",
    initials: "AS",
    color: "#7AAACE",
    location: "North Park, 3.0 miles away",
    service: "Carpenter",
    provider: "Anika V.",
    rating: 4,
    timeAgo: "6 weeks ago",
    text: "Assembled a large custom wardrobe. Took slightly longer than estimated but the final result is solid and well-aligned. Anika cleaned up fully afterwards.",
    helpful: 13,
    booking: "BK-09712",
  },
  {
    id: 13,
    user: "Bethany Cole",
    initials: "BC",
    color: "#9CD5FF",
    location: "Cedar Hill, 6.1 miles away",
    service: "Electrician",
    provider: "Sofia R.",
    rating: 5,
    timeAgo: "2 months ago",
    text: "Replaced our breaker panel and added a couple of new circuits for a home office. Sofia labelled everything clearly and explained the new setup. Top-quality work.",
    helpful: 21,
    booking: "BK-09561",
  },
];

/* ================= ICONS ================= */

const StarIcon = ({ fraction = 1, size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
    <defs>
      <linearGradient id={`star-fill-${Math.round(fraction * 100)}`} x1="0" x2="1" y1="0" y2="0">
        <stop offset={`${Math.max(0, Math.min(1, fraction)) * 100}%`} stopColor="#F2B544" />
        <stop offset={`${Math.max(0, Math.min(1, fraction)) * 100}%`} stopColor="#E0E6EE" />
      </linearGradient>
    </defs>
    <path
      d="M12 2.5l2.95 6.96 7.55.78-5.7 5.16 1.65 7.46L12 19.78l-6.45 3.08L7.2 15.4 1.5 10.24l7.55-.78L12 2.5z"
      fill={`url(#star-fill-${Math.round(fraction * 100)})`}
      stroke="#E0A92E"
      strokeWidth="0.6"
    />
  </svg>
);

const ThumbsUpIcon = ({ size = 16, filled = false }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill={filled ? "#355872" : "none"}
    stroke="#355872"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M7 10v11" />
    <path d="M3 11h4v10H3z" />
    <path d="M7 21l5.7-1.1a2 2 0 0 0 1.6-1.5l1.4-5.2a2 2 0 0 0-1.95-2.5H10l.7-4.5a1.5 1.5 0 0 0-2.95-.6L7 10z" />
  </svg>
);

const FlagIcon = ({ size = 16 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="#5A7A93"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M5 21V4" />
    <path d="M5 4h12l-2 4 2 4H5" />
  </svg>
);

const SearchIcon = ({ size = 18 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#5A7A93" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="7" />
    <line x1="16.2" y1="16.2" x2="21" y2="21" />
  </svg>
);

const ChevronIcon = ({ size = 14 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#355872" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CloseIcon = ({ size = 22 }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="#355872" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M6 6l12 12" />
    <path d="M18 6L6 18" />
  </svg>
);

/* ================= COMPONENT ================= */

const NAV_LINKS = [
  { label: "Home", target: "home" },
  { label: "Services", target: "services" },
  { label: "Features", target: "features" },
  { label: "How It Works", target: "how-it-works" },
  { label: "About", target: "about" },
];

const CATEGORIES = ["All Services", "Electrician", "Plumber", "House Cleaning", "Carpenter"];
const SORT_OPTIONS = ["Most Recent", "Highest Rated", "Lowest Rated"];

export default function ReviewsPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All Services");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [helpfulMap, setHelpfulMap] = useState({});
  const [expandedMap, setExpandedMap] = useState({});
  const [reportedSet, setReportedSet] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ----- Write-a-Review form state ----- */
  const [draft, setDraft] = useState({
    rating: 0,
    service: "Electrician",
    provider: PROVIDERS.Electrician[0],
    booking: "",
    text: "",
  });

  /* ----- Summary stats ----- */
  const stats = useMemo(() => {
    const total = RAW_REVIEWS.length;
    const avg = (
      RAW_REVIEWS.reduce((a, r) => a + r.rating, 0) / total
    ).toFixed(1);
    const breakdown = [5, 4, 3, 2, 1].map((star) => {
      const count = RAW_REVIEWS.filter((r) => r.rating === star).length;
      return { star, count, percent: Math.round((count / total) * 100) };
    });
    return { total, avg, breakdown };
  }, []);

  /* ----- Filtered + sorted reviews ----- */
  const visibleReviews = useMemo(() => {
    let list = RAW_REVIEWS.slice();
    if (activeCategory !== "All Services") {
      list = list.filter((r) => r.service === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.text.toLowerCase().includes(q) ||
          r.user.toLowerCase().includes(q) ||
          r.provider.toLowerCase().includes(q) ||
          r.service.toLowerCase().includes(q)
      );
    }
    if (sortBy === "Highest Rated") {
      list.sort((a, b) => b.rating - a.rating || (a.id > b.id ? -1 : 1));
    } else if (sortBy === "Lowest Rated") {
      list.sort((a, b) => a.rating - b.rating || (a.id > b.id ? -1 : 1));
    } else {
      list.sort((a, b) => a.id - b.id);
    }
    return list;
  }, [activeCategory, search, sortBy]);

  const toggleHelpful = (id) => {
    setHelpfulMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpand = (id) => {
    setExpandedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const reportReview = (id) => {
    setReportedSet((prev) => ({ ...prev, [id]: true }));
    console.log("Review reported:", id);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (draft.rating === 0) {
      console.log("Please select a rating");
      return;
    }
    setSubmitting(true);
    console.log("Submitting review:", draft);
    setTimeout(() => {
      setSubmitting(false);
      setModalOpen(false);
      setDraft({
        rating: 0,
        service: "Electrician",
        provider: PROVIDERS.Electrician[0],
        booking: "",
        text: "",
      });
    }, 900);
  };

  return (
    <div className="rp-page">
      {/* ================= NAVBAR ================= */}
      <header className="rp-nav">
        <div className="rp-container">
          <nav className="rp-nav-inner" aria-label="Main navigation">
            <button
              type="button"
              className="rp-logo"
              onClick={() => console.log("Home clicked")}
              aria-label="Local Service Finder home"
            >
              <span className="rp-logo-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#355872" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="10.5" cy="10.5" r="6.5" />
                  <line x1="15.5" y1="15.5" x2="21" y2="21" />
                  <path d="M8 10.5h5" />
                  <path d="M10.5 8v5" />
                </svg>
              </span>
              Local Service Finder
            </button>

            <ul className="rp-nav-links">
              {NAV_LINKS.map((link) => (
                <li key={link.target}>
                  <button
                    type="button"
                    className="rp-nav-link"
                    onClick={() => console.log("Nav:", link.label)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>

            <div className="rp-nav-actions">
              <button type="button" className="rp-btn-login" onClick={() => console.log("Login clicked")}>
                Login
              </button>
              <button type="button" className="rp-btn-signup" onClick={() => console.log("Sign Up clicked")}>
                Sign Up
              </button>
            </div>

            <button
              type="button"
              className={`rp-hamburger ${menuOpen ? "open" : ""}`}
              aria-expanded={menuOpen}
              aria-controls="rp-mobile-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((open) => !open)}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </nav>
        </div>

        {menuOpen && (
          <div className="rp-mobile-menu" id="rp-mobile-menu">
            {NAV_LINKS.map((link) => (
              <button
                key={link.target}
                type="button"
                className="rp-mobile-link"
                onClick={() => {
                  console.log("Nav:", link.label);
                  setMenuOpen(false);
                }}
              >
                {link.label}
              </button>
            ))}
            <div className="rp-mobile-actions">
              <button type="button" className="rp-btn-login" onClick={() => console.log("Login clicked")}>
                Login
              </button>
              <button type="button" className="rp-btn-signup" onClick={() => console.log("Sign Up clicked")}>
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section className="rp-hero">
        <div className="rp-container rp-hero-inner">
          <span className="rp-hero-eyebrow">
            <span aria-hidden="true">★</span>
            Trusted local feedback from real customers
          </span>
          <h1 className="rp-hero-title">Community Ratings &amp; Feedback</h1>
          <p className="rp-hero-subtitle">
            See real experiences from homeowners in your area.
          </p>
          <div className="rp-hero-actions">
            <button type="button" className="rp-btn-cta" onClick={() => setModalOpen(true)}>
              Leave a Review
            </button>
            <button type="button" className="rp-btn-ghost" onClick={() => console.log("Browse all clicked")}>
              Browse by Service
            </button>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="rp-stats">
        <div className="rp-container">
          <div className="rp-stats-card">
            <div className="rp-stat-main">
              <div className="rp-stat-eyebrow">Overall Rating</div>
              <div className="rp-stat-score">{stats.avg}</div>
              <div className="rp-stat-stars">
                {[1, 2, 3, 4, 5].map((s) => (
                  <StarIcon key={s} fraction={Math.min(1, Math.max(0, parseFloat(stats.avg) - (s - 1)))} size={22} />
                ))}
              </div>
              <span className="rp-stat-tag">
                Based on {RAW_REVIEWS.length.toLocaleString()} verified bookings
              </span>
            </div>

            <div className="rp-stat-divider" aria-hidden="true"></div>

            <div className="rp-stat-breakdown">
              {stats.breakdown.map((row) => (
                <div className="rp-bar-row" key={row.star}>
                  <span className="rp-bar-label">
                    {row.star} <StarIcon size={11} fraction={1} />
                  </span>
                  <div className="rp-bar-track">
                    <div className="rp-bar-fill" style={{ width: `${row.percent}%` }}></div>
                  </div>
                  <span className="rp-bar-value">{row.percent}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ================= FILTERS ================= */}
      <section className="rp-filters">
        <div className="rp-container">
          <div className="rp-filter-row">
            <div className="rp-search">
              <span className="rp-search-icon"><SearchIcon /></span>
              <input
                type="text"
                placeholder="Search reviews — try “leaking pipe” or “punctual”"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search reviews"
              />
            </div>

            <div className="rp-pills" role="tablist" aria-label="Filter by service">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === cat}
                  className={`rp-pill ${activeCategory === cat ? "active" : ""}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="rp-sort">
              <button
                type="button"
                className="rp-sort-btn"
                onClick={() => setSortOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={sortOpen}
              >
                Sort: {sortBy} <ChevronIcon />
              </button>
              {sortOpen && (
                <div className="rp-sort-menu" role="listbox">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      role="option"
                      aria-selected={sortBy === opt}
                      className={`rp-sort-option ${sortBy === opt ? "selected" : ""}`}
                      onClick={() => {
                        setSortBy(opt);
                        setSortOpen(false);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ================= REVIEWS GRID ================= */}
      <section className="rp-reviews" id="reviews">
        <div className="rp-container">
          <div className="rp-reviews-grid">
            {visibleReviews.length === 0 ? (
              <div className="rp-empty">
                <h3>No reviews match your filters yet</h3>
                <p>Try a different keyword, service or sort option.</p>
              </div>
            ) : (
              visibleReviews.map((review) => {
                const isVoted = !!helpfulMap[review.id];
                const isExpanded = !!expandedMap[review.id];
                const isReported = !!reportedSet[review.id];
                const isLong = review.text.length > 200;
                const textCombined = isExpanded || !isLong ? review.text : review.text;
                return (
                  <article className="rp-card" key={review.id}>
                    <div className="rp-card-head">
                      <div
                        className="rp-avatar"
                        style={{ backgroundColor: review.color }}
                        aria-hidden="true"
                      >
                        {review.initials}
                      </div>
                      <div className="rp-card-meta">
                        <div className="rp-card-name-row">
                          <span className="rp-card-name">{review.user}</span>
                          <span className="rp-verified" title={`Booking ID ${review.booking}`}>
                            <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#2E8B57" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                            Verified Booking
                          </span>
                        </div>
                        <span className="rp-card-location" aria-label={`Location: ${review.location}`}>
                          <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#6D8BA3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M12 21s-7-5.6-7-11a7 7 0 0 1 14 0c0 5.4-7 11-7 11z" />
                            <circle cx="12" cy="10" r="2.5" />
                          </svg>
                          {review.location}
                        </span>
                      </div>
                    </div>

                    <span className="rp-card-pill">
                      Booked {review.service} — {review.provider}
                    </span>

                    <div className="rp-card-rating-row">
                      <div className="rp-card-stars" aria-label={`${review.rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((s) => (
                          <StarIcon
                            key={s}
                            fraction={s <= review.rating ? 1 : 0}
                            size={16}
                          />
                        ))}
                      </div>
                      <span className="rp-card-time">{review.timeAgo}</span>
                    </div>

                    <p className={`rp-card-text ${isLong && !isExpanded ? "short" : ""}`}>
                      {textCombined}
                    </p>

                    {isLong && (
                      <button type="button" className="rp-readmore" onClick={() => toggleExpand(review.id)}>
                        {isExpanded ? "Show less" : "Read more"}
                      </button>
                    )}

                    <div className="rp-card-actions">
                      <button
                        type="button"
                        className={`rp-helpful ${isVoted ? "voted" : ""}`}
                        onClick={() => toggleHelpful(review.id)}
                        aria-pressed={isVoted}
                      >
                        <ThumbsUpIcon size={14} filled={isVoted} />
                        Helpful · {review.helpful + (isVoted ? 1 : 0)}
                      </button>
                      <button
                        type="button"
                        className={`rp-report ${isReported ? "reported" : ""}`}
                        onClick={() => !isReported && reportReview(review.id)}
                        aria-label="Report this review"
                        disabled={isReported}
                      >
                        <FlagIcon />
                        {isReported ? "Reported" : "Report"}
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* ================= MODAL ================= */}
      {modalOpen && (
        <div className="rp-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="rp-modal-title">
          <form className="rp-modal" onSubmit={handleSubmitReview}>
            <div className="rp-modal-head">
              <h2 className="rp-modal-title" id="rp-modal-title">Leave a Review</h2>
              <button
                type="button"
                className="rp-modal-close"
                onClick={() => setModalOpen(false)}
                aria-label="Close dialog"
              >
                <CloseIcon />
              </button>
            </div>

            <div className="rp-field">
              <label className="rp-field-label">Your Rating</label>
              <div className="rp-rate-row" role="radiogroup" aria-label="Star rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    role="radio"
                    aria-checked={draft.rating === s}
                    className="rp-rate-btn"
                    onClick={() => setDraft((d) => ({ ...d, rating: s }))}
                    onMouseEnter={() => setDraft((d) => ({ ...d, rating: Math.max(d.rating, s) }))}
                    aria-label={`${s} star${s > 1 ? "s" : ""}`}
                  >
                    <StarIcon fraction={s <= draft.rating ? 1 : 0} size={28} />
                  </button>
                ))}
              </div>
            </div>

            <div className="rp-field">
              <label className="rp-field-label" htmlFor="rp-service">Service Type</label>
              <select
                id="rp-service"
                value={draft.service}
                onChange={(e) => setDraft((d) => ({ ...d, service: e.target.value, provider: PROVIDERS[e.target.value][0] }))}
              >
                {Object.keys(PROVIDERS).map((svc) => (
                  <option key={svc} value={svc}>{svc}</option>
                ))}
              </select>
            </div>

            <div className="rp-field">
              <label className="rp-field-label" htmlFor="rp-provider">Provider</label>
              <select
                id="rp-provider"
                value={draft.provider}
                onChange={(e) => setDraft((d) => ({ ...d, provider: e.target.value }))}
              >
                {PROVIDERS[draft.service].map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
            </div>

            <div className="rp-field">
              <label className="rp-field-label" htmlFor="rp-booking">Booking ID</label>
              <input
                id="rp-booking"
                type="text"
                placeholder="e.g. BK-12345"
                value={draft.booking}
                onChange={(e) => setDraft((d) => ({ ...d, booking: e.target.value }))}
              />
            </div>

            <div className="rp-field">
              <label className="rp-field-label" htmlFor="rp-text">Your Review</label>
              <textarea
                id="rp-text"
                placeholder="Share details about your experience..."
                value={draft.text}
                onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
              />
            </div>

            <div className="rp-modal-actions">
              <button type="button" className="rp-btn-cancel" onClick={() => setModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="rp-btn-submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <span className="rp-spinner" aria-hidden="true"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Review"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= FOOTER ================= */}
      <footer className="rp-footer">
        <div className="rp-container">
          <div className="rp-footer-inner">
            <div className="rp-footer-brand">
              <div className="rp-footer-logo">
                <span className="rp-logo-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#355872" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="10.5" cy="10.5" r="6.5" />
                    <line x1="15.5" y1="15.5" x2="21" y2="21" />
                    <path d="M8 10.5h5" />
                    <path d="M10.5 8v5" />
                  </svg>
                </span>
                Local Service Finder
              </div>
              <p className="rp-footer-tagline">
                Connecting you with trusted local professionals.
              </p>
            </div>

            <nav aria-label="Footer navigation">
              <h3 className="rp-footer-nav-title">Quick Links</h3>
              <ul className="rp-footer-links">
                {NAV_LINKS.map((link) => (
                  <li key={link.target}>
                    <button
                      type="button"
                      className="rp-footer-link"
                      onClick={() => console.log("Footer nav:", link.label)}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
                <li>
                  <button type="button" className="rp-footer-link" onClick={() => console.log("Contact clicked")}>
                    Contact
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          <div className="rp-footer-bottom">
            © 2026 Local Service Finder. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
