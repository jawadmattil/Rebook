"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [feedBooks, setFeedBooks] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [userAvatar, setUserAvatar] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("rebook_user")) {
      setIsAuthenticated(true);
      try {
        const u = JSON.parse(localStorage.getItem("rebook_user"));
        if (u.avatar) setUserAvatar(u.avatar);
      } catch(e) {}
    }

    const fetchBooks = async () => {
      try {
        const res = await fetch('/api/books');
        const data = await res.json();
        
        if (data.success) {
          let books = data.data;

          // Compute mock deterministic distances for sorting
          const hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
          const booksWithDist = books.map(book => {
            const hash = Math.abs(hashCode(book._id || book.title || ''));
            book.distanceKm = ((hash % 245) / 10 + 0.5).toFixed(1);
            book.id = book._id; // Map MongoDB ID to standard 'id' property
            return book;
          });
          
          // Sort books by distance
          booksWithDist.sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));
          setFeedBooks(booksWithDist);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();

    // Auto-detect location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          const cityInfo = data.address.city || data.address.town || data.address.village || data.address.state;
          if (cityInfo) setUserLocation(cityInfo);
        } catch (err) {}
      }, () => {
        // Silently fail if denied or unavailable
      });
    }
  }, []);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Message Bar */}
      <div style={{ 
        background: 'var(--color-primary)', 
        color: 'white', 
        padding: '0.5rem', 
        textAlign: 'center', 
        fontSize: '0.9rem', 
        fontWeight: 'bold',
        letterSpacing: '0.5px'
      }}>
        Welcome to ReBook! Discover your next favorite story today.
      </div>
      {/* Navigation */}
      <nav className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '1rem 0',
        marginBottom: '2rem'
      }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0 }}>ReBook</Link>
          
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
            <Link href="#nearby-books" style={{ fontWeight: 500 }} onClick={() => setMobileMenuOpen(false)}>
              {userLocation ? `Near ${userLocation}` : 'Nearby'}
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/messages" style={{ 
                  color: "var(--foreground)", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  textDecoration: "none",
                  fontWeight: 600,
                  opacity: 0.8,
                  transition: "opacity 0.2s"
                }} onClick={() => setMobileMenuOpen(false)}>
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
                   </svg>
                   Messages
                </Link>
                <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }} onClick={() => setMobileMenuOpen(false)}>
                  {userAvatar ? (
                    <div style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundImage: `url(${userAvatar})`, backgroundSize: "cover", backgroundPosition: "center", border: "2px solid var(--color-primary-light)" }} />
                  ) : (
                    <div className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                       </svg>
                       Dashboard
                    </div>
                  )}
                  {userAvatar && <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--foreground)" }}>Dashboard</span>}
                </Link>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container" style={{
        padding: '6rem 1rem',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem'
      }}>
        <h2 style={{ fontSize: '4rem', lineHeight: '1.1', fontWeight: 800, maxWidth: '800px', margin: '0 auto' }}>
          Give old stories a <br/><span className="gradient-text">new beginning</span>
        </h2>
        <p style={{ fontSize: '1.25rem', opacity: 0.8, maxWidth: '600px', margin: '0 auto' }}>
          Buy and sell second-hand books with readers in your local community. 
          Discover hidden gems and share your favorite reads.
        </p>
        
        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button className="btn btn-primary" onClick={() => document.getElementById('nearby-books').scrollIntoView({ behavior: 'smooth' })} style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            Explore Books
          </button>
          <Link href="/sell" className="btn btn-secondary" style={{ fontSize: '1.125rem', padding: '1rem 2rem', display: 'inline-flex', alignItems: 'center' }}>
            Sell a Book
          </Link>
        </div>
        
        {/* Search Bar */}
        <div className="glass" style={{
          marginTop: '2rem',
          padding: '0.5rem',
          borderRadius: '9999px',
          display: 'flex',
          width: '100%',
          maxWidth: '600px',
          boxShadow: 'var(--glass-shadow)'
        }}>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                router.push(`/books?q=${encodeURIComponent(searchQuery)}`);
              }
            }}
            placeholder="Search by title, author, or ISBN..." 
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              padding: '0.75rem 1.5rem',
              outline: 'none',
              fontSize: '1rem',
              color: 'var(--foreground)'
            }}
          />
          <button className="btn btn-primary" onClick={() => router.push(`/books?q=${encodeURIComponent(searchQuery)}`)} style={{ padding: '0.5rem 1.5rem' }}>Search</button>
        </div>
      </header>

      {/* Featured Section */}
      <section id="nearby-books" className="container" style={{ marginTop: '4rem', scrollMarginTop: '6rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>{userLocation ? `Featured in ${userLocation}` : 'Featured Nearby'}</h3>
            <p style={{ opacity: 0.7 }}>Books available from sellers in {userLocation || 'your area'}</p>
          </div>
          <Link href="/books" className="gradient-text" style={{ fontWeight: 600 }}>View all →</Link>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {feedBooks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No books nearby</h3>
              <p style={{ opacity: 0.8, marginBottom: '2rem' }}>You are the first person here! Be the first to list a book in your local community.</p>
              <Link href="/sell" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Sell the First Book</Link>
            </div>
          ) : (
            feedBooks.map((book, i) => (
              <div key={i} onClick={() => {
                setSelectedBook(book);
                setCurrentImageIndex(0);
                try {
                  const allBooks = JSON.parse(localStorage.getItem("rebook_books") || "[]");
                  const updatedBooks = allBooks.map(b => {
                      if (b.id === book.id) {
                          return { ...b, views: (b.views || 0) + 1 };
                      }
                      return b;
                  });
                  localStorage.setItem("rebook_books", JSON.stringify(updatedBooks));
                } catch(e) {}
              }} className="glass book-card" style={{ 
                borderRadius: '1.25rem', 
                overflow: 'hidden',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--surface)',
                border: '1px solid var(--border)'
              }}>
                <div style={{ 
                  height: '280px', 
                  position: 'relative',
                  width: '100%',
                  overflow: 'hidden',
                  background: 'linear-gradient(45deg, var(--color-primary-light), var(--color-secondary))',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.5rem',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}>
                  {book.photos && book.photos.length > 0 ? (
                    <img 
                      src={book.photos[0]} 
                      alt={book.title} 
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
                      className="book-cover-img"
                    />
                  ) : book.cover ? (
                    <img 
                      src={book.cover} 
                      alt={book.title} 
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }} 
                      className="book-cover-img"
                    />
                  ) : (
                    <span>No Image Uploaded</span>
                  )}
                </div>
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '1.15rem', color: 'var(--foreground)', flex: 1, paddingRight: '0.5rem' }}>{book.title}</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontWeight: 800, color: 'var(--color-primary)', fontSize: '1.125rem' }}>₹{book.price}</span>
                    {book.mrp && <span style={{ fontSize: '0.75rem', opacity: 0.5, textDecoration: 'line-through', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>🏷️ MRP ₹{book.mrp}</span>}
                  </div>
                </div>
                <p style={{ opacity: 0.8, marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--foreground)' }}>{book.author}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', fontWeight: 600, marginTop: 'auto' }}>
                  <span style={{ 
                    background: 'var(--color-primary-light)', 
                    color: 'white',
                    padding: '0.35rem 0.75rem', 
                    borderRadius: '2rem' 
                  }}>
                    {book.condition}
                  </span>
                  <span style={{ color: 'var(--color-secondary)' }}>
                    {book.distanceKm} km away
                  </span>
                </div>
              </div>
            </div>
          )))}
        </div>
      </section>
      
      {/* Category Section */}
      <section className="container" style={{ marginTop: '6rem' }}>
        <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem', textAlign: 'center' }}>
          Browse by Category
        </h3>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '1rem',
          flexWrap: 'wrap' 
        }}>
          {['Fiction', 'Non-Fiction', 'Sci-Fi & Fantasy', 'Mystery & Thriller', 'Romance', 'Textbooks', 'Children\'s', 'Biography', 'History', 'Self-Help', 'Cookbooks', 'Business & Investing'].map((cat, i) => (
            <div key={i} className="glass" style={{ 
              padding: '1rem 2rem', 
              borderRadius: '9999px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }} 
               onClick={() => router.push(`/books?category=${encodeURIComponent(cat)}`)}
               onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
               onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              {cat}
            </div>
          ))}
        </div>
      </section>

      {/* Book Modal */}
      {selectedBook && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          animation: 'fadeIn 0.2s ease-out'
        }} onClick={() => setSelectedBook(null)}>
          <div className="glass" style={{
            background: 'var(--surface)',
            borderRadius: '1.5rem',
            maxWidth: '900px',
            width: '100%',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'row',
            position: 'relative',
            maxHeight: '90vh',
            animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
          }} onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setSelectedBook(null)}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'var(--surface-hover)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
                fontSize: '1.2rem',
                color: 'var(--foreground)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              title="Close"
            >
              ✕
            </button>
            <div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', overflowY: 'auto' }}>
              <div style={{ flex: '1 1 350px', position: 'relative', minHeight: '400px', background: 'linear-gradient(45deg, var(--color-primary-light), var(--color-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '2rem' }}>
                {(selectedBook.photos && selectedBook.photos.length > 0) ? (
                  <>
                    <img 
                      src={selectedBook.photos[currentImageIndex]} 
                      alt={`${selectedBook.title} - Image ${currentImageIndex + 1}`} 
                      style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }} 
                    />
                    {selectedBook.photos.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => prev === 0 ? selectedBook.photos.length - 1 : prev - 1); }}
                          style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', backdropFilter: 'blur(4px)' }}>
                          ‹
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIndex((prev) => prev === selectedBook.photos.length - 1 ? 0 : prev + 1); }}
                          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', backdropFilter: 'blur(4px)' }}>
                          ›
                        </button>
                        <div style={{ position: 'absolute', bottom: '15px', display: 'flex', gap: '8px', zIndex: 10 }}>
                          {selectedBook.photos.map((_, idx) => (
                            <div key={idx} style={{ width: '10px', height: '10px', borderRadius: '50%', background: idx === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)', cursor: 'pointer', transition: 'background 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.5)' }} onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }} />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : selectedBook.cover ? (
                  <img 
                    src={selectedBook.cover} 
                    alt={selectedBook.title} 
                    style={{ objectFit: 'cover', width: '100%', height: '100%', position: 'absolute', inset: 0 }} 
                  />
                ) : (
                  <div style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)', textAlign: 'center', padding: '1rem' }}>{selectedBook.title}<br/><span style={{ fontSize: '1rem', opacity: 0.8 }}>No cover image</span></div>
                )}
              </div>
              <div style={{ flex: '1.5 1 400px', padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.25rem', color: 'var(--foreground)', lineHeight: 1.1 }}>{selectedBook.title}</h3>
                    <p style={{ fontSize: '1.25rem', opacity: 0.8, marginBottom: '1.5rem', fontWeight: 500 }}>By {selectedBook.author}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-primary)' }}>₹{selectedBook.price}</span>
                    {selectedBook.mrp && (
                      <span style={{ fontSize: '1rem', opacity: 0.6, textDecoration: 'line-through', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>🏷️ MRP ₹{selectedBook.mrp}</span>
                    )}
                  </div>
                </div>
                
                <p style={{ lineHeight: '1.7', marginBottom: '2.5rem', color: 'var(--foreground)', fontSize: '1.05rem', opacity: 0.9 }}>
                  {selectedBook.description || "The seller did not put a description for this listing."}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem', background: 'var(--surface-hover)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontSize: '0.875rem', opacity: 0.7, display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Condition</span>
                    <strong style={{ fontSize: '1.1rem' }}>{selectedBook.condition}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', opacity: 0.7, display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Distance</span>
                    <strong style={{ fontSize: '1.1rem' }}>{selectedBook.distanceKm} km away</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', opacity: 0.7, display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Seller</span>
                    <strong style={{ fontSize: '1.1rem' }}>{selectedBook.seller || "Anonymous User"}</strong>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.875rem', opacity: 0.7, display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Rating</span>
                    <strong style={{ fontSize: '1.1rem', color: '#f59e0b' }}>★ <span style={{ color: 'var(--foreground)' }}>Unrated</span></strong>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                  {isAuthenticated ? (
                    <>
                      {isAuthenticated && JSON.parse(localStorage.getItem("rebook_user") || "{}").name === selectedBook.seller ? (
                        <button onClick={() => router.push("/profile")} className="btn btn-secondary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}>Manage Your Listing</button>
                      ) : (
                        <>
                          <button onClick={() => router.push(`/messages?recipient=${encodeURIComponent(selectedBook.seller)}&bookId=${selectedBook.id}`)} className="btn btn-secondary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}>Message Seller</button>
                          <button onClick={() => router.push(`/checkout?bookId=${selectedBook.id}`)} className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}>Request to Buy</button>
                        </>
                      )}
                    </>
                  ) : (
                    <button onClick={() => router.push("/login")} className="btn btn-primary" style={{ flex: 1, padding: '1rem', fontSize: '1.1rem' }}>Sign in to Contact Seller</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
