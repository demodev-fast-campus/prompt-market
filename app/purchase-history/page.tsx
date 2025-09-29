import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Download,
  Search,
  Calendar,
  Receipt,
  Star,
  RefreshCw,
} from 'lucide-react';
import Link from 'next/link';
import { auth } from '@clerk/nextjs/server';
import { getProfileIdByClerkId } from '@/lib/data/user';
import { getCartCountByProfileId } from '@/lib/data/cart';
import { getPurchasesByProfileId } from '@/lib/data/purchases';

export default async function PurchaseHistoryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const sortBy = (typeof params.sort === 'string' ? params.sort : 'latest') as
    | 'latest'
    | 'oldest';

  const { userId } = await auth();
  const profileId = userId ? await getProfileIdByClerkId(userId) : null;
  const cartCount = profileId ? await getCartCountByProfileId(profileId) : 0;
  const rows = profileId ? await getPurchasesByProfileId(profileId) : [];

  const filtered = rows.filter((r) =>
    r.title.toLowerCase().includes(q.toLowerCase()),
  );
  const items = [...filtered].sort((a, b) =>
    sortBy === 'latest'
      ? b.purchasedAt - a.purchasedAt
      : a.purchasedAt - b.purchasedAt,
  );

  const totalSpent = items.reduce((sum, item) => sum + (item.price ?? 0), 0);
  const totalItems = items.length;

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartCount} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">구매 내역</h1>
            <p className="text-muted-foreground">
              총 {totalItems}개 프롬프트 • ₩{totalSpent.toLocaleString()} 결제
            </p>
          </div>
          <Button variant="outline">
            <Receipt className="mr-2 h-4 w-4" /> 전체 영수증 다운로드
          </Button>
        </div>

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

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <form>
              <Input
                name="q"
                placeholder="프롬프트 제목 검색..."
                defaultValue={q}
                className="pl-10"
              />
            </form>
          </div>
        </div>

        <div className="space-y-6">
          {items.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  구매 내역이 없습니다
                </h3>
                <p className="text-muted-foreground mb-6">
                  {q
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
                    </div>
                    <div className="flex flex-col items-end space-y-2 lg:space-y-0">
                      <div className="font-semibold text-right">
                        ₩{(item.price ?? 0).toLocaleString()}
                      </div>
                      <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          <Download className="h-3 w-3 mr-1" /> 다운로드
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-transparent"
                        >
                          <Star className="h-3 w-3 mr-1" /> 리뷰
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
