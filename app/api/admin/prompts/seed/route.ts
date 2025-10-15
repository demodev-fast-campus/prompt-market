import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST() {
  const supabase = createAdminClient();
  const seeds = [
    {
      title: 'ChatGPT 마케팅 자료 생성 프롬프트',
      description:
        '광고 카피부터 SNS 콘텐츠까지 ChatGPT를 활용한 마케팅 자료 생성 프롬프트입니다.',
      price: 25000,
      category: '마케팅',
      rating: 4.9,
      review_count: 2158,
      author: 'AI마케터',
      thumbnail: '/digital-illustration-art.png',
      tags: ['ChatGPT', '마케팅'],
      is_published: true,
    },
    {
      title: 'AI 이미지 생성 마스터 프롬프트',
      description:
        'Midjourney, DALL-E, Stable Diffusion 등 AI 이미지 생성 도구를 위한 전문 프롬프트 모음집입니다.',
      price: 15000,
      category: '이미지 생성',
      rating: 4.8,
      review_count: 1234,
      author: '프롬프트마스터',
      thumbnail: '/marketing-copywriting.jpg',
      tags: ['Midjourney', 'DALL-E', '이미지'],
      is_published: true,
    },
  ];

  const { data, error } = await supabase
    .from('prompts')
    .insert(seeds)
    .select('*');
  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ inserted: data?.length ?? 0 });
}
