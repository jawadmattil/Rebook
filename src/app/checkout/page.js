"use client";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get("bookId");
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/books/${bookId}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setBook(data.data);
        } else {
          console.error("API error:", data.error);
        }
      } catch (err) {
        console.error("Fetch book error:", err);
      }
    };
    if (bookId) fetchBook();
  }, [bookId]);

  const handlePayment = async (status = 'Completed') => {
    const userStr = localStorage.getItem("rebook_user");
    if (!userStr) {
      alert("You must be logged in to purchase!");
      return window.location.href = "/login";
    }
    const user = JSON.parse(userStr);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookId: book._id,
          buyerName: user.name,
          sellerName: book.seller,
          title: book.title,
          price: typeof book.price === 'number' ? book.price : parseFloat(String(book.price).replace(/[^0-9.]/g, '')),
          mrp: typeof book.mrp === 'number' ? book.mrp : parseFloat(String(book.mrp || "").replace(/[^0-9.]/g, '')),
          cover: (book.photos && book.photos[0]) || book.cover,
          status: status
        })
      });
      const data = await res.json();
      if (data.success) {
        if (status === 'Pending') {
          alert("Order reserved! You can pay from your profile later.");
        } else {
          alert("Payment successful! The book has been added to your Purchases.");
        }
        window.location.href = "/profile";
      } else {
        throw new Error(data.error);
      }
    } catch(e) {
      console.error(e);
      alert("Failed to process: " + e.message);
    }
  };

  if (!book) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div className="glass" style={{ padding: "2rem", textAlign: "center", borderRadius: "1rem" }}>
          <h2>Loading book details... Or book not found!</h2>
          <Link href="/" className="btn btn-primary" style={{ marginTop: "1rem", display: "inline-block" }}>Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "2rem 1rem"
    }}>
      <div className="glass" style={{
        padding: "3rem",
        borderRadius: "1.5rem",
        width: "100%",
        maxWidth: "600px",
        display: "flex",
        flexDirection: "column",
        gap: "2rem"
      }}>
        <div style={{ textAlign: "center", borderBottom: "1px solid var(--border)", paddingBottom: "2rem" }}>
          <h1 className="gradient-text" style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Secure Checkout</h1>
          <p style={{ opacity: 0.8 }}>Powered by Stripe (Mock)</p>
        </div>

        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", paddingBottom: "1.5rem", borderBottom: "1px dashed var(--border)" }}>
           <div style={{ 
              width: "80px", 
              height: "120px", 
              background: "linear-gradient(45deg, var(--color-primary-light), var(--color-secondary))",
              borderRadius: "0.5rem",
              position: "relative",
              overflow: "hidden",
            }}>
              {(book.photos && book.photos[0]) ? (
                <img src={book.photos[0]} alt={book.title} style={{ width: "100%", height: "100%", objectFit: 'cover' }} />
              ) : book.cover ? (
                <img src={book.cover} alt={book.title} style={{ width: "100%", height: "100%", objectFit: 'cover' }} />
              ) : null}
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.25rem" }}>{book.title}</h3>
              <p style={{ opacity: 0.7, marginBottom: "0.5rem" }}>by {book.author}</p>
              <p style={{ display: "inline-block", background: "var(--surface-hover)", padding: "0.25rem 0.5rem", borderRadius: "0.25rem", fontSize: "0.75rem", fontWeight: 600 }}>{book.condition}</p>
            </div>
            <div style={{ marginLeft: "auto", fontSize: "2rem", fontWeight: 800, color: "var(--color-primary)" }}>
              ₹{book.price}
            </div>
        </div>

        <div>
          <h3 style={{ fontSize: "1.125rem", fontWeight: 700, marginBottom: "1.5rem" }}>Payment Details</h3>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Card Information</label>
              <div style={{ 
                padding: "1rem", 
                borderRadius: "0.5rem", 
                border: "1px solid var(--border)",
                background: "var(--surface)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <span style={{ opacity: 0.5, letterSpacing: "2px" }}>•••• •••• •••• 4242</span>
                <div style={{ display: "flex", gap: "1rem" }}>
                  <span style={{ opacity: 0.5 }}>MM/YY</span>
                  <span style={{ opacity: 0.5 }}>CVC</span>
                </div>
              </div>
            </div>
            
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Name on Card</label>
              <input type="text" placeholder="John Doe" style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--foreground)",
                outline: "none"
              }} />
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <button className="btn btn-primary" onClick={() => handlePayment('Completed')} style={{ width: "100%", fontSize: "1.25rem", padding: "1rem" }}>
            Pay ₹{book.price}
          </button>
          <button className="btn btn-secondary" onClick={() => handlePayment('Pending')} style={{ width: "100%", fontSize: "1.1rem", padding: "0.75rem" }}>
            Reserve & Pay Later
          </button>
        </div>

        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "0.75rem", opacity: 0.6, marginBottom: "1rem" }}>
            Your payment is processed securely. We don't store your card details.
          </p>
          <Link href="/messages" style={{ fontWeight: 600, color: "var(--color-secondary)", textDecoration: "underline" }}>
            Cancel and return to messages
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Checkout() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  )
}

