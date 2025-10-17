import type { Metadata } from "next";
import "./globals.css";
import {
  Poppins,
  Annie_Use_Your_Telescope,
  Fredoka,
  Nunito,
} from "next/font/google";
import BackgroundWrapper from "./components/background-wrapper";
import { AuthProvider } from "./context/AuthContext"; // Import the context provider


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-poppins",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-fredoka",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-nunito",
});

const annie = Annie_Use_Your_Telescope({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-annie",
});

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Whimsera",
  description: "AI-powered storytelling world",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${poppins.variable} ${annie.variable} ${fredoka.variable} ${nunito.variable}
          antialiased text-[#2D3436] min-h-screen relative overflow-x-hidden
        `}
      >
        {/* Provide AuthContext globally */}
        <AuthProvider>
          {/* Client-side wrapper handles login/signup background logic */}
          <BackgroundWrapper>{children}</BackgroundWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
