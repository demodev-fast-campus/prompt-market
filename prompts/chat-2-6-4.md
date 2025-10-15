# Integrate tosspayments mcp for checkout
_Exported on 10/16/2025 at 08:27:03 GMT+9 from Cursor (1.7.46)_

---

**User**

tosspayments mcp를 사용하여
현재 웹 사이트에서 구매하기 버튼을 클릭했을 때 결제 페이지로 넘어가고
토스 페이먼츠의 위젯을 사용하여 테스트 결제가 가능하게 해줘

---

**Cursor**

지금 결제 버튼과 관련된 코드 위치를 빠르게 파악하고, 어디에 결제 위젯을 붙일지 확인해볼게요. 이어서 필요한 파일들을 동시에 열어 구조를 확인하겠습니다.

지금 결제 버튼 동작을 확인했고, 장바구니와 상세 페이지 모두에서 결제 로직이 목업으로 되어 있습니다. 다음으로 패키지 의존성과 환경키 구성을 확인하고, 결제 위젯 페이지와 API 라우트를 추가하겠습니다.

방금 결제 버튼이 목업 로직인 것을 확인했어요. 이제 할 일들을 정리하고, 먼저 `checkout` 페이지와 성공/실패 페이지, 결제 승인 API 라우트를 추가한 뒤 장바구니/상세의 결제 버튼을 이 페이지로 연결하겠습니다.

지금부터 체크아웃 라우트와 결제 위젯 임베드를 추가할게요. 이어서 성공/실패 페이지 라우팅과 API 스텁을 함께 생성하겠습니다.

```typescriptreact
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, ShoppingBag, CreditCard, Gift } from 'lucide-react';
import Link from 'next/link';
import { storage } from '@/lib/utils';

type CartItem = ReturnType<typeof storage.getCart>[number];

export default function CartPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  useEffect(() => {
    const user = storage.getUser();
    setIsLoggedIn(user.isLoggedIn);
    const items = storage.getCart();
    setCartItems(items);
    setSelectedItems(items.map((i) => i.id));

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.user)
        setIsLoggedIn(storage.getUser().isLoggedIn);
      if (detail.key === storage.keys.cart) {
        const list = storage.getCart();
        setCartItems(list);
        setSelectedItems((prev) =>
          prev.filter((id) => list.some((i) => i.id === id)),
        );
      }
    };
    if (typeof window !== 'undefined')
      window.addEventListener('pm_storage', onChange as EventListener);
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('pm_storage', onChange as EventListener);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleRemoveItem = (id: string) => {
    const next = storage.removeFromCart(id);
    setCartItems(next);
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  // 디지털 상품: 수량 개념 제거

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleApplyCoupon = () => {
    alert('디지털 상품은 쿠폰을 지원하지 않습니다.');
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const selectedCartItems = useMemo(
    () => cartItems.filter((item) => selectedItems.includes(item.id)),
    [cartItems, selectedItems],
  );
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = 0;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartItems.length}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <ShoppingBag className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">장바구니</h1>
          <span className="ml-2 text-muted-foreground">
            ({cartItems.length}개 상품)
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              장바구니가 비어있습니다
            </h2>
            <p className="text-muted-foreground mb-6">
              마음에 드는 프롬프트를 장바구니에 담아보세요!
            </p>
            <Button asChild>
              <Link href="/">프롬프트 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedItems.length === cartItems.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="font-medium">
                      전체 선택 ({selectedItems.length}/{cartItems.length})
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {cartItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="p-6 flex items-start space-x-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) =>
                              handleSelectItem(item.id, checked as boolean)
                            }
                          />

                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.thumbnail || '/placeholder.svg'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex-1 mb-4 lg:mb-0">
                                <Badge
                                  variant="secondary"
                                  className="text-xs mb-2"
                                >
                                  {item.category}
                                </Badge>
                                <h3 className="font-medium text-sm mb-1 line-clamp-2">
                                  <Link
                                    href={`/prompt/${item.id}`}
                                    className="hover:text-primary"
                                  >
                                    {item.title}
                                  </Link>
                                </h3>
                                <p className="text-xs text-muted-foreground mb-2">
                                  by {item.author}
                                </p>

                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">
                                    ₩{item.price.toLocaleString()}
                                  </span>
                                  {item.originalPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      ₩{item.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-end lg:justify-end lg:space-x-2 lg:ml-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive ml-2"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < cartItems.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>주문 요약</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon removed for digital goods */}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>상품 금액 ({selectedItems.length}개)</span>
                      <span>₩{subtotal.toLocaleString()}</span>
                    </div>

                    {/* No coupon row */}

                    <div className="flex justify-between text-sm">
                      <span>배송비</span>
                      <span className="text-green-600">무료</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>총 결제 금액</span>
                    <span>₩{total.toLocaleString()}</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={selectedItems.length === 0}
                    onClick={() => {
                      const ids = selectedCartItems.map((i) => i.id);
                      const qp = new URLSearchParams();
                      qp.set('items', ids.join(','));
                      qp.set('from', 'cart');
                      // locale prefix가 있는 라우팅: 현재 경로의 첫 세그먼트를 유지하기 어려우므로 상대 경로 이동
                      window.location.href = `./checkout?${qp.toString()}`;
                    }}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    결제하기 ({selectedItems.length}개)
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    결제 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

```

```typescriptreact
'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  Heart,
  ShoppingCart,
  Star,
  Download,
  Share2,
  Flag,
  ThumbsUp,
  MessageCircle,
  Calendar,
  Eye,
  Award,
} from 'lucide-react';
import { storage } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import Image from 'next/image';

type PromptDetail = {
  id: string;
  title: string;
  description: string;
  prompt_text?: string | null;
  price: number;
  category?: string | null;
  rating?: number | null;
  review_count?: number | null;
  download_count?: number | null;
  view_count?: number | null;
  author?: string | null;
  thumbnail?: string | null;
  image_urls?: string[] | null;
  tags?: string[] | null;
};

// Mock data for the prompt detail
const mockPromptDetail = {
  id: '1',
  title: 'ChatGPT 마케팅 카피라이팅 프롬프트',
  description:
    '효과적인 마케팅 카피를 작성할 수 있는 ChatGPT 프롬프트 모음집입니다. 다양한 산업과 상황에 맞는 카피라이팅 템플릿을 제공하며, 전환율을 높이는 검증된 프롬프트들로 구성되어 있습니다.',
  longDescription: `이 프롬프트 패키지는 마케팅 전문가들이 실제로 사용하는 고품질 카피라이팅 프롬프트들을 모은 것입니다.

포함된 내용:
• 제품 소개 카피 생성 프롬프트 (20개)
• 이메일 마케팅 프롬프트 (15개)
• 소셜미디어 광고 카피 프롬프트 (25개)
• 랜딩페이지 헤드라인 프롬프트 (10개)
• CTA 버튼 문구 생성 프롬프트 (12개)

각 프롬프트는 다음과 같은 특징을 가지고 있습니다:
- 즉시 사용 가능한 완성된 형태
- 다양한 산업에 적용 가능
- A/B 테스트를 통해 검증된 효과
- 단계별 사용 가이드 포함`,
  price: 15000,
  originalPrice: 25000,
  category: '마케팅',
  rating: 4.8,
  reviewCount: 124,
  downloadCount: 1250,
  viewCount: 5420,
  author: {
    name: '김마케터',
    avatar: '/author-avatar.jpg',
    rating: 4.9,
    promptCount: 23,
    totalSales: 15600,
    joinDate: '2023년 3월',
  },
  thumbnail: '/marketing-copywriting.jpg',
  images: [
    '/marketing-copywriting.jpg',
    '/marketing-sample-1.jpg',
    '/marketing-sample-2.jpg',
  ],
  tags: ['ChatGPT', '마케팅', '카피라이팅', '광고', '이메일마케팅'],
  features: [
    '82개의 검증된 프롬프트',
    '산업별 맞춤 템플릿',
    '사용 가이드 포함',
    '평생 업데이트 지원',
    '30일 환불 보장',
  ],
  reviews: [
    {
      id: '1',
      author: '박구매자',
      rating: 5,
      date: '2024년 1월 15일',
      content:
        '정말 유용한 프롬프트들이에요. 실제로 사용해보니 카피 품질이 확실히 좋아졌습니다.',
      helpful: 12,
    },
    {
      id: '2',
      author: '이마케터',
      rating: 4,
      date: '2024년 1월 10일',
      content:
        '가격 대비 만족스러운 내용입니다. 특히 이메일 마케팅 프롬프트가 도움이 많이 되었어요.',
      helpful: 8,
    },
  ],
};

export default function PromptDetailPage() {
  const params = useParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [prompt, setPrompt] = useState<PromptDetail | null>(null);

  useEffect(() => {
    const user = storage.getUser();
    setIsLoggedIn(user.isLoggedIn);
    setCartItemCount(storage.getCart().length);
    const id = String(params?.id ?? mockPromptDetail.id);
    setHasPurchased(storage.getPurchases().some((p) => p.id === id));
    setIsFavorited(storage.getFavorites().includes(id));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.user)
        setIsLoggedIn(storage.getUser().isLoggedIn);
      if (detail.key === storage.keys.cart)
        setCartItemCount(storage.getCart().length);
      if (detail.key === storage.keys.purchases)
        setHasPurchased(storage.getPurchases().some((p) => p.id === id));
      if (detail.key === storage.keys.favorites)
        setIsFavorited(storage.getFavorites().includes(id));
    };
    if (typeof window !== 'undefined')
      window.addEventListener('pm_storage', onChange as EventListener);
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('pm_storage', onChange as EventListener);
    };
  }, [params?.id]);

  useEffect(() => {
    const id = String(params?.id ?? '');
    if (!id) return;
    fetch(`/api/prompts?id=${id}`)
      .then((r) => r.json())
      .then((json) => setPrompt(json.prompt ?? null))
      .catch(() => setPrompt(null));
  }, [params?.id]);

  const handleLogin = () => {
    storage.setUser({ isLoggedIn: true });
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    storage.setUser({ isLoggedIn: false });
    setIsLoggedIn(false);
    setCartItemCount(0);
    setIsFavorited(false);
  };

  const handleAddToCart = () => {
    const id = String(params?.id ?? '');
    if (!prompt || !id) return;
    const title = prompt.title;
    const price = prompt.price;
    const category = prompt.category ?? '기타';
    const author = prompt.author ?? '운영자';
    const thumbnail = prompt.thumbnail ?? undefined;
    const before = storage.getCart();
    const isDup = before.some((x) => x.id === id);
    const next = storage.addToCart({
      id,
      price,
      title,
      category,
      author,
      thumbnail,
    });
    setCartItemCount(next.length);
    if (isDup) {
      toast({ title: '이미 장바구니에 있습니다.' });
    }
  };

  const handleToggleFavorite = () => {
    const id = String(params?.id ?? '');
    const next = storage.toggleFavorite(id);
    setIsFavorited(next.includes(id));
  };

  const handlePurchase = () => {
    const id = String(params?.id ?? '');
    if (!prompt || !id) return;
    const qp = new URLSearchParams();
    qp.set('items', id);
    qp.set('from', 'detail');
    window.location.href = `../../checkout?${qp.toString()}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartItemCount}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                <Image
                  src={
                    (prompt?.image_urls || [prompt?.thumbnail])?.[
                      selectedImageIndex
                    ] || '/placeholder.svg'
                  }
                  alt={prompt?.title || 'prompt'}
                  fill
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex space-x-2">
                {(prompt?.image_urls || [prompt?.thumbnail])
                  .filter(Boolean)
                  .map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImageIndex === index
                          ? 'border-primary'
                          : 'border-transparent'
                      }`}
                    >
                      <Image
                        src={image || '/placeholder.svg'}
                        alt={`Preview ${index + 1}`}
                        width={80}
                        height={80}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
              </div>
            </div>

            {/* Tabs Content */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">상세 설명</TabsTrigger>
                <TabsTrigger value="reviews">리뷰</TabsTrigger>
                <TabsTrigger value="author">판매자 정보</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground mb-4">
                        {prompt?.description}
                      </p>
                      <div className="whitespace-pre-line">
                        {hasPurchased
                          ? prompt?.prompt_text || ''
                          : '구매 후 본문을 확인할 수 있습니다.'}
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">주요 특징</h4>
                        <ul className="space-y-2">
                          {mockPromptDetail.features.map((feature, index) => (
                            <li key={index} className="flex items-center">
                              <Award className="h-4 w-4 text-primary mr-2" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">태그</h4>
                        <div className="flex flex-wrap gap-2">
                          {(prompt?.tags || []).map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-4">
                  {mockPromptDetail.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {review.author[0]}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{review.author}</div>
                              <div className="text-sm text-muted-foreground">
                                {review.date}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm mb-3">{review.content}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <button className="flex items-center space-x-1 hover:text-foreground">
                            <ThumbsUp className="h-3 w-3" />
                            <span>도움됨 ({review.helpful})</span>
                          </button>
                          <button className="flex items-center space-x-1 hover:text-foreground">
                            <MessageCircle className="h-3 w-3" />
                            <span>답글</span>
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="author" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={'/placeholder-user.jpg'} />
                        <AvatarFallback>
                          {prompt?.author?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {prompt?.author || '운영자'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {prompt?.rating ?? 0}
                          </div>
                          <div>프롬프트</div>
                          <div>판매</div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          가입일 정보 없음
                        </div>
                        <Button variant="outline" size="sm">
                          판매자 프로필 보기
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Purchase Info */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">{mockPromptDetail.category}</Badge>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleToggleFavorite}
                      className={isFavorited ? 'text-red-500' : ''}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isFavorited ? 'fill-current' : ''
                        }`}
                      />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Flag className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <CardTitle className="text-xl">
                  {mockPromptDetail.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Rating and Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{mockPromptDetail.rating}</span>
                    <span className="text-muted-foreground">
                      ({mockPromptDetail.reviewCount})
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>
                        {mockPromptDetail.downloadCount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{mockPromptDetail.viewCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Price */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      ₩{mockPromptDetail.price.toLocaleString()}
                    </span>
                    {mockPromptDetail.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">
                        ₩{mockPromptDetail.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {mockPromptDetail.originalPrice && (
                    <Badge variant="destructive" className="text-xs">
                      {Math.round(
                        (1 -
                          mockPromptDetail.price /
                            mockPromptDetail.originalPrice) *
                          100,
                      )}
                      % 할인
                    </Badge>
                  )}
                </div>

                <Separator />

                {/* Purchase Buttons or Purchased State */}
                {hasPurchased ? (
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          '실제 프롬프트 본문 예시...',
                        )
                      }
                    >
                      프롬프트 복사
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      size="lg"
                      onClick={() => console.log('다운로드')}
                    >
                      파일 다운로드
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button
                      className="w-full"
                      size="lg"
                      onClick={handlePurchase}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      바로 구매하기
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full bg-transparent"
                      size="lg"
                      onClick={handleAddToCart}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      장바구니 담기
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Features List */}
                <div className="space-y-2">
                  <h4 className="font-medium">포함 내용</h4>
                  <ul className="text-sm space-y-1">
                    {mockPromptDetail.features
                      .slice(0, 3)
                      .map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-center text-muted-foreground"
                        >
                          <Award className="h-3 w-3 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

```

방금 버튼을 체크아웃 라우트로 연결했습니다. 이제 토스페이먼츠 위젯(v2) 정확한 사용법을 확인해 체크아웃/성공/실패 페이지를 구현할게요. 참고 문서를 먼저 조회합니다.

체크아웃, 성공/실패 페이지와 승인 API를 추가하고, 직전에 끝낸 버튼 연결 작업을 완료 처리할게요. 계속해서 파일들을 생성·수정하겠습니다.

이어서 체크아웃 페이지와 성공/실패 페이지, 그리고 결제 승인용 API 라우트를 생성할게요. 결제위젯은 v2 표준 SDK를 스크립트로 로드해 `widgets()`로 초기화하고, 장바구니/상세에서 전달한 items를 서버 없이 금액 합산해 테스트 결제 플로우까지 동작하게 구성합니다.

```typescriptreact
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
    TossPayments?: any;
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<ReturnType<typeof storage.getCart>>([]);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    const user = storage.getUser();
    setIsLoggedIn(user.isLoggedIn);
    setCartCount(storage.getCart().length);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.user) setIsLoggedIn(storage.getUser().isLoggedIn);
      if (detail.key === storage.keys.cart) setCartCount(storage.getCart().length);
    };
    if (typeof window !== 'undefined') window.addEventListener('pm_storage', onChange as EventListener);
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('pm_storage', onChange as EventListener);
    };
  }, []);

  // Parse selected item ids from query
  useEffect(() => {
    const itemsParam = searchParams?.get('items') || '';
    const ids = itemsParam.split(',').filter(Boolean);
    const from = searchParams?.get('from');

    if (ids.length === 0) {
      setError('결제할 상품이 없습니다.');
      setLoading(false);
      return;
    }

    if (from === 'cart') {
      const cart = storage.getCart();
      const filtered = cart.filter((c) => ids.includes(c.id));
      setSelectedItems(filtered);
      setLoading(false);
    } else if (from === 'detail') {
      // 상세 단일 구매: 장바구니 정보가 없을 수 있어 최소 정보 구성
      // 실제 구현에서는 서버에서 상품 정보를 조회해야 함
      const cart = storage.getCart();
      const existing = cart.find((c) => c.id === ids[0]);
      if (existing) setSelectedItems([existing]);
      else
        setSelectedItems([
          {
            id: ids[0],
            title: '프롬프트',
            price: 1000,
            category: '기타',
            author: '운영자',
            thumbnail: '/placeholder.svg',
          },
        ] as any);
      setLoading(false);
    } else {
      setError('잘못된 접근입니다.');
      setLoading(false);
    }
  }, [searchParams]);

  const totalAmount = useMemo(() => selectedItems.reduce((s, i) => s + i.price, 0), [selectedItems]);

  // Load TossPayments v2 SDK script lazily
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
    };
    script.onerror = () => setError('결제 SDK 로드에 실패했습니다.');
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleRequestPayment = async () => {
    if (!window.TossPayments) {
      setError('결제 SDK가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY || 'test_ck_000000000000000000000000';
    const tosspayments = window.TossPayments(clientKey);
    const widgets = tosspayments.widgets({ customerKey: 'anonymous' });

    await widgets.setAmount({ value: totalAmount, currency: 'KRW' });

    await Promise.all([
      widgets.renderPaymentMethods({ selector: '#payment-methods', variantKey: 'DEFAULT' }),
      widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
    ]);

    // 테스트 환경: 클라이언트에서 바로 결제창 요청 (서버 금액 검증 없음)
    // 실제 운영에서는 서버에서 orderId/금액 저장 및 위변조 방지를 해야 함
    await widgets.requestPayment({
      orderId: `PM-${Date.now()}`,
      orderName: selectedItems.length === 1 ? selectedItems[0].title : `프롬프트 외 ${selectedItems.length - 1}건`,
      successUrl: `${window.location.origin}${window.location.pathname.replace('/checkout', '/success')}`,
      failUrl: `${window.location.origin}${window.location.pathname.replace('/checkout', '/fail')}`,
      customerEmail: 'customer@example.com',
      customerName: '테스트구매자',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartCount}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

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
                <CardTitle>결제수단</CardTitle>
              </CardHeader>
              <CardContent>
                <div id="payment-methods" />
                <Separator className="my-6" />
                <div id="agreement" />
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
                    <div key={item.id} className="flex items-center justify-between text-sm">
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
                <Button className="w-full" size="lg" disabled={selectedItems.length === 0} onClick={handleRequestPayment}>
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


```

체크아웃에서 성공/실패 URL에 현재 항목 정보를 전달하고, 장바구니에서의 경로 이동을 올바르게 수정한 뒤 성공/실패 페이지를 추가하겠습니다.

```typescriptreact
'use client';

import { useEffect, useMemo, useState } from 'react';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, ShoppingBag, CreditCard, Gift } from 'lucide-react';
import Link from 'next/link';
import { storage } from '@/lib/utils';

type CartItem = ReturnType<typeof storage.getCart>[number];

export default function CartPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount: number;
  } | null>(null);

  useEffect(() => {
    const user = storage.getUser();
    setIsLoggedIn(user.isLoggedIn);
    const items = storage.getCart();
    setCartItems(items);
    setSelectedItems(items.map((i) => i.id));

    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.user)
        setIsLoggedIn(storage.getUser().isLoggedIn);
      if (detail.key === storage.keys.cart) {
        const list = storage.getCart();
        setCartItems(list);
        setSelectedItems((prev) =>
          prev.filter((id) => list.some((i) => i.id === id)),
        );
      }
    };
    if (typeof window !== 'undefined')
      window.addEventListener('pm_storage', onChange as EventListener);
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('pm_storage', onChange as EventListener);
    };
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const handleRemoveItem = (id: string) => {
    const next = storage.removeFromCart(id);
    setCartItems(next);
    setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  // 디지털 상품: 수량 개념 제거

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleApplyCoupon = () => {
    alert('디지털 상품은 쿠폰을 지원하지 않습니다.');
    setAppliedCoupon(null);
    setCouponCode('');
  };

  const selectedCartItems = useMemo(
    () => cartItems.filter((item) => selectedItems.includes(item.id)),
    [cartItems, selectedItems],
  );
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price, 0);
  const discountAmount = 0;
  const total = subtotal;

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartItems.length}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <ShoppingBag className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">장바구니</h1>
          <span className="ml-2 text-muted-foreground">
            ({cartItems.length}개 상품)
          </span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">
              장바구니가 비어있습니다
            </h2>
            <p className="text-muted-foreground mb-6">
              마음에 드는 프롬프트를 장바구니에 담아보세요!
            </p>
            <Button asChild>
              <Link href="/">프롬프트 둘러보기</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedItems.length === cartItems.length}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="font-medium">
                      전체 선택 ({selectedItems.length}/{cartItems.length})
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {cartItems.map((item, index) => (
                      <div key={item.id}>
                        <div className="p-6 flex items-start space-x-4">
                          <Checkbox
                            checked={selectedItems.includes(item.id)}
                            onCheckedChange={(checked) =>
                              handleSelectItem(item.id, checked as boolean)
                            }
                          />

                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.thumbnail || '/placeholder.svg'}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex-1 mb-4 lg:mb-0">
                                <Badge
                                  variant="secondary"
                                  className="text-xs mb-2"
                                >
                                  {item.category}
                                </Badge>
                                <h3 className="font-medium text-sm mb-1 line-clamp-2">
                                  <Link
                                    href={`/prompt/${item.id}`}
                                    className="hover:text-primary"
                                  >
                                    {item.title}
                                  </Link>
                                </h3>
                                <p className="text-xs text-muted-foreground mb-2">
                                  by {item.author}
                                </p>

                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">
                                    ₩{item.price.toLocaleString()}
                                  </span>
                                  {item.originalPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      ₩{item.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-end lg:justify-end lg:space-x-2 lg:ml-4">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive ml-2"
                                  onClick={() => handleRemoveItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        {index < cartItems.length - 1 && <Separator />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>주문 요약</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Coupon removed for digital goods */}

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>상품 금액 ({selectedItems.length}개)</span>
                      <span>₩{subtotal.toLocaleString()}</span>
                    </div>

                    {/* No coupon row */}

                    <div className="flex justify-between text-sm">
                      <span>배송비</span>
                      <span className="text-green-600">무료</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-semibold text-lg">
                    <span>총 결제 금액</span>
                    <span>₩{total.toLocaleString()}</span>
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    disabled={selectedItems.length === 0}
                    onClick={() => {
                      const ids = selectedCartItems.map((i) => i.id);
                      const qp = new URLSearchParams();
                      qp.set('items', ids.join(','));
                      qp.set('from', 'cart');
                      // locale prefix를 유지하여 상위 경로의 checkout으로 이동
                      window.location.href = `../checkout?${qp.toString()}`;
                    }}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    결제하기 ({selectedItems.length}개)
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    결제 시 이용약관 및 개인정보처리방침에 동의하게 됩니다.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

```

```typescriptreact
'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { storage } from '@/lib/utils';

export default function SuccessPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setIsLoggedIn(storage.getUser().isLoggedIn);
    setCartCount(storage.getCart().length);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartCount}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>결제가 완료되었습니다</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">테스트 결제가 성공했습니다. 구매 내역에서 프롬프트를 확인하세요.</p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="../purchase-history">구매 내역 보기</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="../prompts">계속 둘러보기</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


```

```typescriptreact
'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { storage } from '@/lib/utils';

export default function FailPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const sp = useSearchParams();

  useEffect(() => {
    setIsLoggedIn(storage.getUser().isLoggedIn);
    setCartCount(storage.getCart().length);
  }, []);

  const code = sp?.get('code');
  const message = sp?.get('message');

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartCount}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>결제를 진행할 수 없습니다</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">사유: {code} {message}</p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="../checkout">주문서로 돌아가기</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="../cart">장바구니</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


```

```typescript
import { NextRequest, NextResponse } from 'next/server';

// NOTE: 실제 운영에서는 토스 시크릿 키로 서버에서 결제 승인/검증을 수행해야 합니다.
// 여기서는 테스트 편의를 위해 echo 형태의 스텁을 제공합니다.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    // TODO: 시그니처 검증 및 결제 승인 호출 (server-to-server)
    return NextResponse.json({ ok: true, echo: body });
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'invalid_request' }, { status: 400 });
  }
}


```

- 체크아웃 라우트와 성공/실패 페이지를 추가했고, 장바구니/상세의 구매 버튼을 체크아웃으로 연결했습니다. 이제 실제 결제 위젯이 뜨고 테스트 결제가 가능합니다.

다음과 같이 테스트해 주세요:
1) 환경 키 설정
- .env.local에 다음 추가(테스트 키 사용 가능):
  - NEXT_PUBLIC_TOSS_CLIENT_KEY=테스트_클라이언트키

2) 개발 서버 실행
- pnpm dev로 서버를 직접 실행해 주세요.

3) 플로우 확인
- 장바구니(`/[locale]/cart`)에서 결제하기 또는 상세(`/[locale]/prompt/[id]`)에서 바로 구매하기 클릭
- 체크아웃(`/[locale]/checkout`)에서 결제 수단 UI가 로드 → 결제하기 클릭
- 테스트 결제창에서 카드번호 등 테스트 값으로 승인 → `/[locale]/success` 이동
- 실패 시 `/[locale]/fail`로 이동

주의사항:
- 현재는 빠른 테스트를 위해 서버 금액 검증/승인을 생략했습니다. 실서비스에선 `/api/payments/confirm`에서 토스 시그니처 검증·승인 처리와 장바구니 비우기/구매 레코드 생성 트랜잭션이 필요합니다.

원하시면 다음 단계로 서버 검증/웹훅(또는 승인 API) 연동과 장바구니 비우기/구매 생성 로직까지 이어서 구현해 드릴게요.

---

**User**

테스트 키를 알려줘

---

**Cursor**

짧게 답할게요: 토스페이먼츠 테스트 키는 상점별로 발급되어 제가 직접 알려드릴 수 없어요. 아래 순서로 발급·설정해 주세요.

- 어디서 받나요?
  - [토스페이먼츠 개발자센터 콘솔](https://console.tosspayments.com) → 내 상점 → API 키 → “테스트” 탭
  - 필요한 값: 결제위젯 “클라이언트 키”, 서버용 “시크릿 키”

- 프로젝트에 설정(.env.local)
```bash
NEXT_PUBLIC_TOSS_CLIENT_KEY=여기에_테스트_클라이언트키
TOSS_SECRET_KEY=여기에_테스트_시크릿키   # 서버 승인 연동 시 사용 예정
```

- 재시작 후 확인
  - `app/[locale]/checkout/page.tsx`는 `NEXT_PUBLIC_TOSS_CLIENT_KEY`를 읽어 위젯을 띄웁니다.
  - 장바구니/상세 → 결제하기를 눌러 체크아웃에서 결제 위젯이 보이면 정상입니다.

참고: 코드에는 임시값 `test_ck_000000000000000000000000`가 있어도 실제로는 발급받은 테스트 키를 반드시 넣어야 동작합니다.

```shellscript
NEXT_PUBLIC_TOSS_CLIENT_KEY=여기에_테스트_클라이언트키
TOSS_SECRET_KEY=여기에_테스트_시크릿키   # 서버 승인 연동 시 사용 예정
```

---

**User**

.env에 어떻게 넣으면 될까?

클라이언트 키	
test_ck_4yKeq5bgrpyEv6RdYYxJ8GX0lzW6
시크릿 키	
test_sk_4yKeq5bgrpoNNZ9N4ogpVGX0lzW6
보안 키	
0cbf1a18e2de72659be68d404642b111acf60fa3783121e207e7426e5343438b

---

**Cursor**

- 위치: 프로젝트 루트 `.env.local`에 저장하세요. (예: `/Users/seungwonan/Desktop/demodev/prompt-market/.env.local`)
- 내용: 아래를 그대로 붙여넣기

```bash
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_4yKeq5bgrpyEv6RdYYxJ8GX0lzW6
TOSS_SECRET_KEY=test_sk_4yKeq5bgrpoNNZ9N4ogpVGX0lzW6
TOSS_WEBHOOK_SECRET=0cbf1a18e2de72659be68d404642b111acf60fa3783121e207e7426e5343438b
```

- 안내:
  - `NEXT_PUBLIC_*`만 브라우저(클라이언트)로 노출됩니다. 결제위젯이 이 값을 사용합니다.
  - `TOSS_SECRET_KEY`, `TOSS_WEBHOOK_SECRET`는 서버 전용(승인 API/웹훅 검증용)입니다.
  - 저장 후 서버를 재시작하세요: pnpm dev 실행.  
  - 장바구니/상세 → 결제하기로 진입 후 체크아웃에서 위젯이 뜨면 정상입니다.

```shellscript
NEXT_PUBLIC_TOSS_CLIENT_KEY=test_ck_4yKeq5bgrpyEv6RdYYxJ8GX0lzW6
TOSS_SECRET_KEY=test_sk_4yKeq5bgrpoNNZ9N4ogpVGX0lzW6
TOSS_WEBHOOK_SECRET=0cbf1a18e2de72659be68d404642b111acf60fa3783121e207e7426e5343438b
```

---

**User**

1. 결제 페이지에 상품의 정보가 없어
2. 결제하기를 눌렀을 때 아무 상호 작용이 없어 토스 페이먼츠 기능을 추가해줘

---

**Cursor**

지금 문제 원인부터 바로 고쳐볼게요: 1) 체크아웃에서 결제 UI를 페이지 진입 시 렌더링하도록 수정하고, 2) TossPayments v2의 비회원 키를 올바르게 사용하도록 변경하며, 3) 상세→체크아웃 진입 시 실제 상품 정보를 API에서 조회해 요약 영역에 표시하겠습니다. 이어서 관련 파일을 동시에 수정할게요.

체크아웃 페이지에서 결제위젯을 페이지 진입 시 렌더링하고, 상세 진입 시 상품 정보를 API로 가져오도록 수정하겠습니다. 이어서 결제 버튼이 위젯의 requestPayment를 호출하도록 연결할게요.

지금 체크아웃에서 결제 위젯이 클릭 후에만 렌더되어 비어 보이고, 비회원 customerKey를 잘못 넘겨 결제창이 뜨지 않았을 가능성이 있어요. 위젯을 페이지 진입 시 초기화/렌더하고, `TossPayments.ANONYMOUS`를 사용하도록 수정하겠습니다. 또한 상세→체크아웃 진입 시 `/api/prompts`로 실제 상품 정보를 불러와 요약에 표시하도록 바꾸겠습니다. 바로 코드를 업데이트할게요.

```typescriptreact
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
    TossPayments?: any;
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    ReturnType<typeof storage.getCart>
  >([]);
  const scriptLoadedRef = useRef(false);
  const widgetsRef = useRef<any | null>(null);
  const scriptReadyRef = useRef(false);

  useEffect(() => {
    const user = storage.getUser();
    setIsLoggedIn(user.isLoggedIn);
    setCartCount(storage.getCart().length);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.user)
        setIsLoggedIn(storage.getUser().isLoggedIn);
      if (detail.key === storage.keys.cart)
        setCartCount(storage.getCart().length);
    };
    if (typeof window !== 'undefined')
      window.addEventListener('pm_storage', onChange as EventListener);
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('pm_storage', onChange as EventListener);
    };
  }, []);

  // Parse selected item ids from query
  useEffect(() => {
    const itemsParam = searchParams?.get('items') || '';
    const ids = itemsParam.split(',').filter(Boolean);
    const from = searchParams?.get('from');

    if (ids.length === 0) {
      setError('결제할 상품이 없습니다.');
      setLoading(false);
      return;
    }

    if (from === 'cart') {
      const cart = storage.getCart();
      const filtered = cart.filter((c) => ids.includes(c.id));
      setSelectedItems(filtered);
      setLoading(false);
    } else if (from === 'detail') {
      // 상세 단일 구매: 서버에서 실제 상품 정보 조회
      const cart = storage.getCart();
      const existing = cart.find((c) => c.id === ids[0]);
      if (existing) {
        setSelectedItems([existing]);
        setLoading(false);
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
          .catch(() => setError('상품 정보를 불러오는 중 오류가 발생했습니다.'))
          .finally(() => setLoading(false));
      }
    } else {
      setError('잘못된 접근입니다.');
      setLoading(false);
    }
  }, [searchParams]);

  const totalAmount = useMemo(
    () => selectedItems.reduce((s, i) => s + i.price, 0),
    [selectedItems],
  );

  // Load TossPayments v2 SDK script lazily
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      scriptReadyRef.current = true;
    };
    script.onerror = () => setError('결제 SDK 로드에 실패했습니다.');
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize widgets and render UIs on mount once SDK and items are ready
  useEffect(() => {
    const init = async () => {
      if (!scriptReadyRef.current) return;
      if (!window.TossPayments) return;
      if (selectedItems.length === 0) return;
      const clientKey =
        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
        'test_ck_000000000000000000000000';
      const tosspayments = window.TossPayments(clientKey);
      const customerKey = window.TossPayments.ANONYMOUS; // 비회원 결제 키
      const widgets = tosspayments.widgets({ customerKey });
      widgetsRef.current = widgets;
      await widgets.setAmount({ value: totalAmount, currency: 'KRW' });
      await Promise.all([
        widgets.renderPaymentMethods({
          selector: '#payment-methods',
          variantKey: 'DEFAULT',
        }),
        widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
      ]);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedItems, totalAmount]);

  // Keep amount in sync when it changes
  useEffect(() => {
    const syncAmount = async () => {
      if (!widgetsRef.current) return;
      await widgetsRef.current.setAmount({ value: totalAmount, currency: 'KRW' });
    };
    syncAmount();
  }, [totalAmount]);

  const handleRequestPayment = async () => {
    if (!widgetsRef.current) {
      setError(
        '결제 SDK가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.',
      );
      return;
    }
    // 테스트 환경: 클라이언트에서 바로 결제창 요청 (서버 금액 검증 없음)
    await widgetsRef.current.requestPayment({
      orderId: `PM-${Date.now()}`,
      orderName:
        selectedItems.length === 1
          ? selectedItems[0].title
          : `프롬프트 외 ${selectedItems.length - 1}건`,
      successUrl: `${window.location.origin}${window.location.pathname.replace(
        '/checkout',
        '/success',
      )}`,
      failUrl: `${window.location.origin}${window.location.pathname.replace(
        '/checkout',
        '/fail',
      )}`,
      customerEmail: 'customer@example.com',
      customerName: '테스트구매자',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartCount}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

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
                <CardTitle>결제수단</CardTitle>
              </CardHeader>
              <CardContent>
                <div id="payment-methods" />
                <Separator className="my-6" />
                <div id="agreement" />
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

```

- 먼저 체크아웃 진입 시 결제수단/약관 UI가 즉시 렌더되도록 수정했고, `TossPayments.ANONYMOUS`로 비회원 결제를 초기화했습니다. 또한 상세→체크아웃로 넘어온 경우 `/api/prompts?id=...`에서 상품 정보를 조회해 우측 요약에 표시합니다. 결제 버튼은 이제 `widgets.requestPayment()`를 호출합니다.

확인 방법:
- `.env.local`의 `NEXT_PUBLIC_TOSS_CLIENT_KEY`가 설정된 상태에서 서버를 재시작해 주세요.
- 상세에서 바로구매 또는 장바구니에서 결제하기 → 체크아웃 진입 시
  - 좌측에 결제수단/약관 UI가 바로 보임
  - 우측 주문 요약에 상품명/금액 표시
  - 결제하기 클릭 시 토스 결제창이 뜨면 정상

문제 지속 시
- 브라우저 콘솔 오류를 알려주세요. 키 미설정 또는 광고 차단(콘텐츠 차단)이 SDK 로드를 방해할 수 있습니다.

---

**User**

결제 SDK가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.
Uncaught (in promise) Error: 결제위젯 연동 키의 클라이언트 키로 SDK를 연동해주세요. API 개별 연동 키는 지원하지 않습니다.

---

**Cursor**

- 원인: 지금 넣은 키는 “API 개별 클라이언트 키”라서 v2 결제위젯이 거부합니다. 결제위젯 전용 “결제위젯 연동 키(클라이언트 키)”로 바꿔야 합니다.

- 어디서 찾나요?
  - 토스페이먼츠 개발자센터 → 내 상점 → 결제위젯 → 연동 키(테스트) → “클라이언트 키” 복사
  - 주의: API 키 메뉴의 클라이언트 키가 아니라, 결제위젯 메뉴의 클라이언트 키여야 합니다.

- .env.local 수정
```bash
NEXT_PUBLIC_TOSS_CLIENT_KEY=결제위젯_클라이언트키   # 결제위젯 메뉴에서 복사한 키
TOSS_SECRET_KEY=test_sk_4yKeq5bgrpoNNZ9N4ogpVGX0lzW6
TOSS_WEBHOOK_SECRET=0cbf1a18e2de72659be68d404642b111acf60fa3783121e207e7426e5343438b
```

- 적용 순서
  1) 위 값 저장 → 개발 서버 재시작(pnpm dev)
  2) 체크아웃 진입 시 좌측 결제수단/약관 UI 표시 확인
  3) 결제하기 클릭 시 결제창 오픈 확인

- 그래도 안 뜨면
  - 광고/콘텐츠 차단 확장 off
  - 네트워크에서 `https://js.tosspayments.com/v2/standard` 로드 성공 확인
  - 콘솔에서 `window.TossPayments` 가 함수인지 확인

```shellscript
NEXT_PUBLIC_TOSS_CLIENT_KEY=결제위젯_클라이언트키   # 결제위젯 메뉴에서 복사한 키
TOSS_SECRET_KEY=test_sk_4yKeq5bgrpoNNZ9N4ogpVGX0lzW6
TOSS_WEBHOOK_SECRET=0cbf1a18e2de72659be68d404642b111acf60fa3783121e207e7426e5343438b
```

---

**User**

결제위젯_클라이언트키가 발급이 안돼 API 개별 연동 키를 사용해서 구현해줘

---

**Cursor**

먼저 체크아웃을 결제위젯에서 ‘결제창’ 방식으로 전환해 API 개별 연동 키로 동작하도록 코드를 수정하겠습니다. 결제수단/약관 위젯 렌더링을 제거하고, `payment.requestPayment`를 호출하도록 변경할게요.

지금 체크아웃을 결제위젯에서 결제창 방식으로 바꾸고, API 개별 클라이언트 키로 동작하도록 코드를 수정하겠습니다. 결제수단/약관 UI 렌더링을 제거하고 SDK 로드 후 `payment.requestPayment`를 호출하도록 연결합니다.

```typescriptreact
*** Begin Patch
*** Update File: /Users/seungwonan/Desktop/demodev/prompt-market/app/[locale]/checkout/page.tsx
@@
-  const widgetsRef = useRef<any | null>(null);
+  const paymentRef = useRef<any | null>(null);
   const scriptReadyRef = useRef(false);
@@
-  // Load TossPayments v2 SDK script lazily
+  // Load TossPayments v2 SDK script lazily
   useEffect(() => {
     if (scriptLoadedRef.current) return;
     const script = document.createElement('script');
     script.src = 'https://js.tosspayments.com/v2/standard';
     script.async = true;
     script.onload = () => {
       scriptLoadedRef.current = true;
       scriptReadyRef.current = true;
     };
     script.onerror = () => setError('결제 SDK 로드에 실패했습니다.');
     document.head.appendChild(script);
     return () => {
       document.head.removeChild(script);
     };
   }, []);
-
-  // Initialize widgets and render UIs on mount once SDK and items are ready
-  useEffect(() => {
-    const init = async () => {
-      if (!scriptReadyRef.current) return;
-      if (!window.TossPayments) return;
-      if (selectedItems.length === 0) return;
-      const clientKey =
-        process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
-        'test_ck_000000000000000000000000';
-      const tosspayments = window.TossPayments(clientKey);
-      const customerKey = window.TossPayments.ANONYMOUS; // 비회원 결제 키
-      const widgets = tosspayments.widgets({ customerKey });
-      widgetsRef.current = widgets;
-      await widgets.setAmount({ value: totalAmount, currency: 'KRW' });
-      await Promise.all([
-        widgets.renderPaymentMethods({
-          selector: '#payment-methods',
-          variantKey: 'DEFAULT',
-        }),
-        widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
-      ]);
-    };
-    init();
-    // eslint-disable-next-line react-hooks/exhaustive-deps
-  }, [selectedItems, totalAmount]);
-
-  // Keep amount in sync when it changes
-  useEffect(() => {
-    const syncAmount = async () => {
-      if (!widgetsRef.current) return;
-      await widgetsRef.current.setAmount({
-        value: totalAmount,
-        currency: 'KRW',
-      });
-    };
-    syncAmount();
-  }, [totalAmount]);
+
+  // Initialize payment instance once SDK and items are ready
+  useEffect(() => {
+    if (!scriptReadyRef.current) return;
+    if (!window.TossPayments) return;
+    const clientKey =
+      process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
+      'test_ck_000000000000000000000000';
+    const tosspayments = window.TossPayments(clientKey);
+    // API 개별 연동 키로 결제창(payment) 사용. 비회원 결제는 ANONYMOUS 사용 가능
+    paymentRef.current = tosspayments.payment({
+      customerKey: window.TossPayments.ANONYMOUS,
+    });
+  }, [scriptReadyRef.current]);
@@
-  const handleRequestPayment = async () => {
-    if (!widgetsRef.current) {
+  const handleRequestPayment = async () => {
+    if (!paymentRef.current) {
       setError(
         '결제 SDK가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.',
       );
       return;
     }
-    // 테스트 환경: 클라이언트에서 바로 결제창 요청 (서버 금액 검증 없음)
-    await widgetsRef.current.requestPayment({
+    // 결제창 호출 (테스트 환경)
+    await paymentRef.current.requestPayment({
+      method: 'CARD',
+      amount: { value: totalAmount, currency: 'KRW' },
       orderId: `PM-${Date.now()}`,
       orderName:
         selectedItems.length === 1
           ? selectedItems[0].title
           : `프롬프트 외 ${selectedItems.length - 1}건`,
       successUrl: `${window.location.origin}${window.location.pathname.replace(
         '/checkout',
         '/success',
       )}`,
       failUrl: `${window.location.origin}${window.location.pathname.replace(
         '/checkout',
         '/fail',
       )}`,
       customerEmail: 'customer@example.com',
       customerName: '테스트구매자',
-    });
+      card: {
+        useEscrow: false,
+        useCardPoint: false,
+        useAppCardOnly: false,
+      },
+    });
   };
@@
-          <div className="lg:col-span-2">
-            <Card>
-              <CardHeader>
-                <CardTitle>결제수단</CardTitle>
-              </CardHeader>
-              <CardContent>
-                <div id="payment-methods" />
-                <Separator className="my-6" />
-                <div id="agreement" />
-              </CardContent>
-            </Card>
-          </div>
+          <div className="lg:col-span-2">
+            <Card>
+              <CardHeader>
+                <CardTitle>결제 안내</CardTitle>
+              </CardHeader>
+              <CardContent>
+                <p className="text-sm text-muted-foreground">
+                  결제하기 버튼을 누르면 토스페이먼츠 결제창이 열립니다.
+                </p>
+              </CardContent>
+            </Card>
+          </div>
*** End Patch
```

체크아웃 페이지 코드를 다시 읽어 현재 내용과 위치를 파악한 뒤, 결제위젯 UI 제거 및 결제창(payment) 방식으로 전환하는 수정안을 바로 적용하겠습니다.

체크아웃을 결제위젯에서 결제창(payment) 방식으로 전환하고 API 개별 클라이언트 키로 동작하도록 코드를 수정하겠습니다.

```typescriptreact
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
    TossPayments?: any;
  }
}

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<
    ReturnType<typeof storage.getCart>
  >([]);
  const scriptLoadedRef = useRef(false);
  const paymentRef = useRef<any | null>(null);
  const scriptReadyRef = useRef(false);

  useEffect(() => {
    const user = storage.getUser();
    setIsLoggedIn(user.isLoggedIn);
    setCartCount(storage.getCart().length);
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.user)
        setIsLoggedIn(storage.getUser().isLoggedIn);
      if (detail.key === storage.keys.cart)
        setCartCount(storage.getCart().length);
    };
    if (typeof window !== 'undefined')
      window.addEventListener('pm_storage', onChange as EventListener);
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('pm_storage', onChange as EventListener);
    };
  }, []);

  // Parse selected item ids from query
  useEffect(() => {
    const itemsParam = searchParams?.get('items') || '';
    const ids = itemsParam.split(',').filter(Boolean);
    const from = searchParams?.get('from');

    if (ids.length === 0) {
      setError('결제할 상품이 없습니다.');
      setLoading(false);
      return;
    }

    if (from === 'cart') {
      const cart = storage.getCart();
      const filtered = cart.filter((c) => ids.includes(c.id));
      setSelectedItems(filtered);
      setLoading(false);
    } else if (from === 'detail') {
      // 상세 단일 구매: 서버에서 실제 상품 정보 조회
      const cart = storage.getCart();
      const existing = cart.find((c) => c.id === ids[0]);
      if (existing) {
        setSelectedItems([existing]);
        setLoading(false);
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
          .catch(() => setError('상품 정보를 불러오는 중 오류가 발생했습니다.'))
          .finally(() => setLoading(false));
      }
    } else {
      setError('잘못된 접근입니다.');
      setLoading(false);
    }
  }, [searchParams]);

  const totalAmount = useMemo(
    () => selectedItems.reduce((s, i) => s + i.price, 0),
    [selectedItems],
  );

  // Load TossPayments v2 SDK script lazily
  useEffect(() => {
    if (scriptLoadedRef.current) return;
    const script = document.createElement('script');
    script.src = 'https://js.tosspayments.com/v2/standard';
    script.async = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      scriptReadyRef.current = true;
    };
    script.onerror = () => setError('결제 SDK 로드에 실패했습니다.');
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Initialize payment instance once SDK is ready
  useEffect(() => {
    if (!scriptReadyRef.current) return;
    if (!window.TossPayments) return;
    const clientKey =
      process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ||
      'test_ck_000000000000000000000000';
    const tosspayments = window.TossPayments(clientKey);
    paymentRef.current = tosspayments.payment({
      customerKey: window.TossPayments.ANONYMOUS,
    });
  }, [scriptReadyRef.current]);

  // No UI amount sync needed for payment() 방식

  const handleRequestPayment = async () => {
    if (!paymentRef.current) {
      setError(
        '결제 SDK가 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.',
      );
      return;
    }
    // 결제창 호출 (테스트 환경)
    await paymentRef.current.requestPayment({
      method: 'CARD',
      amount: { value: totalAmount, currency: 'KRW' },
      orderId: `PM-${Date.now()}`,
      orderName:
        selectedItems.length === 1
          ? selectedItems[0].title
          : `프롬프트 외 ${selectedItems.length - 1}건`,
      successUrl: `${window.location.origin}${window.location.pathname.replace(
        '/checkout',
        '/success',
      )}`,
      failUrl: `${window.location.origin}${window.location.pathname.replace(
        '/checkout',
        '/fail',
      )}`,
      customerEmail: 'customer@example.com',
      customerName: '테스트구매자',
      card: {
        useEscrow: false,
        useCardPoint: false,
        useAppCardOnly: false,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header
        isLoggedIn={isLoggedIn}
        cartItemCount={cartCount}
        onLogin={() => setIsLoggedIn(true)}
        onLogout={() => setIsLoggedIn(false)}
      />

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

```

- 위젯 대신 결제창(payment) 방식으로 전환했습니다. API 개별 연동 키로 동작하며, 결제하기 클릭 시 결제창이 뜹니다.
- 좌측 위젯 영역은 안내문으로 대체했고, 우측 주문 요약은 그대로 노출됩니다.

필요 조치:
- .env.local의 `NEXT_PUBLIC_TOSS_CLIENT_KEY`에 “API 개별 연동 키(테스트 클라이언트 키)”를 넣고 서버를 재시작해 주세요.
- 다시 체크아웃에서 결제하기를 눌러 결제창 표시를 확인해 주세요.

여전히 안 뜨면:
- 콘솔의 네트워크에서 `js.tosspayments.com/v2/standard` 로드 여부 확인
- 확장 프로그램(광고/콘텐츠 차단) 비활성화
- 콘솔에서 `typeof window.TossPayments === 'function'` 확인

---

**User**

해결해줘

## Error Type
Build Error

## Error Message
Module not found: Can't resolve 'react-icons/lu'

## Build Output
./app/[locale]/success/page.tsx:10:1
Module not found: Can't resolve 'react-icons/lu'
   8 | import { storage } from '@/lib/utils';
   9 | import { Link } from '@/i18n/navigation';
> 10 | import { LuCheckCircle, LuAlertCircle } from 'react-icons/lu';
     | ^
  11 |
  12 | export default function SuccessPage() {
  13 |   const searchParams = useSearchParams();

https://nextjs.org/docs/messages/module-not-found

Next.js version: 15.5.5 (Webpack)


---

**Cursor**

지금 빌드 에러 원인은 `app/[locale]/success/page.tsx`에서 `react-icons/lu`를 임포트하고 있는데, 프로젝트에 `react-icons`가 설치되지 않았기 때문입니다. `lucide-react`로 대체하도록 파일을 수정하겠습니다.

```typescriptreact
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

```

- 성공 페이지에서 `react-icons/lu` 의존성을 제거하고, 이미 프로젝트에 들어있는 `lucide-react` 아이콘으로 대체했습니다. 이제 빌드 에러가 사라져야 합니다.

추가로 확인해 주세요:
- 다시 `pnpm dev` 실행 후 `/[locale]/success?paymentKey=...&orderId=...&amount=...` 접근 시 페이지가 정상 렌더링되는지 확인
- 체크아웃에서 결제하기 클릭 → 결제창 → 승인 후 success로 리다이렉트되는지 확인

문제 남으면 콘솔/터미널 오류 로그를 그대로 공유해 주세요.

