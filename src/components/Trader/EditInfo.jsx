import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../../service/AuthContext";
import Loading from "../Loading";
import Swal from "sweetalert2";

function EditInfo() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const uploadedImageUrlRef = useRef("");
  const uploadedTraderImageUrlRef = useRef("");
  
  // ข้อมูล
  const { user } = useAuth();
  const [formData, setFormData] = useState([]);
  const [originalData, setOriginalData] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const [traderImagePreview, setTraderImagePreview] = useState("");
  const [originalTraderImage, setOriginalTraderImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [prefixOptions, setPrefixOptions] = useState([]);

  useEffect(() => {
    return () => {
      if (uploadedImageUrlRef.current) {
        URL.revokeObjectURL(uploadedImageUrlRef.current);
      }
      if (uploadedTraderImageUrlRef.current) {
        URL.revokeObjectURL(uploadedTraderImageUrlRef.current);
      }
    };
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "product") {
      if (uploadedImageUrlRef.current) {
        URL.revokeObjectURL(uploadedImageUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(file);
      uploadedImageUrlRef.current = objectUrl;
      setImagePreview(objectUrl);
    } else if (type === "trader") {
      if (uploadedTraderImageUrlRef.current) {
        URL.revokeObjectURL(uploadedTraderImageUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(file);
      uploadedTraderImageUrlRef.current = objectUrl;
      setTraderImagePreview(objectUrl);
    }
  };

  const handleOpenModal = (img) => {
    setModalImage(img);
    setIsModalOpen(true);
  };

  const handleReset = () => {
    setFormData(originalData);
    setImagePreview(originalImage);
    setTraderImagePreview(originalTraderImage);
    const picTrader = document.getElementById("edit_pic_trader");
    const picProduct = document.getElementById("edit_pic_product");
    if (picTrader) picTrader.value = "";
    if (picProduct) picProduct.value = "";
  };

  const handleValidate = () => {
    for (const item in formData) {
      if (typeof formData[item] === "string") {
        formData[item] = formData[item].trim();
      }
    } // ลบช่องว่างหน้าหลัง

    for (const key in formData) {
      if (formData[key] === "") {
        Swal.fire({
          icon: "error",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!handleValidate()) return;
    try {
      setIsLoading(true);

      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key] === null ? "" : formData[key]);
      });

      const picTrader = document.getElementById("edit_pic_trader")?.files?.[0];
      const picProduct = document.getElementById("edit_pic_product")?.files?.[0];

      if (picTrader) submitData.append("trader_pic_trader", picTrader);
      if (picProduct) submitData.append("trader_pic_product", picProduct);

      const response = await axios.put(
        import.meta.env.VITE_API_URL + "/trader/editProfile/" + formData.trader_no,
        submitData,
        { headers: { "Content-Type": "multipart/form-data" } },
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      Swal.fire({
        icon: "error",
        title: error.response.data.message || "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
    } finally {
      setIsLoading(false);
    }

    setOriginalData(formData);
    setOriginalImage(imagePreview);
    setOriginalTraderImage(traderImagePreview);
  };

  const getProfile = async () => {
    if (!user || !user.username) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/trader/getProfile",
        {
          params: {
            username: user.username,
          },
        },
      );

      const traderData = response.data.data[0] || {};
      setFormData(traderData);
      setOriginalData(traderData);
      const imageUrl = traderData.trader_pic_product
        ? `${import.meta.env.VITE_BACKEND_URL}/image/product/${traderData.trader_pic_product}`
        : "";
      setImagePreview(imageUrl);
      setOriginalImage(imageUrl);

      const traderImageUrl = traderData.trader_pic_trader
        ? `${import.meta.env.VITE_BACKEND_URL}/image/trader/${traderData.trader_pic_trader}`
        : "";
      setTraderImagePreview(traderImageUrl);
      setOriginalTraderImage(traderImageUrl);
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrefix = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/system/getPrefix",
      );
      setPrefixOptions(response.data.data || []);
    } catch (error) {
      console.error("Error fetching prefix:", error);
      setPrefixOptions([]);
    }
  };

  useEffect(() => {
    getProfile();
    getPrefix();
  }, []);

  return (
    <>
      {isLoading && <Loading />}

      <div className="py-2">
        <div className="text-2xl font-bold mb-6">แก้ไขข้อมูลผู้ค้า</div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <label className="label py-1">
                <span className="label-text text-lg">รหัสสมาชิก</span>
              </label>
              <input
                className="input input-bordered w-full bg-gray-200"
                name="trader_no"
                value={
                  formData.trader_no
                    ? String(formData.trader_no).padStart(6, "0")
                    : ""
                }
                onChange={handleFormChange}
                disabled
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">ประเภทสมาชิก</span>
              </label>
              <input
                className="input input-bordered w-full bg-gray-200"
                name="trader_mtype_name"
                value={formData.trader_mtype_name || ""}
                onChange={handleFormChange}
                disabled
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">ชื่อร้านค้า</span>
              </label>
              <input
                className="input input-bordered w-full bg-gray-200"
                name="trader_shop"
                value={formData.trader_shop || ""}
                onChange={handleFormChange}
                disabled
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">ประเภทสินค้า</span>
              </label>
              <input
                className="input input-bordered w-full bg-gray-200"
                name="trader_ptype_name"
                value={formData.trader_ptype_name || ""}
                onChange={handleFormChange}
                disabled
              />
            </div>

            <div className="flex w-full gap-4">
              <div className="flex flex-col w-[30%]">
                <label className="label py-1">
                  <span className="label-text text-lg">คำนำหน้า</span>
                </label>
                <select
                  className="select select-bordered w-full bg-gray-200"
                  name="trader_pname"
                  value={formData.trader_pname || ""}
                  onChange={handleFormChange}
                  disabled
                >
                  <option value="" disabled>
                    เลือกคำนำหน้า
                  </option>
                  {prefixOptions.map((item) => (
                    <option key={item.id} value={item.title_th}>
                      {item.title_th}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col w-[70%]">
                <label className="label py-1">
                  <span className="label-text text-lg">ชื่อ</span>
                </label>
                <input
                  className="input input-bordered w-full bg-gray-200"
                  name="trader_name"
                  value={formData.trader_name || ""}
                  onChange={handleFormChange}
                  placeholder="ชื่อ"
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">นามสกุล</span>
              </label>
              <input
                className="input input-bordered w-full bg-gray-200"
                name="trader_sname"
                value={formData.trader_sname || ""}
                onChange={handleFormChange}
                placeholder="นามสกุล"
                disabled
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">การอบรมที่สนใจ</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="trader_course"
                value={formData.trader_course || ""}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">กิจกรรมที่ชื่นชอบ</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="trader_hobby"
                value={formData.trader_hobby || ""}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">รถที่ใช้</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="trader_car"
                value={formData.trader_car || ""}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">แหล่งที่มาของสินค้า</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="trader_addr_product"
                value={formData.trader_addr_product || ""}
                onChange={handleFormChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label py-1">
                <span className="label-text text-lg">ที่อยู่</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-36 resize-none"
                name="trader_addr"
                value={formData.trader_addr || ""}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">เบอร์โทรศัพท์</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="trader_tel"
                value={formData.trader_tel || ""}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">Facebook</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="trader_facebook"
                value={formData.trader_facebook || ""}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">Line</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="trader_line"
                value={formData.trader_line || ""}
                onChange={handleFormChange}
              />
            </div>

            <div></div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">Username</span>
              </label>
              <input
                className="input input-bordered w-full bg-gray-200"
                name="trader_un"
                value={formData.trader_un || ""}
                onChange={handleFormChange}
                disabled
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">Password</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="trader_pw"
                value={formData.trader_pw || ""}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="flex flex-row gap-8 pt-2 lg:flex-col">
            {/* รูปภาพผู้ค้า */}
            <div className="w-full flex flex-col items-center gap-4">
              <div className="text-xl text-gray-700">รูปภาพผู้ค้า</div>
              <div
                className="w-full max-w-[250px] aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-green-500 transition-colors"
                onClick={() =>
                  traderImagePreview && handleOpenModal(traderImagePreview)
                }
              >
                {traderImagePreview ? (
                  <img
                    src={traderImagePreview}
                    alt="Trader"
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    <span>ยังไม่มีรูปภาพผู้ค้า</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="edit_pic_trader"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "trader")}
                onClick={(e) => (e.target.value = "")}
              />
              <label
                htmlFor="edit_pic_trader"
                className="btn bg-blue-500 hover:bg-blue-600 text-white border-none w-full max-w-[250px]"
              >
                {traderImagePreview
                  ? "เปลี่ยนรูปภาพผู้ค้า"
                  : "อัพโหลดรูปภาพผู้ค้า"}
              </label>
            </div>

            {/* รูปภาพสินค้า */}
            <div className="w-full flex flex-col items-center gap-4">
              <div className="text-xl text-gray-700">รูปภาพสินค้า</div>
              <div
                className="w-full max-w-[250px] aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-green-500 transition-colors"
                onClick={() => imagePreview && handleOpenModal(imagePreview)}
              >
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Product"
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
                    <span>ยังไม่มีรูปภาพสินค้า</span>
                  </div>
                )}
              </div>
              <input
                type="file"
                id="edit_pic_product"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleFileChange(e, "product")}
                onClick={(e) => (e.target.value = "")}
              />
              <label
                htmlFor="edit_pic_product"
                className="btn bg-blue-500 hover:bg-blue-600 text-white border-none w-full max-w-[250px]"
              >
                {imagePreview ? "เปลี่ยนรูปภาพสินค้า" : "อัพโหลดรูปภาพสินค้า"}
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <button
            className="btn btn-outline border-[#ff7f7f] rounded-xl border-2 text-black hover:bg-[#fff2f2] hover:border-[#ff6b6b] min-w-32"
            onClick={handleReset}
          >
            รีเซ็ต
          </button>
          <button
            className="btn btn-outline border-[#86dc8f] rounded-xl border-2 text-black hover:bg-[#f0fff2] hover:border-[#74cb7d] min-w-32"
            onClick={handleSave}
          >
            บันทึกข้อมูล
          </button>
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
    </>
  );
}

export default EditInfo;
