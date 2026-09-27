import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kaku Food - Sistem Informasi Inventaris Equipment",
  description: "Sistem Informasi Monitoring dan Pelaporan Inventaris Equipment Berbasis Algoritma Hashing pada Kaku Food.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-scroll-behavior="smooth">
      <body>
        {children}
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" crossOrigin="anonymous" async></script>
      </body>
    </html>
  );
}
