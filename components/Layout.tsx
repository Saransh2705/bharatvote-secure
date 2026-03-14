"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Elections', path: '/elections' },
  { label: 'Voter Registration', path: '/register' },
  { label: 'Verify & Vote', path: '/verify' },
  { label: 'Booth Locator', path: '/booths' },
  { label: 'Documents', path: '/documents' },
  { label: 'Help Center', path: '/help' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Tricolor stripe */}
      <div className="saffron-stripe" />

      {/* Header */}
      <header className="govt-banner text-primary-foreground">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-saffron" />
            <div>
              <h1 className="text-xl font-heading font-bold leading-tight">BharatVote</h1>
              <p className="text-xs opacity-80">Election Commission of India</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-3 py-2 text-sm rounded transition-colors ${
                  pathname === link.path
                    ? 'bg-primary-foreground/20 font-medium'
                    : 'hover:bg-primary-foreground/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="ml-2 px-3 py-2 text-sm bg-saffron text-accent-foreground rounded font-medium hover:opacity-90 transition-opacity"
            >
              Admin Login
            </Link>
          </nav>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden border-t border-primary-foreground/20"
            >
              <div className="container mx-auto px-4 py-2 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    href={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`px-3 py-2 text-sm rounded ${
                      pathname === link.path ? 'bg-primary-foreground/20 font-medium' : ''
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/admin/login"
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 text-sm bg-saffron text-accent-foreground rounded font-medium"
                >
                  Admin Login
                </Link>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="govt-banner text-primary-foreground">
        <div className="saffron-stripe" />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-heading font-bold mb-3">BharatVote</h4>
              <p className="opacity-80 leading-relaxed">
                Official Digital Election Platform of the Election Commission of India.
                Secure, transparent, and accessible voting for every citizen.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-3">Quick Links</h4>
              <ul className="space-y-1 opacity-80">
                <li><Link href="/elections" className="hover:underline">Elections</Link></li>
                <li><Link href="/register" className="hover:underline">Voter Registration</Link></li>
                <li><Link href="/help" className="hover:underline">Help Center</Link></li>
                <li><Link href="/documents" className="hover:underline">Documents</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-bold mb-3">Contact</h4>
              <ul className="space-y-1 opacity-80">
                <li>Toll Free: 1800-111-950</li>
                <li>Email: support@bharatvote.gov.in</li>
                <li>Nirvachan Sadan, New Delhi</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-4 border-t border-primary-foreground/20 text-center text-xs opacity-60">
            © 2026 Election Commission of India. All Rights Reserved. | Disclaimer: This is a demonstration platform.
          </div>
        </div>
      </footer>
    </div>
  );
}
