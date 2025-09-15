"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Search, Filter, ChevronDown, Calendar, Receipt, Star, RefreshCw } from "lucide-react"
import Link from "next/link"

// Mock purchase history data
const mockPurchases = [
  {
    id: "order-001",
    date: "2024년 1월 15일",
    items: [
      {
        id: "1",
        title: "ChatGPT 마케팅 카피라이팅 프롬프트",
        author: "김마케터",
        price: 15000,
        category: "마케팅",
        thumbnail: "/marketing-copywriting.jpg",
        downloadUrl: "/downloads/marketing-copywriting.zip",
      },
    ],
    total: 15000,
    status: "completed",
    paymentMethod: "카드",
  },
  {
    id: "order-002",
    date: "2024년 1월 10일",
    items: [
      {
        id: "2",
        title: "Midjourney 일러스트 생성 프롬프트",
        author: "박디자이너",
        price: 25000,
        category: "디자인",
        thumbnail: "/digital-illustration-art.png",
        downloadUrl: "/downloads/midjourney-illustration.zip",
      },
      {
        id: "3",
        title: "개발자를 위한 코드 리뷰 프롬프트",
        author: "이개발자",
        price: 20000,
        category: "개발",
        thumbnail: "/code-review-programming.jpg",
        downloadUrl: "/downloads/code-review.zip",
      },
    ],
    total: 45000,
    status: "completed",
    paymentMethod: "카드",
  },
  {
    id: "order-003",
    date: "2024년 1월 5일",
    items: [
      {
        id: "4",
        title: "블로그 포스팅 아이디어 생성기",
        author: "최블로거",
        price: 12000,
        category: "콘텐츠",
        thumbnail: "/blog-writing-content.jpg",
        downloadUrl: "/downloads/blog-ideas.zip",
      },
    ],
    total: 12000,
    status: "completed",
    paymentMethod: "계좌이체",
  },
]

const statusLabels = {
  completed: "완료",
  processing: "처리중",
  cancelled: "취소됨",
}

const statusColors = {
  completed: "default",
  processing: "secondary",
  cancelled: "destructive",
} as const

export default function PurchaseHistoryPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("latest")

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleDownload = (downloadUrl: string, title: string) => {
    // Handle download logic
    console.log(`Downloading: ${title} from ${downloadUrl}`)
  }

  const filteredPurchases = mockPurchases.filter((purchase) => {
    const matchesSearch = purchase.items.some(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.author.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    const matchesStatus = filterStatus === "all" || purchase.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalSpent = mockPurchases.reduce((sum, purchase) => sum + purchase.total, 0)
  const totalItems = mockPurchases.reduce((sum, purchase) => sum + purchase.items.length, 0)

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} cartItemCount={cartItemCount} onLogin={handleLogin} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">구매 내역</h1>
            <p className="text-muted-foreground">
              총 {totalItems}개 프롬프트 • ₩{totalSpent.toLocaleString()} 결제
            </p>
          </div>
          <Button variant="outline">
            <Receipt className="mr-2 h-4 w-4" />
            전체 영수증 다운로드
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalItems}</div>
              <div className="text-muted-foreground">구매한 프롬프트</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Receipt className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">₩{(totalSpent / 10000).toFixed(0)}만</div>
              <div className="text-muted-foreground">총 결제 금액</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">{mockPurchases.length}</div>
              <div className="text-muted-foreground">총 주문 수</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="프롬프트 제목이나 판매자로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                상태: {filterStatus === "all" ? "전체" : statusLabels[filterStatus as keyof typeof statusLabels]}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilterStatus("all")}>전체</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("completed")}>완료</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("processing")}>처리중</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("cancelled")}>취소됨</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                정렬: {sortBy === "latest" ? "최신순" : "오래된순"}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setSortBy("latest")}>최신순</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>오래된순</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Purchase List */}
        <div className="space-y-6">
          {filteredPurchases.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Receipt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">구매 내역이 없습니다</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery ? "검색 조건에 맞는 구매 내역이 없습니다." : "아직 구매한 프롬프트가 없습니다."}
                </p>
                <Button asChild>
                  <Link href="/">프롬프트 둘러보기</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredPurchases.map((purchase) => (
              <Card key={purchase.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">주문 #{purchase.id}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {purchase.date} • {purchase.paymentMethod}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={statusColors[purchase.status as keyof typeof statusColors]}>
                        {statusLabels[purchase.status as keyof typeof statusLabels]}
                      </Badge>
                      <div className="text-lg font-semibold mt-1">₩{purchase.total.toLocaleString()}</div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {purchase.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.thumbnail || "/placeholder.svg"}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <Badge variant="secondary" className="text-xs mb-1">
                            {item.category}
                          </Badge>
                          <h4 className="font-medium text-sm mb-1 line-clamp-2">
                            <Link href={`/prompt/${item.id}`} className="hover:text-primary">
                              {item.title}
                            </Link>
                          </h4>
                          <p className="text-sm text-muted-foreground font-medium">작성자: {item.author}</p>
                        </div>

                        <div className="flex flex-col items-end space-y-2 lg:space-y-0">
                          <div className="font-semibold text-right">₩{item.price.toLocaleString()}</div>
                          <div className="flex flex-col sm:flex-row space-y-1 sm:space-y-0 sm:space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownload(item.downloadUrl, item.title)}
                              className="text-xs"
                            >
                              <Download className="h-3 w-3 mr-1" />
                              다운로드
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs bg-transparent">
                              <Star className="h-3 w-3 mr-1" />
                              리뷰
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredPurchases.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" />더 많은 내역 보기
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
