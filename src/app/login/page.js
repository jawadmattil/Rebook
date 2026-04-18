"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loggedInUser = localStorage.getItem("rebook_user");
    if (loggedInUser) {
      router.push("/profile");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLogin) {
      if (!name || !email || !password) {
        setError("Name, Email, and Password are required.");
        return;
      }
      
      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });
        const data = await res.json();
        
        if (data.success) {
          localStorage.setItem("rebook_user", JSON.stringify(data.user));
          router.push("/profile");
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to register. Please try again.");
      }
    } else {
      if (!email || !password) {
        setError("Email and Password are required.");
        return;
      }

      // Demo login
      if (email === "demo@rebook.com" && password === "12345678") {
        localStorage.setItem("rebook_user", JSON.stringify({ name: "Demo User", email, isDemo: true }));
        router.push("/profile");
        return;
      }

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (data.success) {
          localStorage.setItem("rebook_user", JSON.stringify(data.user));
          router.push("/profile");
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Failed to login. Please try again.");
      }
    }
  };

  const handleOAuthLogin = (provider) => {
    localStorage.setItem("rebook_user", JSON.stringify({ name: `Authenticated via ${provider}` }));
    setError("");
    router.push("/profile");
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div className="glass" style={{
        padding: "3rem",
        borderRadius: "1.5rem",
        width: "100%",
        maxWidth: "480px",
        display: "flex",
        flexDirection: "column",
        gap: "1.5rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
      }}>
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <h1 className="gradient-text" style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>ReBook</h1>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
            {isLogin ? "Welcome back" : "Create your account"}
          </h2>
          <p style={{ opacity: 0.7, fontSize: "0.875rem", marginTop: "0.5rem" }}>
            {isLogin ? "Enter your details to access your account." : "Join thousands of readers trading books locally."}
          </p>
        </div>

        {/* OAuth Providers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <button 
            type="button"
            onClick={() => handleOAuthLogin("Google")}
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "var(--surface-hover)"}
          onMouseOut={(e) => e.currentTarget.style.background = "var(--surface)"}>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" width="18" height="18" alt="Google" />
            Google
          </button>
          <button 
            type="button"
            onClick={() => handleOAuthLogin('Apple')}
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "var(--surface-hover)"}
          onMouseOut={(e) => e.currentTarget.style.background = "var(--surface)"}>
            <svg viewBox="0 0 384 512" width="18" height="18" fill="currentColor"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg>
            Apple
          </button>

          <button 
            type="button"
            onClick={() => handleOAuthLogin('Facebook')}
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => { e.currentTarget.style.background = "#1877F2"; e.currentTarget.style.color = "white"; e.currentTarget.style.borderColor = "#1877F2"; }}
          onMouseOut={(e) => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.color = "var(--foreground)"; e.currentTarget.style.borderColor = "var(--border)"; }}>
            <svg viewBox="0 0 320 512" width="18" height="18" fill="currentColor"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>
            Facebook
          </button>

          <button 
            type="button"
            onClick={() => handleOAuthLogin('GitHub')}
            style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            width: "100%",
            padding: "0.75rem",
            borderRadius: "0.5rem",
            border: "1px solid var(--border)",
            background: "var(--surface)",
            color: "var(--foreground)",
            fontWeight: 600,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseOver={(e) => e.currentTarget.style.background = "var(--surface-hover)"}
          onMouseOut={(e) => e.currentTarget.style.background = "var(--surface)"}>
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a5.4 5.4 0 0 0-1.5-3.8 5.4 5.4 0 0 0-.1-3.8s-1.2-.4-3.9 1.4a13.3 13.3 0 0 0-7 0C6.2 1.4 5 1.8 5 1.8a5.4 5.4 0 0 0-.1 3.8A5.4 5.4 0 0 0 3 9.4c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
            GitHub
          </button>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", opacity: 0.5 }}>
          <div style={{ flex: 1, height: "1px", background: "var(--foreground)" }}></div>
          <span style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>or email</span>
          <div style={{ flex: 1, height: "1px", background: "var(--foreground)" }}></div>
        </div>

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          {error && (
            <div style={{ background: "rgba(244, 63, 94, 0.1)", color: "#F43F5E", padding: "1rem", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 600, border: "1px solid rgba(244, 63, 94, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{error}</span>
              {error === "User not found." && (
                <button 
                  type="button" 
                  onClick={() => { setIsLogin(false); setError(""); }}
                  style={{ background: "#F43F5E", color: "white", border: "none", padding: "0.25rem 0.75rem", borderRadius: "0.25rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: "bold" }}>
                  Create Account
                </button>
              )}
            </div>
          )}
          
          {!isLogin && (
            <div>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Full Name</label>
              <input type="text" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--border)",
                background: "var(--surface)",
                color: "var(--foreground)",
                outline: "none",
                transition: "border-color 0.2s"
              }} 
              onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
              onBlur={(e) => e.target.style.borderColor = "var(--border)"}
              />
            </div>
          )}
          
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Email</label>
            <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--foreground)",
              outline: "none",
              transition: "border-color 0.2s"
            }} 
            onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
            onBlur={(e) => e.target.style.borderColor = "var(--border)"}
            />
          </div>

          <div>
             <div style={{ display: "flex", justifyContent: "space-between" }}>
               <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.875rem" }}>Password</label>
               {isLogin && <a href="#" style={{ fontSize: "0.75rem", color: "var(--color-primary)", fontWeight: 600 }}>Forgot password?</a>}
             </div>
             <div style={{ position: "relative" }}>
               <input type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{
                 width: "100%",
                 padding: "0.75rem 1rem",
                 paddingRight: "3rem",
                 borderRadius: "0.5rem",
                 border: "1px solid var(--border)",
                 background: "var(--surface)",
                 color: "var(--foreground)",
                 outline: "none",
                 transition: "border-color 0.2s"
               }} 
               onFocus={(e) => e.target.style.borderColor = "var(--color-primary)"}
               onBlur={(e) => e.target.style.borderColor = "var(--border)"}
               />
               <button 
                 type="button"
                 onClick={() => setShowPassword(!showPassword)}
                 style={{
                   position: "absolute",
                   right: "0.75rem",
                   top: "50%",
                   transform: "translateY(-50%)",
                   background: "none",
                   border: "none",
                   color: "var(--foreground)",
                   opacity: 0.5,
                   cursor: "pointer",
                   display: "flex",
                   alignItems: "center"
                 }}
               >
                 {showPassword ? (
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                 ) : (
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                 )}
               </button>
             </div>
          </div>

          {isLogin && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <input type="checkbox" id="remember" style={{ cursor: "pointer", accentColor: "var(--color-primary)" }} />
              <label htmlFor="remember" style={{ fontSize: "0.875rem", cursor: "pointer", opacity: 0.8 }}>Remember me for 30 days</label>
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem", fontSize: "1.125rem", padding: "0.875rem", fontFamily: "inherit", border: "none", cursor: "pointer" }}>
            {isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>
        
        <p style={{ textAlign: "center", fontSize: "0.875rem", marginTop: "1rem", color: "var(--foreground)", opacity: 0.8 }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(""); }}
            style={{ 
              background: "none", 
              border: "none", 
              color: "var(--color-primary-light)", 
              fontWeight: 800, 
              cursor: "pointer",
              fontFamily: "inherit",
              textDecoration: "underline"
            }}
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}
