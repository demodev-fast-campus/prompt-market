'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { storage } from '@/lib/utils';

declare global {
  interface Window {
    TossPayments?: (clientKey: string) => {
      requestPayment: (method: string, params: any) => Promise<void>;
    };
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [isMounted, setIsMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    ReturnType<typeof storage.getCart>
  >([]);
  const tossPaymentsRef = useRef<ReturnType<
    NonNullable<typeof window.TossPayments>
  > | null>(null);

  // Handle hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Parse selected item ids from query
  useEffect(() => {
    if (!isMounted) return;
    const itemsParam = searchParams?.get('items') || '';
    const ids = itemsParam.split(',').filter(Boolean);
    const from = searchParams?.get('from');

    if (ids.length === 0) {
      setError('결제할 상품이 없습니다.');
      return;
    }

    if (from === 'cart') {
      const cart = storage.getCart();
      const filtered = cart.filter((c) => ids.includes(c.id));
      setSelectedItems(filtered);
    } else if (from === 'detail') {
      // 상세 단일 구매: 서버에서 실제 상품 정보 조회
      const cart = storage.getCart();
      const existing = cart.find((c) => c.id === ids[0]);
      if (existing) {
        setSelectedItems([existing]);
      } else {
        fetch(`/api/prompts?id=${ids[0]}`)
          .then((r) => r.json())
          .then((json) => {
            const p = json?.prompt;
            if (p) {
              setSelectedItems([
                {
                  id: p.id,
                  title: p.title,
                  price: p.price,
                  category: p.category ?? '기타',
                  author: p.author ?? '운영자',
                  thumbnail: p.thumbnail ?? '/placeholder.svg',
                },
              ] as any);
            } else {
              setError('상품 정보를 불러오지 못했습니다.');
            }
          })
          .catch(() => setError('상품 정보를 불러오는 중 오류가 발생했습니다.'));
      }
    } else {
      setError('잘못된 접근입니다.');
    }
  }, [searchParams, isMounted]);

  const totalAmount = useMemo(
    () => selectedItems.reduce((s, i) => s + i.price, 0),
    [selectedItems],
  );

  // Load TossPayments v1 SDK script and initialize
  useEffect(() => {
    if (tossPaymentsRef.current) return;

    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v1/payment';
    script.async = true;

    script.onload = () => {
      try {
        const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
        if (!clientKey) {
          setError('결제 클라이언트 키가 설정되지 않았습니다.');
          return;
        }

        if (!window.TossPayments) {
          setError('TossPayments SDK를 로드하지 못했습니다.');
          return;
        }

        // v1 SDK 초기화
        tossPaymentsRef.current = window.TossPayments(clientKey);
      } catch (err) {
        console.error('TossPayments 초기화 실패:', err);
        setError(
          err instanceof Error
            ? err.message
            : '결제 SDK 초기화에 실패했습니다.',
        );
      }
    };

    script.onerror = () => {
      setError('결제 SDK 로드에 실패했습니다.');
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  const handleRequestPayment = async () => {
    if (!tossPaymentsRef.current) {
      setError(
        '결제 SDK가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.',
      );
      return;
    }

    try {
      setError(null);

      // v1 SDK: requestPayment(결제수단, 결제정보)
      await tossPaymentsRef.current.requestPayment('카드', {
        amount: totalAmount,
        orderId: `PM-${Date.now()}`,
        orderName:
          selectedItems.length === 1
            ? selectedItems[0].title
            : `${selectedItems[0].title} 외 ${selectedItems.length - 1}건`,
        customerName: '테스트구매자',
        successUrl: `${window.location.origin}${window.location.pathname.replace(
          '/checkout',
          '/success',
        )}`,
        failUrl: `${window.location.origin}${window.location.pathname.replace(
          '/checkout',
          '/fail',
        )}`,
      });
    } catch (err: any) {
      console.error('결제 요청 실패:', err);
      if (err.code === 'USER_CANCEL') {
        setError('결제를 취소하셨습니다.');
      } else {
        setError(
          err.message || '결제 요청에 실패했습니다. 다시 시도해주세요.',
        );
      }
    }
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-6">
            <h1 className="text-2xl font-bold">결제</h1>
            <span className="ml-2 text-muted-foreground">(테스트)</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="text-2xl font-bold">결제</h1>
          <span className="ml-2 text-muted-foreground">(테스트)</span>
        </div>

        {error && <div className="text-sm text-red-500 mb-4">{error}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>결제 안내</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  결제하기 버튼을 누르면 토스페이먼츠 결제창이 열립니다.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>주문 요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {selectedItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="truncate mr-3">{item.title}</span>
                      <span>₩{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex items-center justify-between font-semibold text-lg">
                  <span>총 결제 금액</span>
                  <span>₩{totalAmount.toLocaleString()}</span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={selectedItems.length === 0}
                  onClick={handleRequestPayment}
                >
                  결제하기
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
