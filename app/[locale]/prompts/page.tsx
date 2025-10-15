'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { PromptCard } from '@/components/prompt-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { storage } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

type PromptItem = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  author: string;
  thumbnail?: string | null;
  tags?: string[] | null;
};

export default function PromptsPage() {
  const [items, setItems] = useState<PromptItem[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [sortBy, setSortBy] = useState('인기순');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  useEffect(() => {
    const user = storage.getUser();
    setIsLoggedIn(user.isLoggedIn);
    setCartItemCount(storage.getCart().length);
    setFavorites(storage.getFavorites());
    // Fetch prompts from API (public read)
    fetch('/api/prompts')
      .then((r) => r.json())
      .then((json) => {
        const fetched = (json.prompts || []).map(
          (p: any): PromptItem => ({
            id: String(p.id),
            title: p.title,
            description: p.description,
            price: p.price ?? 0,
            category: p.category ?? '기타',
            rating: Number(p.rating ?? 0),
            reviewCount: Number(p.review_count ?? 0),
            author: p.author ?? '운영자',
            thumbnail: p.thumbnail ?? null,
            tags: p.tags ?? null,
          }),
        );
        setItems(fetched);
      })
      .catch(() => {
        // 실패 시 빈 목록 유지 (기존 더미는 관리자 페이지에서 시드됨)
        setItems([]);
      });
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.user)
        setIsLoggedIn(storage.getUser().isLoggedIn);
      if (detail.key === storage.keys.cart)
        setCartItemCount(storage.getCart().length);
      if (detail.key === storage.keys.favorites)
        setFavorites(storage.getFavorites());
    };
    if (typeof window !== 'undefined')
      window.addEventListener('pm_storage', onChange as EventListener);
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('pm_storage', onChange as EventListener);
    };
  }, []);

  const handleLogin = () => {
    storage.setUser({ isLoggedIn: true });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    storage.setUser({ isLoggedIn: false });
    setIsLoggedIn(false);
    setCartItemCount(0);
    setFavorites([]);
  };

  const handleAddToCart = (id: string) => {
    const prompt = items.find((p) => p.id === id);
    if (!prompt) return;
    const before = storage.getCart();
    const isDup = before.some((x) => x.id === prompt.id);
    const next = storage.addToCart({
      id: prompt.id,
      price: prompt.price,
      title: prompt.title,
      category: prompt.category,
      author: prompt.author,
      thumbnail: prompt.thumbnail ?? undefined,
    });
    setCartItemCount(next.length);
    if (isDup) {
      toast({ title: '이미 장바구니에 있습니다.' });
    }
  };

  const handleToggleFavorite = (id: string) => {
    const next = storage.toggleFavorite(id);
    setFavorites(next);
  };

  // Filter/sort/page prompts
  const filteredPrompts = useMemo(() => {
    const base = items.filter((prompt) => {
      const matchesSearch =
        prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prompt.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === '전체' || prompt.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    const sorted = (() => {
      switch (sortBy) {
        case '가격순':
          return [...base].sort((a, b) => a.price - b.price);
        case '평점순':
          return [...base].sort((a, b) => b.rating - a.rating);
        case '최신순':
          return [...base];
        default:
          return base;
      }
    })();
    return sorted;
  }, [items, searchQuery, selectedCategory, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredPrompts.length / PAGE_SIZE));
  const pagedPrompts = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredPrompts.slice(start, start + PAGE_SIZE);
  }, [filteredPrompts, page]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartItemCount}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Page Header */}
      <section className="py-12 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">프롬프트 마켓</h1>
          <p className="text-gray-400 text-lg">
            전문가들이 만든 고품질 AI 프롬프트를 찾아보세요
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="프롬프트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                />
              </div>
            </div>

            {/* Category Filter */}
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="전체" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="전체">전체</SelectItem>
                <SelectItem value="마케팅">마케팅</SelectItem>
                <SelectItem value="광고">광고</SelectItem>
                <SelectItem value="이미지 생성">이미지 생성</SelectItem>
                <SelectItem value="창작">창작</SelectItem>
                <SelectItem value="온라인">온라인</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="인기순" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="인기순">인기순</SelectItem>
                <SelectItem value="최신순">최신순</SelectItem>
                <SelectItem value="가격순">가격순</SelectItem>
                <SelectItem value="평점순">평점순</SelectItem>
              </SelectContent>
            </Select>

            {/* Filter Button */}
            <Button
              variant="outline"
              className="border-gray-600 text-white hover:bg-gray-900 bg-transparent"
            >
              <Filter className="h-4 w-4 mr-2" />
              필터링하기
            </Button>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-400">
              총 {filteredPrompts.length}개의 프롬프트
            </p>
          </div>

          {/* Prompts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pagedPrompts.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                {...prompt}
                priority={index === 0}
                isFavorited={favorites.includes(prompt.id)}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                이전
              </Button>
              <span className="text-sm text-gray-400">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                다음
              </Button>
            </div>
          )}

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">검색 결과가 없습니다.</p>
              <p className="text-gray-500 mt-2">다른 키워드로 검색해보세요.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
