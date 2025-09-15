"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { PromptCard } from "@/components/prompt-card"
import {
  User,
  Edit,
  Star,
  Download,
  TrendingUp,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Globe,
  Save,
  Camera,
} from "lucide-react"

// Mock user data
const mockUser = {
  id: "user1",
  name: "김마케터",
  email: "kim.marketer@example.com",
  phone: "010-1234-5678",
  location: "서울, 대한민국",
  website: "https://kimmarketer.com",
  bio: "10년 경력의 디지털 마케팅 전문가입니다. ChatGPT와 AI 도구를 활용한 마케팅 자동화에 특화되어 있으며, 다양한 기업의 마케팅 성과 향상에 기여하고 있습니다.",
  avatar: "/author-avatar.jpg",
  joinDate: "2023년 3월",
  stats: {
    totalPrompts: 23,
    totalSales: 15600,
    totalEarnings: 2340000,
    rating: 4.9,
    reviewCount: 342,
  },
}

// Mock user's prompts
const mockUserPrompts = [
  {
    id: "1",
    title: "ChatGPT 마케팅 카피라이팅 프롬프트",
    description: "효과적인 마케팅 카피를 작성할 수 있는 ChatGPT 프롬프트 모음집입니다.",
    price: 15000,
    category: "마케팅",
    rating: 4.8,
    reviewCount: 124,
    author: "김마케터",
    thumbnail: "/marketing-copywriting.jpg",
  },
  {
    id: "4",
    title: "블로그 포스팅 아이디어 생성기",
    description: "다양한 주제의 블로그 포스팅 아이디어를 생성하는 프롬프트입니다.",
    price: 12000,
    category: "콘텐츠",
    rating: 4.6,
    reviewCount: 203,
    author: "김마케터",
    thumbnail: "/blog-writing-content.jpg",
  },
]

export default function ProfilePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState(mockUser)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Save profile logic here
  }

  const handleInputChange = (field: string, value: string) => {
    setUserInfo((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} cartItemCount={cartItemCount} onLogin={handleLogin} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userInfo.avatar || "/placeholder.svg"} />
                  <AvatarFallback className="text-2xl">{userInfo.name[0]}</AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full">
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-2xl font-bold">{userInfo.name}</h1>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                  >
                    {isEditing ? (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        저장
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-4 w-4" />
                        프로필 수정
                      </>
                    )}
                  </Button>
                </div>

                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                    {userInfo.stats.rating} ({userInfo.stats.reviewCount}개 리뷰)
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {userInfo.joinDate} 가입
                  </div>
                </div>

                <p className="text-muted-foreground mb-4">{userInfo.bio}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userInfo.stats.totalPrompts}</div>
                    <div className="text-xs text-muted-foreground">프롬프트</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userInfo.stats.totalSales.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">총 판매</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ₩{(userInfo.stats.totalEarnings / 10000).toFixed(0)}만
                    </div>
                    <div className="text-xs text-muted-foreground">총 수익</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{userInfo.stats.rating}</div>
                    <div className="text-xs text-muted-foreground">평점</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Tabs */}
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info">개인정보</TabsTrigger>
            <TabsTrigger value="prompts">내 프롬프트</TabsTrigger>
            <TabsTrigger value="sales">판매 현황</TabsTrigger>
            <TabsTrigger value="settings">설정</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>개인정보</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          id="name"
                          value={userInfo.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      ) : (
                        <span>{userInfo.name}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={userInfo.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      ) : (
                        <span>{userInfo.email}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          id="phone"
                          value={userInfo.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                        />
                      ) : (
                        <span>{userInfo.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">위치</Label>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          id="location"
                          value={userInfo.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                        />
                      ) : (
                        <span>{userInfo.location}</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="website">웹사이트</Label>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          id="website"
                          value={userInfo.website}
                          onChange={(e) => handleInputChange("website", e.target.value)}
                        />
                      ) : (
                        <a
                          href={userInfo.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {userInfo.website}
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">자기소개</Label>
                  {isEditing ? (
                    <Textarea
                      id="bio"
                      value={userInfo.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{userInfo.bio}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="prompts" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">내 프롬프트 ({mockUserPrompts.length}개)</h2>
              <Button>
                <TrendingUp className="mr-2 h-4 w-4" />새 프롬프트 등록
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUserPrompts.map((prompt) => (
                <PromptCard key={prompt.id} {...prompt} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sales" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">₩{(userInfo.stats.totalEarnings / 10000).toFixed(0)}만</div>
                  <div className="text-muted-foreground">총 수익</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Download className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userInfo.stats.totalSales.toLocaleString()}</div>
                  <div className="text-muted-foreground">총 판매</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{userInfo.stats.rating}</div>
                  <div className="text-muted-foreground">평균 평점</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>최근 판매 내역</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3].map((_, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div>
                          <div className="font-medium">ChatGPT 마케팅 카피라이팅 프롬프트</div>
                          <div className="text-sm text-muted-foreground">2024년 1월 15일</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">₩15,000</div>
                        <Badge variant="secondary" className="text-xs">
                          완료
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>계정 설정</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-3">알림 설정</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">새로운 주문 알림</span>
                      <Button variant="outline" size="sm">
                        켜기
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">리뷰 알림</span>
                      <Button variant="outline" size="sm">
                        켜기
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">마케팅 이메일</span>
                      <Button variant="outline" size="sm">
                        끄기
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">보안</h3>
                  <div className="space-y-3">
                    <Button variant="outline">비밀번호 변경</Button>
                    <Button variant="outline">2단계 인증 설정</Button>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-3">계정</h3>
                  <div className="space-y-3">
                    <Button variant="outline">데이터 내보내기</Button>
                    <Button variant="destructive">계정 삭제</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
