# ReBook 📚 - Second-Hand Bookstore Marketplace

ReBook is a modern, full-stack marketplace designed for buying and selling second-hand books locally. Built with Next.js and MongoDB, it features AI-powered book condition analysis, ISBN-based listing, and a premium glassmorphic user interface.

## ✨ Key Features

- **AI Condition Analysis**: Automatically assesses book conditions from uploaded photos.
- **Fast Listings**: Auto-fill book details using ISBN lookup (OpenLibrary API).
- **MongoDB Integration**: Robust data persistence for listings, orders, and messages.
- **Pricing Transparency**: Integrated MRP and discounted selling prices.
- **Dynamic Search**: Filter books by category, price, condition, and distance.
- **User Dashboards**: Dedicated views for sellers and buyers to manage listings and orders.
- **Messaging System**: Built-in communication between buyers and sellers.

## 🛠 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: MongoDB Atlas (Mongoose)
- **Styling**: Vanilla CSS (Premium Glassmorphism)
- **API**: Next.js API Routes
- **Platform Utils**: React 19, Lucide Icons (Mocked)

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jawadmattil/Rebook.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file with the following:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open the app**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎨 UI Aesthetics

The application follows a premium "Glassmorphic" design language, featuring:
- Translucent surfaces with background blur.
- Vibrant gradients and subtle micro-animations.
- Full dark mode support tailored for accessibility.

---

Created with ❤️ by Antigravity.
