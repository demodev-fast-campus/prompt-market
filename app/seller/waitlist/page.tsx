'use client';

import { useState } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { storage } from '@/lib/utils';

export default function SellerWaitlistPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(storage.getUser().isLoggedIn);
  const [cartItemCount] = useState(storage.getCart().length);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const toggleCategory = (c: string) => {
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );
  };

  const handleSubmit = () => {
    const record = {
      id: String(Date.now()),
      createdAt: Date.now(),
      name,
      email,
      portfolio_url: portfolio,
      categories,
      message,
      processed: false,
    };
    storage.addWaitlist(record);
    setSubmitted(true);
    setName('');
    setEmail('');
    setPortfolio('');
    setCategories([]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartItemCount}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>판매자 웨이팅 리스트 등록</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submitted && (
              <div className="text-sm text-green-500">
                등록이 완료되었습니다. 운영자가 확인 후 연락드립니다.
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">이름</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="portfolio">포트폴리오 URL</Label>
              <Input
                id="portfolio"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className="space-y-2">
              <Label>관심 카테고리</Label>
              <div className="flex flex-wrap gap-2">
                {['마케팅', '이미지 생성', '개발', '콘텐츠', '기타'].map(
                  (c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => toggleCategory(c)}
                      className={`px-3 py-1 rounded-full border ${
                        categories.includes(c)
                          ? 'bg-primary text-white'
                          : 'border-gray-300 text-gray-600'
                      }`}
                    >
                      {c}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">자기소개/메시지</Label>
              <Textarea
                id="message"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="pt-2">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={!name || !email}
              >
                제출하기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
