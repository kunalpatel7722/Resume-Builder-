'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { FileCheck2 } from 'lucide-react';

const navLinks = [
  { href: '/resume-builder', label: 'Resume Builder' },
  { href: '/resume-checker', label: 'ATS Checker' },
  { href: '/', label: 'LinkedIn Review' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-card border-b sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 flex items-center gap-2 text-foreground font-bold text-lg">
               <FileCheck2 className="h-7 w-7 text-primary" />
              <span>AI Resume Pro</span>
            </Link>
          </div>
          <div className="flex items-center space-x-6">
             {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    'hidden md:block px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary font-semibold'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
}
