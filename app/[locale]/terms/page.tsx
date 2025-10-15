import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="p-0">
            <Link href="/auth/register" className="flex items-center text-gray-400 hover:text-white">
              <ArrowLeft className="h-4 w-4 mr-2" />
              회원가입으로 돌아가기
            </Link>
          </Button>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl text-white">이용약관</CardTitle>
            <p className="text-gray-400">PromptMarket 서비스 이용약관</p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-300">
            <section>
              <h3 className="text-lg font-semibold text-white mb-3">제1조 (목적)</h3>
              <p>
                이 약관은 PromptMarket(이하 "회사")이 제공하는 AI 프롬프트 마켓플레이스 서비스의 이용조건 및 절차,
                회사와 이용자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">제2조 (정의)</h3>
              <ul className="space-y-2 list-disc list-inside">
                <li>"서비스"란 회사가 제공하는 AI 프롬프트 거래 플랫폼을 의미합니다.</li>
                <li>"이용자"란 이 약관에 따라 회사의 서비스를 받는 회원 및 비회원을 말합니다.</li>
                <li>"프롬프트"란 AI 모델에 입력하는 명령어나 질문을 의미합니다.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">제3조 (약관의 효력 및 변경)</h3>
              <p>
                이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다. 회사는
                합리적인 사유가 발생할 경우 이 약관을 변경할 수 있으며, 변경된 약관은 공지와 동시에 효력을 발생합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">제4조 (서비스의 제공)</h3>
              <p>회사는 다음과 같은 서비스를 제공합니다:</p>
              <ul className="space-y-2 list-disc list-inside mt-2">
                <li>AI 프롬프트 판매 및 구매 서비스</li>
                <li>프롬프트 검색 및 카테고리 분류 서비스</li>
                <li>사용자 간 리뷰 및 평점 서비스</li>
                <li>기타 회사가 정하는 서비스</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">제5조 (이용자의 의무)</h3>
              <p>이용자는 다음 행위를 하여서는 안 됩니다:</p>
              <ul className="space-y-2 list-disc list-inside mt-2">
                <li>타인의 정보 도용</li>
                <li>회사의 서비스 정보를 이용하여 얻은 정보를 회사의 사전 승낙 없이 복제하거나 유통시키는 행위</li>
                <li>타인의 저작권 등 지적재산권을 침해하는 행위</li>
                <li>음란물이나 폭력적인 메시지, 화상, 음성 등을 공개 또는 게시하는 행위</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">제6조 (서비스 이용의 제한)</h3>
              <p>
                회사는 이용자가 이 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우, 경고, 일시정지,
                영구이용정지 등으로 서비스 이용을 단계적으로 제한할 수 있습니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">제7조 (면책조항)</h3>
              <p>
                회사는 천재지변 또는 이에 준하는 불가항력으로 인하여 서비스를 제공할 수 없는 경우에는 서비스 제공에 관한
                책임이 면제됩니다.
              </p>
            </section>

            <div className="pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-500">본 약관은 2025년 1월 1일부터 시행됩니다.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
