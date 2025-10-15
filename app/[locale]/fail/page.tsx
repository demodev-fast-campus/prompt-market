'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/utils';
import { Link } from '@/i18n/navigation';
import { XCircle } from 'lucide-react';

export default function FailPage() {
  const searchParams = useSearchParams();
  const [errorData, setErrorData] = useState<{
    code: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const code = searchParams?.get('code');
    const message = searchParams?.get('message');

    if (code && message) {
      setErrorData({ code, message });
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="w-16 h-16 text-red-500" />
              </div>
              <CardTitle className="text-2xl">결제 요청 실패</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {errorData ? (
                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">에러 코드</span>
                    <span className="font-mono text-red-700 dark:text-red-300">
                      {errorData.code}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground block mb-1">
                      에러 메시지
                    </span>
                    <p className="text-red-800 dark:text-red-200">
                      {errorData.message}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  결제 처리 중 오류가 발생했습니다.
                </p>
              )}

              <div className="flex gap-3">
                <Button asChild className="flex-1">
                  <Link href="/cart">장바구니로</Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/">홈으로</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
