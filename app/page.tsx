"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { PromptCard } from "@/components/prompt-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

// Mock data for prompts - updated to match the design
const mockPrompts = [
  {
    id: "1",
    title: "AI 이미지 생성 마스터 프롬프트",
    description: "Midjourney, DALL-E, Stable Diffusion 등 AI 이미지 생성 도구를 위한 전문 프롬프트 모음집입니다.",
    price: 15000,
    category: "이미지 생성",
    rating: 4.8,
    reviewCount: 1234,
    author: "프롬프트마스터",
    thumbnail: "/marketing-copywriting.jpg",
    isPremium: false,
  },
  {
    id: "2",
    title: "ChatGPT 마케팅 자료 생성 프롬프트",
    description: "광고 카피부터 SNS 콘텐츠까지 ChatGPT를 활용한 마케팅 자료 생성 프롬프트입니다.",
    price: 25000,
    category: "마케팅",
    rating: 4.9,
    reviewCount: 2158,
    author: "AI마케터",
    thumbnail: "/digital-illustration-art.png",
    isPremium: true,
  },
  {
    id: "3",
    title: "한국 소설 아이디어 생성기",
    description: "독창적인 소설 아이디어와 캐릭터를 생성하는 창작 전용 프롬프트입니다.",
    price: 12000,
    category: "창작",
    rating: 4.7,
    reviewCount: 987,
    author: "작가김씨",
    thumbnail: "/code-review-programming.jpg",
    isPremium: false,
  },
  {
    id: "4",
    title: "마케팅 카피라이팅 프롬프트",
    description: "매출을 높이는 효과적인 마케팅 카피를 작성할 수 있는 프롬프트 모음집입니다.",
    price: 18000,
    category: "마케팅",
    rating: 4.6,
    reviewCount: 1567,
    author: "마케팅전문가",
    thumbnail: "/blog-writing-content.jpg",
    isPremium: true,
  },
]

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setCartItemCount(0)
    setFavorites([])
  }

  const handleAddToCart = (id: string) => {
    setCartItemCount((prev) => prev + 1)
  }

  const handleToggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]))
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header isLoggedIn={isLoggedIn} cartItemCount={cartItemCount} onLogin={handleLogin} onLogout={handleLogout} />

      {/* Hero Section */}
      <section className="py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-5xl font-bold mb-6 text-balance">
            최고의 AI 프롬프트를
            <br />
            발견하고 판매하세요
          </h1>
          <p className="text-xl text-gray-400 mb-12 text-pretty max-w-2xl mx-auto">
            전문가들이 만든 고품질 프롬프트를 구매하고, 나만의 프롬프트를 판매하여 수익을 창출하세요.
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" className="px-8 bg-white text-black hover:bg-gray-200" asChild>
              <Link href="/prompts">프롬프트 둘러보기</Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 border-gray-600 text-white hover:bg-gray-900 bg-transparent"
            >
              판매자 되기
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Prompts Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">인기 프롬프트</h2>
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              전체 보기
            </Button>
          </div>

          {/* Prompt Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {mockPrompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                {...prompt}
                isFavorited={favorites.includes(prompt.id)}
                onAddToCart={handleAddToCart}
                onToggleFavorite={handleToggleFavorite}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
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

      {/* Footer */}
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
  )
}
