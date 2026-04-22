import "./globals.css";
import { Urbanist } from "next/font/google";
import Navbar from "./components/Navbar";   // ✅ add
import Footer from "./components/Footer";   // optional

const urbanist = Urbanist({
  subsets: ["latin"],
  variable: "--font-urbanist",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${urbanist.variable} font-sans bg-[#FDFDFD] text-[#2E2E2E]`}>
        
        <Navbar />     
        {children}    
        <Footer />    

      </body>
    </html>
  );
}