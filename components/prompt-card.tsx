'use client';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';

interface PromptCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  rating: number;
  reviewCount: number;
  author: string;
  thumbnail?: string;
  isFavorited?: boolean;
  onAddToCart?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  priority?: boolean;
}

export function PromptCard({
  id,
  title,
  description,
  price,
  category,
  rating,
  reviewCount,
  author,
  thumbnail,
  isFavorited = false,
  onAddToCart,
  onToggleFavorite,
  priority,
}: PromptCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="p-0">
        <div className="relative aspect-video bg-muted rounded-t-lg overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail || '/placeholder.svg'}
              alt={`${title} 썸네일`}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
              priority={Boolean(priority)}
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="text-muted-foreground text-sm">
                프롬프트 미리보기
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 ${
              isFavorited ? 'text-red-500' : 'text-white'
            } hover:text-red-500`}
            onClick={() => onToggleFavorite?.(id)}
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <div className="flex items-center space-x-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs text-muted-foreground">
              {rating} ({reviewCount})
            </span>
          </div>
        </div>

        <Link href={`/prompt/${id}`}>
          <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {description}
        </p>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>by {author}</span>
          <span className="font-semibold text-foreground">
            ₩{price.toLocaleString()}
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-white text-black hover:bg-gray-100"
          size="sm"
          onClick={() => onAddToCart?.(id)}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          장바구니 담기
        </Button>
      </CardFooter>
    </Card>
  );
}
