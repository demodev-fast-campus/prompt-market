'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
// Tabs removed (no review flow)
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  TrendingUp,
  User,
} from 'lucide-react';
import { storage } from '@/lib/utils';

type AdminPrompt = {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  author: string;
  createdAt: string;
};

const seedPrompts: AdminPrompt[] = [
  {
    id: '1',
    title: 'ChatGPT 마케팅 카피라이팅 프롬프트',
    description: '효과적인 마케팅 카피를 작성하는 ChatGPT 프롬프트입니다.',
    price: 25000,
    category: '마케팅',
    author: '프롬프트마스터',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'AI 이미지 생성 마스터 프롬프트',
    description:
      'Midjourney, DALL-E, Stable Diffusion에서 활용할 수 있는 이미지 생성 프롬프트입니다.',
    price: 18000,
    category: '이미지 생성',
    author: 'AI크리에이터',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    title: '코드 리뷰 자동화 프롬프트',
    description: '개발자를 위한 코드 리뷰 자동화 프롬프트입니다.',
    price: 15000,
    category: '개발',
    author: '개발자김씨',
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    title: '블로그 글쓰기 도우미 프롬프트',
    description: '매력적인 블로그 포스트를 작성하는 프롬프트입니다.',
    price: 12000,
    category: '글쓰기',
    author: '글쓰기전문가',
    createdAt: '2024-01-22',
  },
  {
    id: '5',
    title: '소셜미디어 콘텐츠 생성 프롬프트',
    description: '인스타그램, 페이스북용 콘텐츠를 생성하는 프롬프트입니다.',
    price: 20000,
    category: '마케팅',
    author: '마케터박씨',
    createdAt: '2024-01-18',
  },
];

export default function AdminPromptsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [prompts, setPrompts] = useState<AdminPrompt[]>([]);

  useEffect(() => {
    const existing = storage.getPrompts<AdminPrompt>();
    if (existing.length === 0) {
      storage.setPrompts<AdminPrompt>(seedPrompts);
      setPrompts(seedPrompts);
    } else {
      setPrompts(existing);
    }
    const onChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key: string };
      if (!detail) return;
      if (detail.key === storage.keys.prompts)
        setPrompts(storage.getPrompts<AdminPrompt>());
    };
    if (typeof window !== 'undefined')
      window.addEventListener('pm_storage', onChange as EventListener);
    return () => {
      if (typeof window !== 'undefined')
        window.removeEventListener('pm_storage', onChange as EventListener);
    };
  }, []);

  const filteredPrompts = prompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const totalRevenue = 0;
  const totalSales = 0;
  const publishedCount = prompts.length;
  const pendingCount = 0;

  const handleCreate = () => {
    const id = String(Date.now());
    const next: AdminPrompt = {
      id,
      title: `새 프롬프트 ${id}`,
      description: '설명을 입력하세요',
      price: 10000,
      category: '기타',
      author: '운영자',
      createdAt: new Date().toISOString().slice(0, 10),
    };
    const updated = [next, ...storage.getPrompts<AdminPrompt>()];
    storage.setPrompts(updated);
    setPrompts(updated);
  };

  const handleDelete = (promptId: string) => {
    const updated = storage
      .getPrompts<AdminPrompt>()
      .filter((p) => p.id !== promptId);
    storage.setPrompts(updated);
    setPrompts(updated);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">프롬프트 관리</h1>
            <p className="text-gray-400 mt-2">
              운영자 직권 CRUD. 심사/승인 프로세스는 없습니다.
            </p>
          </div>
          <Button
            className="bg-white text-black hover:bg-gray-200"
            onClick={handleCreate}
          >
            <Plus className="h-4 w-4 mr-2" />새 프롬프트 등록
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">총 수익</p>
                  <p className="text-2xl font-bold text-white">
                    ₩{totalRevenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">총 판매량</p>
                  <p className="text-2xl font-bold text-white">{totalSales}</p>
                </div>
                <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {totalSales}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">게시된 프롬프트</p>
                  <p className="text-2xl font-bold text-white">
                    {publishedCount}
                  </p>
                </div>
                <Eye className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">승인 대기</p>
                  <p className="text-2xl font-bold text-white">
                    {pendingCount}
                  </p>
                </div>
                <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="프롬프트 또는 작성자 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-gray-900 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>

        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map((prompt) => (
              <Card
                key={prompt.id}
                className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant="outline"
                          className="border-gray-600 text-gray-300"
                        >
                          {prompt.category}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg text-white line-clamp-2">
                        {prompt.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
                        <User className="h-3 w-3" />
                        <span>{prompt.author}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-gray-400 hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-gray-800 border-gray-700"
                      >
                        <DropdownMenuItem className="text-gray-300 hover:text-white">
                          <Edit className="h-4 w-4 mr-2" />
                          수정
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-gray-300 hover:text-white">
                          <Eye className="h-4 w-4 mr-2" />
                          미리보기
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-400 hover:text-red-300"
                          onClick={() => handleDelete(prompt.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                    {prompt.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">가격</span>
                      <span className="text-white font-semibold">
                        ₩{prompt.price.toLocaleString()}
                      </span>
                    </div>

                    {/* 간단 요약만 유지 */}

                    <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                      <span className="text-gray-400 text-sm">등록일</span>
                      <span className="text-gray-300 text-sm">
                        {prompt.createdAt}
                      </span>
                    </div>
                    {/* 승인/거부 UI 제거 */}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPrompts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg mb-4">검색 결과가 없습니다</p>
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-2" />새 프롬프트 등록하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
