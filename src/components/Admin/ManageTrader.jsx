import { useState, useEffect } from "react";
import Loading from "../Loading";
import axios from "axios";
import { BuddhistDatePicker } from "../../utils/utils.jsx";
import Swal from "sweetalert2";

function ManageTrader() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const [isForm, setIsFrom] = useState(false);
  const [formType, setFormType] = useState(""); // Add, Edit สำหรับจัดการฟอร์ม
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);

  // ข้อมูล
  const [prefix, setPrefix] = useState([]);
  const [details, setDetails] = useState([]);
  const [typeMembers, setTypeMembers] = useState([]);
  const [typeProducts, setTypeProducts] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    trader_no: "",
    trader_mtype: "",
    trader_ptype: "",
    trader_pname: "",
    trader_name: "",
    trader_sname: "",
    trader_shop: "",
    trader_product: "",
    trader_addr_product: "",
    trader_addr: "",
    trader_business: "",
    trader_fsale: "",
    trader_car: "",
    trader_course: "",
    trader_hobby: "",
    trader_tel: "",
    trader_line: "",
    trader_facebook: "",
    trader_pic_trader: "",
    trader_pic_product: "",
    trader_un: "",
    trader_pw: "",
    trader_date: "",
    trader_status: "1", // 1 = ปกติ, 2 = ระงับ
  });

  const handleEdit = (item) => {
    setFormType("edit");
    setIsFrom(true);
    setSelectedItem(item);
    console.log("Editing id:", item);
  };

  const handleAdd = () => {
    setFormType("add");
    setIsFrom(true);
    setSelectedItem(null);
  };

  const handleBackToList = () => {
    setIsFrom(false);
    setFormType("");
    setSelectedItem(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (formType === "add") {
      setDetails((prev) => [...prev, { ...formData }]);
    } else if (formType === "edit" && selectedItem) {
      setDetails((prev) =>
        prev.map((item) =>
          item.trader_no === selectedItem.trader_no
            ? { ...item, ...formData }
            : item,
        ),
      );
    }
    handleBackToList();
  };

  const getTrader = async () => {
    //ดึงข้อมูลผู้ค้า
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getTrader",
      );
      setDetails(response.data.data || []);
    } catch (error) {
      console.error("Error fetching trader data:", error);
      setDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeMembers = async () => {
    // ดึงข้อมูลประเภทสมาชิก
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/system/getMemberType",
      );
      setTypeMembers(response.data.data || []);
    } catch (error) {
      console.error("Error fetching type members:", error);
      setTypeMembers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeProducts = async () => {
    // ดึงข้อมูลประเภทสินค้า
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/system/getProductType",
      );
      setTypeProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching type products:", error);
      setTypeProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrefix = async () => {
    // ดึงข้อมูลคำนำหน้า
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/system/getPrefix",
      );
      setPrefix(response.data.data || []);
    } catch (error) {
      console.error("Error fetching prefix:", error);
      setPrefix([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTrader();
    getTypeMembers();
    getTypeProducts();
    getPrefix();
  }, []);

  useEffect(() => {
    if (formType === "edit" && selectedItem) {
      setFormData({
        trader_no: selectedItem.trader_no || "",
        trader_mtype: selectedItem.trader_mtype || "",
        trader_ptype: selectedItem.trader_ptype || "",
        trader_pname: selectedItem.trader_pname || "",
        trader_name: selectedItem.trader_name || "",
        trader_sname: selectedItem.trader_sname || "",
        trader_shop: selectedItem.trader_shop || "",
        trader_product: selectedItem.trader_product || "",
        trader_addr_product: selectedItem.trader_addr_product || "",
        trader_addr: selectedItem.trader_addr || "",
        trader_business: selectedItem.trader_business || "",
        trader_fsale: selectedItem.trader_fsale || "",
        trader_car: selectedItem.trader_car || "",
        trader_course: selectedItem.trader_course || "",
        trader_hobby: selectedItem.trader_hobby || "",
        trader_tel: selectedItem.trader_tel || "",
        trader_line: selectedItem.trader_line || "",
        trader_facebook: selectedItem.trader_facebook || "",
        trader_pic_trader: selectedItem.trader_pic_trader || "",
        trader_pic_product: selectedItem.trader_pic_product || "",
        trader_un: selectedItem.trader_un || "",
        trader_pw: selectedItem.trader_pw || "",
        trader_date: selectedItem.trader_date || "",
        trader_status: selectedItem.trader_status || "1",
      });
      return;
    }
    if (formType === "add") {
      setFormData({
        trader_no: "",
        trader_mtype: "",
        trader_ptype: "",
        trader_pname: "",
        trader_name: "",
        trader_sname: "",
        trader_shop: "",
        trader_product: "",
        trader_addr_product: "",
        trader_addr: "",
        trader_business: "",
        trader_fsale: "",
        trader_car: "",
        trader_course: "",
        trader_hobby: "",
        trader_tel: "",
        trader_line: "",
        trader_facebook: "",
        trader_pic_trader: "",
        trader_pic_product: "",
        trader_un: "",
        trader_pw: "",
        trader_date: "",
        trader_status: "1",
      });
    }
  }, [formType, selectedItem]);

  return (
    <>
      {isLoading && <Loading />}
      {!isForm ? (
        <>
          {/* Header */}
          <div className="flex flex-row justify-between py-4">
            <div className="text-2xl font-bold">จัดการข้อมูลผู้ค้า</div>
            <button
              className="btn bg-[#7BE397] border-[#7BE397] shadow-sm hover:bg-[#68d284] hover:border-[#68d284]"
              onClick={handleAdd}
            >
              เพิ่มข้อมูล
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="bg-[#71FF7A]">
                  <th className="text-center w-[5%]"></th>
                  <th className="text-center w-[10%]">รหัสผู้ค้า</th>
                  <th className="text-start">ชื่อร้าน</th>
                  <th className="text-start">ชื่อ-นามสกุล</th>
                  <th className="text-start">ประเภทสมาชิก</th>
                  <th className="text-start">ประเภทสินค้า</th>
                  <th className="text-start w-[10%]">ชื่อผู้ใช้</th>
                  <th className="text-start w-[10%]">รหัสผ่าน</th>
                  <th className="text-center w-[20%]">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {details.length > 0 ? (
                  // ถ้ามีข้อมูล ให้ map แถวออกมา
                  details.map((item, index) => (
                    <tr key={item.trader_no} className="hover:bg-gray-100">
                      <th className="text-center">{index + 1}</th>
                      <td className="text-center">{item.trader_no}</td>
                      <td className="text-start">{item.trader_shop}</td>
                      <td className="text-start">
                        {(item.trader_pname === "-"
                          ? ""
                          : item.trader_pname + " ") +
                          item.trader_name +
                          " " +
                          item.trader_sname}
                      </td>
                      <td className="text-start">{item.trader_mtype_name}</td>
                      <td className="text-start">{item.trader_ptype_name}</td>
                      <td className="text-start">{item.trader_un}</td>
                      <td className="text-start">{item.trader_pw}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-warning mr-2 w-17"
                          onClick={() => handleEdit(item)}
                        >
                          แก้ไข
                        </button>
                        <button className="btn btn-sm btn-error w-17">
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // ถ้าไม่มีข้อมูล ให้แสดงแถวนี้แถวเดียว
                  <tr>
                    <td colSpan="6" className="text-center">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#8EEA8B] px-6 py-4 flex items-center justify-between">
            <div className="text-3xl font-bold text-green-800">
              {formType === "edit" ? "แก้ไขผู้ค้า" : "เพิ่มผู้ค้า"}
            </div>
            <button
              className="text-4xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={handleBackToList}
            >
              ×
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">
                  <span className="label-text text-lg">รหัสผู้ค้า</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_no"
                  value={formData.trader_no}
                  onChange={handleFormChange}
                  placeholder="ระบบจะกรอกรหัสให้อัตโนมัติ"
                  disabled
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ชื่อร้าน</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_shop"
                  value={formData.trader_shop}
                  onChange={handleFormChange}
                  placeholder="กรอกชื่อร้าน"
                />
              </div>
              <div className="flex w-full gap-4">
                <div className="flex flex-col w-1/4">
                  <label className="label">
                    <span className="label-text text-lg">คำนำหน้า</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="trader_pname"
                    value={formData.trader_pname}
                    onChange={handleFormChange}
                  >
                    <option value="">เลือกคำนำหน้า</option>
                    {prefix.map((item) => (
                      <option key={item.id} value={item.short_th}>
                        {item.title_th}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-3/4">
                  <label className="label">
                    <span className="label-text text-lg">ชื่อ</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    name="trader_name"
                    value={formData.trader_name}
                    onChange={handleFormChange}
                    placeholder="กรอกชื่อ"
                  />
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">นามสกุล</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_sname"
                  value={formData.trader_sname}
                  onChange={handleFormChange}
                  placeholder="กรอกนามสกุล"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">เบอร์โทรศัพท์</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_tel"
                  type="tel"
                  value={formData.trader_tel}
                  onChange={handleFormChange}
                  placeholder="กรอกเบอร์โทรศัพท์"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ประเภทสมาชิก</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="trader_mtype"
                  value={formData.trader_mtype}
                  onChange={handleFormChange}
                >
                  <option value="" disabled>
                    เลือกประเภทสมาชิก
                  </option>
                  {typeMembers.map((type) => (
                    <option key={type.memtype_id} value={type.memtype_id}>
                      {type.memtype_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ประเภทสินค้า</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="trader_ptype"
                  value={formData.trader_ptype}
                  onChange={handleFormChange}
                >
                  <option value="" disabled>
                    เลือกประเภทสินค้า
                  </option>
                  {typeProducts.map((type) => (
                    <option key={type.ptype_id} value={type.ptype_id}>
                      {type.ptype_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ชื่อสินค้า</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_product"
                  value={formData.trader_product}
                  onChange={handleFormChange}
                  placeholder="กรอกชื่อสินค้า"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text text-lg">แหล่งที่มาของสินค้า</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_addr_product"
                  value={formData.trader_addr_product}
                  onChange={handleFormChange}
                  placeholder="กรอกแหล่งที่มาของสินค้า"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text text-lg">ที่อยู่ผู้ค้า</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-24"
                  name="trader_addr"
                  value={formData.trader_addr}
                  onChange={handleFormChange}
                  placeholder="กรอกที่อยู่ผู้ค้า"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">วันที่เริ่มทำธุรกิจ</span>
                </label>
                <BuddhistDatePicker
                  name="trader_business"
                  value={formData.trader_business}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, trader_business: date }))
                  }
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">
                    Flash Sale (ยอดขาย)
                  </span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_fsale"
                  value={formData.trader_fsale}
                  onChange={handleFormChange}
                  placeholder="กรอกยอดขาย Flash Sale"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">รถที่ใช้</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_car"
                  value={formData.trader_car}
                  onChange={handleFormChange}
                  placeholder="เช่น กระบะ, มอเตอร์ไซค์"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">คอร์สที่เรียน</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_course"
                  value={formData.trader_course}
                  onChange={handleFormChange}
                  placeholder="กรอกคอร์สที่เคยเรียน"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">งานอดิเรก</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_hobby"
                  value={formData.trader_hobby}
                  onChange={handleFormChange}
                  placeholder="กรอกงานอดิเรก"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">Line ID</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_line"
                  value={formData.trader_line}
                  onChange={handleFormChange}
                  placeholder="กรอก Line ID"
                />
              </div>
              <div className="md:col-span-2">
                <label className="label">
                  <span className="label-text text-lg">Facebook</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_facebook"
                  value={formData.trader_facebook}
                  onChange={handleFormChange}
                  placeholder="กรอกลิงก์หรือชื่อ Facebook"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ชื่อผู้ใช้</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_un"
                  value={formData.trader_un}
                  onChange={handleFormChange}
                  placeholder="กรอกชื่อผู้ใช้สำหรับเข้าระบบ"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">รหัสผ่าน</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="trader_pw"
                  type="password"
                  value={formData.trader_pw}
                  onChange={handleFormChange}
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">สถานะ</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="trader_status"
                  value={formData.trader_status}
                  onChange={handleFormChange}
                >
                  <option value="1">ปกติ</option>
                  <option value="0">ระงับการใช้งาน</option>
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">วันที่สมัคร</span>
                </label>
                <BuddhistDatePicker
                  name="trader_date"
                  value={formData.trader_date}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, trader_date: date }))
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-6 pt-10">
              <button
                className="btn bg-[#ff7d7d] border-[#ff7d7d] text-white shadow-sm hover:bg-[#ff6b6b] hover:border-[#ff6b6b]"
                onClick={handleBackToList}
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

export default ManageTrader;
