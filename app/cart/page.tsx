"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Minus, ShoppingBag, CreditCard, Gift } from "lucide-react"
import Link from "next/link"

// Mock cart data
const mockCartItems = [
  {
    id: "1",
    title: "ChatGPT 마케팅 카피라이팅 프롬프트",
    author: "김마케터",
    price: 15000,
    originalPrice: 25000,
    category: "마케팅",
    thumbnail: "/marketing-copywriting.jpg",
    quantity: 1,
  },
  {
    id: "2",
    title: "Midjourney 일러스트 생성 프롬프트",
    author: "박디자이너",
    price: 25000,
    originalPrice: null,
    category: "디자인",
    thumbnail: "/digital-illustration-art.png",
    quantity: 1,
  },
  {
    id: "3",
    title: "개발자를 위한 코드 리뷰 프롬프트",
    author: "이개발자",
    price: 20000,
    originalPrice: null,
    category: "개발",
    thumbnail: "/code-review-programming.jpg",
    quantity: 1,
  },
]

export default function CartPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [selectedItems, setSelectedItems] = useState<string[]>(mockCartItems.map((item) => item.id))
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
    setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
  }

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id))
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartItems.map((item) => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleApplyCoupon = () => {
    if (couponCode === "WELCOME10") {
      setAppliedCoupon({ code: couponCode, discount: 0.1 })
    } else if (couponCode === "SAVE20") {
      setAppliedCoupon({ code: couponCode, discount: 0.2 })
    } else {
      alert("유효하지 않은 쿠폰 코드입니다.")
    }
  }

  const selectedCartItems = cartItems.filter((item) => selectedItems.includes(item.id))
  const subtotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.discount : 0
  const total = subtotal - discountAmount

  return (
    <div className="min-h-screen bg-background">
      <Header isLoggedIn={isLoggedIn} cartItemCount={cartItems.length} onLogin={handleLogin} onLogout={handleLogout} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <ShoppingBag className="h-6 w-6 mr-2" />
          <h1 className="text-2xl font-bold">장바구니</h1>
          <span className="ml-2 text-muted-foreground">({cartItems.length}개 상품)</span>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">장바구니가 비어있습니다</h2>
            <p className="text-muted-foreground mb-6">마음에 드는 프롬프트를 장바구니에 담아보세요!</p>
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
                    <Checkbox checked={selectedItems.length === cartItems.length} onCheckedChange={handleSelectAll} />
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
                            onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                          />

                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                            <img
                              src={item.thumbnail || "/placeholder.svg"}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                              <div className="flex-1 mb-4 lg:mb-0">
                                <Badge variant="secondary" className="text-xs mb-2">
                                  {item.category}
                                </Badge>
                                <h3 className="font-medium text-sm mb-1 line-clamp-2">
                                  <Link href={`/prompt/${item.id}`} className="hover:text-primary">
                                    {item.title}
                                  </Link>
                                </h3>
                                <p className="text-xs text-muted-foreground mb-2">by {item.author}</p>

                                <div className="flex items-center space-x-2">
                                  <span className="font-semibold">₩{item.price.toLocaleString()}</span>
                                  {item.originalPrice && (
                                    <span className="text-sm text-muted-foreground line-through">
                                      ₩{item.originalPrice.toLocaleString()}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center justify-between lg:justify-end lg:space-x-2 lg:ml-4">
                                <div className="flex items-center border rounded-md">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="px-3 py-1 text-sm min-w-[2.5rem] text-center">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>

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
                  {/* Coupon */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">쿠폰 코드</label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="쿠폰 코드 입력"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <Button variant="outline" onClick={handleApplyCoupon}>
                        적용
                      </Button>
                    </div>
                    {appliedCoupon && (
                      <div className="flex items-center text-sm text-green-600">
                        <Gift className="h-4 w-4 mr-1" />
                        {appliedCoupon.code} 쿠폰이 적용되었습니다
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>상품 금액 ({selectedItems.length}개)</span>
                      <span>₩{subtotal.toLocaleString()}</span>
                    </div>

                    {appliedCoupon && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>쿠폰 할인 ({appliedCoupon.discount * 100}%)</span>
                        <span>-₩{discountAmount.toLocaleString()}</span>
                      </div>
                    )}

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

                  <Button className="w-full" size="lg" disabled={selectedItems.length === 0}>
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
  )
}
