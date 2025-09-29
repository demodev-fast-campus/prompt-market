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
import { getPrompts } from '@/lib/data/prompts';
import { auth } from '@clerk/nextjs/server';
import { getProfileIdByClerkId } from '@/lib/data/user';
import { getCartCountByProfileId } from '@/lib/data/cart';

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const q = typeof params.q === 'string' ? params.q : '';
  const sortParam = typeof params.sort === 'string' ? params.sort : 'latest';

  const items = await getPrompts({ search: q, sort: sortParam as any });
  const { userId } = await auth();
  const profileId = userId ? await getProfileIdByClerkId(userId) : null;
  const cartCount = profileId ? await getCartCountByProfileId(profileId) : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      <Header cartItemCount={cartCount} />
      <section className="py-12 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">프롬프트 마켓</h1>
          <p className="text-gray-400 text-lg">
            전문가들이 만든 고품질 AI 프롬프트를 찾아보세요
          </p>
        </div>
      </section>

      <section className="py-8 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <form>
                  <Input
                    name="q"
                    defaultValue={q}
                    placeholder="프롬프트 검색..."
                    className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
                  />
                </form>
              </div>
            </div>

            <Select defaultValue={sortParam} name="sort">
              <SelectTrigger className="w-32 bg-gray-900 border-gray-700 text-white">
                <SelectValue placeholder="정렬" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="price">가격순</SelectItem>
                <SelectItem value="rating">평점순</SelectItem>
              </SelectContent>
            </Select>

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

      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <p className="text-gray-400">총 {items.length}개의 프롬프트</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
