export function B2BFooter() {
  return (
    <footer className="border-t border-white/10 pt-12 pb-16">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
        <span>
          &copy; 2026 Socio Lab Inc. All rights reserved. Enterprise Go-To-Market Architecture.
        </span>
        <div className="flex gap-6">
          <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Terms of Engagement</a>
          <a href="#" className="hover:text-slate-300 transition-colors">Security &amp; Compliance</a>
        </div>
      </div>
    </footer>
  );
}
