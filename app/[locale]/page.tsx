'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Header } from '@/components/header';
import { PromptCard } from '@/components/prompt-card';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

const mockPrompts = [
  {
    id: '1',
    title: 'AI 이미지 생성 마스터 프롬프트',
    description:
      'Midjourney, DALL-E, Stable Diffusion 등 AI 이미지 생성 도구를 위한 전문 프롬프트 모음집입니다.',
    price: 15000,
    category: '이미지 생성',
    rating: 4.8,
    reviewCount: 1234,
    author: '프롬프트마스터',
    thumbnail: '/marketing-copywriting.jpg',
    isPremium: false,
  },
  {
    id: '2',
    title: '광고 문구 생성 프롬프트',
    description: '효과적인 광고 문구를 생성하는 AI 프롬프트 모음집입니다.',
    price: 20000,
    category: '광고',
    rating: 4.8,
    reviewCount: 1890,
    author: '광고전문가',
    thumbnail: '/gen_ad_prompt.png',
    isPremium: true,
  },
  {
    id: '3',
    title: '한국 소설 아이디어 생성기',
    description:
      '독창적인 소설 아이디어와 캐릭터를 생성하는 창작 전용 프롬프트입니다.',
    price: 12000,
    category: '창작',
    rating: 4.7,
    reviewCount: 987,
    author: '작가김씨',
    thumbnail: '/code-review-programming.jpg',
    isPremium: false,
  },
  {
    id: '4',
    title: '마케팅 카피라이팅 프롬프트',
    description:
      '매출을 높이는 효과적인 마케팅 카피를 작성할 수 있는 프롬프트 모음집입니다.',
    price: 18000,
    category: '마케팅',
    rating: 4.6,
    reviewCount: 1567,
    author: '마케팅전문가',
    thumbnail: '/blog-writing-content.jpg',
    isPremium: true,
  },
];

export default function HomePage() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    setCartItemCount(storage.getCart().length);
    setFavorites(storage.getFavorites());
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.cart)
        setCartItemCount(storage.getCart().length);
      if (detail.key === storage.keys.favorites)
        setFavorites(storage.getFavorites());
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

  const handleAddToCart = (promptId: string) => {
    storage.addToCart(promptId);
    toast({
      title: '장바구니에 추가되었습니다',
      description: '장바구니에서 확인하세요.',
    });
  };

  const handleToggleFavorite = (promptId: string) => {
    if (favorites.includes(promptId)) {
      storage.removeFromFavorites(promptId);
      toast({
        title: '즐겨찾기에서 제거되었습니다',
        description: '즐겨찾기 목록을 확인하세요.',
      });
    } else {
      storage.addToFavorites(promptId);
      toast({
        title: '즐겨찾기에 추가되었습니다',
        description: '즐겨찾기 목록을 확인하세요.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header cartItemCount={cartItemCount} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            AI 프롬프트의{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              새로운 경험
            </span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            창의적인 아이디어부터 전문적인 비즈니스 솔루션까지, 당신이 찾던
            완벽한 프롬프트를 만나보세요.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200">
              프롬프트 둘러보기
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-800"
            >
              판매자 되기
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Prompts Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">인기 프롬프트</h2>
            <Link href="/prompts">
              <Button
                variant="outline"
                className="border-gray-600 text-white hover:bg-gray-800"
              >
                전체 보기
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                isFavorited={favorites.includes(prompt.id)}
                onAddToCart={() => handleAddToCart(prompt.id)}
                onToggleFavorite={() => handleToggleFavorite(prompt.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">
            왜 PromptMarket을 선택해야 할까요?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-600 rounded-full flex items-center justify-center">
                ⚡
              </div>
              <h3 className="text-xl font-semibold mb-4">빠른 결과</h3>
              <p className="text-gray-400">
                검증된 프롬프트로 즉시 원하는 결과를 얻으세요.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-600 rounded-full flex items-center justify-center">
                🎯
              </div>
              <h3 className="text-xl font-semibold mb-4">전문성</h3>
              <p className="text-gray-400">
                각 분야별 전문가들이 검증한 고품질 프롬프트만을 제공합니다.
              </p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-600 rounded-full flex items-center justify-center">
                💎
              </div>
              <h3 className="text-xl font-semibold mb-4">다양성</h3>
              <p className="text-gray-400">
                마케팅부터 창작까지, 모든 분야의 프롬프트를 한 곳에서.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">PromptMarket</h3>
              <p className="text-gray-400">최고의 AI 프롬프트 마켓플레이스</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">서비스</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    프롬프트 구매
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    프롬프트 판매
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    프리미엄
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    도움말
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    문의하기
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사 정보</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white">
                    이용약관
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    개인정보처리방침
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>© 2025 PromptMarket. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
