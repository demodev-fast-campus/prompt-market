"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreVertical, Edit, Trash2, Eye, TrendingUp, Check, X, User } from "lucide-react"

const mockPrompts = [
  {
    id: "1",
    title: "ChatGPT 마케팅 카피라이팅 프롬프트",
    description: "효과적인 마케팅 카피를 작성하는 ChatGPT 프롬프트입니다.",
    price: 25000,
    category: "마케팅",
    status: "published",
    author: "프롬프트마스터",
    authorId: "user1",
    sales: 156,
    revenue: 3900000,
    rating: 4.8,
    reviews: 23,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "AI 이미지 생성 마스터 프롬프트",
    description: "Midjourney, DALL-E, Stable Diffusion에서 활용할 수 있는 이미지 생성 프롬프트입니다.",
    price: 18000,
    category: "이미지 생성",
    status: "pending",
    author: "AI크리에이터",
    authorId: "user2",
    sales: 0,
    revenue: 0,
    rating: 0,
    reviews: 0,
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    title: "코드 리뷰 자동화 프롬프트",
    description: "개발자를 위한 코드 리뷰 자동화 프롬프트입니다.",
    price: 15000,
    category: "개발",
    status: "published",
    author: "개발자김씨",
    authorId: "user3",
    sales: 89,
    revenue: 1335000,
    rating: 4.6,
    reviews: 12,
    createdAt: "2024-01-10",
  },
  {
    id: "4",
    title: "블로그 글쓰기 도우미 프롬프트",
    description: "매력적인 블로그 포스트를 작성하는 프롬프트입니다.",
    price: 12000,
    category: "글쓰기",
    status: "pending",
    author: "글쓰기전문가",
    authorId: "user4",
    sales: 0,
    revenue: 0,
    rating: 0,
    reviews: 0,
    createdAt: "2024-01-22",
  },
  {
    id: "5",
    title: "소셜미디어 콘텐츠 생성 프롬프트",
    description: "인스타그램, 페이스북용 콘텐츠를 생성하는 프롬프트입니다.",
    price: 20000,
    category: "마케팅",
    status: "rejected",
    author: "마케터박씨",
    authorId: "user5",
    sales: 0,
    revenue: 0,
    rating: 0,
    reviews: 0,
    createdAt: "2024-01-18",
  },
]

export default function AdminPromptsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

  const filteredPrompts = mockPrompts.filter((prompt) => {
    const matchesSearch =
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === "all" || prompt.status === activeTab
    return matchesSearch && matchesTab
  })

  const totalRevenue = mockPrompts.reduce((sum, prompt) => sum + prompt.revenue, 0)
  const totalSales = mockPrompts.reduce((sum, prompt) => sum + prompt.sales, 0)
  const publishedCount = mockPrompts.filter((p) => p.status === "published").length
  const pendingCount = mockPrompts.filter((p) => p.status === "pending").length

  const handleApprove = (promptId: string) => {
    console.log("[v0] Approving prompt:", promptId)
    // 실제 구현에서는 API 호출
  }

  const handleReject = (promptId: string) => {
    console.log("[v0] Rejecting prompt:", promptId)
    // 실제 구현에서는 API 호출
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">프롬프트 관리</h1>
            <p className="text-gray-400 mt-2">모든 프롬프트를 관리하고 승인/거부 처리를 할 수 있습니다</p>
          </div>
          <Button className="bg-white text-black hover:bg-gray-200">
            <Plus className="h-4 w-4 mr-2" />새 프롬프트 등록
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">총 수익</p>
                  <p className="text-2xl font-bold text-white">₩{totalRevenue.toLocaleString()}</p>
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
                  <span className="text-white text-sm font-bold">{totalSales}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">게시된 프롬프트</p>
                  <p className="text-2xl font-bold text-white">{publishedCount}</p>
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
                  <p className="text-2xl font-bold text-white">{pendingCount}</p>
                </div>
                <div className="h-8 w-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">!</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="bg-gray-900 border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-black">
              전체 ({mockPrompts.length})
            </TabsTrigger>
            <TabsTrigger value="published" className="data-[state=active]:bg-white data-[state=active]:text-black">
              게시됨 ({publishedCount})
            </TabsTrigger>
            <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:text-black">
              승인 대기 ({pendingCount})
            </TabsTrigger>
            <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:text-black">
              거부됨 ({mockPrompts.filter((p) => p.status === "rejected").length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <Card key={prompt.id} className="bg-gray-900 border-gray-800 hover:border-gray-700 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={
                              prompt.status === "published"
                                ? "default"
                                : prompt.status === "pending"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className={
                              prompt.status === "published"
                                ? "bg-green-600"
                                : prompt.status === "pending"
                                  ? "bg-orange-600"
                                  : "bg-red-600"
                            }
                          >
                            {prompt.status === "published"
                              ? "게시됨"
                              : prompt.status === "pending"
                                ? "승인 대기"
                                : "거부됨"}
                          </Badge>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {prompt.category}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-white line-clamp-2">{prompt.title}</CardTitle>
                        <div className="flex items-center gap-1 mt-2 text-sm text-gray-400">
                          <User className="h-3 w-3" />
                          <span>{prompt.author}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                          <DropdownMenuItem className="text-gray-300 hover:text-white">
                            <Edit className="h-4 w-4 mr-2" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-gray-300 hover:text-white">
                            <Eye className="h-4 w-4 mr-2" />
                            미리보기
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 hover:text-red-300">
                            <Trash2 className="h-4 w-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{prompt.description}</p>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">가격</span>
                        <span className="text-white font-semibold">₩{prompt.price.toLocaleString()}</span>
                      </div>

                      {prompt.status === "published" && (
                        <>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">판매량</span>
                            <span className="text-white">{prompt.sales}개</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">수익</span>
                            <span className="text-green-400 font-semibold">₩{prompt.revenue.toLocaleString()}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">평점</span>
                            <span className="text-yellow-400">
                              ★ {prompt.rating} ({prompt.reviews})
                            </span>
                          </div>
                        </>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                        <span className="text-gray-400 text-sm">등록일</span>
                        <span className="text-gray-300 text-sm">{prompt.createdAt}</span>
                      </div>

                      {prompt.status === "pending" && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            className="flex-1 bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(prompt.id)}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="flex-1"
                            onClick={() => handleReject(prompt.id)}
                          >
                            <X className="h-3 w-3 mr-1" />
                            거부
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredPrompts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg mb-4">검색 결과가 없습니다</p>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />새 프롬프트 등록하기
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
