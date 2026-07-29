import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TailorConnect | Votre Style, Parfaitement Taillé",
  description: "Connectez-vous avec des tailleurs experts. Gérez vos mesures numériquement et obtenez des vêtements sur mesure qui vous vont parfaitement.",
};

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          <ToastProvider>
            <LanguageProvider>
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </LanguageProvider>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
