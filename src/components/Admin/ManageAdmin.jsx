import { useState, useEffect } from "react";
import Loading from "../Loading";
import axios from "axios";
import { BuddhistDatePicker } from "../../utils/utils.jsx";
import Swal from "sweetalert2";

function ManageAdmin() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const [isForm, setIsFrom] = useState(false);
  const [formType, setFormType] = useState(""); // Add, Edit สำหรับจัดการฟอร์ม
  const [visiblePasswordId, setVisiblePasswordId] = useState(null);

  // ข้อมูล
  const [prefix, setPrefix] = useState([]);
  const [details, setDetails] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    admin_no: "",
    admin_pname: "",
    admin_name: "",
    admin_sname: "",
    admin_birth: "",
    admin_job: "",
    admin_gender: "",
    admin_tel: "",
    admin_addr: "",
    admin_date: "",
    admin_un: "",
    admin_pw: "",
  });

  const handleEdit = (item) => {
    // Logic สำหรับแก้ไขข้อมูลผู้บริหาร
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

  const handleAdminBirthChange = (value) => {
    setFormData((prev) => ({ ...prev, admin_birth: value }));
  };

  const handleAdminDateChange = (value) => {
    setFormData((prev) => ({ ...prev, admin_date: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    for (const item in formData) {
      if (item === "admin_no") {
        continue;
      } else if (formData[item] === "") {
        Swal.fire({
          icon: "error",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
        setIsLoading(false);
        return;
      }
    }
    if (formType === "add") {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + "/admin/addAdmin",
          formData,
        );
        Swal.fire({
          icon: "success",
          title: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
      } catch (error) {
        console.error("Error adding admin:", error);
        Swal.fire({
          icon: "error",
          title: error.response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
      } finally {
        getAdmin();
        handleBackToList();
        setIsLoading(false);
      }
    } else if (formType === "edit" && selectedItem) {
      setDetails((prev) =>
        prev.map((item) =>
          item.admin_no === selectedItem.admin_no
            ? { ...item, ...formData }
            : item,
        ),
      );
    }
    handleBackToList();
  };

  const getAdmin = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getAdmin",
      );
      setDetails(response.data.data || []);
    } catch (error) {
      console.error("Error fetching admin data:", error);
      setDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getPrefix = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/system/getPrefix",
      );
      setPrefix(response.data.data || []);
    } catch (error) {
      console.error("Error fetching prefix data:", error);
      setPrefix([]);
    }
  };

  useEffect(() => {
    getAdmin();
    getPrefix();
  }, []);

  useEffect(() => {
    if (formType === "edit" && selectedItem) {
      setFormData({
        admin_no: selectedItem.admin_no || "",
        admin_pname: selectedItem.admin_pname || "",
        admin_name: selectedItem.admin_name || "",
        admin_sname: selectedItem.admin_sname || "",
        admin_birth: selectedItem.admin_birth || "",
        admin_job: selectedItem.admin_job || "",
        admin_gender: selectedItem.admin_gender || "",
        admin_tel: selectedItem.admin_tel || "",
        admin_addr: selectedItem.admin_addr || "",
        admin_date: selectedItem.admin_date || "",
        admin_un: selectedItem.admin_un || "",
        admin_pw: selectedItem.admin_pw || "",
      });
      return;
    }
    if (formType === "add") {
      setFormData({
        admin_no: "",
        admin_pname: "",
        admin_name: "",
        admin_sname: "",
        admin_birth: "",
        admin_job: "",
        admin_gender: "",
        admin_tel: "",
        admin_addr: "",
        admin_date: "",
        admin_un: "",
        admin_pw: "",
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
            <div className="text-2xl font-bold">จัดการข้อมูลผู้บริหาร</div>
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
                  <th className="text-center w-[10%]">รหัส</th>
                  <th className="text-start">ชื่อ-นามสกุล</th>
                  <th className="text-start w-[10%]">ชื่อผู้ใช้</th>
                  <th className="text-start w-[10%]">รหัสผ่าน</th>
                  <th className="text-center w-[20%]">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {details.length > 0 ? (
                  // ถ้ามีข้อมูล ให้ map แถวออกมา
                  details?.map((item, index) => (
                    <tr key={item.admin_no} className="hover:bg-gray-100 h-10">
                      <th className="text-center">{index + 1}</th>
                      <td className="text-center">{item.admin_no}</td>
                      <td className="text-start">
                        {item.admin_pname === "-"
                          ? ""
                          : item.admin_pname +
                            " " +
                            item.admin_name +
                            " " +
                            item.admin_sname}
                      </td>
                      <td className="text-start">{item.admin_un}</td>
                      <td className="text-start flex justify-between items-center">
                        {visiblePasswordId === item.admin_no
                          ? item.admin_pw
                          : "********"}
                        <button
                          type="button"
                          className="btn btn-ghost h-10 btn-xs"
                          aria-label="แสดงรหัสผ่าน"
                          onMouseDown={() =>
                            setVisiblePasswordId(item.admin_no)
                          }
                          onMouseUp={() => setVisiblePasswordId(null)}
                          onMouseLeave={() => setVisiblePasswordId(null)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-4 w-4"
                            aria-hidden="true"
                          >
                            <path d="M12 5c-5.5 0-9.6 3.7-11 7 1.4 3.3 5.5 7 11 7s9.6-3.7 11-7c-1.4-3.3-5.5-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                          </svg>
                        </button>
                      </td>
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
              {formType === "edit" ? "แก้ไขผู้บริหาร" : "เพิ่มผู้บริหาร"}
            </div>
            <button
              className="text-4xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => handleBackToList()}
            >
              ×
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
              <div>
                <label className="label">
                  <span className="label-text text-lg">รหัส</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="admin_no"
                  value={formData.admin_no || ""}
                  onChange={(e) => handleFormChange(e)}
                  placeholder="ระบบจะกรอกรหัสอัตโนมัติ"
                  disabled
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">อาชีพ</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="admin_job"
                  value={formData.admin_job || ""}
                  onChange={(e) => handleFormChange(e)}
                  placeholder="กรอกอาชีพ"
                />
              </div>
              <div className="flex w-full gap-4">
                <div className="flex flex-col w-1/4">
                  <label className="label">
                    <span className="label-text text-lg">คำนำหน้าชื่อ</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="admin_pname"
                    value={formData.admin_pname || ""}
                    onChange={(e) => handleFormChange(e)}
                  >
                    <option value="" disabled>
                      เลือกคำนำหน้าชื่อ
                    </option>
                    {prefix.map((item) => (
                      <option key={item.id} value={item.short_th}>
                        {item.title_th}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col w-3/4">
                  <label className="label">
                    <span className="label-text text-lg">ชื่อจริง</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    name="admin_name"
                    value={formData.admin_name || ""}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="กรอกชื่อจริง"
                  />
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">นามสกุล</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="admin_sname"
                  value={formData.admin_sname || ""}
                  onChange={(e) => handleFormChange(e)}
                  placeholder="กรอกนามสกุล"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">เพศ</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="admin_gender"
                  value={formData.admin_gender || ""}
                  onChange={(e) => handleFormChange(e)}
                >
                  <option value="" disabled>
                    เลือกเพศ
                  </option>
                  <option value="ชาย">ชาย</option>
                  <option value="หญิง">หญิง</option>
                  <option value="อื่นๆ">อื่นๆ</option>
                </select>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">วันเกิด</span>
                </label>
                <BuddhistDatePicker
                  name="admin_birth"
                  value={formData.admin_birth}
                  onChange={(e) => handleAdminBirthChange(e)}
                  placeholder="เลือกวันเกิด"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">เบอร์โทรศัพท์</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="admin_tel"
                  value={formData.admin_tel || ""}
                  onChange={(e) => handleFormChange(e)}
                  placeholder="กรอกเบอร์โทรศัพท์"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">วันที่รับตำแหน่ง</span>
                </label>
                <BuddhistDatePicker
                  name="admin_date"
                  value={formData.admin_date}
                  onChange={(e) => handleAdminDateChange(e)}
                  placeholder="เลือกวันที่รับตำแหน่ง"
                />
              </div>
              <div className="col-span-2">
                <label className="label">
                  <span className="label-text text-lg">ที่อยู่</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-[122px] resize-none"
                  name="admin_addr"
                  value={formData.admin_addr || ""}
                  onChange={(e) => handleFormChange(e)}
                  placeholder="กรอกที่อยู่"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ชื่อผู้ใช้</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="admin_un"
                  value={formData.admin_un || ""}
                  onChange={(e) => handleFormChange(e)}
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">รหัสผ่าน</span>
                </label>
                <div className="relative">
                  <input
                    type={visiblePasswordId === "form" ? "text" : "password"}
                    className="input input-bordered w-full pr-10"
                    name="admin_pw"
                    value={formData.admin_pw || ""}
                    onChange={(e) => handleFormChange(e)}
                    placeholder="กรอกรหัสผ่าน"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
                    aria-label="แสดงรหัสผ่าน"
                    onMouseDown={() => setVisiblePasswordId("form")}
                    onMouseUp={() => setVisiblePasswordId(null)}
                    onMouseLeave={() => setVisiblePasswordId(null)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <path d="M12 5c-5.5 0-9.6 3.7-11 7 1.4 3.3 5.5 7 11 7s9.6-3.7 11-7c-1.4-3.3-5.5-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-6 pt-10">
              <button
                className="btn bg-[#ff7d7d] border-[#ff7d7d] text-white shadow-sm hover:bg-[#ff6b6b] hover:border-[#ff6b6b]"
                onClick={() => handleBackToList()}
              >
                ย้อนกลับ
              </button>
              <button
                className="btn bg-[#77e279] border-[#77e279] text-white shadow-sm hover:bg-[#68d56b] hover:border-[#68d56b]"
                onClick={() => handleSave()}
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

export default ManageAdmin;
