import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const dayFilters = [
  { key: "1", label: "วันเสาร์" },
  { key: "2", label: "วันอาทิตย์" },
];

function getStallChipClass(status) {
  if (!status) {
    return "bg-[#95e49b]";
  }
  return "bg-[#ff7e7e]";
}

function Map() {
  const [activeDay, setActiveDay] = useState("1");
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapImage, setMapImage] = useState(null);
  const [reportMap, setReportMap] = useState([]);

  useEffect(() => {
    fetchMapImage();
  }, []);

  const fetchMapImage = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getMapImage",
      );
      setMapImage(response.data.filename);
    } catch (error) {
      console.error("Error fetching map image:", error);
    }
  };

  const getReportMap = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getReportMap",
        {
          params: {
            date: new Date().toISOString().split("T")[0],
            sell_day: activeDay,
          },
        },
      );
      setReportMap(response.data.data);
    } catch (error) {
      console.error("Error fetching report map:", error);
    }
  };

  useEffect(() => {
    getReportMap();
  }, [activeDay]);

  const mapSource = mapImage
    ? `${import.meta.env.VITE_BACKEND_URL}/image/${mapImage}`
    : `${import.meta.env.BASE_URL}asset/map_market.png`;

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
                  src={mapSource}
                  alt="แผนผังพื้นที่ตลาด"
                  className="h-full w-full object-contain "
                />
              </button>
            </div>

            <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm max-h-320 overflow-y-auto">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {dayFilters.map((day) => {
                  const active = activeDay === day.key;

                  let activeClass = "";
                  let inactiveClass = "";

                  if (day.key === "1") {
                    activeClass =
                      "border-[#ea8bea] bg-[#ea8bea] text-black hover:border-[#d678d6] hover:bg-[#d678d6]";
                    inactiveClass =
                      "border-[#ea8bea] bg-white text-[#ea8bea] hover:border-[#d678d6] hover:bg-[#d678d6] hover:text-white";
                  } else if (day.key === "2") {
                    activeClass =
                      "border-[#ff7e7e] bg-[#ff7e7e] text-black hover:border-[#ff6b6b] hover:bg-[#ff6b6b]";
                    inactiveClass =
                      "border-[#ff7e7e] bg-white text-[#ff7e7e] hover:border-[#ff6b6b] hover:bg-[#ff6b6b] hover:text-white";
                  }

                  return (
                    <button
                      key={day.key}
                      type="button"
                      onClick={() => setActiveDay(day.key)}
                      className={`btn h-10 min-h-10 flex-1 rounded-2xl border px-3 text-base font-medium shadow-none transition-colors ${
                        active ? activeClass : inactiveClass
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}

                <div className="ml-auto flex items-center gap-2 cursor-default">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#95e49b] text-[11px] font-medium text-black">
                    ว่าง
                  </span>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ff7e7e] text-[11px] font-medium text-black">
                    จอง
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {reportMap.map((group) => (
                  <div
                    key={group.group}
                    className="rounded bg-gray-100 p-2.5 min-h-[180px]"
                  >
                    <div className="mb-2 rounded bg-[#65ef6e] px-3 py-1.5 text-2xl font-semibold">
                      กลุ่มสังกัด : {group.group}
                    </div>
                    <div className="flex flex-wrap gap-2 pb-1">
                      {group.stall.map((stall) => {
                        return (
                          <span
                            key={stall.stall_id}
                            className={`inline-flex h-9 min-w-[52px] items-center justify-center rounded-full px-2 text-[11px] font-medium text-black cursor-default ${getStallChipClass(stall.stall_status)}`}
                          >
                            {stall.stall_id}
                          </span>
                        );
                      })}
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
              src={mapSource}
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
