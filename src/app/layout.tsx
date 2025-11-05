// app/layout.tsx
import { Lexend } from "next/font/google";
import localFont from "next/font/local";
import { Providers } from "./providers";
import "./globals.css";

const lexend = Lexend({
  weight: ["400", "500"],
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
