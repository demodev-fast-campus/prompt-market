'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  Receipt,
  Star,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { storage } from '@/lib/utils';

type PurchaseItem = ReturnType<typeof storage.getPurchases>[number];

const statusLabels = {
  completed: '완료',
  processing: '처리중',
  cancelled: '취소됨',
};

const statusColors = {
  completed: 'default',
  processing: 'secondary',
  cancelled: 'destructive',
} as const;

export default function PurchaseHistoryPage() {
  const [cartItemCount, setCartItemCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('latest');
  const [purchases, setPurchases] = useState<PurchaseItem[]>([]);

  useEffect(() => {
    setCartItemCount(storage.getCart().length);
    setPurchases(storage.getPurchases());

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.cart)
        setCartItemCount(storage.getCart().length);
      if (detail.key === storage.keys.purchases)
        setPurchases(storage.getPurchases());
    };
    if (typeof window !== 'undefined')
      window.addEventListener('pm_storage', onChange as EventListener);
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('pm_storage', onChange as EventListener);
    };
  }, []);

  const handleDownload = (downloadUrl: string, title: string) => {
    // Handle download logic
    console.log(`Downloading: ${title} from ${downloadUrl}`);
  };

  const items = useMemo(() => {
    const list = purchases.map((p) => ({
      id: p.id,
      title: p.title ?? '구매한 프롬프트',
      author: p.author ?? '작성자',
      price: p.price ?? 0,
      category: p.category ?? '기타',
      thumbnail: p.thumbnail ?? '/placeholder.jpg',
      purchasedAt: p.purchasedAt,
    }));
    const filtered = list.filter((item) =>
      (item.title + item.author)
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
    );
    const sorted = [...filtered].sort((a, b) =>
      sortBy === 'latest'
        ? b.purchasedAt - a.purchasedAt
        : a.purchasedAt - b.purchasedAt,
    );
    return sorted;
  }, [purchases, searchQuery, sortBy]);

  const totalSpent = items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const totalItems = items.length;

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItemCount} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">구매 내역</h1>
            <p className="text-muted-foreground">
              총 {totalItems}개 프롬프트 • ₩{totalSpent.toLocaleString()} 결제
            </p>
          </div>
          <Button variant="outline">
            <Receipt className="mr-2 h-4 w-4" />
            전체 영수증 다운로드
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-muted-foreground">구매한 프롬프트</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Receipt className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">
                ₩{(totalSpent / 10000).toFixed(0)}만
              </div>
              <div className="text-muted-foreground">총 결제 금액</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{items.length}</div>
              <div className="text-muted-foreground">총 주문 수</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="프롬프트 제목이나 판매자로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                상태:{' '}
                {filterStatus === 'all'
                  ? '전체'
                  : statusLabels[filterStatus as keyof typeof statusLabels]}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                전체
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('completed')}>
                완료
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('processing')}>
                처리중
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus('cancelled')}>
                취소됨
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                정렬: {sortBy === 'latest' ? '최신순' : '오래된순'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy('latest')}>
                최신순
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy('oldest')}>
                오래된순
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Purchase List */}
        <div className="space-y-6">
          {items.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  구매 내역이 없습니다
                </h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery
                    ? '검색 조건에 맞는 구매 내역이 없습니다.'
                    : '아직 구매한 프롬프트가 없습니다.'}
                </p>
                <Button asChild>
                  <Link href="/">프롬프트 둘러보기</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id}>
                <CardContent>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={item.thumbnail || '/placeholder.svg'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Badge variant="secondary" className="text-xs mb-1">
                        {item.category}
                      </Badge>
                      <h4 className="font-medium text-sm mb-1 line-clamp-2">
                        <Link
                          href={`/prompt/${item.id}`}
                          className="hover:text-primary"
                        >
                          {item.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-muted-foreground font-medium">
                        작성자: {item.author}
                      </p>
                    </div>
                    <div className="flex flex-col items-end space-y-2 lg:space-y-0">
                      <div className="font-semibold text-right">
                        ₩{(item.price ?? 0).toLocaleString()}
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() =>
                            handleDownload('/signed-url', item.title)
                          }
                        >
                          <Download className="h-3 w-3 mr-1" />
                          다운로드
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-transparent"
                        >
                          <Star className="h-3 w-3 mr-1" />
                          리뷰
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {items.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />더 많은 내역 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
