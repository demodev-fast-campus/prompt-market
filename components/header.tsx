'use client';

import { useEffect, useState } from 'react';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, User, Menu, X } from 'lucide-react';
import { ModeToggle } from '@/components/mode-toggle';
import { useTranslations, useLocale } from 'next-intl';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';

import { storage } from '@/lib/utils';

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    setCartCount(storage.getCart().length);

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
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
                  {locale.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-36 bg-gray-900 border-gray-700 z-[60]"
              >
                <DropdownMenuItem asChild>
                  <Link
                    href={pathname}
                    locale="en"
                    className={locale === 'en' ? 'bg-gray-800' : ''}
                  >
                    English
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={pathname}
                    locale="ko"
                    className={locale === 'ko' ? 'bg-gray-800' : ''}
                  >
                    한국어
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <ModeToggle />

            {/* Clerk Authentication */}
            <SignedOut>
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  {t('nav.login')}
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button
                  className="bg-white text-black hover:bg-gray-200"
                >
                  {t('nav.signup')}
                </Button>
              </SignUpButton>
            </SignedOut>

            <SignedIn>
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
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Clerk UserButton */}
              <UserButton
                signInUrl="/"
                appearance={{
                  elements: {
                    rootBox: "flex items-center",
                    avatarBox: "w-8 h-8"
                  }
                }}
              />
            </SignedIn>
          </nav>

          <div className="flex md:hidden items-center space-x-2">
            <ModeToggle />
            <SignedIn>
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
            </SignedIn>
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

              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                  >
                    {t('nav.login')}
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    className="block w-full text-left px-3 py-2 bg-white text-black hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {t('nav.signup')}
                  </button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
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
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-gray-300">{t('nav.account')}</span>
                  <UserButton
                    signInUrl="/"
                    appearance={{
                      elements: {
                        rootBox: "flex items-center",
                        avatarBox: "w-8 h-8"
                      }
                    }}
                  />
                </div>
              </SignedIn>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
