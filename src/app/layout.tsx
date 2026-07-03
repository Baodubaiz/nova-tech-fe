import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "NovaTech - eCommerce",
  description: "Advanced eCommerce Platform",
  icons: {
    icon: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22url(%23g)%22/><defs><linearGradient id=%22g%22 x1=%220%22 y1=%220%22 x2=%221%22 y2=%221%22><stop offset=%220%25%22 stop-color=%22%2322d3ee%22/><stop offset=%22100%25%22 stop-color=%22%232563eb%22/></linearGradient></defs><text x=%2250%22 y=%2265%22 font-family=%22sans-serif%22 font-size=%2255%22 font-weight=%22bold%22 fill=%22white%22 text-anchor=%22middle%22>N</text></svg>',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased font-sans`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
