'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<{
    paymentKey: string;
    orderId: string;
    amount: string;
  } | null>(null);

  useEffect(() => {
    const paymentKey = searchParams?.get('paymentKey');
    const orderId = searchParams?.get('orderId');
    const amount = searchParams?.get('amount');

    if (paymentKey && orderId && amount) {
      setPaymentData({ paymentKey, orderId, amount });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          {paymentData ? (
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
                <CardTitle className="text-2xl">결제 요청 성공</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">주문번호</span>
                    <span className="font-mono">{paymentData.orderId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">결제키</span>
                    <span className="font-mono text-xs truncate max-w-[200px]">
                      {paymentData.paymentKey}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">결제금액</span>
                    <span className="font-semibold">
                      ₩{Number(paymentData.amount).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-100">
                    <strong>테스트 환경입니다.</strong> 실제 결제가 진행되지
                    않았습니다.
                  </p>
                  <p className="text-sm text-blue-800 dark:text-blue-200 mt-2">
                    실제 운영 환경에서는 서버에서 결제 승인 API를 호출하여
                    결제를 완료해야 합니다.
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <Link href="/">홈으로</Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/prompts">프롬프트 둘러보기</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <AlertCircle className="w-16 h-16 text-yellow-500" />
                </div>
                <CardTitle className="text-2xl">결제 정보 없음</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  결제 정보를 찾을 수 없습니다.
                </p>
                <Button asChild>
                  <Link href="/">홈으로 돌아가기</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
