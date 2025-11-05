import { Lexend } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "./providers";
import "./globals.css";
import type { Metadata } from "next";

const lexend = Lexend({
  weight: ["300", "400", "700"],  
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

const limelight = localFont({
  src: "./fonts/Limelight.ttf",
  display: "swap",
  variable: "--font-limelight",
  weight: "400",
});

export const metadata: Metadata = {
  title: {
    default: "Way to India - Discover India's Best Tours",
    template: "%s | Way to India",
  },
  description: "Discover amazing tours across India. Book your dream vacation with the best tour packages at Waytoindia.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lexend.variable} ${limelight.variable}`}>
      <body className={lexend.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}