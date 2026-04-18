"use client";
import { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";

function MessagesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const recipientName = searchParams.get("recipient");
  const bookIdParam = searchParams.get("bookId");
  
  const [currentUser, setCurrentUser] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [inputText, setInputText] = useState("");
  const isFetchingBus = useRef(false);
  const messagesEndRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("rebook_user");
    if (!userStr) {
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);
    setCurrentUser(user);

    loadChats(user, recipientName, bookIdParam);

    const interval = setInterval(() => {
        loadChats(user, recipientName, bookIdParam, false);
    }, 3000);

    return () => clearInterval(interval);
  }, [recipientName, bookIdParam, router]);

  const loadChats = async (user, initialRecipient, initialBookId, isFirstLoad = true) => {
    if (!user || !user.name) return;
    if (isFetchingBus.current && !isFirstLoad) return;
    try {
      isFetchingBus.current = true;
      const url = `/api/messages?user=${encodeURIComponent(user.name)}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const data = await res.json();
      if (!data.success) return;
      const allMessages = data.data;

      const chatGroups = {};
      allMessages.forEach(msg => {
        const otherParticipant = msg.sender === user.name ? msg.recipient : msg.sender;
        const chatId = msg.bookId === 'system' ? 'admin_chat' : `${otherParticipant}_${msg.bookId || 'general'}`;
        
        if (!chatGroups[chatId]) {
          const isSystem = msg.bookId === 'system';
          chatGroups[chatId] = {
            id: chatId,
            participants: [user.name, otherParticipant],
            bookId: msg.bookId,
            bookTitle: isSystem ? 'System Notification' : (msg.bookTitle || 'Book Inquiry'),
            messages: [],
            lastUpdated: new Date(msg.createdAt).getTime(),
            unreadCount: 0
          };
        }
        
        chatGroups[chatId].messages.push({
          sender: msg.sender,
          text: msg.text,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          timestamp: new Date(msg.createdAt).getTime()
        });
        if (msg.recipient === user.name && !msg.isRead) chatGroups[chatId].unreadCount++;
        if (new Date(msg.createdAt).getTime() > chatGroups[chatId].lastUpdated) {
          chatGroups[chatId].lastUpdated = new Date(msg.createdAt).getTime();
        }
      });

      let myChats = Object.values(chatGroups);

      if (initialRecipient && initialBookId) {
        const targetId = `${initialRecipient}_${initialBookId}`;
        if (!chatGroups[targetId]) {
          myChats.push({
            id: targetId,
            participants: [user.name, initialRecipient],
            bookId: initialBookId,
            bookTitle: "New Inquiry",
            messages: [],
            lastUpdated: Date.now(),
            unreadCount: 0
          });
          if (isFirstLoad) setActiveChatId(targetId);
        } else if (isFirstLoad) {
          setActiveChatId(targetId);
        }
      }

      myChats.sort((a, b) => b.lastUpdated - a.lastUpdated);

      if (isFirstLoad && myChats.length > 0 && !activeChatId && !initialRecipient) {
        setActiveChatId(myChats[0].id);
      }
      setChats(myChats);
    } catch (err) { 
      console.error("Inbox Polling Error:", err); 
    } finally {
      isFetchingBus.current = false;
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chats, activeChatId]);

  const sendMessage = async () => {
    if (!inputText.trim() || !activeChatId || !currentUser) return;
    const chat = chats.find(c => c.id === activeChatId);
    if (!chat) return;
    const otherParticipant = chat.participants.find(p => p !== currentUser.name);

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: currentUser.name,
          recipient: otherParticipant,
          text: inputText.trim(),
          bookId: chat.bookId
        })
      });
      if (res.ok) {
        setInputText("");
        loadChats(currentUser, null, null, false);
      }
    } catch (err) { console.error(err); }
  };

  const handleChatClick = async (chatId) => {
    setActiveChatId(chatId);
    
    const chat = chats.find(c => c.id === chatId);
    if (!chat || !currentUser) return;

    if (chat.unreadCount > 0) {
      try {
        const otherParticipant = chat.participants.find(p => p !== currentUser.name);
        await fetch('/api/messages', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user: currentUser.name,
            other: otherParticipant,
            bookId: chat.bookId
          })
        });
        setChats(prev => prev.map(c => c.id === chatId ? { ...c, unreadCount: 0 } : c));
      } catch (err) { console.error(err); }
    }
  };

  const activeChat = chats.find(c => c.id === activeChatId);
  const otherPersonName = activeChat ? activeChat.participants.find(p => p !== (currentUser?.name)) : "";

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Navigation */}
      <nav className="glass" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        padding: '1rem 0',
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
             <Link href="/profile" style={{ fontWeight: 500 }} onClick={() => setMobileMenuOpen(false)}>Profile</Link>
             <Link href="/" style={{ fontWeight: 500 }} onClick={() => setMobileMenuOpen(false)}>Browse</Link>
             <Link href="/" className="btn btn-secondary" onClick={() => { setMobileMenuOpen(false); localStorage.removeItem("rebook_user"); }} style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}>Sign Out</Link>
          </div>
        </div>
      </nav>

      {/* Messaging UI */}
      <div className="container" style={{ 
        flex: 1, 
        display: "flex", 
        gap: "2rem", 
        padding: "2rem 1.5rem", 
        height: "calc(100vh - 80px)",
        maxWidth: "1400px" // Wider for desktop readability
      }}>
        
        {/* Chat List */}
        <div className="glass chat-list-sidebar" style={{ 
          width: "380px", // Slightly wider
          borderRadius: "1.5rem", 
          overflow: "hidden", 
          display: "flex", 
          flexDirection: "column",
          transition: "all 0.3s ease",
          background: "var(--surface)"
        }}>
          <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800 }}>Messages</h2>
          </div>
          <div style={{ overflowY: "auto", flex: 1 }}>
            {chats.length === 0 ? (
              <div style={{ padding: "2rem", textAlign: "center", opacity: 0.6 }}>
                No messages yet.
              </div>
            ) : chats.map((chat) => {
              const otherUser = chat.participants.find(p => p !== currentUser?.name) || "Unknown User";
              const lastMsgObj = chat.messages[chat.messages.length - 1];
              const lastMsgText = lastMsgObj ? lastMsgObj.text : "No messages yet.";
              const unreadCount = chat.unread?.[currentUser?.name] || 0;
              const timeDisplay = lastMsgObj ? lastMsgObj.time : new Date(chat.lastUpdated).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

              return (
                <div 
                  key={chat.id} 
                  onClick={() => handleChatClick(chat.id)}
                  style={{ 
                    padding: "1.5rem", 
                    borderBottom: "1px solid var(--border)", 
                    cursor: "pointer",
                    background: activeChatId === chat.id ? "var(--surface-hover)" : "transparent",
                    transition: "background 0.2s"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <h3 style={{ fontWeight: 700 }}>{otherUser}</h3>
                    <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>{timeDisplay}</span>
                  </div>
                  <p style={{ fontSize: "0.875rem", color: "var(--color-primary)", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Regarding: {chat.bookTitle}
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <p style={{ fontSize: "0.875rem", opacity: 0.8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "80%" }}>
                      {lastMsgText}
                    </p>
                    {unreadCount > 0 && (
                      <span style={{ background: "var(--color-accent)", color: "white", padding: "0.1rem 0.5rem", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: "bold" }}>
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chat Window */}
        <div className={`glass chat-window ${activeChat ? 'active' : ''}`} style={{ 
          flex: 1, 
          borderRadius: "1.5rem", 
          display: "flex", 
          flexDirection: "column", 
          overflow: "hidden",
          background: "var(--surface)"
        }}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                  <button 
                    onClick={() => setActiveChatId(null)} 
                    style={{ 
                      display: "none", // Will be shown by media query but hidden by default on desktop
                      background: "none", 
                      border: "none", 
                      cursor: "pointer", 
                      padding: "0.5rem",
                      color: "var(--foreground)" 
                    }}
                    className="mobile-back-btn"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5M12 19l-7-7 7-7"/>
                    </svg>
                  </button>
                  <div>
                    <h2 style={{ fontSize: "1.25rem", fontWeight: 800 }}>{otherPersonName}</h2>
                    <span style={{ fontSize: "0.875rem", color: "var(--color-primary-light)", fontWeight: 600 }}>
                      {activeChatId === "admin_chat" ? activeChat.bookTitle : `Regarding: ${activeChat.bookTitle}`}
                    </span>
                  </div>
                </div>
                {activeChatId !== "admin_chat" && (
                  <Link href={`/checkout?bookId=${activeChat.bookId}`} className="btn btn-primary" style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}>
                    Request Payment
                  </Link>
                )}
              </div>

              {/* Messages Area */}
              <div style={{ flex: 1, padding: "1.5rem", overflowY: "auto", display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activeChat.messages.length === 0 ? (
                  <div style={{ alignSelf: "center", opacity: 0.5, marginTop: "auto", marginBottom: "auto" }}>
                    Say hi to {otherPersonName}!
                  </div>
                ) : (
                  activeChat.messages.map((msg, i) => {
                    const isMe = msg.sender === currentUser?.name;
                    return (
                      <div key={i} style={{ 
                        maxWidth: "70%", 
                        alignSelf: isMe ? "flex-end" : "flex-start", 
                        padding: "1rem", 
                        borderRadius: isMe ? "1rem 1rem 0 1rem" : "1rem 1rem 1rem 0", 
                        background: isMe ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))" : "var(--surface)", 
                        color: isMe ? "white" : "inherit",
                        border: isMe ? "none" : "1px solid var(--border)",
                        whiteSpace: "pre-wrap"
                      }}>
                        <p style={{ marginBottom: "0.25rem" }}>{msg.text}</p>
                        <span style={{ fontSize: "0.7rem", opacity: isMe ? 0.8 : 0.5 }}>{msg.time}</span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              {activeChatId !== "admin_chat" ? (
                <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)" }}>
                  <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} style={{ display: "flex", gap: "1rem", width: "100%" }}>
                    <input 
                      type="text" 
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Type your message..." 
                      style={{
                        flex: 1,
                        padding: "1rem 1.5rem",
                        borderRadius: "9999px",
                        border: "1px solid var(--border)",
                        background: "var(--surface)",
                        color: "var(--foreground)",
                        outline: "none",
                        fontSize: "1rem"
                      }} 
                    />
                    <button type="submit" disabled={!inputText.trim()} className="btn btn-primary" style={{ padding: "0 2rem", borderRadius: "9999px", cursor: inputText.trim() ? "pointer" : "not-allowed", opacity: inputText.trim() ? 1 : 0.5 }}>
                      Send
                    </button>
                  </form>
                </div>
              ) : (
                <div style={{ padding: "1.5rem", borderTop: "1px solid var(--border)", textAlign: "center", opacity: 0.6, fontSize: "0.875rem" }}>
                  This is a system notification channel. Replies are disabled.
                </div>
              )}
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5, flexDirection: "column", gap: "1rem" }}>
              <div style={{ marginBottom: '1.5rem', color: 'var(--color-primary)', opacity: 0.3 }}>
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/>
                  <path d="M8 9h8"/>
                  <path d="M8 13h6"/>
                </svg>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 700, opacity: 0.8 }}>Select a chat to start messaging</h2>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default function Messages() {
  return (
    <Suspense fallback={<div>Loading Messages...</div>}>
      <MessagesContent />
    </Suspense>
  )
}

