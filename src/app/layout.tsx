import type { Metadata } from "next";
import { DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import AdvertBanner from "@/components/AdvertBanner";
import Header from "@/components/Header/Header";
import { AppProvider } from "@/context/AppContext";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas-neue",
  subsets: ["latin"],
  weight: "400"
});

export const metadata: Metadata = {
  title: {
    default: "ShopCo",
    template: "%s | ShopCo",
  },
  description: "Discover the latest trends in casual, formal, party, and gym wear. Shop shirts, shorts, hoodies, and pants at ShopCo.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppProvider>
          <AdvertBanner />
          <Header />
          {children}
          <Footer />
        </AppProvider>
      </body>
    </html>
  );
}
