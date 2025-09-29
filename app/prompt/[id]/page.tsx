import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Award,
  Download,
  Eye,
  Flag,
  Heart,
  MessageCircle,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { getPromptById } from '@/lib/data/prompts';
import { auth } from '@clerk/nextjs/server';
import { getProfileIdByClerkId } from '@/lib/data/user';
import { hasPurchasedPrompt } from '@/lib/data/purchases';
import { CopyButton } from '@/components/copy-button';

export default async function PromptDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const prompt = await getPromptById(id);
  if (!prompt) return null;

  const { userId } = await auth();
  const profileId = userId ? await getProfileIdByClerkId(userId) : null;
  const purchased = profileId
    ? await hasPurchasedPrompt({ profileId, promptId: id })
    : false;

  const images =
    Array.isArray(prompt.image_urls) && prompt.image_urls.length > 0
      ? prompt.image_urls
      : ['/placeholder.svg'];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden mb-4">
                <Image
                  src={images[0] || '/placeholder.svg'}
                  alt={prompt.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>

            <Tabs defaultValue="description" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">상세 설명</TabsTrigger>
                <TabsTrigger value="reviews">리뷰 (0)</TabsTrigger>
                <TabsTrigger value="author">판매자 정보</TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="mt-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="prose max-w-none">
                      <p className="text-muted-foreground mb-4">
                        {prompt.description}
                      </p>
                      <div className="whitespace-pre-line">
                        {purchased
                          ? prompt.prompt_text ?? ''
                          : '구매 후 본문 노출'}
                      </div>
                      {purchased && prompt.prompt_text && (
                        <div className="mt-4">
                          <CopyButton text={prompt.prompt_text} />
                        </div>
                      )}
                      <div className="mt-6">
                        <h4 className="font-semibold mb-3">태그</h4>
                        <div className="flex flex-wrap gap-2">
                          {(prompt.tags ?? []).map((tag) => (
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
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary">
                    {prompt.tags?.[0] ?? '기타'}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-300" aria-label="favorite">
                      <Heart className="h-4 w-4" />
                    </button>
                    <button className="text-gray-300" aria-label="share">
                      <MessageCircle className="h-4 w-4" />
                    </button>
                    <button className="text-gray-300" aria-label="report">
                      <Flag className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <CardTitle className="text-xl">{prompt.title}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{prompt.rating ?? 0}</span>
                    <span className="text-muted-foreground">
                      ({prompt.review_count ?? 0})
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>
                        {(prompt.download_count ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-3 w-3" />
                      <span>{(prompt.view_count ?? 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold">
                      ₩{prompt.price.toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
