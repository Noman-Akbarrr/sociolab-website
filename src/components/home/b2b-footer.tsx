"use client";

export function B2BFooter() {
  return (
    <footer className="pt-12 pb-16" style={{ borderTop: "1px solid #E7E5E4" }}>
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ color: "#A8A29E" }}>
        <span>
          &copy; 2026 Socio Lab Inc. All rights reserved. Enterprise Go-To-Market Architecture.
        </span>
        <div className="flex gap-6">
          <a href="#" className="transition-colors" style={{ color: "#A8A29E" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1917")} onMouseLeave={(e) => (e.currentTarget.style.color = "#A8A29E")}>Privacy Policy</a>
          <a href="#" className="transition-colors" style={{ color: "#A8A29E" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1917")} onMouseLeave={(e) => (e.currentTarget.style.color = "#A8A29E")}>Terms of Engagement</a>
          <a href="#" className="transition-colors" style={{ color: "#A8A29E" }} onMouseEnter={(e) => (e.currentTarget.style.color = "#1C1917")} onMouseLeave={(e) => (e.currentTarget.style.color = "#A8A29E")}>Security &amp; Compliance</a>
        </div>
      </div>
    </footer>
  );
}
