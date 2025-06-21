import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Header } from '@/components/header';

export const metadata: Metadata = {
  title: 'AI Profile & Resume Analyzer',
  description: 'Get an instant score and AI-powered tips to improve your LinkedIn profile and resume.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;600;700&family=Roboto:ital,wght@0,400;0,700;1,400&family=Roboto+Slab:wght@400;700&family=JetBrains+Mono:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Open+Sans:wght@400;600;700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&family=Merriweather:ital,wght@0,400;0,700;1,400&family=Mulish:wght@400;600;700&family=Nunito:wght@400;600;700&family=EB+Garamond:wght@400;700&family=Quicksand:wght@400;600;700&family=Fira+Code:wght@400;700&family=Raleway:wght@400;700;800&family=Karla:wght@400;700&family=IBM+Plex+Sans:wght@400;600&family=IBM+Plex+Mono:wght@400;600&family=Work+Sans:wght@400;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Header />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
