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
  const [cartItemCount, setCartItemCount] = useState(0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [hasPurchased, setHasPurchased] = useState(false);

  useEffect(() => {
    setCartItemCount(storage.getCart().length);
    const id = String(params?.id ?? mockPromptDetail.id);
    setHasPurchased(storage.getPurchases().some((p) => p.id === id));
    setIsFavorited(storage.getFavorites().includes(id));
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
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

  const handleAddToCart = () => {
    const id = String(params?.id ?? mockPromptDetail.id);
    const title = mockPromptDetail.title;
    const price = mockPromptDetail.price;
    const category = mockPromptDetail.category;
    const author = mockPromptDetail.author.name;
    const thumbnail = mockPromptDetail.thumbnail;
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
    const id = String(params?.id ?? mockPromptDetail.id);
    const next = storage.toggleFavorite(id);
    setIsFavorited(next.includes(id));
  };

  const handlePurchase = () => {
    const id = String(params?.id ?? mockPromptDetail.id);
    storage.addPurchase(id, {
      title: mockPromptDetail.title,
      price: mockPromptDetail.price,
      category: mockPromptDetail.category,
      author: mockPromptDetail.author.name,
      thumbnail: mockPromptDetail.thumbnail,
    });
    setHasPurchased(true);
    storage.removeFromCart(id);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItemCount} />

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-6">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                <Image
                  src={
                    mockPromptDetail.images[selectedImageIndex] ||
                    '/placeholder.svg'
                  }
                  alt={mockPromptDetail.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="flex space-x-2">
                {mockPromptDetail.images.map((image, index) => (
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
                <TabsTrigger value="reviews">
                  리뷰 ({mockPromptDetail.reviewCount})
                </TabsTrigger>
                <TabsTrigger value="author">판매자 정보</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground mb-4">
                        {mockPromptDetail.description}
                      </p>
                      <div className="whitespace-pre-line">
                        {mockPromptDetail.longDescription}
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
                          {mockPromptDetail.tags.map((tag) => (
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
                        <AvatarImage
                          src={
                            mockPromptDetail.author.avatar || '/placeholder.svg'
                          }
                        />
                        <AvatarFallback>
                          {mockPromptDetail.author.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {mockPromptDetail.author.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {mockPromptDetail.author.rating}
                          </div>
                          <div>
                            {mockPromptDetail.author.promptCount}개 프롬프트
                          </div>
                          <div>
                            {mockPromptDetail.author.totalSales.toLocaleString()}
                            회 판매
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-4">
                          <Calendar className="h-4 w-4 mr-1" />
                          {mockPromptDetail.author.joinDate} 가입
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
