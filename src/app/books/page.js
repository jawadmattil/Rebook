"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";

function BooksContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const catParam = searchParams.get("category") || "";

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState(q);
  const [category, setCategory] = useState(catParam);
  const [condition, setCondition] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxDistance, setMaxDistance] = useState("50");
  const [showFilters, setShowFilters] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("rebook_user")) {
      setIsAuthenticated(true);
    }
    
    const fetchBooks = async () => {
      try {
        const url = new URL('/api/books', window.location.origin);
        if (q) url.searchParams.set('q', q);
        if (catParam) url.searchParams.set('category', catParam);

        const res = await fetch(url);
        const data = await res.json();
        
        if (data.success) {
          const processedBooks = data.data.map(book => {
            // Compute mock deterministic distances for sorting
            const hashCode = s => s.split('').reduce((a,b)=>{a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);
            const hash = Math.abs(hashCode(book._id || book.title || ''));
            book.distanceKm = ((hash % 245) / 10 + 0.5).toFixed(1);
            book.id = book._id; // Map MongoDB ID to standard 'id' property
            
            // Make sure price is a clean number for filtering
            const numPrice = parseFloat(String(book.price).replace(/[^0-9.]/g, '')) || 0;
            book.numPrice = numPrice;
            return book;
          });
          setBooks(processedBooks);
        }
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
  }, [q, catParam]);

  useEffect(() => {
    let result = [...books];

    // Filter by search query
    if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(b => 
        b.title?.toLowerCase().includes(lowerQ) || 
        b.author?.toLowerCase().includes(lowerQ) || 
        b.id?.toLowerCase().includes(lowerQ)
      );
    }

    // Filter by category
    if (category) {
      result = result.filter(b => b.category === category);
    }

    // Filter by condition
    if (condition) {
      result = result.filter(b => b.condition === condition);
    }

    // Filter by price
    if (maxPrice) {
      const priceLimit = parseFloat(maxPrice);
      if (!isNaN(priceLimit)) {
        result = result.filter(b => b.numPrice <= priceLimit);
      }
    }
    
    // Filter by distance
    if (maxDistance) {
      const distLimit = parseFloat(maxDistance);
      if (!isNaN(distLimit)) {
        result = result.filter(b => parseFloat(b.distanceKm) <= distLimit);
      }
    }

    // Sort by location ascending (nearest first)
    result.sort((a, b) => parseFloat(a.distanceKm) - parseFloat(b.distanceKm));

    setFilteredBooks(result);
  }, [books, searchQuery, category, condition, maxPrice, maxDistance]);

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
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
            <Link href="/" style={{ fontWeight: 500 }} onClick={() => setMobileMenuOpen(false)}>Home</Link>
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
                <Link href="/profile" className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => setMobileMenuOpen(false)}>
                   <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                     <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                   </svg>
                   Dashboard
                </Link>
              </>
            ) : (
              <Link href="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }} onClick={() => setMobileMenuOpen(false)}>Sign In</Link>
            )}
          </div>
        </div>
      </nav>

      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>All Books</h1>
            <p style={{ opacity: 0.7 }}>Showing books near your location, sorted by nearest first.</p>
          </div>
          <button 
            className="btn btn-secondary" 
            onClick={() => setShowFilters(!showFilters)}
            style={{ padding: '0.75rem 1.5rem' }}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {showFilters && (
          <div className="glass" style={{
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Search</label>
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Title, author, ISBN..." 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface-hover)', outline: 'none', color: 'inherit' }}
              />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Category</label>
              <select 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface-hover)', outline: 'none', color: 'inherit' }}
              >
                <option value="">All Categories</option>
                {['Fiction', 'Non-Fiction', 'Sci-Fi & Fantasy', 'Mystery & Thriller', 'Romance', 'Textbooks', 'Children\'s', 'Biography', 'History', 'Self-Help', 'Cookbooks', 'Business & Investing'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Max Price (₹)</label>
              <input 
                type="number" 
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="e.g. 500" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface-hover)', outline: 'none', color: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Max Distance (km)</label>
              <input 
                type="number" 
                value={maxDistance}
                onChange={(e) => setMaxDistance(e.target.value)}
                placeholder="e.g. 50" 
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface-hover)', outline: 'none', color: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Condition</label>
              <select 
                value={condition} 
                onChange={(e) => setCondition(e.target.value)}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '0.5rem', border: '1px solid var(--border)', background: 'var(--surface-hover)', outline: 'none', color: 'inherit' }}
              >
                <option value="">Any Condition</option>
                <option value="Like New">Like New</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Acceptable">Acceptable</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <button 
                className="btn btn-secondary" 
                onClick={() => {
                  setSearchQuery('');
                  setCategory('');
                  setCondition('');
                  setMaxPrice('');
                  setMaxDistance('50');
                }}
                style={{ width: '100%', padding: '0.75rem' }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
          gap: '2.5rem' 
        }}>
          {filteredBooks.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', background: 'var(--surface)', borderRadius: '1rem', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>📚</div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>No books found</h3>
              <p style={{ opacity: 0.8 }}>Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            filteredBooks.map((book, i) => (
              <div key={i} onClick={() => {
                setSelectedBook(book);
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
                  {book.cover ? (
                    <Image 
                      src={book.cover} 
                      alt={book.title} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                      className="book-cover-img"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  ) : (
                    <span>No Cover Uploaded</span>
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
      </div>

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
                {selectedBook.cover ? (
                  <Image 
                    src={selectedBook.cover} 
                    alt={selectedBook.title} 
                    fill 
                    style={{ objectFit: 'cover' }} 
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
                    <span style={{ fontSize: '0.875rem', opacity: 0.7, display: 'block', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Category</span>
                    <strong style={{ fontSize: '1.1rem' }}>{selectedBook.category || "General"}</strong>
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

export default function BooksPage() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', fontSize: '1.5rem' }}>Loading Books...</div>}>
      <BooksContent />
    </Suspense>
  );
}
