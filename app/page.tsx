import Link from 'next/link';
import { Header } from '@/components/header';
import { PromptCard } from '@/components/prompt-card';
import { Button } from '@/components/ui/button';
import { getPrompts } from '@/lib/data/prompts';
import { auth } from '@clerk/nextjs/server';
import { getProfileIdByClerkId } from '@/lib/data/user';
import { getCartCountByProfileId } from '@/lib/data/cart';

export default async function HomePage() {
  const items = await getPrompts({ limit: 8, sort: 'latest' });
  const { userId } = await auth();
  const profileId = userId ? await getProfileIdByClerkId(userId) : null;
  const cartCount = profileId ? await getCartCountByProfileId(profileId) : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header cartItemCount={cartCount} />

      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-balance">
            최고의 AI 프롬프트를
            <br />
            발견하고 판매하세요
          </h1>
          <p className="text-xl text-gray-400 mb-12 text-pretty max-w-2xl mx-auto">
            전문가들이 만든 고품질 프롬프트를 구매하고, 나만의 프롬프트를
            판매하여 수익을 창출하세요.
          </p>
          <div className="flex justify-center space-x-4">
            <Button
              size="lg"
              className="px-8 bg-white text-black hover:bg-gray-200"
              asChild
            >
              <Link href="/prompts">프롬프트 둘러보기</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 border-gray-600 text-white hover:bg-gray-900 bg-transparent"
              asChild
            >
              <Link href="/seller/waitlist">판매자 되기</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">인기 프롬프트</h2>
            <Button
              variant="ghost"
              className="text-gray-400 hover:text-white"
              asChild
            >
              <Link href="/prompts">전체 보기</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {items.map((prompt, index) => (
              <PromptCard
                key={prompt.id}
                id={prompt.id}
                title={prompt.title}
                description={prompt.description ?? ''}
                price={prompt.price}
                category={prompt.tags?.[0] ?? '기타'}
                rating={prompt.rating ?? 0}
                reviewCount={prompt.reviewCount ?? 0}
                author={''}
                thumbnail={prompt.thumbnail ?? undefined}
                priority={index === 0}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-gray-400">프롬프트</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-gray-400">활성 사용자</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-gray-400">만족도</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-400">고객 지원</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-16 border-t border-gray-800">
        <div className="container mx-auto px-4">
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
