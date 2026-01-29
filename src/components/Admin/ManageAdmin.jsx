import React, { useState, useEffect } from "react";
import Loading from "../Loading";

function ManageAdmin() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const [isForm, setIsFrom] = useState(false);
  const [formType, setFormType] = useState(""); // Add, Edit สำหรับจัดการฟอร์ม
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // ข้อมูล
  const [details, setDetails] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    username: "",
    password: "",
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

  const handleSave = () => {
    if (formType === "add") {
      setDetails((prev) => [...prev, { ...formData }]);
    } else if (formType === "edit" && selectedItem) {
      setDetails((prev) =>
        prev.map((item) =>
          item.id === selectedItem.id ? { ...item, ...formData } : item,
        ),
      );
    }
    handleBackToList();
  };

  const getAdmin = () => {
    setDetails([
      {
        id: "90000000001",
        name: "นาย xxxxxx xxxxxx",
        username: "admin01",
        password: "123456",
      },
      {
        id: "90000000002",
        name: "นางสาว yyyyyy yyyyyy",
        username: "admin02",
        password: "abcdef",
      },
    ]);
  };

  useEffect(() => {
    setIsLoading(true);
    getAdmin();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (formType === "edit" && selectedItem) {
      setFormData({
        id: selectedItem.id || "",
        name: selectedItem.name || "",
        username: selectedItem.username || "",
        password: selectedItem.password || "",
      });
      return;
    }
    if (formType === "add") {
      setFormData({ id: "", name: "", username: "", password: "" });
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
                  details.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-100">
                      <th className="text-center">{index + 1}</th>
                      <td className="text-center">{item.id}</td>
                      <td className="text-start">{item.name}</td>
                      <td className="text-start">{item.username}</td>
                      <td className="text-start">{item.password}</td>
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
              className="text-4xl font-bold text-gray-500 hover:text-gray-700"
              onClick={handleBackToList}
            >
              ×
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label">
                  <span className="label-text text-lg">รหัส</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="id"
                  value={formData.id}
                  onChange={handleFormChange}
                  placeholder="กรอกรหัส"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ชื่อ-นามสกุล</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ชื่อผู้ใช้</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="username"
                  value={formData.username}
                  onChange={handleFormChange}
                  placeholder="กรอกชื่อผู้ใช้"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">รหัสผ่าน</span>
                </label>
                <div className="relative">
                  <input
                    type={isPasswordVisible ? "text" : "password"}
                    className="input input-bordered w-full pr-10"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    placeholder="กรอกรหัสผ่าน"
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-ghost btn-xs"
                    aria-label="แสดงรหัสผ่าน"
                    onMouseDown={() => setIsPasswordVisible(true)}
                    onMouseUp={() => setIsPasswordVisible(false)}
                    onMouseLeave={() => setIsPasswordVisible(false)}
                    onTouchStart={() => setIsPasswordVisible(true)}
                    onTouchEnd={() => setIsPasswordVisible(false)}
                    onTouchCancel={() => setIsPasswordVisible(false)}
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

export default ManageAdmin;
