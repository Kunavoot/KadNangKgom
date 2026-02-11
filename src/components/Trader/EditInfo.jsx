import React, { useEffect, useRef, useState } from "react";
import Loading from "../Loading";

function EditInfo() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);

  // ข้อมูลฟอร์มเริ่มต้น
  const defaultProfile = {
    member_id: "90000000001",
    member_type: "สมาชิกทั่วไป",
    shop_name: "ร้านตัวอย่าง",
    full_name: "นาย ตัวอย่าง ระบบ",
    facebook: "",
    line: "",
    username: "trader01",
    password: "",
    interest_training: "",
    hobby: "",
    used_car: "",
    product_source: "",
    address: "",
  };

  const [formData, setFormData] = useState(defaultProfile);
  const [originalData, setOriginalData] = useState(defaultProfile);
  const [imagePreview, setImagePreview] = useState("");
  const [originalImage, setOriginalImage] = useState("");
  const uploadedImageUrlRef = useRef("");

  useEffect(() => {
    // จำลองการดึงข้อมูลผู้ค้า
    setIsLoading(true);
    try {
      setFormData(defaultProfile);
      setOriginalData(defaultProfile);
      setImagePreview("");
      setOriginalImage("");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching profile:", error);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (uploadedImageUrlRef.current) {
        URL.revokeObjectURL(uploadedImageUrlRef.current);
      }
    };
  }, []);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    if (uploadedImageUrlRef.current) {
      URL.revokeObjectURL(uploadedImageUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(file);
    uploadedImageUrlRef.current = objectUrl;
    setImagePreview(objectUrl);
  };

  const handleReset = () => {
    setFormData(originalData);
    setImagePreview(originalImage);
  };

  const handleSave = () => {
    // TODO: เชื่อม API บันทึกข้อมูล
    setOriginalData(formData);
    setOriginalImage(imagePreview);
    console.log("Saved profile:", formData);
  };

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
                name="member_id"
                value={formData.member_id}
                onChange={handleFormChange}
                disabled
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">Username</span>
              </label>
              <input
                className="input input-bordered w-full bg-gray-200"
                name="username"
                value={formData.username}
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
                name="member_type"
                value={formData.member_type}
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
                name="password"
                value={formData.password}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">ชื่อร้านค้า</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="shop_name"
                value={formData.shop_name}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">การอบรมที่สนใจ</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="interest_training"
                value={formData.interest_training}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">ชื่อ - นามสกุล</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="full_name"
                value={formData.full_name}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">กิจกรรมที่ชื่นชอบ</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="hobby"
                value={formData.hobby}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">Facebook</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="facebook"
                value={formData.facebook}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">รถที่ใช้</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="used_car"
                value={formData.used_car}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">Line</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="line"
                value={formData.line}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label className="label py-1">
                <span className="label-text text-lg">แหล่งที่มาของสินค้า</span>
              </label>
              <input
                className="input input-bordered w-full"
                name="product_source"
                value={formData.product_source}
                onChange={handleFormChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label py-1">
                <span className="label-text text-lg">ที่อยู่</span>
              </label>
              <textarea
                className="textarea textarea-bordered w-full h-36 resize-none"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 lg:pt-2">
            <div className="w-full max-w-[250px] h-[380px] border border-gray-300 bg-gray-200 rounded-md overflow-hidden flex items-center justify-center">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="รูปภาพสินค้า"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-gray-700 text-xl">รูปภาพสินค้า</span>
              )}
            </div>

            <label className="btn btn-sm rounded-xl border-2 border-gray-500 bg-white text-black hover:bg-gray-100 px-6">
              อัพโหลดรูปภาพสินค้า
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUploadImage}
              />
            </label>
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
    </>
  );
}

export default EditInfo;
