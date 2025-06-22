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
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Karla:wght@400;700&family=Lato:wght@400;700&family=Libre+Baskerville:wght@400;700&family=Merriweather+Sans:wght@400;700&family=Merriweather:wght@400;700&family=Montserrat:wght@400;600;700&family=Mulish:wght@400;700&family=Nunito:wght@400;700&family=Open+Sans:wght@400;700&family=Playfair+Display:wght@400;700&family=Poppins:wght@400;600;700&family=Quicksand:wght@400;700&family=Roboto+Slab:wght@400;700&family=Roboto:wght@400;700&family=Source+Serif+4:ital,wght@0,400;0,700;1,400&family=Work+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <Header />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
