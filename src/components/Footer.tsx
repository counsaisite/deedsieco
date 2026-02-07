'use client';

import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import LocaleSwitcher from './LocaleSwitcher';

const FOOTER_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/help', label: 'Help Center' },
  { href: '/accessibility', label: 'Accessibility' },
  { href: '/terms', label: 'User Agreement' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/cookies', label: 'Cookie Policy' },
  { href: '/copyright', label: 'Copyright Policy' },
  { href: '/brand', label: 'Brand Policy' },
  { href: '/guest-controls', label: 'Guest Controls' },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-700/50 py-4 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Row 1: Brand + copyright + links */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 py-2">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">Deedsie</span>
            <Image src="/logo.png" alt="" width={20} height={20} className="rounded" />
            <span className="text-sm text-slate-500 dark:text-slate-400">© 2026</span>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
            {FOOTER_LINKS.map(({ href, label }) => (
              <Link key={href} href={href} className="hover:text-slate-700 dark:hover:text-slate-300">
                {label}
              </Link>
            ))}
          </div>
        </div>
        {/* Row 2: Community Guidelines + Language */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/community-guidelines" className="hover:text-slate-700 dark:hover:text-slate-300">
            Community Guidelines
          </Link>
          <div className="flex items-center gap-2">
            <span>Language</span>
            <LocaleSwitcher />
          </div>
        </div>
      </div>
    </footer>
  );
}
