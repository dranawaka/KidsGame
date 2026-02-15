import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bubble Pop Math - Fun Math Game for Kids",
  description: "A fun and educational math game for kids. Pop the bubble with the correct answer!",
  keywords: ["math game", "kids education", "learning", "arithmetic", "fun math"],
  authors: [{ name: "Bubble Pop Math" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
