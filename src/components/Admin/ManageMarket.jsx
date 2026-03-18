import { useMemo, useState, useEffect } from "react";
import Loading from "../Loading";
import axios from "axios";
import Swal from "sweetalert2";
import { formatCurrency } from "../../utils/utils";

function ManageMarket() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const [isForm, setIsForm] = useState(false);
  const [formType, setFormType] = useState("");

  // รูปภาพ
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

  // ข้อมูล
  const [groups, setGroups] = useState([]);
  const [stalls, setStalls] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
  const [formData, setFormData] = useState({
    market_id: "",
    group_id: "",
    market_area: "",
    market_price: "",
    market_addr: "",
    market_img: "",
    market_status: "",
  });

  const selectedGroup = useMemo(
    () => groups.find((group) => group.group_id === selectedGroupId) || null,
    [groups, selectedGroupId],
  );

  const handleSelectGroup = (groupId) => {
    setSelectedGroupId(groupId);
    setIsForm(false);
    setFormType("");
    setSelectedStall(null);
    getMarket_Detail(groupId);
  };

  const handleBackToSummary = () => {
    setSelectedGroupId(null);
    setIsForm(false);
    setFormType("");
    setSelectedStall(null);
  };

  const handleAdd = () => {
    setFormType("add");
    setIsForm(true);
    setSelectedStall(null);
    setPreviewImage(null);
    setSelectedFile(null);
    setFormData({
      market_id: "",
      group_id: selectedGroupId,
      market_area: "4 x 4",
      market_price: "50",
      market_addr: "",
      market_img: "",
      market_status: "0",
    });
  };

  const handleEdit = (stall) => {
    setFormType("edit");
    setIsForm(true);
    setSelectedStall(stall);
    setPreviewImage(
      stall.market_img
        ? `${import.meta.env.VITE_BACKEND_URL}/image/stall/${stall.market_img}`
        : null
    );
    setSelectedFile(null);
    setFormData({ ...stall });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, market_img: file.name }));
    }
  };

  const handleOpenModal = (imageSrc) => {
    setModalImage(imageSrc);
    setIsModalOpen(true);
  };

  const handleDelete = (stallId) => {
    if (!selectedGroupId) return;
    Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลล็อคตลาดนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#c2c2c2ff",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const response = await axios.delete(
            import.meta.env.VITE_API_URL + `/admin/delMarket_Detail/${stallId}`
          );
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: response.data.message || "ลบข้อมูลสำเร็จ",
              confirmButtonText: "ตกลง",
              confirmButtonColor: "#5bc06d",
            });
            getMarket_Detail(selectedGroupId);
            getMarket_Summary();
          }
        } catch (error) {
          console.error("Error deleting market detail:", error);
          Swal.fire({
            icon: "error",
            title: error.response?.data?.message || "เกิดข้อผิดพลาดในการลบข้อมูล",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#5bc06d",
          });
        } finally {
          setIsLoading(false);
        }
      }
    });
  };

  const handleBackToDetail = () => {
    setIsForm(false);
    setFormType("");
    setSelectedStall(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!selectedGroupId) return;
    if (!formData.market_area || !formData.market_price || !formData.market_addr) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกข้อมูลให้ครบถ้วน",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      return;
    }

    setIsLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "group_id") {
          data.append("market_group", formData[key] === null ? "" : formData[key]);
        } else {
          data.append(key, formData[key] === null ? "" : formData[key]);
        }
      });

      // ถ้ามีการเลือกรูปภาพใหม่
      if (selectedFile) {
        data.append("market_img", selectedFile);
      }

      let response;
      if (formType === "add") {
        response = await axios.post(
          import.meta.env.VITE_API_URL + "/admin/addMarket_Detail",
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      } else if (formType === "edit" && selectedStall) {
        response = await axios.put(
          import.meta.env.VITE_API_URL + `/admin/editMarket_Detail/${selectedStall.market_id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
      }

      if (response && response.status === 200) {
        Swal.fire({
          icon: "success",
          title: response.data.message || "บันทึกข้อมูลสำเร็จ",
          showConfirmButton: false,
          timer: 1500,
        });
        getMarket_Detail(selectedGroupId);
        getMarket_Summary(); // Update total counts
        handleBackToDetail();
      }
    } catch (error) {
      console.error("Error saving market detail:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getMarket_Summary = async () => {
    // ดึงข้อมูลภาพรวมตลาด
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getMarket_Summary",
      );
      setGroups(response.data.data || []);
    } catch (error) {
      console.error("Error fetching market summary:", error);
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMarket_Detail = async (groupId) => {
    // ดึงข้อมูลรายละเอียดตลาด
    const targetId = groupId;
    if (!targetId) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getMarket_Detail/" + targetId,
      );
      setStalls(response.data.data || []);
    } catch (error) {
      console.error("Error fetching market detail:", error);
      setStalls([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getMarket_Summary();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      {!selectedGroupId && (
        <>
          <div className="flex flex-row justify-between py-4">
            <div className="text-2xl font-bold">จัดการเตรียมพื้นที่ตลาด</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {groups.map((group) => (
              <button
                key={group.group_id}
                className="bg-[#D9F7C9] border border-[#CDEEC1] shadow-sm p-4 h-[45] cursor-pointer text-center flex flex-col justify-between hover:shadow-md transition"
                onClick={() => handleSelectGroup(group.group_id)}
              >
                <div>
                  <div className="text-sm text-gray-700">กลุ่ม</div>
                  <div className="text-2xl font-semibold">{group.group_name}</div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">จำนวนล็อค</div>
                    <div className="text-2xl font-semibold">
                      {group.total_stall}
                    </div>
                  </div>
                  <div className="w-px h-10 bg-[#7CCF7B]" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">เช่าแล้ว</div>
                    <div className="text-2xl font-semibold">
                      {group.total_rented}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedGroupId && !isForm && (
        <>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                className="btn btn-sm btn-circle btn-ghost text-2xl content-center"
                onClick={handleBackToSummary}
              >
                &lt;
              </button>
              <div className="text-2xl font-bold">จัดการเตรียมพื้นที่ตลาด</div>
            </div>
            <button
              className="btn bg-[#7BE397] border-[#7BE397] shadow-sm hover:bg-[#68d284] hover:border-[#68d284]"
              onClick={handleAdd}
            >
              เพิ่มข้อมูล
            </button>
          </div>

          <div className="flex flex-wrap gap-6 pb-6">
            <div className="bg-[#89E989] shadow-md w-[140px] h-[120px] flex flex-col items-center justify-center">
              <div className="text-sm font-medium">กลุ่ม</div>
              <div className="text-2xl font-semibold">{selectedGroup.group_name}</div>
            </div>
            <div className="bg-[#89E989] shadow-md w-[140px] h-[120px] flex flex-col items-center justify-center">
              <div className="text-sm font-medium">จำนวนล็อค</div>
              <div className="text-2xl font-semibold">
                {selectedGroup.total_stall}
              </div>
            </div>
            <div className="bg-[#89E989] shadow-md w-[140px] h-[120px] flex flex-col items-center justify-center">
              <div className="text-sm font-medium">เช่าแล้ว</div>
              <div className="text-2xl font-semibold">
                {selectedGroup.total_rented}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-[#71FF7A]">
                  <th className="text-center w-[5%]"></th>
                  <th className="text-center">รหัสล็อคตลาด</th>
                  <th className="text-center">ขนาดพื้นที่</th>
                  <th className="text-end">ค่าเช่า/วัน</th>
                  <th className="text-start w-[30%]">ตำแหน่งที่ตั้ง</th>
                  <th className="text-center">สถานะ</th>
                  <th className="text-center w-[20%]">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {stalls.length > 0 ? (
                  stalls.map((stall, index) => (
                    <>
                      <tr
                        key={stall.market_id || index}
                        className="hover:bg-gray-100"
                      >
                        <th className="text-center">{index + 1}</th>
                        <td className="text-center">{stall.market_id}</td>
                        <td className="text-center">{stall.market_area}</td>
                        <td className="text-end">{formatCurrency(stall.market_price)}</td>
                        <td className="text-start">{stall.market_addr}</td>
                        <td className="text-center">
                          <span
                            className={
                              stall.market_status === "0"
                                ? "badge badge-success text-center"
                                : stall.market_status === "1"
                                  ? "badge badge-error text-center"
                                  : "badge badge-warning text-center"
                            }
                          >
                            {stall.market_status === "0"
                              ? "ว่าง"
                              : stall.market_status === "1"
                                ? "เช่าแล้ว"
                                : ""}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-warning mr-2 w-17"
                            onClick={() => handleEdit(stall)}
                          >
                            แก้ไข
                          </button>
                          <button
                            className="btn btn-sm btn-error w-17"
                            onClick={() => handleDelete(stall.market_id)}
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedGroupId && isForm && (
        <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#8EEA8B] px-6 py-4 flex items-center justify-between">
            <div className="text-3xl font-bold text-green-800">
              {formType === "edit" ? "แก้ไขล็อคตลาด" : "เพิ่มล็อคตลาด"}
            </div>
            <button
              className="text-4xl font-bold text-gray-500 hover:text-gray-700"
              onClick={handleBackToDetail}
            >
              ×
            </button>
          </div>

          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Form Fields */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">
                      <span className="label-text text-lg">รหัสล็อคตลาด</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="market_id"
                      value={formData.market_id}
                      onChange={handleFormChange}
                      placeholder="ระบบจะกรอกรหัสให้อัตโนมัติ"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-lg">ขนาดพื้นที่</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="market_area"
                      value={formData.market_area}
                      onChange={handleFormChange}
                      placeholder="เช่น 4 x 4 ม."
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-lg">ค่าเช่า/วัน</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="market_price"
                      value={formData.market_price}
                      onChange={handleFormChange}
                      placeholder="เช่น 50"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">
                      <span className="label-text text-lg">ตำแหน่งที่ตั้ง</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="market_addr"
                      value={formData.market_addr}
                      onChange={handleFormChange}
                      placeholder="กรอกตำแหน่งที่ตั้ง"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-lg">สถานะ</span>
                    </label>
                    <select
                      className="select select-bordered w-full"
                      name="market_status"
                      value={formData.market_status}
                      onChange={handleFormChange}
                      disabled
                    >
                      <option value="0">ว่าง</option>
                      <option value="1">เช่าแล้ว</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Image Upload */}
              <div className="w-full lg:w-1/3 flex flex-col items-center gap-8">
                <div className="w-8/10 flex flex-col items-center gap-4">
                  <div className="text-xl text-gray-700">รูปภาพล็อคตลาด</div>
                  <div
                    className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-green-500 transition-colors"
                    onClick={() =>
                      previewImage && handleOpenModal(previewImage)
                    }
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Market Stall"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-gray-400 flex flex-col items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span>ยังไม่มีรูปภาพ</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id="market_img"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="market_img"
                    className="btn bg-blue-500 hover:bg-blue-600 text-white border-none w-full text-center"
                  >
                    {previewImage ? "เปลี่ยนรูปภาพ" : "อัพโหลดรูปภาพ"}
                  </label>
                </div>
              </div>
            </div>

            {/* Modal for image expansion */}
            {isModalOpen && modalImage && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
                onClick={() => setIsModalOpen(false)}
              >
                <div className="relative max-w-4xl max-h-full">
                  <button
                    className="absolute -top-10 -right-10 text-white text-4xl hover:text-gray-300 cursor-pointer"
                    onClick={() => setIsModalOpen(false)}
                  >
                    ×
                  </button>
                  <img
                    src={modalImage}
                    alt="Expanded"
                    className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-6 pt-10">
              <button
                className="btn bg-[#ff7d7d] border-[#ff7d7d] text-white shadow-sm hover:bg-[#ff6b6b] hover:border-[#ff6b6b]"
                onClick={handleBackToDetail}
              >
                ย้อนกลับ
              </button>
              <button
                className="btn bg-[#77e279] border-[#77e279] text-white shadow-sm hover:bg-[#68d56b] hover:border-[#68d56b]"
                onClick={handleSave}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageMarket;
