import React, { useState, useEffect } from "react";
import Loading from "../Loading";

function ManageMemberType() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const [isForm, setIsFrom] = useState(false);
  const [formType, setFormType] = useState(""); // Add, Edit สำหรับจัดการฟอร์ม

  // ข้อมูล
  const [details, setDetails] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    remark: "",
  });

  const handleEdit = (item) => {
    setFormType("edit");
    setIsFrom(true);
    setSelectedItem(item);
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

  const getProductType = () => {
    setIsLoading(true);
    try {
      setDetails([
        {
          id: "01",
          name: "อาหาร",
          remark: "ขายอาหาร",
        },
        {
          id: "02",
          name: "เสื้อผ้า",
          remark: "ขายเสื้อผ้า",
        },
        {
          id: "03",
          name: "เครื่องดื่ม",
          remark: "ขายเครื่องดื่ม",
        },
      ]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching product type data:", error);
    }
  };

  useEffect(() => {
    getProductType();
  }, []);

  useEffect(() => {
    if (formType === "edit" && selectedItem) {
      setFormData({
        id: selectedItem.id || "",
        name: selectedItem.name || "",
        remark: selectedItem.remark || "",
      });
      return;
    }
    if (formType === "add") {
      setFormData({
        id: "",
        name: "",
        remark: "",
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
            <div className="text-2xl font-bold">จัดการข้อมูลประเภทสินค้า</div>
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
                  <th className="text-start w-[20%]">ชื่อประเภทสินค้า</th>
                  <th className="text-start">รายละเอียด</th>
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
                      <td className="text-start">{item.remark}</td>
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
              {formType === "edit" ? "แก้ไขประเภทสมาชิก" : "เพิ่มประเภทสมาชิก"}
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
                  <span className="label-text text-lg">ประเภทสมาชิก</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  placeholder="กรอกประเภทสมาชิก"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">รายละเอียด</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="remark"
                  value={formData.remark}
                  onChange={handleFormChange}
                  placeholder="กรอกรายละเอียด"
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

export default ManageMemberType;
