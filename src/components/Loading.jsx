import React from "react";

function Loading({ label = "กำลังโหลด...", className = "" }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm ${className}`}
      role="status"
      aria-live="polite"
    >
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-xl border border-gray-200 bg-white/95 px-6 py-5 shadow-lg">
        <div className="flex items-center gap-3">
          <span className="loading loading-spinner loading-lg text-[#00AF35]"></span>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;
