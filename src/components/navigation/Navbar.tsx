'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Calendar, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { SollyLogo } from '@/components/ui/Doodles';
import { useBooking, ExperienceId } from '@/context/BookingContext';

interface SubmenuItem {
  id: ExperienceId;
  label: string;
  description: string;
  badge?: string;
}

const EXPERIENCE_SUBMENU: SubmenuItem[] = [
  {
    id: 'mini-pancakes',
    label: 'Mini Pancakes',
    description: 'Moelleux, nappés & préparés minute',
  },
  {
    id: 'croffles',
    label: 'Croffles',
    description: 'Croustillants, dorés & servis chauds',
  },
  {
    id: 'cake-bar',
    label: 'Cake Bar',
    description: 'Des douceurs à composer minute',
  },
  {
    id: 'charcuterie',
    label: 'Bar à Charcuterie',
    description: 'Cornets apéritifs & bouchées salées',
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [experienceDropdownOpen, setExperienceDropdownOpen] = useState(false);
  const [mobileSubmenuOpen, setMobileSubmenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const pathname = usePathname();
  const { openBooking } = useBooking();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setExperienceDropdownOpen(false);
  }, [pathname]);

  const handleMouseEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setExperienceDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setExperienceDropdownOpen(false);
    }, 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-solly-cream/95 backdrop-blur-md py-3 shadow-solly-soft border-b border-solly-border/70'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Brand Logo - Official Solly Style */}
        <Link
          href="/"
          className="group flex items-center focus:outline-none transition-transform duration-200 group-hover:scale-105"
        >
          <SollyLogo height={36} />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-solly-charcoal">
          <Link
            href="/"
            className={`relative py-1 transition-colors hover:text-solly-pink ${
              pathname === '/' ? 'text-solly-pink font-extrabold' : 'text-solly-charcoal'
            }`}
          >
            Accueil
            {pathname === '/' && (
              <motion.div
                layoutId="navbar-underline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-solly-pink rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </Link>

          {/* Nos expériences with Dropdown Sub-menu */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/experiences"
              className={`relative py-1 transition-colors flex items-center gap-1.5 hover:text-solly-pink ${
                pathname === '/experiences'
                  ? 'text-solly-pink font-extrabold'
                  : 'text-solly-charcoal'
              }`}
            >
              <span>Nos expériences</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  experienceDropdownOpen ? 'rotate-180 text-solly-pink' : 'text-solly-charcoal/70'
                }`}
              />
              {pathname === '/experiences' && (
                <motion.div
                  layoutId="navbar-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-solly-pink rounded-full"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </Link>

            {/* Dropdown Menu Card */}
            <AnimatePresence>
              {experienceDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-[22px] shadow-solly-card border border-solly-border p-2 z-50 overflow-hidden"
                >
                  <div className="flex flex-col gap-1">
                    {EXPERIENCE_SUBMENU.map((subItem) => (
                      <button
                        key={subItem.label}
                        type="button"
                        onClick={() => {
                          setExperienceDropdownOpen(false);
                          openBooking(subItem.id);
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl hover:bg-solly-pink-soft text-left transition-colors group flex items-start justify-between cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-bold text-solly-charcoal group-hover:text-solly-pink">
                              {subItem.label}
                            </p>
                            {subItem.badge && (
                              <span className="bg-solly-yellow text-solly-charcoal text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                                {subItem.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-medium text-solly-muted mt-0.5">
                            {subItem.description}
                          </p>
                        </div>
                        <span className="text-solly-pink font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity mt-0.5">
                          ✦
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 mt-1.5 border-t border-solly-border/70 px-1">
                    <Link
                      href="/experiences"
                      onClick={() => setExperienceDropdownOpen(false)}
                      className="block text-center text-xs font-bold text-solly-pink hover:underline py-1"
                    >
                      Voir toutes les formules →
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/notre-histoire"
            className={`relative py-1 transition-colors hover:text-solly-pink ${
              pathname === '/notre-histoire' || pathname === '/a-propos'
                ? 'text-solly-pink font-extrabold'
                : 'text-solly-charcoal'
            }`}
          >
            Notre histoire
            {(pathname === '/notre-histoire' || pathname === '/a-propos') && (
              <motion.div
                layoutId="navbar-underline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-solly-pink rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </Link>

          <Link
            href="/partenaires"
            className={`relative py-1 transition-colors hover:text-solly-pink ${
              pathname === '/partenaires'
                ? 'text-solly-pink font-extrabold'
                : 'text-solly-charcoal'
            }`}
          >
            Partenaires
            {pathname === '/partenaires' && (
              <motion.div
                layoutId="navbar-underline"
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-solly-pink rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        </nav>

        {/* Action Button: Réserver (Pink Pill) */}
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="pink"
            size="sm"
            onClick={() => openBooking()}
            className="!px-6 !py-2.5 text-sm font-bold"
          >
            Réserver
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="pink"
            size="sm"
            onClick={() => openBooking()}
            className="!px-4 !py-2 text-xs font-bold"
          >
            Réserver
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full bg-white border border-solly-border text-solly-charcoal shadow-2xs hover:bg-solly-cream-soft transition-colors"
            aria-label="Menu principal"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="md:hidden absolute top-full left-0 right-0 bg-solly-cream/98 backdrop-blur-xl border-b border-solly-border shadow-xl px-6 py-6"
          >
            <div className="flex flex-col gap-2">
              <Link
                href="/"
                className={`px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                  pathname === '/'
                    ? 'bg-solly-pink-soft text-solly-pink'
                    : 'text-solly-charcoal hover:bg-white'
                }`}
              >
                Accueil
              </Link>

              {/* Mobile Submenu for Nos expériences */}
              <div className="flex flex-col">
                <div className="flex items-center justify-between">
                  <Link
                    href="/experiences"
                    className={`flex-1 px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                      pathname === '/experiences'
                        ? 'bg-solly-pink-soft text-solly-pink'
                        : 'text-solly-charcoal hover:bg-white'
                    }`}
                  >
                    Nos expériences
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileSubmenuOpen(!mobileSubmenuOpen)}
                    className="p-3 text-solly-charcoal hover:text-solly-pink"
                    aria-label="Afficher le sous-menu"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        mobileSubmenuOpen ? 'rotate-180 text-solly-pink' : ''
                      }`}
                    />
                  </button>
                </div>

                {mobileSubmenuOpen && (
                  <div className="pl-6 pr-2 py-2 flex flex-col gap-1.5">
                    {EXPERIENCE_SUBMENU.map((subItem) => (
                      <button
                        key={subItem.label}
                        type="button"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setMobileSubmenuOpen(false);
                          openBooking(subItem.id);
                        }}
                        className="w-full px-3.5 py-2 rounded-xl text-sm font-bold text-solly-charcoal/80 hover:text-solly-pink hover:bg-white/80 transition-colors flex items-center justify-between text-left cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-solly-pink text-xs font-bold">✦</span>
                          <span>{subItem.label}</span>
                        </div>
                        {subItem.badge && (
                          <span className="bg-solly-yellow text-solly-charcoal text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full">
                            {subItem.badge}
                          </span>
                        )}
                      </button>
                    ))}
                    <Link
                      href="/experiences"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setMobileSubmenuOpen(false);
                      }}
                      className="px-3.5 py-1.5 text-xs font-bold text-solly-pink hover:underline text-left"
                    >
                      Voir toutes les formules →
                    </Link>
                  </div>
                )}
              </div>

              <Link
                href="/notre-histoire"
                className={`px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                  pathname === '/notre-histoire' || pathname === '/a-propos'
                    ? 'bg-solly-pink-soft text-solly-pink'
                    : 'text-solly-charcoal hover:bg-white'
                }`}
              >
                Notre histoire
              </Link>

              <Link
                href="/partenaires"
                className={`px-4 py-3 rounded-2xl text-base font-bold transition-colors ${
                  pathname === '/partenaires'
                    ? 'bg-solly-pink-soft text-solly-pink'
                    : 'text-solly-charcoal hover:bg-white'
                }`}
              >
                Partenaires
              </Link>

              <div className="pt-4 mt-2 border-t border-solly-border/70">
                <Button
                  variant="pink"
                  fullWidth
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBooking();
                  }}
                  icon={<Calendar className="w-4 h-4" />}
                >
                  Réserver un événement
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
