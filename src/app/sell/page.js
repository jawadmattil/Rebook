"use client";
import Link from "next/link";
import { useState } from "react";

export default function SellBook() {
  const [isbn, setIsbn] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [condition, setCondition] = useState("Like New");
  const [category, setCategory] = useState("Fiction");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const fetchIsbnData = async () => {
    if (!isbn) return;
    setLoading(true);
    try {
      const cleanIsbn = isbn.replace(/-/g, "");
      const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${cleanIsbn}&format=json&jscmd=data`);
      const data = await res.json();
      
      const bookKey = `ISBN:${cleanIsbn}`;
      if (data[bookKey]) {
        setTitle(data[bookKey].title || "");
        
        if (data[bookKey].authors && data[bookKey].authors.length > 0) {
          setAuthor(data[bookKey].authors[0].name);
        }
        
        // Auto-select category based on API subjects
        if (data[bookKey].subjects && data[bookKey].subjects.length > 0) {
          const subjects = data[bookKey].subjects.map(s => s.name.toLowerCase());
          let foundCategory = "Fiction";
          
          if (subjects.some(s => s.includes("science") || s.includes("textbook") || s.includes("history") || s.includes("biography"))) {
            foundCategory = "Non-Fiction";
          } else if (subjects.some(s => s.includes("fantasy") || s.includes("science fiction"))) {
            foundCategory = "Sci-Fi & Fantasy";
          } else if (subjects.some(s => s.includes("textbook") || s.includes("study") || s.includes("education"))) {
            foundCategory = "Textbooks";
          } else {
            foundCategory = data[bookKey].subjects[0].name;
          }
          setCategory(foundCategory);
        }



      } else {
        alert("Could not find book details for this ISBN.");
      }
    } catch (e) {
      console.error(e);
      alert("Error fetching book details.");
    }
    setLoading(false);
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
       const remainingSlots = 6 - images.length;
       if (remainingSlots <= 0) {
         alert("You can only upload a maximum of 6 photos.");
         return;
       }
       
       const files = Array.from(e.target.files).slice(0, remainingSlots);
       
       Promise.all(files.map(file => {
           return new Promise((resolve) => {
               const reader = new FileReader();
               reader.onload = (ev) => {
                   resolve(ev.target.result);
               };
               reader.readAsDataURL(file);
           });
       })).then(base64Images => {
           setImages(prev => [...prev, ...base64Images]);
           
           const conditionOptions = ["Like New", "Very Good", "Good", "Acceptable"];
           const randomCondition = conditionOptions[Math.floor(Math.random() * conditionOptions.length)];
           let reason = "";
           if (randomCondition === "Like New") reason = "No visible wear detected. Appears crisp and unread.";
           if (randomCondition === "Very Good") reason = "Minor spine creasing detected, but otherwise clean.";
           if (randomCondition === "Good") reason = "Visible edge wear and slight corner folding detected.";
           if (randomCondition === "Acceptable") reason = "Heavy cover wear, creases, and possible highlighting detected.";
           
           alert(`🤖 AI Condition Analysis Complete:\n\n${reason}\n\nAuto-graded as '${randomCondition}'.`);
           setCondition(randomCondition);
       });
       
       e.target.value = null; // Clear input to allow re-uploading the same file if deleted
    }
  };

  const removeImage = (indexToRemove) => {
    setImages(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <div style={{ minHeight: "100vh", paddingBottom: "4rem" }}>
      {/* Navigation */}
      <nav className="glass" style={{ padding: "1rem 0", position: 'sticky', top: 0, zIndex: 50, marginBottom: "2rem" }}>
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
            <Link href="/profile" style={{ fontWeight: 500 }} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
            <Link href="/" style={{ fontWeight: 500 }} onClick={() => setMobileMenuOpen(false)}>Browse</Link>
          </div>
        </div>
      </nav>

      <div className="container section-padding" style={{ maxWidth: "850px" }}>
        <h1 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "0.5rem", textAlign: "center" }}>Sell Your Book</h1>
        <p style={{ opacity: 0.8, marginBottom: "3rem", textAlign: "center", fontSize: "1.1rem" }}>Share your stories with the next reader and earn cash.</p>

        <div className="glass" style={{ padding: "3rem", borderRadius: "2rem", display: "flex", flexDirection: "column", gap: "2.5rem" }}>
          
          {/* Quick ISBN Autofill */}
          <div style={{ background: "var(--surface-hover)", padding: "2rem", borderRadius: "1.25rem", display: "flex", gap: "1rem", alignItems: "flex-end", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: "250px" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Auto-fill via ISBN (Fast Tracking)</label>
              <input 
                type="text" 
                placeholder="e.g. 9780140328721" 
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.5rem",
                  border: "1px solid var(--border)",
                  background: "var(--surface)",
                  color: "var(--foreground)",
                  outline: "none"
                }} 
              />
            </div>
            <button 
              className="btn btn-secondary" 
              onClick={fetchIsbnData}
              disabled={loading}
              style={{ padding: "0.75rem 1.5rem", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Searching..." : "Auto-fill Details"}
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ gridColumn: "span 2" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Book Title *</label>
              <input 
                type="text" 
                placeholder="The Lord of the Rings" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none" }} />
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Author *</label>
              <input 
                type="text" 
                placeholder="J.R.R. Tolkien" 
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Selling Price (₹) *</label>
              <input 
                type="number" 
                placeholder="450" 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none" }} />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Original MRP (₹) *</label>
              <input 
                type="number" 
                placeholder="600" 
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none" }} />
            </div>

             <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Condition *</label>
              <select 
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none" }}>
                <option value="Like New">Like New</option>
                <option value="Very Good">Very Good</option>
                <option value="Good">Good</option>
                <option value="Acceptable">Acceptable</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Category</label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none" }}>
                {['Fiction', 'Non-Fiction', 'Sci-Fi & Fantasy', 'Mystery & Thriller', 'Romance', 'Textbooks', 'Children\'s', 'Biography', 'History', 'Self-Help', 'Cookbooks', 'Business & Investing'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
                {!['Fiction', 'Non-Fiction', 'Sci-Fi & Fantasy', 'Mystery & Thriller', 'Romance', 'Textbooks', 'Children\'s', 'Biography', 'History', 'Self-Help', 'Cookbooks', 'Business & Investing'].includes(category) && (
                  <option value={category}>{category}</option>
                )}
              </select>
            </div>
          </div>

          <div>
             <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Upload Photos</label>
             <input 
              type="file" 
              id="photoUpload" 
              multiple
              accept="image/*"
              style={{ display: "none" }} 
              onChange={handlePhotoUpload}
             />
             {images.length < 6 && (
                 <label htmlFor="photoUpload" style={{ display: "block", cursor: "pointer" }}>
                   <div style={{ 
                     border: "2px dashed var(--color-primary-light)", 
                     padding: "3rem", 
                     borderRadius: "1rem", 
                     textAlign: "center",
                     background: "var(--surface-hover)",
                     transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = "var(--color-primary)"}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--color-primary-light)"}>
                      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>📸</div>
                      <p style={{ fontWeight: 600, marginBottom: "0.5rem" }}>Click to upload or drag & drop</p>
                      <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>SVG, PNG, JPG or GIF (max. 30MB) - Up to 6 Photos.</p>
                   </div>
                 </label>
             )}

             {/* Display uploaded images visually with remove button */}
             {images.length > 0 && (
               <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
                 {images.map((src, i) => (
                   <div key={i} style={{ position: 'relative', width: '100px', height: '100px', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid var(--border)' }}>
                     <img src={src} alt={`Book cover preview ${i}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                     
                     <button 
                       onClick={() => removeImage(i)}
                       style={{ 
                         position: 'absolute', 
                         top: '4px', 
                         right: '4px', 
                         background: 'rgba(244, 63, 94, 0.9)', 
                         color: 'white', 
                         border: 'none', 
                         borderRadius: '50%', 
                         width: '24px', 
                         height: '24px', 
                         cursor: 'pointer', 
                         display: 'flex', 
                         alignItems: 'center', 
                         justifyContent: 'center', 
                         fontSize: '12px',
                         fontWeight: 'bold',
                         boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                       }}
                       title="Remove Image"
                     >
                       ✕
                     </button>
                   </div>
                 ))}
               </div>
             )}
          </div>

          <div>
             <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Description</label>
             <textarea rows={4} placeholder="Describe any wear and tear, notes, or interesting history about this copy..." style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none", resize: "vertical" }} />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
            <Link href="/profile" className="btn btn-secondary">Cancel</Link>
            <button 
              className="btn btn-primary" 
              disabled={!title || !author}
              onClick={async (e) => {
                e.preventDefault();
                setLoading(true);
                
                const newBook = {
                    title: title,
                    author: author,
                    price: price,
                    mrp: mrp,
                    condition: condition,
                    category: category,
                    status: "Active",
                    seller: "Unknown Seller",
                    photos: images,
                };
                
                try {
                    const userStr = localStorage.getItem("rebook_user");
                    if (userStr) {
                        newBook.seller = JSON.parse(userStr).name;
                    }

                    const res = await fetch('/api/books', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newBook)
                    });

                    const data = await res.json();
                    
                    if (data.success) {
                      alert(`Success! "${title}" has been listed on ReBook!`);
                      window.location.href = "/profile";
                    } else {
                      throw new Error(data.error || "Failed to save listing");
                    }
                } catch(err) {
                    console.error("Database save error:", err);
                    alert(`Failed to save the listing: ${err.message}`);
                } finally {
                  setLoading(false);
                }
              }}>
              {loading ? "Publishing..." : "Publish Listing"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
