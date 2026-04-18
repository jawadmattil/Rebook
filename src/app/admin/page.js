/* eslint-disable */
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

// ----------------- Helper Icons -----------------
const IconHome = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>;
const IconUsers = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>;
const IconBooks = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>;
const IconDollar = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="12" y1="2" x2="12" y2="6" /></svg>;
const IconActivity = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>;
const IconSettings = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>;
const IconSearch = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>;
const IconBell = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>;

const TABS = [
  { name: 'Dashboard', icon: <IconHome /> },
  { name: 'Users', icon: <IconUsers /> },
  { name: 'Books & Listings', icon: <IconBooks /> },
  { name: 'Sold Books', icon: <IconDollar /> },
  { name: 'Transactions', icon: <IconActivity /> },
  { name: 'Reports', icon: <IconActivity /> },
  { name: 'Settings', icon: <IconSettings /> },
];

// ----------------- Sub-Components (Moved outside to fix typing lag/focus issues) -----------------
const StatCard = ({ title, value, icon, trend, positive }) => (
  <div className="glass" style={{ 
    padding: "2rem", 
    borderRadius: "1.5rem", 
    flex: "1 1 240px", 
    display: "flex", 
    flexDirection: "column", 
    gap: "1.25rem", 
    transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)"
  }} 
  onMouseOver={e => {
    e.currentTarget.style.transform="translateY(-8px) scale(1.02)";
    e.currentTarget.style.borderColor="var(--color-primary-light)";
    e.currentTarget.style.boxShadow="0 20px 40px -15px rgba(109, 40, 217, 0.2)";
  }} 
  onMouseOut={e => {
    e.currentTarget.style.transform="translateY(0) scale(1)";
    e.currentTarget.style.borderColor="var(--border)";
    e.currentTarget.style.boxShadow="0 10px 30px -10px rgba(0,0,0,0.05)";
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div style={{ padding: "0.875rem", background: "linear-gradient(135deg, rgba(109, 40, 217, 0.1), rgba(14, 165, 233, 0.1))", borderRadius: "1rem", color: "var(--color-primary)" }}>
        {icon}
      </div>
      <div style={{ fontSize: "0.875rem", display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.8rem", borderRadius: "9999px", background: positive ? "rgba(16, 185, 129, 0.1)" : "rgba(244, 63, 94, 0.1)", color: positive ? "#10b981" : "#f43f5e", fontWeight: 700 }}>
        {positive ? '↑' : '↓'} {trend}%
      </div>
    </div>
    <div>
      <p style={{ fontWeight: 600, opacity: 0.6, fontSize: "0.875rem", marginBottom: "0.25rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>{title}</p>
      <h2 style={{ fontSize: "2.25rem", fontWeight: 900, color: "var(--foreground)" }}>{value}</h2>
    </div>
  </div>
);

const ActivityChart = ({ stats }) => (
  <div className="glass" style={{ padding: "1.5rem", borderRadius: "1rem", flex: 2, height: "300px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
    <h3 style={{ fontWeight: 700, marginBottom: "1rem" }}>Platform Revenue Trend</h3>
    <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", flex: 1 }}>
       {stats.chartData.map((v, i) => (
         <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", gap: "0.5rem" }}>
           <div style={{ 
               width: "100%", 
               height: `${(v/Math.max(...stats.chartData, 120))*100}%`, 
               background: "linear-gradient(to top, var(--color-primary), var(--color-secondary))", 
               borderRadius: "0.5rem",
               opacity: 0.8,
               transition: "all 0.3s ease",
               cursor: "pointer"
            }} 
            onMouseOver={(e) => { e.currentTarget.style.opacity = 1; e.currentTarget.style.filter = "brightness(1.2)"; }}
            onMouseOut={(e) => { e.currentTarget.style.opacity = 0.8; e.currentTarget.style.filter = "brightness(1)"; }}
           />
           <span style={{ fontSize: "0.6rem", textAlign: "center", opacity: 0.5 }}>{['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i]}</span>
         </div>
       ))}
    </div>
  </div>
);

const getStatusBadge = (status) => {
  let bg = "rgba(100, 116, 139, 0.1)";
  let c = "var(--foreground)";
  if (status === "Active" || status === "Completed") { bg = "rgba(16, 185, 129, 0.1)"; c = "#10b981"; }
  else if (status === "Flagged" || status === "Banned") { bg = "rgba(244, 63, 94, 0.1)"; c = "#f43f5e"; }
  else if (status === "Pending Payment" || status === "Pending") { bg = "rgba(245, 158, 11, 0.1)"; c = "#f59e0b"; }

  return (
     <span style={{ fontSize: "0.75rem", fontWeight: "bold", padding: "0.25rem 0.6rem", borderRadius: "9999px", background: bg, color: c }}>
       {status}
     </span>
  );
};

// --- Login Screen Component ---
const AdminLogin = ({ handleLogin, loginForm, setLoginForm, loginError, loginLoading, showPass, setShowPass }) => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--background)", padding: "2rem" }}>
    <div className="glass" style={{ width: "100%", maxWidth: "450px", padding: "3rem", borderRadius: "2rem", animation: "slideUp 0.5s ease-out" }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <h1 className="gradient-text" style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "0.5rem" }}>Admin Portal</h1>
        <p style={{ opacity: 0.7, fontSize: "0.95rem" }}>Secure access to ReBook moderation suite</p>
      </div>

      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.85rem", opacity: 0.8 }}>Admin Email</label>
          <input 
            type="email" 
            required
            value={loginForm.email}
            onChange={e => setLoginForm({...loginForm, email: e.target.value})}
            placeholder="admin@rebook.app" 
            style={{ width: "100%", padding: "1rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none", fontSize: "1rem" }} 
          />
        </div>

        <div>
          <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.85rem", opacity: 0.8 }}>Password</label>
          <div style={{ position: "relative" }}>
            <input 
              type={showPass ? "text" : "password"} 
              required
              value={loginForm.password}
              onChange={e => setLoginForm({...loginForm, password: e.target.value})}
              placeholder="••••••••" 
              style={{ width: "100%", padding: "1rem", paddingRight: "3rem", borderRadius: "1rem", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none", fontSize: "1rem" }} 
            />
            <button 
              type="button" 
              onClick={() => setShowPass(!showPass)} 
              style={{ 
                position: "absolute", 
                right: "1rem", 
                top: "50%", 
                transform: "translateY(-50%)",
                background: "transparent", 
                border: "none", 
                cursor: "pointer", 
                opacity: 0.5,
                display: "flex",
                alignItems: "center"
              }}
            >
               {showPass ? (
                 <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
               ) : (
                 <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
               )}
            </button>
          </div>
        </div>

        {loginError && (
          <div style={{ padding: "1rem", background: "rgba(244, 63, 94, 0.1)", color: "var(--color-accent)", borderRadius: "0.75rem", fontSize: "0.85rem", fontWeight: 600, textAlign: "center", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
            {loginError}
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loginLoading} style={{ width: "100%", padding: "1.1rem", fontSize: "1rem", marginTop: "1rem" }}>
          {loginLoading ? "Authenticating..." : "Login"}
        </button>
      </form>

      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <Link href="/" style={{ fontSize: "0.85rem", opacity: 0.5, fontWeight: 500 }} onMouseOver={e=>e.currentTarget.style.opacity=1} onMouseOut={e=>e.currentTarget.style.opacity=0.5}>Return to Marketplace</Link>
      </div>
    </div>
  </div>
);

export default function AdminConsole() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [stats, setStats] = useState({ totalUsers: 0, activeBooks: 0, totalSales: 0, platformRev: 0, chartData: [30, 45, 25, 60, 40, 80, 55, 90, 70, 100, 85, 120] });

  // Auth State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminProfile, setAdminProfile] = useState({ name: "Admin", email: "admin@rebook.com", role: "Super Admin" });
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Settings State
  const [newAdminForm, setNewAdminForm] = useState({ name: "", email: "", password: "", role: "Moderator" });
  const [showNewAdminPass, setShowNewAdminPass] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editBookData, setEditBookData] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [actionType, setActionType] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const refreshDynamicData = async () => {
    try {
      // 1. Fetch Users
      const usersRes = await fetch('/api/users');
      const usersData = await usersRes.json();
      let dbUsers = [];
      if (usersData.success) {
        dbUsers = usersData.data.map(u => ({
          ...u,
          id: u.id || u._id,
          provider: u.isAdmin ? "Admin" : "Standard",
          joined: new Date(u.createdAt).toLocaleDateString(),
          status: "Active"
        }));
      }

      // 2. Fetch Books
      const booksRes = await fetch('/api/books');
      const booksData = await booksRes.json();
      let dbBooks = [];
      if (booksData.success) {
        dbBooks = booksData.data.map(b => ({
          ...b,
          id: b._id || b.id,
          addedAt: new Date(b.createdAt).toLocaleDateString()
        }));
      }

      setUsers(dbUsers);
      setBooks(dbBooks);

      // 3. Calculate Stats & Transactions
      let totalSales = 0;
      let mockTx = [];
      dbBooks.forEach(b => {
        const p = typeof b.price === 'number' ? b.price : parseInt(String(b.price || "").replace(/[^0-9]/g, '')) || 0;
        if (b.status === 'Sold' || b.status === 'Pending Payment') {
          totalSales += p;
          mockTx.push({
            id: `TX-${String(b.id).slice(-4)}`,
            date: b.addedAt || 'Recently',
            book: b.title,
            seller: b.seller,
            amount: `₹${p}`,
            fee: `₹${(p * 0.02).toFixed(2)}`,
            status: b.status === 'Sold' ? 'Completed' : 'Pending'
          });
        }
      });
      setTransactions(mockTx.reverse());
      
      // Recent Activity
      let acts = [];
      dbUsers.slice(0, 3).forEach(u => acts.push({ title: "New user registered", sub: `${u.name} (${u.email})`, time: u.joined }));
      dbBooks.slice(0, 3).forEach(b => {
        if (b.status === "Sold") acts.push({ title: "Book Sold", sub: `${b.title} by ${b.seller}`, time: b.addedAt });
        else acts.push({ title: "New Listing", sub: `${b.title} added by ${b.seller}`, time: b.addedAt });
      });
      setRecentActivity(acts);

      const chartBase = totalSales > 0 ? (totalSales * 0.02) / 100 : 50;
      const dynamicChart = Array(12).fill(0).map((_, i) => Math.max(10, Math.min(120, chartBase * (Math.random() * 0.5 + 0.5) + (i * 2))));

      setStats({
        totalUsers: dbUsers.length,
        activeBooks: dbBooks.filter(x => x.status === 'Active').length,
        totalSales,
        platformRev: totalSales * 0.02,
        chartData: totalSales > 0 ? dynamicChart : [30, 45, 25, 60, 40, 80, 55, 90, 70, 100, 85, 120]
      });
    } catch (e) {
      console.error("Admin refresh error:", e);
    }
  };

  useEffect(() => {
    const userStr = localStorage.getItem("rebook_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.isAdmin) {
        setIsAuthorized(true);
        setAdminProfile({
          id: user.id || user._id,
          name: user.name,
          email: user.email,
          role: user.role || "Super Admin"
        });
        refreshDynamicData();
      }
    }
    setCheckingAuth(false);
  }, []);

  const handleAdminUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch(`/api/users/${adminProfile.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: adminProfile.name })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Update local storage
      const userStr = localStorage.getItem("rebook_user");
      const user = JSON.parse(userStr);
      user.name = adminProfile.name;
      localStorage.setItem("rebook_user", JSON.stringify(user));
      
      alert("Profile updated successfully!");
    } catch (err) {
      alert(`Update failed: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newAdminForm, isAdmin: true })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      alert(`Team member ${newAdminForm.name} added as ${newAdminForm.role}!`);
      setNewAdminForm({ name: "", email: "", password: "", role: "Moderator" });
      refreshDynamicData();
    } catch (err) {
      alert(`Failed to add admin: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();

      if (!data.success) throw new Error(data.error);
      
      if (!data.user.isAdmin) {
        throw new Error("Access denied. You do not have administrator privileges.");
      }

      localStorage.setItem("rebook_user", JSON.stringify(data.user));
      setIsAuthorized(true);
      refreshDynamicData();
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("rebook_user");
    setIsAuthorized(false);
    window.location.reload();
  };

  const sendMessageToUser = async (recipientName, message, subject) => {
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: "ReBook Admin",
          recipient: recipientName,
          text: `[${subject}]\n${message}`,
          bookId: "system"
        })
      });
    } catch(e){
      console.error("Admin message send error:", e);
    }
  };

  const executeAdminAction = async () => {
    if (!adminMessage.trim() && !actionType.includes("View")) {
      alert("Please provide a message/reason to the user.");
      return;
    }

    try {
      if (actionType === "Delete") {
        const res = await fetch(`/api/books/${selectedBook.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        alert(`Deleted listing: ${selectedBook.title}`);
      } else if (actionType === "Edit") {
        const res = await fetch(`/api/books/${selectedBook.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editBookData)
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        alert(`Updated listing: ${editBookData.title}`);
      } else if (actionType === "Ban User") {
        // Implement User Ban in DB
        const res = await fetch(`/api/users/${selectedUser.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: "Banned" })
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.error);
        alert(`User banned: ${selectedUser.name}`);
      } else if (actionType === "Message User") {
        alert(`Message sent to ${selectedUser.name}`);
      }
      
      // Notify User
      sendMessageToUser(
        selectedBook ? selectedBook.seller : selectedUser.name, 
        adminMessage, 
        actionType === "Edit" ? "Listing Updated" : 
        actionType === "Delete" ? "Listing Removed" : 
        actionType === "Message User" ? "Admin Message" : 
        "Account Notice"
      );
      
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
    
    refreshDynamicData();
    setIsModalOpen(false);
    setAdminMessage("");
  };

  const revertToActive = async (book) => {
    if (!confirm(`Are you sure you want to reactivate "${book.title}"?`)) return;
    
    try {
      const res = await fetch(`/api/books/${book.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Active', buyerName: "" })
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      alert(`Listing "${book.title}" is now Active again.`);
      sendMessageToUser(book.seller, `Your sold listing "${book.title}" has been reactivated by the administrator.`, "Listing Reactivated");
      refreshDynamicData();
    } catch (err) {
      alert(`Error reactivating book: ${err.message}`);
    }
  };

  if (checkingAuth) return null;
  if (!isAuthorized) return (
    <AdminLogin 
      handleLogin={handleLogin} 
      loginForm={loginForm} 
      setLoginForm={setLoginForm} 
      loginError={loginError} 
      loginLoading={loginLoading}
      showPass={showPass}
      setShowPass={setShowPass}
    />
  );

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "var(--background)", overflow:"hidden", position: "relative" }}>
      
      {/* Sidebar Overlay for Mobile */}
      <div 
        className={`nav-overlay ${mobileSidebarOpen ? 'open' : ''}`} 
        onClick={() => setMobileSidebarOpen(false)}
        style={{ zIndex: 100 }}
      ></div>

      {/* Sidebar */}
      <div className={`glass admin-sidebar ${mobileSidebarOpen ? 'open' : ''}`} style={{ 
        width: "280px", 
        display: "flex", 
        flexDirection: "column", 
        padding: "1.5rem", 
        zIndex: 110, 
        margin: "1rem", 
        borderRadius: "1.5rem", 
        border: "1px solid var(--border)",
        transition: "all 0.3s ease-in-out"
      }}>
        <div style={{ marginBottom: "2.5rem", paddingLeft: "0.5rem" }}>
           <Link href="/" className="gradient-text" style={{ fontSize: '1.75rem', fontWeight: 900, display: "flex", alignItems: "center", gap: "0.5rem" }}>
             ReBook 
             <span style={{fontSize:"0.7rem", color:"white", background:"var(--color-primary)", padding:"0.2rem 0.5rem", borderRadius:"9999px", fontWeight:"bold"}}>ADMIN</span>
           </Link>
        </div>

        <nav style={{ display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
          {TABS.map((t, i) => (
            <button key={i} onClick={() => { setActiveTab(t.name); setMobileSidebarOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: "0.75rem",
              padding: "0.875rem 1rem",
              borderRadius: "0.75rem",
              background: activeTab === t.name ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))" : "transparent",
              color: activeTab === t.name ? "white" : "var(--foreground)",
              fontWeight: activeTab === t.name ? 600 : 500,
              boxShadow: activeTab === t.name ? "0 4px 14px 0 rgba(109, 40, 217, 0.39)" : "none",
              transition: "all 0.2s ease",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              fontSize: "0.95rem"
            }}
             onMouseOver={e => { if (activeTab !== t.name) { e.currentTarget.style.background="var(--surface-hover)"; e.currentTarget.style.opacity = 1; } }}
             onMouseOut={e => { if (activeTab !== t.name) { e.currentTarget.style.background="transparent"; e.currentTarget.style.opacity = 0.8; } }}
            >
              <div style={{ opacity: activeTab === t.name ? 1 : 0.6 }}>{t.icon}</div>
              {t.name}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "1rem" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "1.2rem", boxShadow: "0 4px 10px rgba(109, 40, 217, 0.3)" }}>
            {adminProfile.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.9rem", fontWeight: 700 }}>{adminProfile.name}</p>
            <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>{adminProfile.role}</p>
          </div>
          <button onClick={handleLogout} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--color-accent)", opacity: 0.7 }} title="Logout">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "2rem 3rem", overflowY: "auto", height: "100vh" }}>
        
        {/* Top Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3rem", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button 
              className="hamburger" 
              onClick={() => setMobileSidebarOpen(true)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
            <div>
              <h1 style={{ fontSize: "2.25rem", fontWeight: 800 }}>{activeTab}</h1>
              <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>Welcome back, here's what's happening today.</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
            <div style={{ position: "relative" }}>
               <input type="text" placeholder="Global search..." style={{ padding: "0.75rem 1rem 0.75rem 2.5rem", borderRadius: "9999px", border: "1px solid var(--border)", background: "var(--surface)", color: "var(--foreground)", outline: "none", width: "250px", transition: "box-shadow 0.2s" }} onFocus={e=>e.currentTarget.style.boxShadow="0 0 0 2px var(--color-primary-light)"} onBlur={e=>e.currentTarget.style.boxShadow="none"} />
               <div style={{ position: "absolute", left: "12px", top: "12px", opacity: 0.5 }}><IconSearch /></div>
            </div>
            <button style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="var(--surface-hover)"} onMouseOut={e=>e.currentTarget.style.background="var(--surface)"}>
              <IconBell />
            </button>
          </div>
        </div>

        {/* Tab Contents */}
        {activeTab === 'Dashboard' && (
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
             <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
               <StatCard title="Gross Sales Volume" value={`₹${stats.totalSales.toLocaleString()}`} icon={<IconDollar />} trend="12.5" positive={true} />
               <StatCard title="Platform Revenue (2%)" value={`₹${stats.platformRev.toLocaleString()}`} icon={<IconActivity />} trend="14.2" positive={true} />
               <StatCard title="Active Listings" value={stats.activeBooks} icon={<IconBooks />} trend="2.4" positive={false} />
               <StatCard title="Total Users" value={stats.totalUsers} icon={<IconUsers />} trend="8.1" positive={true} />
             </div>
             
             <div style={{ display: "flex", gap: "1.5rem" }}>
                <ActivityChart stats={stats} />
                <div className="glass" style={{ padding: "1.5rem", borderRadius: "1rem", flex: 1, minWidth: "300px" }}>
                   <h3 style={{ fontWeight: 700, marginBottom: "1.5rem" }}>Recent Activity</h3>
                   <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {recentActivity.length === 0 ? (
                        <p style={{ opacity: 0.6, fontSize: "0.9rem" }}>No recent activity yet.</p>
                      ) : (
                        recentActivity.map((act, i) => (
                          <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                             <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-primary)", marginTop: "0.4rem", flexShrink: 0 }}></div>
                             <div>
                                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{act.title}</p>
                                <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>{act.sub}</p>
                                <p style={{ fontSize: "0.7rem", color: "var(--color-primary-light)", marginTop: "0.2rem" }}>{act.time}</p>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Sold Books' && (
          <div className="glass" style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)" }}>
            <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", background: "rgba(109, 40, 217, 0.05)" }}>
              <h3 style={{ fontWeight: 800 }}>Sold Archive</h3>
              <p style={{ fontSize: "0.85rem", opacity: 0.7 }}>Manage your marketplace sales history and reactivate listings if needed.</p>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)", background: "rgba(0,0,0,0.02)" }}>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Book Info</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Seller / Buyer</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Sale Value</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Date Sold</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.filter(b => b.status === "Sold").map((book, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background="var(--surface-hover)"} onMouseOut={(e) => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        {book.photos && book.photos[0] ? (
                           <img src={book.photos[0]} alt="cover" style={{ width: "36px", height: "50px", objectFit: "cover", borderRadius: "4px" }} />
                        ) : (
                           <div style={{ width: "36px", height: "50px", background: "var(--border)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", opacity: 0.5 }}>COV</div>
                        )}
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "0.9rem" }}>{book.title}</p>
                          <p style={{ fontSize: "0.75rem", opacity: 0.6 }}>{book.author}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem" }}>
                       <p style={{ fontSize: "0.85rem", fontWeight: 600 }}>S: {book.seller}</p>
                       <p style={{ fontSize: "0.85rem", color: "var(--color-primary-light)" }}>B: {book.buyerName || "Guest / Manual"}</p>
                    </td>
                    <td style={{ padding: "1rem" }}>
                       <p style={{ fontWeight: 700, color: "#10b981" }}>₹{book.price}</p>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.8rem", opacity: 0.7 }}>{book.addedAt || "Recent"}</td>
                    <td style={{ padding: "1rem", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                       <button onClick={() => { setSelectedBook(book); setActionType("View Details"); setIsModalOpen(true); }} style={{ background: "transparent", border: "1px solid var(--border)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600 }}>View</button>
                       <button onClick={() => revertToActive(book)} style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.2)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer", color: "#10b981", fontSize: "0.75rem", fontWeight: 600 }}>Reverse to Active</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Books & Listings' && (
          <div className="glass" style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)", background: "rgba(0,0,0,0.02)" }}>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Listing Details</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Seller</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Price</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Added</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Status</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background="var(--surface-hover)"} onMouseOut={(e) => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                        {book.photos && book.photos[0] ? (
                           <img src={book.photos[0]} alt="cover" style={{ width: "40px", height: "56px", objectFit: "cover", borderRadius: "4px" }} />
                        ) : book.images && book.images[0] ? (
                           <img src={book.images[0]} alt="cover" style={{ width: "40px", height: "56px", objectFit: "cover", borderRadius: "4px" }} />
                        ) : book.cover ? (
                           <img src={book.cover} alt="cover" style={{ width: "40px", height: "56px", objectFit: "cover", borderRadius: "4px" }} />
                        ) : book.image ? (
                           <img src={book.image} alt="cover" style={{ width: "40px", height: "56px", objectFit: "cover", borderRadius: "4px" }} />
                        ) : (
                           <div style={{ width: "40px", height: "56px", background: "var(--border)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6rem", opacity: 0.5, flexShrink: 0 }}>COV</div>
                        )}
                        <div>
                          <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{book.title}</p>
                          <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>{book.author} • {book.id}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.875rem", color: "var(--color-primary-light)", fontWeight: 600 }}>{book.seller.split(' (')[0]}</td>
                    <td style={{ padding: "1rem" }}>
                       <p style={{ fontWeight: 700 }}>₹{book.price}</p>
                       {book.mrp && <p style={{ fontSize: "0.7rem", opacity: 0.5, textDecoration: "line-through" }}>MRP ₹{book.mrp}</p>}
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.85rem", opacity: 0.8 }}>{book.addedAt || "Oct 24, 2026"}</td>
                    <td style={{ padding: "1rem" }}>{getStatusBadge(book.status)}</td>
                    <td style={{ padding: "1rem", textAlign: "right", display: "flex", justifyContent: "flex-end", gap: "0.5rem" }}>
                       <button onClick={() => { setSelectedBook(book); setActionType("View Details"); setIsModalOpen(true); }} style={{ background: "transparent", border: "1px solid var(--border)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer", color: "var(--color-primary-light)", fontSize: "0.8rem", fontWeight: 600, transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="var(--surface-hover)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>View</button>
                       <button onClick={() => { setSelectedBook(book); setEditBookData({...book, buyerName: ""}); setActionType("Edit"); setIsModalOpen(true); }} style={{ background: "transparent", border: "1px solid var(--border)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer", color: "var(--foreground)", fontSize: "0.8rem", fontWeight: 600, transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="var(--surface-hover)"} onMouseOut={e=>e.currentTarget.style.background="transparent"}>Edit</button>
                       <button onClick={() => { setSelectedBook(book); setActionType("Delete"); setIsModalOpen(true); }} style={{ background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.2)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer", color: "#f43f5e", fontSize: "0.8rem", fontWeight: 600, transition: "0.2s" }} onMouseOver={e=>e.currentTarget.style.background="rgba(244, 63, 94, 0.2)"} onMouseOut={e=>e.currentTarget.style.background="rgba(244, 63, 94, 0.1)"}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Users' && (
          <div className="glass" style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)", background: "rgba(0,0,0,0.02)" }}>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>User Profile</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Auth Provider</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Joined</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Status</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background="var(--surface-hover)"} onMouseOut={(e) => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding: "1rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                         <div style={{ 
                           width: "36px", 
                           height: "36px", 
                           borderRadius: "50%", 
                           backgroundImage: user.avatar ? `url(${user.avatar})` : "linear-gradient(135deg, var(--color-secondary), var(--color-primary-light))", 
                           backgroundSize: "cover",
                           backgroundPosition: "center",
                           color: "white", 
                           display: "flex", 
                           alignItems: "center", 
                           justifyContent: "center", 
                           fontWeight: "bold",
                           overflow: "hidden"
                         }}>
                           {!user.avatar && user.name.charAt(0).toUpperCase()}
                         </div>
                         <div>
                           <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{user.name}</p>
                           <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>{user.email} • {user.id}</p>
                         </div>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.85rem", fontWeight: 600 }}>
                      <span style={{ padding: "0.3rem 0.6rem", borderRadius: "0.5rem", background: "var(--surface-hover)", border: "1px solid var(--border)"}}>
                        {user.provider}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "0.85rem", opacity: 0.8 }}>{user.joined}</td>
                    <td style={{ padding: "1rem" }}>{getStatusBadge(user.status)}</td>
                    <td style={{ padding: "1rem", textAlign: "right" }}>
                       <button onClick={() => { setSelectedUser(user); setActionType("View User"); setIsModalOpen(true); }} style={{ background: "transparent", border: "1px solid var(--border)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer", color: "var(--foreground)", marginRight: "0.5rem", fontSize: "0.8rem", fontWeight: 600 }}>View</button>
                       <button onClick={() => { setSelectedUser(user); setActionType("Message User"); setIsModalOpen(true); }} style={{ background: "transparent", border: "1px solid var(--color-primary-light)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer", color: "var(--color-primary-light)", marginRight: "0.5rem", fontSize: "0.8rem", fontWeight: 600 }}>Message</button>
                       <button onClick={() => { setSelectedUser(user); setActionType("Ban User"); setIsModalOpen(true); }} style={{ background: "rgba(244, 63, 94, 0.1)", border: "1px solid rgba(244, 63, 94, 0.2)", padding: "0.4rem 0.8rem", borderRadius: "0.5rem", cursor: "pointer", color: "#f43f5e", fontSize: "0.8rem", fontWeight: 600 }}>Ban</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Transactions' && (
          <div className="glass" style={{ borderRadius: "1rem", overflow: "hidden", border: "1px solid var(--border)", background: "var(--surface)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid var(--border)", background: "rgba(0,0,0,0.02)" }}>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Transaction ID / Date</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Book Info</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Amount</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Platform Fee (2%)</th>
                  <th style={{ padding: "1.25rem 1rem", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "1px", textTransform: "uppercase", opacity: 0.7 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)", transition: "background 0.2s" }} onMouseOver={(e) => e.currentTarget.style.background="var(--surface-hover)"} onMouseOut={(e) => e.currentTarget.style.background="transparent"}>
                    <td style={{ padding: "1rem" }}>
                       <p style={{ fontWeight: 700, fontSize: "0.95rem" }}>{tx.id}</p>
                       <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>{tx.date}</p>
                    </td>
                    <td style={{ padding: "1rem" }}>
                       <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{tx.book}</p>
                       <p style={{ fontSize: "0.75rem", opacity: 0.7 }}>Seller: {tx.seller}</p>
                    </td>
                    <td style={{ padding: "1rem", fontSize: "1rem", fontWeight: 800 }}>{tx.amount}</td>
                    <td style={{ padding: "1rem", fontSize: "0.9rem", fontWeight: 700, color: "var(--color-primary-light)" }}>+ {tx.fee}</td>
                    <td style={{ padding: "1rem" }}>{getStatusBadge(tx.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'Settings' && (
           <div style={{ display: "flex", gap: "2rem" }}>
              <div className="glass" style={{ flex: 1, padding: "2.5rem", borderRadius: "1.5rem" }}>
                 <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Administrator Profile</h3>
                 <p style={{ opacity: 0.7, marginBottom: "2rem", fontSize: "0.9rem" }}>Update your display name and login information.</p>
                 
                 <form onSubmit={handleAdminUpdate} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.85rem", opacity: 0.8 }}>Full Name</label>
                      <input 
                        value={adminProfile.name} 
                        onChange={e => setAdminProfile({...adminProfile, name: e.target.value})}
                        style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.85rem", opacity: 0.8 }}>Email Address</label>
                      <input 
                        disabled 
                        value={adminProfile.email} 
                        style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "rgba(0,0,0,0.05)", color: "var(--foreground)", opacity: 0.7 }} 
                      />
                      <p style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: "0.5rem" }}>Contact support to change your primary admin email.</p>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginTop: "1rem", padding: "1rem" }} disabled={isSaving}>
                      {isSaving ? "Saving Changes..." : "Save Profile"}
                    </button>
                 </form>
              </div>

              <div className="glass" style={{ flex: 1.5, padding: "2.5rem", borderRadius: "1.5rem" }}>
                 <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Add Team Member</h3>
                 <p style={{ opacity: 0.7, marginBottom: "2rem", fontSize: "0.9rem" }}>Invite another user to the management panel with specific permissions.</p>

                 <form onSubmit={handleAddAdmin} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.85rem", opacity: 0.8 }}>Member Full Name</label>
                      <input 
                        required
                        value={newAdminForm.name}
                        onChange={e => setNewAdminForm({...newAdminForm, name: e.target.value})}
                        placeholder="e.g. Sarah Connor"
                        style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.85rem", opacity: 0.8 }}>Login Email</label>
                      <input 
                        type="email"
                        required
                        value={newAdminForm.email}
                        onChange={e => setNewAdminForm({...newAdminForm, email: e.target.value})}
                        placeholder="sarah@rebook.app"
                        style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.85rem", opacity: 0.8 }}>Initial Password</label>
                      <div style={{ position: "relative" }}>
                        <input 
                          type={showNewAdminPass ? "text" : "password"}
                          required
                          value={newAdminForm.password}
                          onChange={e => setNewAdminForm({...newAdminForm, password: e.target.value})}
                          placeholder="••••••••"
                          style={{ width: "100%", padding: "1rem", paddingRight: "3rem", borderRadius: "0.75rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} 
                        />
                        <button 
                          type="button"
                          onClick={() => setShowNewAdminPass(!showNewAdminPass)}
                          style={{
                            position: "absolute",
                            right: "1rem",
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
                          {showNewAdminPass ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.85rem", opacity: 0.8 }}>Administrative Role</label>
                      <select 
                        value={newAdminForm.role}
                        onChange={e => setNewAdminForm({...newAdminForm, role: e.target.value})}
                        style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "2px solid var(--color-primary-light)", background: "var(--background)", color: "var(--foreground)", fontWeight: 700 }}
                      >
                         <option value="Super Admin">Super Admin (Full Access)</option>
                         <option value="Moderator">Moderator (Manage Listings & Users)</option>
                         <option value="Editor">Editor (Edit Descriptions & Prices only)</option>
                      </select>
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ gridColumn: "span 2", marginTop: "1rem", padding: "1rem" }} disabled={isSaving}>
                       {isSaving ? "Creating Account..." : "Grant Admin Access"}
                    </button>
                 </form>
              </div>
           </div>
        )}

        {activeTab === 'Reports' && (
          <div className="glass" style={{ padding: "4rem", borderRadius: "1rem", textAlign: "center", border: "1px dashed var(--border)" }}>
             <div style={{ opacity: 0.3, marginBottom: "1rem", transform: "scale(2)" }}>
                {activeTab === 'Reports' ? <IconActivity /> : <IconSettings />}
             </div>
             <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>{activeTab} Module</h2>
             <p style={{ opacity: 0.6, maxWidth: "400px", margin: "0 auto" }}>This module is currently under development. It will provide advanced configurations and deep-dive analytics in v2.0.</p>
          </div>
        )}

      </div>
      
      {/* Admin Action Modal */}
      {isModalOpen && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem", backdropFilter: "blur(4px)" }}>
          <div className="glass" style={{ width: "100%", maxWidth: (actionType === "View Details" || actionType === "View User") ? "800px" : "500px", padding: "2.5rem", borderRadius: "1.5rem", background: "var(--surface)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)", animation: "slideUp 0.3s ease-out" }}>
            
            {actionType === "View User" && selectedUser && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                   <div>
                     <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>{selectedUser.name}</h2>
                     <p style={{ opacity: 0.8, fontSize: "1rem" }}>{selectedUser.email}</p>
                   </div>
                   {getStatusBadge(selectedUser.status)}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                   <div><p style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, fontWeight: 700 }}>User ID</p><p style={{ fontWeight: 600 }}>{selectedUser.id}</p></div>
                   <div><p style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, fontWeight: 700 }}>Joined</p><p style={{ fontWeight: 600 }}>{selectedUser.joined}</p></div>
                   <div><p style={{ fontSize: "0.75rem", textTransform: "uppercase", opacity: 0.6, fontWeight: 700 }}>Auth Provider</p><p style={{ fontWeight: 600 }}>{selectedUser.provider}</p></div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid var(--border)", paddingTop: "1.5rem" }}>
                   <button onClick={() => setIsModalOpen(false)} className="btn btn-secondary">Close</button>
                </div>
              </div>
            )}
            
            {actionType === "Message User" && selectedUser && (
              <>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Message User</h2>
                <p style={{ opacity: 0.8, marginBottom: "2rem", fontSize: "0.9rem" }}>Direct message to: <strong style={{ color: "var(--color-primary-light)" }}>{selectedUser.name}</strong> ({selectedUser.email})</p>

                <label style={{ display: "block", marginBottom: "0.75rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--foreground)" }}>Your Message</label>
                <textarea 
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Type your message here..." 
                  rows={6}
                  style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "2px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none", resize: "vertical", marginBottom: "2rem", fontFamily: "inherit" }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                   <button onClick={() => { setIsModalOpen(false); setAdminMessage(""); }} className="btn btn-secondary">Cancel</button>
                   <button onClick={executeAdminAction} className="btn btn-primary">Send Message</button>
                </div>
              </>
            )}

            {actionType === "Ban User" && selectedUser && (
              <>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Ban User</h2>
                <p style={{ opacity: 0.8, marginBottom: "2rem", fontSize: "0.9rem" }}>Taking action upon: <strong style={{ color: "var(--color-primary-light)" }}>{selectedUser.name}</strong> ({selectedUser.email})</p>

                <label style={{ display: "block", marginBottom: "0.75rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--foreground)" }}>Reason for Ban (Sent to User)</label>
                <textarea 
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Explain why this account is being banned..." 
                  rows={4}
                  style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "2px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none", resize: "vertical", marginBottom: "2rem", fontFamily: "inherit" }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                   <button onClick={() => { setIsModalOpen(false); setAdminMessage(""); }} className="btn btn-secondary">Cancel</button>
                   <button onClick={executeAdminAction} className="btn btn-primary" style={{ background: "linear-gradient(135deg, #e11d48, #f43f5e)", border: "none" }}>Confirm Ban</button>
                </div>
              </>
            )}

            {actionType === "View Details" && selectedBook ? (
              <div style={{ maxHeight: "75vh", overflowY: "auto", paddingRight: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                   <div>
                     <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.25rem" }}>{selectedBook.title}</h2>
                     <p style={{ opacity: 0.8, fontSize: "1rem" }}>by {selectedBook.author}</p>
                   </div>
                   {getStatusBadge(selectedBook.status)}
                </div>
            
                {/* Images */}
                <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1.5rem", marginBottom: "1.5rem", borderBottom: "1px solid var(--border)" }}>
                   {selectedBook.photos && selectedBook.photos.length > 0 ? (
                      selectedBook.photos.map((img, idx) => (
                         <img key={idx} src={img} alt={`Book image ${idx}`} style={{ height: "200px", borderRadius: "0.75rem", objectFit: "cover", border: "1px solid var(--border)" }} />
                      ))
                   ) : selectedBook.images && selectedBook.images.length > 0 ? (
                      selectedBook.images.map((img, idx) => (
                         <img key={idx} src={img} alt={`Book image ${idx}`} style={{ height: "200px", borderRadius: "0.75rem", objectFit: "cover", border: "1px solid var(--border)" }} />
                      ))
                   ) : selectedBook.cover ? (
                      <img src={selectedBook.cover} alt="Book cover" style={{ height: "200px", borderRadius: "0.75rem", objectFit: "cover", border: "1px solid var(--border)" }} />
                   ) : selectedBook.image ? (
                      <img src={selectedBook.image} alt="Book cover" style={{ height: "200px", borderRadius: "0.75rem", objectFit: "cover", border: "1px solid var(--border)" }} />
                   ) : (
                      <div style={{ height: "200px", width: "150px", background: "var(--surface-hover)", borderRadius: "0.75rem", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)", opacity: 0.5, flexShrink: 0 }}>No Image</div>
                   )}
                </div>
            
                {/* Details Grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
                   <div>
                     <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6, fontWeight: 700, marginBottom: "0.25rem" }}>Selling Price</p>
                     <p style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--color-primary-light)" }}>₹{selectedBook.price}</p>
                   </div>
                   <div>
                     <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6, fontWeight: 700, marginBottom: "0.25rem" }}>Original MRP</p>
                     <p style={{ fontSize: "1.25rem", fontWeight: 800, opacity: 0.6, textDecoration: "line-through" }}>₹{selectedBook.mrp || "N/A"}</p>
                   </div>
                   <div>
                     <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6, fontWeight: 700, marginBottom: "0.25rem" }}>Condition</p>
                     <p style={{ fontSize: "1rem", fontWeight: 600 }}>{selectedBook.condition || "Not Specified"}</p>
                   </div>
                   <div>
                     <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6, fontWeight: 700, marginBottom: "0.25rem" }}>Seller</p>
                     <p style={{ fontSize: "1rem", fontWeight: 600 }}>{selectedBook.seller}</p>
                   </div>
                   <div>
                     <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6, fontWeight: 700, marginBottom: "0.25rem" }}>Listing ID</p>
                     <p style={{ fontSize: "1rem", fontWeight: 600 }}>{selectedBook.id}</p>
                   </div>
                </div>
                
                <div>
                  <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.6, fontWeight: 700, marginBottom: "0.5rem" }}>Description</p>
                  <p style={{ fontSize: "0.95rem", lineHeight: 1.6, opacity: 0.9 }}>{selectedBook.description || "No description provided by the seller."}</p>
                </div>
            
                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "2.5rem", paddingTop: "1.5rem", borderTop: "1px solid var(--border)" }}>
                   <button onClick={() => { setIsModalOpen(false); }} className="btn" style={{ padding: "0.75rem 1.5rem", background: "var(--surface-hover)", borderRadius: "9999px", fontWeight: 600, border: "none", color: "var(--foreground)", cursor: "pointer" }}>Close</button>
                </div>
              </div>
            ) : actionType === "Edit" && selectedBook && editBookData ? (
              <div style={{ maxHeight: "80vh", overflowY: "auto", paddingRight: "0.5rem" }}>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Edit Listing</h2>
                <p style={{ opacity: 0.8, marginBottom: "1.5rem", fontSize: "0.9rem" }}>Modifying listing format for <strong style={{color:"var(--color-primary-light)"}}>{selectedBook.title}</strong></p>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7 }}>Title</label>
                      <input value={editBookData.title} onChange={e=>setEditBookData({...editBookData, title: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7 }}>Selling Price</label>
                      <input value={editBookData.price} onChange={e=>setEditBookData({...editBookData, price: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7 }}>Original MRP</label>
                      <input value={editBookData.mrp} onChange={e=>setEditBookData({...editBookData, mrp: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                    </div>
                  </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7 }}>Condition</label>
                    <input value={editBookData.condition} onChange={e=>setEditBookData({...editBookData, condition: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7 }}>Status</label>
                    <select value={editBookData.status} onChange={e=>setEditBookData({...editBookData, status: e.target.value})} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}>
                      <option>Active</option>
                      <option>Sold</option>
                      <option>Pending Payment</option>
                      <option>Flagged</option>
                    </select>
                  </div>
                </div>

                {editBookData.status === "Sold" && (
                   <div style={{ marginBottom: "1rem" }}>
                     <label style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7 }}>Assign to Buyer (Name)</label>
                     <input 
                       value={editBookData.buyerName || ""} 
                       onChange={e=>setEditBookData({...editBookData, buyerName: e.target.value})} 
                       placeholder="e.g. John Doe (Leave empty for 'Admin Manual Checkout')" 
                       style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "2px solid var(--color-primary-light)", background: "rgba(109, 40, 217, 0.05)", color: "var(--foreground)" }} 
                     />
                   </div>
                )}

                <div style={{ marginBottom: "1.5rem" }}>
                  <label style={{ fontSize: "0.8rem", fontWeight: 700, opacity: 0.7 }}>Description</label>
                  <textarea value={editBookData.description || ""} onChange={e=>setEditBookData({...editBookData, description: e.target.value})} rows={3} style={{ width: "100%", padding: "0.75rem", borderRadius: "0.5rem", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)", resize: "vertical" }} />
                </div>

                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--foreground)" }}>Reason for Edit (Sent to User Inbox)</label>
                <textarea 
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Explain why this listing is being edited..." 
                  rows={3}
                  style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "2px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none", resize: "vertical", marginBottom: "2rem" }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                   <button onClick={() => { setIsModalOpen(false); setAdminMessage(""); }} className="btn btn-secondary">Cancel</button>
                   <button onClick={executeAdminAction} className="btn btn-primary">Save & Notify</button>
                </div>
              </div>
            ) : actionType === "Delete" && selectedBook ? (
              <>
                <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Delete Listing</h2>
                <p style={{ opacity: 0.8, marginBottom: "2rem", fontSize: "0.9rem" }}>Taking action upon: <strong style={{ color: "var(--color-primary-light)" }}>{selectedBook.title}</strong> by {selectedBook.seller}</p>

                <label style={{ display: "block", marginBottom: "0.75rem", fontWeight: 600, fontSize: "0.9rem", color: "var(--foreground)" }}>Reason (Sent to User)</label>
                <textarea 
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                  placeholder="Explain why this listing is being deleted..." 
                  rows={4}
                  style={{ width: "100%", padding: "1rem", borderRadius: "0.75rem", border: "2px solid var(--border)", background: "var(--background)", color: "var(--foreground)", outline: "none", resize: "vertical", marginBottom: "2rem" }}
                />

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem" }}>
                   <button onClick={() => { setIsModalOpen(false); setAdminMessage(""); }} className="btn btn-secondary">Cancel</button>
                   <button onClick={executeAdminAction} className="btn btn-primary" style={{ background: "linear-gradient(135deg, #e11d48, #f43f5e)", border: "none" }}>Confirm Delete</button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}

    </div>
  );
}
