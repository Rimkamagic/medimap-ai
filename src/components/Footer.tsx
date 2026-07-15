export function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-300 bg-slate-200">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-bold text-slate-950">MediMap AI</p>
          <p className="mt-2 text-sm text-slate-700">© 2024 MediMap AI. All rights reserved.</p>
        </div>
        <nav className="flex gap-8 text-sm text-slate-700" aria-label="하단 메뉴">
          <a href="#">Terms of Service</a>
          <a href="#">Privacy Policy</a>
          <a href="#">Medical Disclaimer</a>
        </nav>
      </div>
      <div className="border-t border-red-200 bg-red-50 px-5 py-4 text-center text-sm font-semibold text-red-700">
        AI 분석 결과는 참고용이며 정확한 진단과 복약 상담은 의사 또는 약사에게 받아야 합니다.
      </div>
    </footer>
  );
}
