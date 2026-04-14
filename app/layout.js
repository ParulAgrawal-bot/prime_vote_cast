import { Geist, Geist_Mono, DM_Sans, Playfair_Display } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "../components/navbar";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["600", "700"],
});

export const metadata = {
  title: "PrimeVote Cast — Secure E-Voting",
  description: "Secure digital voting portal for elections, results, and voter help.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${playfair.variable} antialiased`}
      >
        <ClerkProvider>
          <Navbar />
          <main className="app-main">{children}</main>
        </ClerkProvider>
      </body>
    </html>
  );
}