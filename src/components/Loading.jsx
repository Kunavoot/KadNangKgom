import React from "react";

function Loading({ label = "กำลังโหลด...", className = "" }) {
  return (
    <div className={`w-full ${className}`}>
      <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-xl border border-gray-200 bg-white/90 px-6 py-5 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="loading loading-spinner loading-lg text-[#00AF35]"></span>
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
      </div>
    </div>
  );
}

export default Loading;
