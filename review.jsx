import React, { useState, useMemo, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "./review.css";

/* ------------------------------------------------------------------
 * API layer
 * Mirrors src/services/api.js: VITE_API_URL base + Bearer token from
 * localStorage. If your api.js already exports a request helper, replace
 * `request` below with it and delete this block.
 *
 * Endpoints this page expects from the Spring Boot backend:
 *   GET  /api/categories                       -> ServiceCategory[]  {id, name}
 *   GET  /api/reviews?categoryId=&sort=&q=&page=&size=
 *                                              -> Page<ReviewResponse>
 *   GET  /api/reviews/summary?categoryId=      -> {average, total, counts:{1..5}}
 *   GET  /api/bookings/my?status=COMPLETED     -> BookingResponse[] (CUSTOMER only)
 *   POST /api/reviews  {bookingId, rating, comment}  -> ReviewResponse
 *
 * ReviewResponse DTO:
 *   { id, rating, comment, createdAt, customerName,
 *     providerId, providerName, serviceName, categoryName, bookingId }
 * ------------------------------------------------------------------ */
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const PAGE_SIZE = 6;

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      message = body.message || body.error || message;
    } catch {
      /* non-JSON error body */
    }
    throw new Error(message);
  }
  return res.status === 204 ? null : res.json();
}

const reviewApi = {
  categories: () => request("/api/categories"),
  list: (params) => request(`/api/reviews?${new URLSearchParams(params)}`),
  summary: (params) => request(`/api/reviews/summary?${new URLSearchParams(params)}`),
  myCompletedBookings: () => request("/api/bookings/my?status=COMPLETED"),
  create: (payload) => request("/api/reviews", { method: "POST", body: JSON.stringify(payload) }),
};

/* Read the role claim out of the JWT (roles: CUSTOMER / PROVIDER / ADMIN). */
function getRole() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    const role = payload.role || (payload.roles && payload.roles[0]) || payload.authorities?.[0];
    return typeof role === "string" ? role.replace("ROLE_", "") : null;
  } catch {
    return null;
  }
}

function timeAgo(iso) {
  if (!iso) return "";
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "just now";
  const units = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [name, secs] of units) {
    const n = Math.floor(diff / secs);
    if (n >= 1) return `${n} ${name}${n > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

function Stars({ rating }) {
  const r = Math.round(rating || 0);
  return (
    <span className="stars" aria-label={`${r} out of 5 stars`}>
      {"★".repeat(r)}
      {"☆".repeat(5 - r)}
    </span>
  );
}

export default function ReviewsPage() {
  const role = getRole();
  const isCustomer = role === "CUSTOMER";

  // server data
  const [categories, setCategories] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [summary, setSummary] = useState({ average: 0, total: 0, counts: {} });
  const [totalPages, setTotalPages] = useState(0);
  const [eligibleBookings, setEligibleBookings] = useState([]);

  // ui state
  const [categoryId, setCategoryId] = useState("");
  const [sort, setSort] = useState("recent");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState(""); // debounced search
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // form state
  const [showForm, setShowForm] = useState(false);
  const [draft, setDraft] = useState({ bookingId: "", rating: 0, comment: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  // debounce search box -> query
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(0);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  // categories (once)
  useEffect(() => {
    reviewApi.categories().then(setCategories).catch(() => setCategories([]));
  }, []);

  // reviews + summary whenever filters change
  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = { sort, page, size: PAGE_SIZE };
      if (categoryId) params.categoryId = categoryId;
      if (query) params.q = query;
      const [pageData, sum] = await Promise.all([
        reviewApi.list(params),
        reviewApi.summary(categoryId ? { categoryId } : {}),
      ]);
      setReviews(pageData.content || []);
      setTotalPages(pageData.totalPages || 0);
      setSummary(sum || { average: 0, total: 0, counts: {} });
    } catch (e) {
      setError(e.message || "Could not load reviews.");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, sort, query, page]);

  useEffect(() => {
    load();
  }, [load]);

  // completed bookings the customer can review
  const loadEligible = useCallback(async () => {
    if (!isCustomer) return;
    try {
      const bookings = await reviewApi.myCompletedBookings();
      setEligibleBookings(bookings.filter((b) => !b.reviewed));
    } catch {
      setEligibleBookings([]);
    }
  }, [isCustomer]);

  useEffect(() => {
    loadEligible();
  }, [loadEligible]);

  const bookingLabel = (b) =>
    `${b.serviceName || b.service?.name || "Service"} — ${
      b.providerName || b.provider?.name || "Provider"
    }${b.date ? ` (${b.date})` : ""}`;

  const openForm = () => {
    setFormError("");
    setNotice("");
    setShowForm((s) => !s);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setFormError("");
    if (!draft.bookingId) return setFormError("Select a completed booking to review.");
    if (!draft.rating) return setFormError("Please choose a star rating.");
    if (!draft.comment.trim()) return setFormError("Please share a few details.");

    setSubmitting(true);
    try {
      await reviewApi.create({
        bookingId: Number(draft.bookingId),
        rating: draft.rating,
        comment: draft.comment.trim(),
      });
      setDraft({ bookingId: "", rating: 0, comment: "" });
      setShowForm(false);
      setNotice("Thanks! Your review has been posted.");
      setPage(0);
      await Promise.all([load(), loadEligible()]);
    } catch (err) {
      setFormError(err.message || "Could not submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  // rating distribution bars
  const distribution = useMemo(() => {
    const total = summary.total || 0;
    return [5, 4, 3, 2, 1].map((star) => {
      const count = summary.counts?.[star] ?? summary.counts?.[String(star)] ?? 0;
      return { star, count, pct: total ? Math.round((count / total) * 100) : 0 };
    });
  }, [summary]);

  const avg = Number(summary.average || 0).toFixed(1);

  return (
    <div>
      <nav className="nav">
        <span className="logo">Local Service Finder</span>
        <div>
          <Link to="/services">Services</Link>
          <a href="#reviews">Reviews</a>
          {!role && <Link to="/login">Login</Link>}
        </div>
      </nav>

      <section className="hero">
        <h1>Community Ratings &amp; Feedback</h1>
        <p>Real experiences from customers of verified local providers.</p>
        {isCustomer ? (
          <button className="btn" onClick={openForm}>
            {showForm ? "Cancel" : "Leave a Review"}
          </button>
        ) : (
          <p className="hint">
            {role
              ? "Only customers with a completed booking can leave a review."
              : <>Please <Link to="/login">log in</Link> as a customer to leave a review.</>}
          </p>
        )}
      </section>

      {notice && <div className="banner success">{notice}</div>}

      <div className="stats">
        <div className="stats-main">
          <strong>{avg}</strong> ★ average — based on {summary.total || 0} review
          {summary.total === 1 ? "" : "s"}
        </div>
        {summary.total > 0 && (
          <div className="dist">
            {distribution.map((d) => (
              <div className="dist-row" key={d.star}>
                <span>{d.star} ★</span>
                <div className="dist-bar">
                  <div className="dist-fill" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="dist-count">{d.count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && isCustomer && (
        <form className="review-form" onSubmit={submitReview}>
          {eligibleBookings.length === 0 ? (
            <p className="form-empty">
              You have no completed bookings waiting for a review. Once a provider marks a
              booking as COMPLETED, you can review it here.
            </p>
          ) : (
            <>
              <select
                value={draft.bookingId}
                onChange={(e) => setDraft((d) => ({ ...d, bookingId: e.target.value }))}
              >
                <option value="">Select a completed booking…</option>
                {eligibleBookings.map((b) => (
                  <option key={b.id} value={b.id}>
                    {bookingLabel(b)}
                  </option>
                ))}
              </select>

              <div className="stars-input" role="radiogroup" aria-label="Rating">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    type="button"
                    key={s}
                    className={s <= draft.rating ? "on" : ""}
                    aria-label={`${s} star${s > 1 ? "s" : ""}`}
                    onClick={() => setDraft((d) => ({ ...d, rating: s }))}
                  >
                    ★
                  </button>
                ))}
              </div>

              <textarea
                placeholder="Share details about your experience..."
                rows={3}
                maxLength={1000}
                value={draft.comment}
                onChange={(e) => setDraft((d) => ({ ...d, comment: e.target.value }))}
              />
              {formError && <div className="form-error">{formError}</div>}
              <button className="btn" type="submit" disabled={submitting}>
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </>
          )}
        </form>
      )}

      <div className="filters">
        <input
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(0);
          }}
        >
          <option value="">All Services</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
        >
          <option value="recent">Most Recent</option>
          <option value="high">Highest Rated</option>
          <option value="low">Lowest Rated</option>
        </select>
      </div>

      <div className="reviews" id="reviews">
        {loading ? (
          <div className="empty">Loading reviews…</div>
        ) : error ? (
          <div className="empty error">
            {error} <button className="link-btn" onClick={load}>Retry</button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="empty">No reviews match your filters.</div>
        ) : (
          reviews.map((r) => (
            <div className="card" key={r.id}>
              <div className="card-top">
                <span className="name">{r.customerName}</span>
                <span className="service">{r.categoryName || r.serviceName}</span>
              </div>
              <Stars rating={r.rating} />
              <p>{r.comment}</p>
              <div className="card-bottom">
                <span>{timeAgo(r.createdAt)}</span>
                {r.providerName && (
                  <span className="provider">
                    for{" "}
                    {r.providerId ? (
                      <Link to={`/providers/${r.providerId}`}>{r.providerName}</Link>
                    ) : (
                      r.providerName
                    )}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && !loading && (
        <div className="pager">
          <button className="btn" disabled={page === 0} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            className="btn"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}

      <footer>© 2026 Local Service Finder</footer>
    </div>
  );
}
