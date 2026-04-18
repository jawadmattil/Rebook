"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Profile() {
  const [userName, setUserName] = useState("John Doe");
  const [isDemoUser, setIsDemoUser] = useState(false);
  const [userBooks, setUserBooks] = useState([]);
  const [userPurchases, setUserPurchases] = useState([]);
  const [userReviews, setUserReviews] = useState([]);
  const [reviewingBook, setReviewingBook] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  
  // Dashboard Action State
  const [editingBook, setEditingBook] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", author: "", price: "", condition: "", category: "", status: "", photos: [] });

  // Profile Action State
  const [userAvatar, setUserAvatar] = useState("");
  const [userBio, setUserBio] = useState("Welcome to ReBook!");
  const [userLocation, setUserLocation] = useState("");
  const [userJoined, setUserJoined] = useState("Recently");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: "", bio: "", location: "", avatar: "" });
  const [isLocating, setIsLocating] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      const res = await fetch(`/api/orders?id=${orderId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        alert("Order cancelled successfully.");
        refreshUserBooks();
      } else {
        alert(data.error);
      }
    } catch(e) {
      console.error("Cancel order error:", e);
      alert("Failed to cancel order.");
    }
  };

  const calculateTotalEarnings = () => {
    let total = 0;
    userBooks.filter(b => b.status === "Sold").forEach(b => {
      const p = typeof b.price === 'number' ? b.price : parseFloat(String(b.price || "").replace(/[^0-9.-]+/g,"")) || 0;
      total += p * 0.98;
    });
    if (isDemoUser) total += 5400; // Mock demo earnings
    return total.toFixed(2);
  };

  const refreshUserBooks = async (overrideName) => {
    try {
      const u = JSON.parse(localStorage.getItem("rebook_user") || "{}");
      const targetName = overrideName || u.name || userName;
      
      const res = await fetch(`/api/books?seller=${encodeURIComponent(targetName)}`);
      const data = await res.json();
      if (data.success) {
        setUserBooks(data.data);
      }
      
      const reviewsRes = await fetch(`/api/reviews?seller=${encodeURIComponent(targetName)}`);
      const reviewsData = await reviewsRes.json();
      if (reviewsData.success) {
        setUserReviews(reviewsData.data);
      }
      
      const ordersRes = await fetch(`/api/orders?buyer=${encodeURIComponent(targetName)}`);
      const ordersData = await ordersRes.json();
      if (ordersData.success) {
        setUserPurchases(ordersData.data);
      }
    } catch(e) {
      console.error("Error refreshing profile data:", e);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const bookId = editingBook?._id || editingBook?.id;
      const res = await fetch(`/api/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editForm,
          price: parseFloat(editForm.price)
        })
      });
      const data = await res.json();
      if (data.success) {
        refreshUserBooks();
        setEditingBook(null);
      } else {
        alert(data.error);
      }
    } catch(e) { console.error(e); }
  };

  const handleDeleteBook = async (id) => {
    if (!id) {
       alert("Cannot delete mock demo books.");
       return;
    }
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) refreshUserBooks();
    } catch(e) { console.error(e); }
  };

  const handleSubmitReview = async () => {
    if (!reviewForm.comment.trim()) {
      return alert("Please leave a comment.");
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: reviewingBook._id || reviewingBook.id,
          seller: reviewingBook.seller,
          buyer: userName,
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
      });

      const data = await res.json();
      
      if (data.success) {
        setReviewingBook(null);
        setReviewForm({ rating: 5, comment: "" });
        alert("Thank you for your review!");
        refreshUserBooks();
      } else {
        alert(data.error);
      }
    } catch(e) {
      console.error("Review submit error:", e);
      alert("Failed to submit review.");
    }
  };

  const handleFetchLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      setIsLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await res.json();
        const cityInfo = data.address.city || data.address.town || data.address.village || data.address.state || "Detected Location";
        setProfileForm({ ...profileForm, location: cityInfo });
      } catch (err) {
        alert("Could not fetch location details. You can type it manually.");
      }
      setIsLocating(false);
    }, () => {
      alert("Location access denied or unavailable.");
      setIsLocating(false);
    });
  };

  const handleSaveProfile = async () => {
    try {
      const u = JSON.parse(localStorage.getItem("rebook_user") || "{}");
      if (!u.id && !u._id) {
         // Fallback for mock users
         setUserName(profileForm.name);
         setUserBio(profileForm.bio);
         setUserLocation(profileForm.location);
         setUserAvatar(profileForm.avatar);
         setIsEditingProfile(false);
         return;
      }

      const userId = u.id || u._id;
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileForm)
      });
      const data = await res.json();
      
      if (data.success) {
        setUserName(data.user.name);
        setUserBio(data.user.bio);
        setUserLocation(data.user.location);
        setUserAvatar(data.user.avatar);
        localStorage.setItem("rebook_user", JSON.stringify(data.user));
        alert("Profile updated successfully!");
      } else {
        alert(data.error);
      }
    } catch(e) {
      console.error("Profile update error:", e);
      alert("Failed to update profile.");
    }
    
    setIsEditingProfile(false);
  };

  useEffect(() => {
    const user = localStorage.getItem("rebook_user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.name) setUserName(parsed.name);
        if (parsed.isDemo) setIsDemoUser(true);
        if (parsed.bio) setUserBio(parsed.bio);
        if (parsed.location) setUserLocation(parsed.location);
        if (parsed.avatar) setUserAvatar(parsed.avatar);
        
        let usersObj = JSON.parse(localStorage.getItem("rebook_users") || "{}");
        if (parsed.email && usersObj[parsed.email] && usersObj[parsed.email].joinedAt) {
          setUserJoined(usersObj[parsed.email].joinedAt);
        }
        
        refreshUserBooks(parsed.name);
      } catch (e) {}
    }
  }, []);

  const initials = userName
    .split(" ")
    .map(n => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Navigation */}
      <nav className="glass" style={{ padding: "1rem 0", position: 'sticky', top: 0, zIndex: 50 }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>ReBook</Link>
          
          <button 
            className="hamburger" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>

          <div className={`nav-overlay ${mobileMenuOpen ? 'open' : ''}`} onClick={() => setMobileMenuOpen(false)}></div>

          <div className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <Link href="/" style={{ color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={() => setMobileMenuOpen(false)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </Link>
            <Link href="/messages" style={{ 
              color: "var(--foreground)", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.5rem", 
              textDecoration: "none",
              fontWeight: 600
            }} onClick={() => setMobileMenuOpen(false)}>
               <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                 <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
               </svg>
               Messages
            </Link>
            <Link href="/" className="btn btn-secondary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }} onClick={() => { setMobileMenuOpen(false); localStorage.removeItem("rebook_user"); }}>Sign Out</Link>
          </div>
        </div>
      </nav>

      <div className="container section-padding">
        <div style={{ display: "flex", gap: "3rem", flexDirection: "column" }}>
          
          {/* Profile Header */}
          <div className="glass" style={{ padding: "4rem", borderRadius: "2rem", display: "flex", gap: "3rem", alignItems: "center", flexWrap: "wrap", background: "var(--surface)" }}>
            <div style={{ 
              width: "160px", 
              height: "160px", 
              borderRadius: "50%", 
              backgroundImage: userAvatar ? `url(${userAvatar})` : "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "4rem",
              fontWeight: 800,
              overflow: "hidden",
              border: "6px solid var(--surface)",
              boxShadow: "0 20px 40px -10px rgba(0,0,0,0.2)"
            }}>
              {!userAvatar && initials}
            </div>
            <div style={{ flex: 1, minWidth: "300px" }}>
              <h1 style={{ fontSize: "3.5rem", fontWeight: 900, marginBottom: "0.5rem" }}>{userName}</h1>
              {isDemoUser ? (
                <>
                  <p style={{ fontSize: "1.25rem", opacity: 0.8, marginBottom: "1.5rem" }}>Avid reader & sci-fi enthusiast based in Mumbai, MH</p>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "1rem", fontWeight: 600 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-primary-light)" }}>
                      ★ 4.9 (12 reviews)
                    </span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span style={{ opacity: 0.7 }}>Joined 2024</span>
                  </div>
                </>
              ) : (
                <>
                  <p style={{ fontSize: "1.25rem", opacity: 0.8, marginBottom: "1.5rem" }}>{userBio}</p>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "1rem", fontWeight: 600 }}>
                    {userLocation && (
                       <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--color-secondary)" }}>
                         📍 {userLocation}
                       </span>
                    )}
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem", opacity: 0.7 }}>
                      ★ No reviews yet
                    </span>
                    <span style={{ opacity: 0.5 }}>•</span>
                    <span style={{ opacity: 0.7 }}>Joined {userJoined}</span>
                  </div>
                </>
              )}
            </div>
            <div>
              <button 
                onClick={() => {
                  setProfileForm({ name: userName, bio: userBio, location: userLocation, avatar: userAvatar });
                  setIsEditingProfile(true);
                }} 
                className="btn btn-primary"
                style={{ padding: "1rem 2rem", fontSize: "1rem" }}
              >
                Edit Profile
              </button>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 2.5fr", gap: "3rem" }}>
            
            {/* Sidebar Stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="glass" style={{ padding: "2rem", borderRadius: "1.5rem", background: "var(--surface)" }}>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem" }}>Account Overview</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ opacity: 0.7 }}>Books Sold</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>{userBooks.filter(b => b.status === "Sold").length + (isDemoUser ? 18 : 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ opacity: 0.7 }}>Books Bought</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>{userPurchases.length + (isDemoUser ? 34 : 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ opacity: 0.7 }}>Active Items</span>
                    <span style={{ fontWeight: 800, fontSize: "1.25rem" }}>{userBooks.filter(b => b.status === "Active").length + (isDemoUser ? 3 : 0)}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem", alignItems: "center" }}>
                    <span style={{ fontWeight: 700 }}>Total Earned</span>
                    <span style={{ fontWeight: 900, color: "var(--color-primary)", fontSize: "1.75rem" }}>₹{calculateTotalEarnings()}</span>
                  </div>
                </div>
              </div>

              <div className="glass" style={{ padding: "1.5rem", borderRadius: "1rem" }}>
                <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1rem" }}>Recent Reviews</h3>
                {userReviews.length > 0 ? (
                  userReviews.map((r, i) => (
                    <div key={i} style={{ paddingBottom: "1rem", borderBottom: i !== userReviews.length -1 ? "1px solid var(--border)" : "none", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 600 }}>{r.buyer}</span>
                        <span style={{ color: "var(--color-accent)" }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>
                      </div>
                      <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>"{r.comment}"</p>
                    </div>
                  ))
                ) : isDemoUser ? (
                  <>
                    <div style={{ paddingBottom: "1rem", borderBottom: "1px solid var(--border)", marginBottom: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 600 }}>Alice M.</span>
                        <span style={{ color: "var(--color-accent)" }}>★★★★★</span>
                      </div>
                      <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>"Book was in perfect condition exactly as described. Fast response!"</p>
                    </div>
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                        <span style={{ fontWeight: 600 }}>Bob T.</span>
                        <span style={{ color: "var(--color-accent)" }}>★★★★☆</span>
                      </div>
                      <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>"Smooth transaction. Met up locally."</p>
                    </div>
                  </>
                ) : (
                  <div style={{ paddingBottom: "1rem" }}>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8 }}>No reviews received yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content: Listings */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Your Listings</h2>
                <Link href="/sell" className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>+ List a Book</Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {(isDemoUser || userBooks.length > 0) ? (
                  [
                    ...userBooks.map(b => ({ ...b, views: b.views || 0 })),
                    ...(isDemoUser ? [
                      { title: "Neuromancer", author: "William Gibson", price: "₹400", status: "Active", views: 24 },
                      { title: "Snow Crash", author: "Neal Stephenson", price: "₹500", status: "Active", views: 18 },
                      { title: "Foundation", author: "Isaac Asimov", price: "₹300", status: "Sold", views: 56 }
                    ] : [])
                  ].map((book, i) => (
                    <div key={i} className="glass" style={{ padding: "1.5rem", borderRadius: "1rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                      <div style={{ 
                        width: "80px", 
                        height: "120px", 
                        background: "linear-gradient(45deg, var(--color-primary-light), var(--color-secondary))",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        overflow: "hidden",
                        position: "relative"
                      }}>
                        {(book.photos && book.photos.length > 0) ? (
                           <img src={book.photos[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : book.cover ? (
                           <img src={book.cover} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                           <span>No Cover</span>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>{book.title}</h3>
                        <p style={{ opacity: 0.7, marginBottom: "0.5rem" }}>{book.author}</p>
                        <div style={{ display: "flex", gap: "1rem", fontSize: "0.875rem" }}>
                          <span style={{ color: book.status === "Sold" ? "var(--border)" : "var(--color-primary-light)", fontWeight: 700 }}>
                            {book.status}
                          </span>
                          <span style={{ opacity: 0.6 }}>{book.views} views</span>
                        </div>
                      </div>
                      <div style={{ textAlign: "right", minWidth: "150px" }}>
                        <div style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>
                          ₹{book.price}
                          {book.mrp && <span style={{ fontSize: "0.85rem", opacity: 0.5, textDecoration: "line-through", display: "block", fontWeight: 500 }}>MRP ₹{book.mrp}</span>}
                        </div>
                        <div style={{ fontSize: "0.80rem", opacity: 0.8, marginBottom: "0.75rem", lineHeight: "1.4" }}>
                          App Fee (2%): <span style={{ color: "var(--color-accent)" }}>-₹{((typeof book.price === 'number' ? book.price : parseFloat(String(book.price || "").replace(/[^0-9.-]+/g,"")) || 0) * 0.02).toFixed(2)}</span><br/>
                          <span style={{ fontWeight: 700 }}>You get: <span style={{ color: "var(--color-primary)" }}>₹{((typeof book.price === 'number' ? book.price : parseFloat(String(book.price || "").replace(/[^0-9.-]+/g,"")) || 0) * 0.98).toFixed(2)}</span></span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "0.5rem" }}>
                          {book.status === "Sold" && <span style={{ opacity: 0.5, fontWeight: 600, fontSize: "0.875rem" }}>Status: Completed</span>}
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button 
                              className="btn btn-secondary" 
                              onClick={() => {
                                setEditingBook(book);
                                setEditForm({
                                  title: book.title,
                                  author: book.author,
                                  price: typeof book.price === 'number' ? String(book.price) : String(book.price).replace(/[^0-9.]/g, ''),
                                  mrp: typeof book.mrp === 'number' ? String(book.mrp) : String(book.mrp || "").replace(/[^0-9.]/g, ''),
                                  condition: book.condition,
                                  category: book.category,
                                  status: book.status,
                                  photos: book.photos ? [...book.photos] : (book.cover ? [book.cover] : [])
                                });
                              }}
                              style={{ padding: "0.5rem 1rem" }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteBook(book.id)} 
                              style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid #f43f5e", color: "#f43f5e", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer" }}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="glass" style={{ padding: "3rem 1.5rem", borderRadius: "1rem", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
                     <div style={{ fontSize: "3rem", marginBottom: "1rem", opacity: 0.5 }}>📚</div>
                     <h3 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>No active listings</h3>
                     <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>You haven't listed any books for sale yet.</p>
                     <Link href="/sell" className="btn btn-primary" style={{ padding: "0.5rem 1.5rem" }}>List Your First Book</Link>
                  </div>
                )}
              </div>

              {/* Purchases Section */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", marginTop: "4rem" }}>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Your Purchases</h2>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                {userPurchases.length > 0 ? userPurchases.map((book, i) => (
                  <div key={`pur-${i}`} className="glass" style={{ padding: "1.5rem", borderRadius: "1rem", display: "flex", gap: "1.5rem", alignItems: "center" }}>
                      <div style={{ 
                        width: "80px", 
                        height: "120px", 
                        background: "linear-gradient(45deg, var(--color-primary-light), var(--color-secondary))",
                        borderRadius: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                        fontSize: "0.75rem",
                        fontWeight: "bold",
                        textAlign: "center",
                        overflow: "hidden"
                      }}>
                        {book.photos && book.photos[0] ? <img src={book.photos[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : book.cover ? <img src={book.cover} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span>No Image</span>}
                      </div>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.25rem" }}>{book.title}</h3>
                        <p style={{ opacity: 0.7, marginBottom: "0.5rem" }}>Seller: {book.sellerName || book.seller}</p>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-primary)" }}>₹{book.price}</div>
                          {book.mrp && <div style={{ fontSize: "0.9rem", opacity: 0.5, textDecoration: "line-through", display: "flex", alignItems: "center", gap: "0.25rem" }}><span title="Maximum Retail Price">🏷️</span> MRP ₹{book.mrp}</div>}
                          {book.status === 'Pending' && <span style={{ background: "var(--color-accent)", color: "white", padding: "0.2rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: "bold" }}>PAYMENT PENDING</span>}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {book.status === 'Pending' ? (
                          <>
                             <button className="btn btn-primary" onClick={() => window.location.href=`/checkout?bookId=${book.bookId}`} style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Pay Now</button>
                             <button onClick={() => handleCancelOrder(book._id || book.id)} style={{ padding: "0.5rem 1rem", background: "transparent", border: "1px solid #f43f5e", color: "#f43f5e", borderRadius: "0.5rem", fontWeight: 600, cursor: "pointer", fontSize: "0.875rem" }}>Cancel Order</button>
                          </>
                        ) : (
                          <button className="btn btn-primary" onClick={() => setReviewingBook(book)} style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>Rate Seller & Book</button>
                        )}
                      </div>
                  </div>
                )) : (
                  <div className="glass" style={{ padding: "2rem", textAlign: "center", borderRadius: "1rem" }}>
                    <p style={{ opacity: 0.6 }}>You haven't purchased any books yet.</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Edit Book Modal */}
      {editingBook && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="glass" style={{ width: "100%", maxWidth: "500px", padding: "2rem", borderRadius: "1.5rem", background: "var(--surface)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem" }}>Edit Listing</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Photos (Max 6)</label>
                
                {editForm.photos && editForm.photos.length > 0 && (
                  <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                    {editForm.photos.map((photoUrl, i) => (
                      <div key={i} style={{ position: "relative", width: "80px", height: "100px", borderRadius: "0.5rem", overflow: "hidden", border: "1px solid var(--border)", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", background: "var(--surface)" }}>
                        <img src={photoUrl} alt={`Cover Preview ${i+1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <button 
                          onClick={() => {
                            const newPhotos = [...editForm.photos];
                            newPhotos.splice(i, 1);
                            setEditForm({...editForm, photos: newPhotos});
                          }} 
                          style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(244, 63, 94, 0.9)", color: "white", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: "bold" }}
                          title="Remove Photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {(!editForm.photos || editForm.photos.length < 6) && (
                   <div style={{ background: "var(--background)", padding: "1.5rem", borderRadius: "0.5rem", border: "1px dashed var(--color-primary-light)", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", textAlign: "center" }}>
                     <span style={{ fontSize: "0.875rem", opacity: 0.8, fontWeight: 500 }}>Upload more photos ({editForm.photos ? editForm.photos.length : 0}/6)</span>
                     <input type="file" multiple accept="image/*" onChange={(e) => {
                       if (e.target.files && e.target.files.length > 0) {
                         const maxAllowed = 6 - (editForm.photos ? editForm.photos.length : 0);
                         const files = Array.from(e.target.files).slice(0, maxAllowed);
                         files.forEach(file => {
                           const reader = new FileReader();
                           reader.onload = (ev) => {
                             setEditForm(prev => ({...prev, photos: [...(prev.photos || []), ev.target.result]}));
                           };
                           reader.readAsDataURL(file);
                         });
                         e.target.value = null;
                       }
                     }} style={{ fontSize: "0.875rem", maxWidth: "100%" }} />
                   </div>
                )}
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Title</label>
                <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none" }} />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Author</label>
                <input type="text" value={editForm.author} onChange={e => setEditForm({...editForm, author: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none" }} />
              </div>

              <div style={{ display: "flex", gap: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Selling Price</label>
                  <div style={{ display: "flex", alignItems: "center", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "0.5rem", overflow: "hidden" }}>
                    <span style={{ padding: "0.75rem 1rem", background: "var(--surface-hover)", borderRight: "1px solid var(--border)", fontWeight: 700 }}>₹</span>
                    <input type="number" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} style={{ width: "100%", padding: "0.75rem", border: "none", background: "transparent", color: "var(--foreground)", outline: "none" }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Original MRP</label>
                  <div style={{ display: "flex", alignItems: "center", background: "var(--background)", border: "1px solid var(--border)", borderRadius: "0.5rem", overflow: "hidden" }}>
                    <span style={{ padding: "0.75rem 1rem", background: "var(--surface-hover)", borderRight: "1px solid var(--border)", fontWeight: 700 }}>₹</span>
                    <input type="number" value={editForm.mrp} onChange={e => setEditForm({...editForm, mrp: e.target.value})} style={{ width: "100%", padding: "0.75rem", border: "none", background: "transparent", color: "var(--foreground)", outline: "none" }} />
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Status</label>
                  <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none", appearance: "none" }}>
                    <option value="Active">Active</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              <button onClick={() => setEditingBook(null)} className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>Cancel</button>
              <button onClick={handleSaveEdit} className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div className="glass" style={{ width: "100%", maxWidth: "500px", padding: "2rem", borderRadius: "1.5rem", background: "var(--surface)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1.5rem" }}>Edit Profile</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "1rem" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: profileForm.avatar ? `url(${profileForm.avatar})` : "var(--surface-hover)", backgroundSize: "cover", backgroundPosition: "center", border: "2px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--foreground)", opacity: profileForm.avatar ? 1 : 0.5 }}>
                   {!profileForm.avatar && <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>}
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Profile Picture</label>
                  <label htmlFor="avatarUpload" className="btn btn-secondary" style={{ padding: "0.5rem 1rem", fontSize: "0.75rem", cursor: "pointer", display: "inline-block" }}>
                    Change Photo
                  </label>
                  <input 
                    id="avatarUpload"
                    type="file" 
                    accept="image/*" 
                    style={{ display: "none" }} 
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        const reader = new FileReader();
                        reader.onload = (ev) => setProfileForm({ ...profileForm, avatar: ev.target.result });
                        reader.readAsDataURL(e.target.files[0]);
                      }
                    }}
                  />
                  {profileForm.avatar && (
                    <button 
                      onClick={() => setProfileForm({ ...profileForm, avatar: "" })}
                      style={{ marginLeft: "1rem", background: "transparent", border: "none", color: "#f43f5e", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Name</label>
                <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none" }} />
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Bio</label>
                <textarea rows={3} value={profileForm.bio} onChange={e => setProfileForm({...profileForm, bio: e.target.value})} placeholder="Tell the community about yourself..." style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none", resize: "vertical" }} />
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "0.5rem" }}>
                  <label style={{ fontWeight: 600, fontSize: "0.875rem" }}>Location Hub</label>
                  <button onClick={handleFetchLocation} disabled={isLocating} style={{ background: "transparent", border: "none", color: "var(--color-primary)", fontSize: "0.75rem", fontWeight: "bold", cursor: isLocating ? "wait" : "pointer" }}>{isLocating ? "LOCATING..." : "AUTO-DETECT VIA GPS"}</button>
                </div>
                <input type="text" value={profileForm.location} onChange={e => setProfileForm({...profileForm, location: e.target.value})} placeholder="E.g. Seattle, WA" style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none" }} />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
              <button onClick={() => setIsEditingProfile(false)} className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>Cancel</button>
              <button onClick={handleSaveProfile} className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>Save Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Review Modal */}
      {reviewingBook && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)" }}>
          <div className="glass" style={{ width: "100%", maxWidth: "500px", padding: "2rem", borderRadius: "1.5rem", background: "var(--surface)", animation: "slideUp 0.3s ease-out" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Rate Your Purchase</h2>
            <p style={{ opacity: 0.8, marginBottom: "2rem", fontSize: "0.9rem" }}>Leave a review for <strong style={{ color: "var(--color-primary-light)" }}>{reviewingBook.seller}</strong> regarding the condition of <strong>{reviewingBook.title}</strong>.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Rating (1-5 Stars)</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                      style={{ background: "transparent", border: "none", fontSize: "2rem", cursor: "pointer", color: star <= reviewForm.rating ? "var(--color-accent)" : "var(--surface-hover)", transition: "color 0.2s" }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Comment</label>
                <textarea 
                  rows={4} 
                  value={reviewForm.comment} 
                  onChange={e => setReviewForm({...reviewForm, comment: e.target.value})} 
                  placeholder="Did the book condition match the listing? Was the seller responsive?" 
                  style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none", resize: "vertical" }} 
                />
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
              <button onClick={() => setReviewingBook(null)} className="btn btn-secondary" style={{ padding: "0.5rem 1rem" }}>Cancel</button>
              <button onClick={handleSubmitReview} className="btn btn-primary" style={{ padding: "0.5rem 1rem" }}>Submit Review</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
