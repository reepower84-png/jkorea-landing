"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitResult({ success: true, message: "문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다." });
        setFormData({ name: "", phone: "", message: "" });
      } else {
        setSubmitResult({ success: false, message: result.error || "문의 접수에 실패했습니다." });
      }
    } catch {
      setSubmitResult({ success: false, message: "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-slate-900/98 backdrop-blur-md shadow-lg z-50 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="cursor-pointer">
            <img
              src="/조력자들_로고_가로_1-removebg-preview.png"
              alt="조력자들"
              className="h-10"
            />
          </a>
          <div className="flex gap-3">
            <a
              href="https://drive.google.com/file/d/1_0lIg3NcV4qR6UfeljxyIfl04SlSOWpC/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2.5 rounded font-semibold transition-all shadow-md hover:shadow-lg"
            >
              MC 보러가기
            </a>
            <button
              onClick={scrollToContact}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-6 py-2.5 rounded font-semibold transition-all shadow-md hover:shadow-lg"
            >
              무료 상담
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-20 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 min-h-[90vh] flex items-center">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-1.5 mb-8">
            <span className="text-amber-400 text-sm font-medium tracking-wide">10년 이상의 전문성과 신뢰</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight tracking-tight">
            성공적인 행사의 시작,
            <br />
            <span className="text-amber-400">전문 MC 섭외</span>
          </h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            개그맨, MC, 아나운서까지
            <br className="hidden md:block" />
            검증된 전문가를 빠르고 정확하게 매칭해 드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToContact}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-10 py-4 rounded text-lg font-bold transition-all shadow-lg hover:shadow-xl"
            >
              지금 상담받기
            </button>
            <a
              href="#services"
              className="border-2 border-slate-500 hover:border-slate-400 text-slate-300 hover:text-white px-10 py-4 rounded text-lg font-semibold transition-all"
            >
              서비스 알아보기
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">500+</div>
              <div className="text-slate-400 text-sm mt-1">성공 행사</div>
            </div>
            <div className="text-center border-x border-slate-700">
              <div className="text-3xl font-bold text-amber-400">98%</div>
              <div className="text-slate-400 text-sm mt-1">고객 만족도</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-400">100+</div>
              <div className="text-slate-400 text-sm mt-1">전문 인력</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-amber-600 font-semibold tracking-wide text-sm uppercase">Our Services</span>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              전문 섭외 서비스
            </h3>
            <p className="text-slate-600 max-w-2xl mx-auto">
              각 분야 최고의 전문가들과 함께 성공적인 행사를 만들어 드립니다.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                <svg className="w-7 h-7 text-amber-400 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">개그맨 섭외</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                TV에서 검증된 개그맨들이 행사장을 유쾌하게 만들어 드립니다.
              </p>
              <ul className="text-slate-500 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  기업 행사 / 워크샵
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  축제 / 지역 이벤트
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  결혼식 / 돌잔치
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-900 p-8 rounded-lg border border-slate-700 hover:border-amber-400 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-amber-500 rounded-lg flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-white mb-3">MC 섭외</h4>
              <p className="text-slate-300 mb-6 leading-relaxed">
                전문 MC가 행사를 처음부터 끝까지 매끄럽게 이끌어 드립니다.
              </p>
              <ul className="text-slate-400 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  기업 세미나 / 컨퍼런스
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  시상식 / 기념식
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  신제품 런칭 / 박람회
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-50 p-8 rounded-lg border border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all group">
              <div className="w-14 h-14 bg-slate-900 rounded-lg flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                <svg className="w-7 h-7 text-amber-400 group-hover:text-slate-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-3">아나운서 섭외</h4>
              <p className="text-slate-600 mb-6 leading-relaxed">
                현직 아나운서의 품격 있는 진행으로 행사의 격을 높여 드립니다.
              </p>
              <ul className="text-slate-500 text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  공식 행사 / 정부 행사
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  기업 IR / 주주총회
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                  고급 웨딩 / VIP 행사
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-12">
            <button
              onClick={scrollToContact}
              className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded text-lg font-semibold transition-all shadow-lg"
            >
              맞춤 상담 받기
            </button>
          </div>
        </div>
      </section>

      {/* Why Us Section */}
      <section className="py-24 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-amber-400 font-semibold tracking-wide text-sm uppercase">Why Choose Us</span>
            <h3 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-4">
              조력자들을 선택해야 하는 이유
            </h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-white text-lg mb-3">검증된 전문 인력</h4>
              <p className="text-slate-400 leading-relaxed">
                철저한 검증 과정을 거친 전문가만 소개해 드립니다. 경력과 실력이 검증된 인력만을 매칭합니다.
              </p>
            </div>
            <div className="text-center p-8 border-x border-slate-700">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-white text-lg mb-3">합리적인 가격</h4>
              <p className="text-slate-400 leading-relaxed">
                불필요한 중간 마진 없이 합리적인 가격으로 섭외해 드립니다. 투명한 견적을 약속합니다.
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-bold text-white text-lg mb-3">신속한 매칭</h4>
              <p className="text-slate-400 leading-relaxed">
                문의 후 24시간 이내 최적의 인력을 추천해 드립니다. 급한 행사도 문제없습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-amber-600 font-semibold tracking-wide text-sm uppercase">Contact Us</span>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 mt-3 mb-4">
              무료 상담 문의
            </h3>
            <p className="text-slate-600">
              아래 양식을 작성해 주시면 담당자가 빠르게 연락드리겠습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white p-10 rounded-lg shadow-xl border border-slate-200">
            <div className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-slate-700 font-semibold mb-2">
                  이름 <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-slate-50"
                  placeholder="담당자 성함"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-slate-700 font-semibold mb-2">
                  연락처 <span className="text-amber-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all bg-slate-50"
                  placeholder="010-0000-0000"
                  required
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-slate-700 font-semibold mb-2">
                  문의 내용 <span className="text-amber-500">*</span>
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border border-slate-300 rounded focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all resize-none bg-slate-50"
                  placeholder="행사 일시, 장소, 원하시는 섭외 유형 등을 상세히 적어주세요."
                  required
                />
              </div>

              <div className="text-sm text-slate-500 bg-slate-50 p-4 rounded border border-slate-200">
                <p>개인정보 수집 및 이용에 동의합니다. 수집된 정보는 상담 목적으로만 사용되며, 상담 완료 후 즉시 파기됩니다.</p>
              </div>

              {submitResult && (
                <div
                  className={`p-4 rounded ${
                    submitResult.success
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {submitResult.message}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white py-4 rounded font-bold text-lg transition-colors shadow-lg"
              >
                {isSubmitting ? "접수 중..." : "상담 신청하기"}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Kakao Floating Button */}
      <a
        href="http://pf.kakao.com/_kbDdxb/chat"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
      >
        <img
          src="/카톡_원형_로고.png"
          alt="카카오톡 상담"
          className="w-full h-full rounded-full"
        />
      </a>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 py-16 border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <div className="mb-4">
                <img
                  src="/조력자들_로고_가로_1-removebg-preview.png"
                  alt="조력자들"
                  className="h-10"
                />
              </div>
              <p className="text-slate-400 mb-6 leading-relaxed">
                개그맨, MC, 아나운서 섭외 전문<br />
                성공적인 행사의 파트너
              </p>
              <p className="text-sm text-slate-500">
                상호: 제이코리아, 대표: 이주영, 사업자등록번호: 278-30-01540
              </p>
            </div>
            <div className="md:text-right">
              <h5 className="font-bold text-white mb-4">빠른 상담</h5>
              <p className="text-slate-400 mb-4">
                지금 바로 문의하세요.<br />
                24시간 내 답변드립니다.
              </p>
              <button
                onClick={scrollToContact}
                className="bg-amber-500 hover:bg-amber-400 text-slate-900 px-8 py-3 rounded font-semibold transition-colors shadow-lg"
              >
                상담 문의하기
              </button>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm text-slate-500">
            © 2024 조력자들. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
