'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { useTranslations } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { storage } from '@/lib/utils';

interface HeaderProps {
  isLoggedIn?: boolean;
  cartItemCount?: number;
  onLogin?: () => void;
  onLogout?: () => void;
}

export function Header({
  isLoggedIn = false,
  cartItemCount = 0,
  onLogin,
  onLogout,
}: HeaderProps) {
  const t = useTranslations();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(isLoggedIn);
  const [cartCount, setCartCount] = useState<number>(cartItemCount);

  useEffect(() => {
    const user = storage.getUser();
    setLoggedIn(user.isLoggedIn);
    setCartCount(storage.getCart().length);

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.user) {
        setLoggedIn(storage.getUser().isLoggedIn);
      }
      if (detail.key === storage.keys.cart) {
        setCartCount(storage.getCart().length);
      }
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('pm_storage', onChange as EventListener);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('pm_storage', onChange as EventListener);
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl text-white">
              {t('common.brand')}
            </span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={t('common.search.placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/prompts"
              className="text-gray-300 hover:text-white transition-colors"
            >
              {t('nav.prompts')}
            </Link>

            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white px-2"
                >
                  EN / KO
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-36 bg-gray-900 border-gray-700 z-[60]"
              >
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch('/api/set-locale', {
                      method: 'POST',
                      body: JSON.stringify({ locale: 'en' }),
                    });
                    location.reload();
                  }}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await fetch('/api/set-locale', {
                      method: 'POST',
                      body: JSON.stringify({ locale: 'ko' }),
                    });
                    location.reload();
                  }}
                >
                  한국어
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />

            {loggedIn ? (
              <>
                {/* Cart */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative text-gray-300 hover:text-white"
                  asChild
                >
                  <Link href="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                      >
                        {cartCount}
                      </Badge>
                    )}
                  </Link>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-300 hover:text-white"
                    >
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 bg-gray-900 border-gray-700 z-[60]"
                  >
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="text-gray-300">
                        {t('nav.profile')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/prompts" className="text-gray-300">
                        {t('nav.adminPrompts')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/purchase-history" className="text-gray-300">
                        {t('nav.purchaseHistory')}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      onClick={() => {
                        storage.setUser({ isLoggedIn: false });
                        onLogout?.();
                      }}
                      className="text-gray-300"
                    >
                      {t('nav.logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => {
                    storage.setUser({ isLoggedIn: true });
                    onLogin?.();
                  }}
                  className="text-gray-300 hover:text-white"
                >
                  {t('nav.login')}
                </Button>
                <Button
                  onClick={() => {
                    storage.setUser({ isLoggedIn: true });
                    onLogin?.();
                  }}
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {t('nav.signup')}
                </Button>
              </>
            )}
          </nav>

          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            {loggedIn && (
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-300 hover:text-white"
                asChild
              >
                <Link href="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {cartCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                    >
                      {cartCount}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-300 hover:text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-800 py-4">
            {/* Mobile Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('common.search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-2">
              <Link
                href="/prompts"
                className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.prompts')}
              </Link>

              {loggedIn ? (
                <>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.profile')}
                  </Link>
                  <Link
                    href="/admin/prompts"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.adminPrompts')}
                  </Link>
                  <Link
                    href="/purchase-history"
                    className="block px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t('nav.purchaseHistory')}
                  </Link>
                  <button
                    onClick={() => {
                      storage.setUser({ isLoggedIn: false });
                      onLogout?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  >
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      storage.setUser({ isLoggedIn: true });
                      onLogin?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  >
                    {t('nav.login')}
                  </button>
                  <button
                    onClick={() => {
                      storage.setUser({ isLoggedIn: true });
                      onLogin?.();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 bg-white text-black hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {t('nav.signup')}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
