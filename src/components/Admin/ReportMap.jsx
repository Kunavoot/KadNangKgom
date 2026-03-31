import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const dayFilters = [
  { key: "1", label: "วันเสาร์" },
  { key: "2", label: "วันอาทิตย์" },
];

function getStallChipClass(status) {
  if (!status) {
    return "bg-[#95e49b] hover:bg-[#84d290]";
  }
  return "bg-[#ff7e7e] hover:bg-[#ff6b6b]";
}

function ReportMap() {
  const [activeDay, setActiveDay] = useState("1");
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mapZoom, setMapZoom] = useState(1);
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [isDraggingMap, setIsDraggingMap] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapImage, setMapImage] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
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

  const handleUploadMap = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const result = await Swal.fire({
      title: "ยืนยันการอัพโหลด?",
      text: "คุณต้องการอัพโหลดรูปภาพแผนที่ใหม่ใช่หรือไม่?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#5bc06d",
      cancelButtonColor: "#d33",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });

    if (!result.isConfirmed) {
      event.target.value = "";
      return;
    }

    const formData = new FormData();
    formData.append("map_image", file);

    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/admin/uploadMapImage",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      Swal.fire({
        icon: "success",
        title: response.data.message || "อัพโหลดไฟล์แผนที่สำเร็จ",
        showConfirmButton: false,
        timer: 1500,
      });
      fetchMapImage();
    } catch (error) {
      console.error("Error uploading map image:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถอัพโหลดไฟล์แผนที่ได้",
      });
    } finally {
      event.target.value = "";
    }
  };

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
      console.log(response.data.data);
      setReportMap(response.data.data);
    } catch (error) {
      console.error("Error fetching report map:", error);
    }
  };

  useEffect(() => {
    getReportMap();
  }, [activeDay]);

  return (
    <div className="w-full pb-4">
      <div className="flex flex-col gap-4 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="text-2xl font-bold">พื้นที่ตลาด</div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn btn-outline border-[#3b82f6] text-[#3b82f6] shadow-sm hover:bg-[#3b82f6] hover:text-white hover:border-[#3b82f6]"
            onClick={() =>
              window.open(import.meta.env.VITE_CANVA_MAP_LINK, "_blank")
            }
          >
            เปิดลิ้งค์ภาพตลาด
          </button>
          <input
            type="file"
            id="map_upload"
            className="hidden"
            accept="image/*"
            onChange={handleUploadMap}
          />
          <label
            htmlFor="map_upload"
            className="btn  bg-[#7BE397] hover:bg-[#68d284] text-black border-none shadow-sm cursor-pointer"
          >
            อัพโหลดภาพตลาด
          </label>
        </div>
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

        <div className="rounded-lg border border-gray-300 bg-white p-3 shadow-sm max-h-400 overflow-y-auto">
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
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#95e49b] text-[11px] font-medium text-black">
                ว่าง
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ff7e7e] text-[11px] font-medium text-black">
                เช่าแล้ว
              </span>
            </div>
          </div>

          <div className="space-y-3">
            {reportMap.map((item) => (
              <div
                key={item.group.group_name}
                className="rounded bg-gray-100 p-2.5 min-h-[180px]"
              >
                <div className="mb-2 rounded bg-[#65ef6e] px-3 py-1.5 text-lg font-semibold">
                  {item.group.group_name} ({item.group.group_zone})
                </div>
                <div className="flex flex-wrap gap-2 pb-1">
                  {item.stall.map((stall) => {
                    return (
                      <button
                        type="button"
                        key={stall.stall_id}
                        onClick={() =>
                          setSelectedStall({
                            id: stall.stall_id,
                            status: stall.stall_status,
                            group: item.group.group_name,
                            zone: item.group.group_zone,
                            shop: stall.stall_shop,
                            ptype: stall.stall_ptype,
                            amgt: stall.stall_agmt,
                          })
                        }
                        className={`inline-flex h-9 min-w-[52px] cursor-pointer items-center justify-center rounded-full px-2 text-[11px] font-medium text-black ${getStallChipClass(stall.stall_status)}`}
                      >
                        {stall.stall_id}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Map Zoom */}
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

      {/* Modal */}
      {selectedStall && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedStall(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">รายละเอียดล็อคตลาด</h3>
              <button
                type="button"
                onClick={() => setSelectedStall(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-base">
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">รหัสล็อคตลาด</span>
                <span className="font-semibold text-gray-800">
                  {selectedStall.id}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">กลุ่มสังกัด</span>
                <span className="font-medium text-gray-800">
                  {selectedStall.group}
                </span>
              </div>
              <div className="flex justify-between border-b border-gray-100 pb-2">
                <span className="text-gray-500">ประเภทพื้นที่</span>
                <span className="font-medium text-gray-800">
                  {selectedStall.zone}
                </span>
              </div>
              <div
                className={`flex justify-between ${selectedStall.status === "rented" ? "border-b border-gray-100 pb-2" : ""}`}
              >
                <span className="text-gray-500">สถานะ</span>
                <span
                  className={`flex items-center justify-center rounded-full px-3 py-1 text-sm font-medium ${
                    selectedStall.status
                      ? "bg-[#ff7e7e] text-black"
                      : "bg-[#95e49b] text-black"
                  }`}
                >
                  {selectedStall.status ? "จองแล้ว" : "ว่าง"}
                </span>
              </div>

              {selectedStall.status == "1" && (
                <>
                  <div className="flex justify-between border-b border-gray-100 pb-2 pt-2">
                    <span className="text-gray-500">ชื่อร้าน</span>
                    <span className="font-medium text-gray-800">
                      {selectedStall.shop || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 pb-2 pt-2">
                    <span className="text-gray-500">ประเภทสินค้า</span>
                    <span className="font-medium text-gray-800">
                      {selectedStall.ptype || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-500">รหัสสัญญาเช่า</span>
                    <span className="font-medium text-gray-800">
                      {selectedStall.amgt.toString().padStart(6, "0") || "-"}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportMap;
