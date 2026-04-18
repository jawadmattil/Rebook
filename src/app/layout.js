import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "ReBook - Your Second-Hand Bookstore",
  description: "Buy and sell second-hand books nearby.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${outfit.variable}`}>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
