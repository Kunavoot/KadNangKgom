import React, { useState } from "react";

const dayFilters = ["วันเสาร์", "วันอาทิตย์"];

const groups = [
  {
    id: "g1",
    name: "ไก่",
    stalls: ["01001", "01002", "01003", "01004", "01005"],
  },
  {
    id: "g2",
    name: "ม้า",
    stalls: ["02001", "02002", "02003", "02004", "02005"],
  },
  {
    id: "g3",
    name: "หนอน",
    stalls: ["03001", "03002", "03003", "03004", "03005"],
  },
  {
    id: "g4",
    name: "นก",
    stalls: ["04001", "04002", "04003", "04004", "04005"],
  },
  {
    id: "g5",
    name: "ปลา",
    stalls: ["05001", "05002", "05003", "05004", "05005"],
  },
];

function getStallState(index) {
  if (index < 2) return "rented";
  return "available";
}

function getStallChipClass(status) {
  if (status === "rented") {
    return "bg-[#ff7e7e]";
  }

  return "bg-[#95e49b]";
}

function ReportMap() {
  const [activeDay, setActiveDay] = useState("วันเสาร์");

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col gap-4 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="text-2xl font-bold">พื้นที่ตลาด</div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_370px]">
        <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
          <div className="mx-auto w-full max-w-[1060px] overflow-hidden rounded-md border border-gray-300 bg-[#f6f6f6]">
            <img
              src="/asset/map_market.png"
              alt="แผนผังพื้นที่ตลาด"
              className="h-auto w-full object-contain xl:max-h-[calc(100vh-220px)]"
            />
          </div>
        </div>

        <div className="rounded-lg border border-black bg-black p-3 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            {dayFilters.map((day) => {
              const active = activeDay === day;
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => setActiveDay(day)}
                  className={`btn h-10 min-h-10 flex-1 rounded-2xl border px-3 text-base font-medium shadow-none ${
                    active
                      ? "border-[#ea8bea] bg-[#ea8bea] text-black hover:border-[#ea8bea] hover:bg-[#ea8bea]"
                      : "border-[#ff7f7f] bg-white text-black hover:border-[#ff7f7f] hover:bg-[#fff1f1]"
                  }`}
                >
                  {day}
                </button>
              );
            })}

            <div className="ml-auto flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#95e49b] text-[11px] font-medium text-black">
                ว่าง
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ff7e7e] text-[11px] font-medium text-black">
                จอง
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {groups.map((group) => (
              <div key={group.id} className="rounded bg-[#dddddd] p-2.5">
                <div className="mb-2 rounded bg-[#65ef6e] px-3 py-1.5 text-2xl font-semibold">
                  กลุ่มสังกัด : {group.name}
                </div>
                <div className="flex flex-wrap gap-2 pb-1">
                  {group.stalls.map((stall, stallIndex) => (
                    <span
                      key={stall}
                      className={`inline-flex h-9 min-w-[52px] items-center justify-center rounded-full px-2 text-[11px] font-medium text-black ${getStallChipClass(
                        getStallState(stallIndex),
                      )}`}
                    >
                      {stall}
                    </span>
                  ))}

                  {Array.from({ length: 8 }).map((_, idx) => (
                    <span
                      key={`${group.id}-empty-${idx}`}
                      className="inline-flex h-9 w-9 rounded-full bg-[#bfbfbf]"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportMap;
