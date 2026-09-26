import React, { useState, useMemo } from "react";
import "./review page.css";

const REVIEWS = [
  { id: 1, name: "Olivia Carter", service: "Plumber", rating: 5, timeAgo: "2 days ago", text: "Fixed a leaking pipe quickly and explained everything clearly. Fair price and very professional.", helpful: 28 },
  { id: 2, name: "Marcus Hill", service: "Electrician", rating: 4, timeAgo: "5 days ago", text: "Rewired our outlets and installed new fixtures. Clean work, finished a bit late but great communication.", helpful: 14 },
  { id: 3, name: "Saanvi Patel", service: "House Cleaning", rating: 5, timeAgo: "1 week ago", text: "Outstanding deep clean, even the baseboards were spotless. Booking again next month.", helpful: 41 },
  { id: 4, name: "Diego Romero", service: "Carpenter", rating: 5, timeAgo: "1 week ago", text: "Built a custom bookshelf for an awkward corner. Beautiful craftsmanship, transparent pricing.", helpful: 22 },
  { id: 5, name: "Liam O'Connor", service: "Plumber", rating: 3, timeAgo: "2 weeks ago", text: "Faucet install was fine, but he arrived 40 minutes late without much notice.", helpful: 9 },
  { id: 6, name: "Hana Watanabe", service: "Plumber", rating: 2, timeAgo: "1 month ago", text: "Sink still drains slowly after the visit. Polite, but the issue wasn't actually fixed.", helpful: 6 },
];

const SERVICES = ["All Services", "Electrician", "Plumber", "House Cleaning", "Carpenter"];

function Stars({ rating }) {
  return <span className="stars">{"★".repeat(rating)}{"☆".repeat(5 - rating)}</span>;
}

export default function ReviewsPage() {
  const [service, setService] = useState("All Services");
  const [sort, setSort] = useState("recent");
  const [search, setSearch] = useState("");
  const [helpful, setHelpful] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ rating: 0, service: "Electrician", text: "" });
  const [reviews, setReviews] = useState(REVIEWS);

  const avg = useMemo(
    () => (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1),
    [reviews]
  );

  const visible = useMemo(() => {
    let list = reviews.filter(
      (r) =>
        (service === "All Services" || r.service === service) &&
        r.text.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "high") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "low") list = [...list].sort((a, b) => a.rating - b.rating);
    return list;
  }, [reviews, service, search, sort]);

  const toggleHelpful = (id) => setHelpful((h) => ({ ...h, [id]: !h[id] }));

  const submitReview = (e) => {
    e.preventDefault();
    if (!draft.rating || !draft.text.trim()) return;
    setReviews((r) => [
      { id: Date.now(), name: "You", service: draft.service, rating: draft.rating, timeAgo: "just now", text: draft.text, helpful: 0 },
      ...r,
    ]);
    setDraft({ rating: 0, service: "Electrician", text: "" });
    setShowForm(false);
  };

  return (
    <div>
      <nav className="nav">
        <span className="logo">Local Service Finder</span>
        <div>
          <a href="#reviews">Reviews</a>
          <a href="#">About</a>
        </div>
      </nav>

      <section className="hero">
        <h1>Community Ratings &amp; Feedback</h1>
        <p>Real experiences from homeowners in your area.</p>
        <button className="btn" onClick={() => setShowForm((s) => !s)}>
          {showForm ? "Cancel" : "Leave a Review"}
        </button>
      </section>

      <div className="stats">
        <strong>{avg}</strong> ★ average — based on {reviews.length} reviews
      </div>

      {showForm && (
        <form className="review-form" onSubmit={submitReview}>
          <div className="stars-input">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                type="button"
                key={s}
                className={s <= draft.rating ? "on" : ""}
                onClick={() => setDraft((d) => ({ ...d, rating: s }))}
              >
                ★
              </button>
            ))}
          </div>
          <select
            value={draft.service}
            onChange={(e) => setDraft((d) => ({ ...d, service: e.target.value }))}
          >
            {SERVICES.slice(1).map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <textarea
            placeholder="Share details about your experience..."
            rows={3}
            value={draft.text}
            onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
          />
          <button className="btn" type="submit">Submit Review</button>
        </form>
      )}

      <div className="filters">
        <input
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={service} onChange={(e) => setService(e.target.value)}>
          {SERVICES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Most Recent</option>
          <option value="high">Highest Rated</option>
          <option value="low">Lowest Rated</option>
        </select>
      </div>

      <div className="reviews" id="reviews">
        {visible.length === 0 ? (
          <div className="empty">No reviews match your filters.</div>
        ) : (
          visible.map((r) => (
            <div className="card" key={r.id}>
              <div className="card-top">
                <span className="name">{r.name}</span>
                <span className="service">{r.service}</span>
              </div>
              <Stars rating={r.rating} />
              <p>{r.text}</p>
              <div className="card-bottom">
                <span>{r.timeAgo}</span>
                <button
                  className={`helpful-btn ${helpful[r.id] ? "voted" : ""}`}
                  onClick={() => toggleHelpful(r.id)}
                >
                  👍 Helpful · {r.helpful + (helpful[r.id] ? 1 : 0)}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <footer>© 2026 Local Service Finder</footer>
    </div>
  );
}
