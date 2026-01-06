import { Annie_Use_Your_Telescope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./context/AuthContext"; // Import the context provider


const annie = Annie_Use_Your_Telescope({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-annie", // This matches the variable in your CSS
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${annie.variable} antialiased`}>
                <AuthProvider>
          {/* Client-side wrapper handles login/signup background logic */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}