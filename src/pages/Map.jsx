import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

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

function Map() {
  const [activeDay, setActiveDay] = useState("วันเสาร์");
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const closeExpandedMap = () => {
    setIsMapExpanded(false);
    setMapZoom(1);
    setMapOffset({ x: 0, y: 0 });
    setIsDraggingMap(false);
  };

  const zoomIn = () => setMapZoom((prev) => Math.min(prev + 0.25, 3));
  const zoomOut = () => {
    const nextZoom = Math.max(mapZoom - 0.25, 1);
    setMapZoom(nextZoom);
    if (nextZoom === 1) {
      setMapOffset({ x: 0, y: 0 });
      setIsDraggingMap(false);
    }
  };

  const onMapPointerDown = (event) => {
    if (mapZoom <= 1) return;
    if (event.target.closest('[data-map-controls="true"]')) return;
    event.preventDefault();
    setIsDraggingMap(true);
    setDragStart({
      x: event.clientX - mapOffset.x,
      y: event.clientY - mapOffset.y,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const onMapPointerMove = (event) => {
    if (!isDraggingMap) return;
    setMapOffset({
      x: event.clientX - dragStart.x,
      y: event.clientY - dragStart.y,
    });
  };

  const onMapPointerUp = (event) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setIsDraggingMap(false);
  };

  return (
    <div className="w-screen min-h-screen flex flex-col bg-[#f8f8f8]">
      <nav className="h-[18vh] shrink-0">
        <Navbar />
      </nav>

      <main className="flex-1 w-full px-4 py-4">
        <div className="mx-auto w-full max-w-[1400px] pb-4">
          <div className="flex flex-col gap-4 py-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="text-2xl font-bold">พื้นที่ตลาด</div>
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_370px]">
            <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
              <button
                type="button"
                onClick={() => setIsMapExpanded(true)}
                className="block w-full cursor-zoom-in"
                aria-label="ขยายรูปแผนผังพื้นที่ตลาด"
              >
                <img
                  src="/asset/map_market.png"
                  alt="แผนผังพื้นที่ตลาด"
                  className="h-full w-full object-contain "
                />
              </button>
            </div>

            <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm">
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
                  <div
                    key={group.id}
                    className="rounded bg-gray-100 p-2.5 min-h-[180px]"
                  >
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
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="w-full shrink-0">
        <Footer />
      </footer>

      {isMapExpanded && (
        <div
          className="fixed inset-0 z-50 flex cursor-zoom-out items-center justify-center bg-black/75 p-4"
          onClick={closeExpandedMap}
          role="dialog"
          aria-modal="true"
          aria-label="รูปแผนผังพื้นที่ตลาดแบบขยาย"
        >
          <div
            className="relative max-h-[90vh] max-w-[95vw] overflow-auto rounded-md"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={onMapPointerDown}
            onPointerMove={onMapPointerMove}
            onPointerUp={onMapPointerUp}
            onPointerCancel={onMapPointerUp}
            style={{ touchAction: mapZoom > 1 ? "none" : "auto" }}
          >
            <div
              className="fixed right-6 top-6 z-[60] flex items-center gap-2"
              data-map-controls="true"
            >
              <button
                type="button"
                onClick={zoomOut}
                disabled={mapZoom <= 1}
                className="h-9 w-9 rounded-full bg-white text-xl font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="ซูมออก"
              >
                -
              </button>
              <button
                type="button"
                onClick={zoomIn}
                disabled={mapZoom >= 3}
                className="h-9 w-9 rounded-full bg-white text-xl font-semibold text-black disabled:cursor-not-allowed disabled:opacity-50"
                aria-label="ซูมเข้า"
              >
                +
              </button>
            </div>

            <img
              src="/asset/map_market.png"
              alt="แผนผังพื้นที่ตลาดแบบขยาย"
              className={`max-h-[90vh] w-auto max-w-[95vw] rounded-md object-contain ${
                isDraggingMap ? "" : "transition-transform duration-150"
              } ${mapZoom > 1 ? (isDraggingMap ? "cursor-grabbing" : "cursor-grab") : ""}`}
              style={{
                transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${mapZoom})`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Map;
