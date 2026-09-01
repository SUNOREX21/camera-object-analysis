import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ObjectLens AI — Scan Anything. Understand Everything.',
  description: 'Use multimodal computer vision AI to identify physical objects and estimate volume, material, dimensions, density, and physical properties.',
  keywords: ['AI Object Scanner', 'Computer Vision', 'Physical Object Analysis', 'Estimated Weight', 'Material Identification', 'ObjectLens AI'],
  authors: [{ name: 'ObjectLens AI Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-dark-bg text-slate-100 font-sans antialiased min-h-screen selection:bg-cyber-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
