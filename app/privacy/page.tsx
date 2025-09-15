import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
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
            <CardTitle className="text-2xl text-white">개인정보처리방침</CardTitle>
            <p className="text-gray-400">PromptMarket 개인정보 보호정책</p>
          </CardHeader>
          <CardContent className="space-y-6 text-gray-300">
            <section>
              <h3 className="text-lg font-semibold text-white mb-3">1. 개인정보의 처리목적</h3>
              <p>PromptMarket은 다음의 목적을 위하여 개인정보를 처리합니다:</p>
              <ul className="space-y-2 list-disc list-inside mt-2">
                <li>서비스 제공에 관한 계약 이행 및 서비스 제공에 따른 요금정산</li>
                <li>회원 가입의사 확인, 회원제 서비스 제공에 따른 본인 식별·인증</li>
                <li>불법 또는 약관 위반행위 및 부정이용 방지</li>
                <li>각종 고지·통지, 고충처리 등을 위한 의사소통 경로 확보</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">2. 개인정보의 처리 및 보유기간</h3>
              <p>
                회사는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집시에 동의받은 개인정보
                보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
              <ul className="space-y-2 list-disc list-inside mt-2">
                <li>회원가입 및 관리: 서비스 이용계약 또는 회원가입 해지시까지</li>
                <li>재화 또는 서비스 제공: 재화·서비스 공급완료 및 요금결제·정산 완료시까지</li>
                <li>불만처리 등: 불만 또는 분쟁처리에 관한 기록 3년</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">3. 처리하는 개인정보의 항목</h3>
              <p>회사는 다음의 개인정보 항목을 처리하고 있습니다:</p>
              <ul className="space-y-2 list-disc list-inside mt-2">
                <li>필수항목: 이메일, 비밀번호, 이름</li>
                <li>선택항목: 프로필 사진, 전화번호</li>
                <li>자동 수집항목: IP주소, 쿠키, MAC주소, 서비스 이용기록, 방문기록</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">4. 개인정보의 제3자 제공</h3>
              <p>
                회사는 정보주체의 개인정보를 개인정보의 처리목적에서 명시한 범위 내에서만 처리하며, 정보주체의 동의,
                법률의 특별한 규정 등 개인정보 보호법 제17조에 해당하는 경우에만 개인정보를 제3자에게 제공합니다.
              </p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">5. 개인정보처리의 위탁</h3>
              <p>회사는 원활한 개인정보 업무처리를 위하여 다음과 같이 개인정보 처리업무를 위탁하고 있습니다:</p>
              <ul className="space-y-2 list-disc list-inside mt-2">
                <li>결제처리: 결제대행업체</li>
                <li>이메일 발송: 이메일 서비스 제공업체</li>
                <li>클라우드 서비스: AWS, Google Cloud 등</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">6. 정보주체의 권리·의무 및 행사방법</h3>
              <p>정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다:</p>
              <ul className="space-y-2 list-disc list-inside mt-2">
                <li>개인정보 처리현황 통지요구</li>
                <li>개인정보 처리정지 요구</li>
                <li>개인정보의 정정·삭제 요구</li>
                <li>손해배상 청구</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-white mb-3">7. 개인정보의 안전성 확보조치</h3>
              <p>회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다:</p>
              <ul className="space-y-2 list-disc list-inside mt-2">
                <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
                <li>기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치</li>
                <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
              </ul>
            </section>

            <div className="pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-500">
                본 개인정보처리방침은 2025년 1월 1일부터 시행됩니다.
                <br />
                개인정보보호 관련 문의: privacy@promptmarket.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
