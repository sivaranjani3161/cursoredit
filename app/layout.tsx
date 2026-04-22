import "./globals.css";
import { Urbanist } from "next/font/google";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
  display: "swap",   // prevents preload-but-unused warning
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={urbanist.variable}>
      <body className="font-sans bg-[#FDFDFD] text-[#2E2E2E]">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}