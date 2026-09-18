import type { Metadata } from "next";
import "./globals.css";
import WhatsAppButton from "../components/WhatsAppButton";

export const metadata: Metadata = {
  title: "WebService | You Tell Us. We Build It.",
  description: "Modern, responsive websites built around your requirements.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        {children}
        <WhatsAppButton />
      </body>
    </html>
  );
}
