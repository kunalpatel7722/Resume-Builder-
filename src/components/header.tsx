'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'LinkedIn Review' },
  { href: '/resume-checker', label: 'ATS Resume Checker' },
  { href: '/resume-builder', label: 'Resume Builder' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b sticky top-0 z-40">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 text-foreground font-bold text-xl">
               <svg role="img" aria-label="Logo" className="h-8 w-auto text-primary" width="32" height="32" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 88.2c-21.1 0-38.2-17.1-38.2-38.2S28.9 11.8 50 11.8s38.2 17.1 38.2 38.2-17.1 38.2-38.2 38.2z"></path><path d="M50 76.5c-14.6 0-26.5-11.9-26.5-26.5S35.4 23.5 50 23.5s26.5 11.9 26.5 26.5-11.9 26.5-26.5 26.5z"></path></svg>
              <span>Profile Analyzer</span>
            </Link>
            <div className="hidden md:flex items-baseline space-x-4">
               {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
