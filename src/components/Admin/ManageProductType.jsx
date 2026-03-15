import React, { useState, useEffect } from "react";
import Loading from "../Loading";
import axios from "axios";
import Swal from "sweetalert2";

function ManageMemberType() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const [isForm, setIsFrom] = useState(false);
  const [formType, setFormType] = useState(""); // Add, Edit สำหรับจัดการฟอร์ม

  // ข้อมูล
  const [details, setDetails] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    ptype_id: "",
    ptype_name: "",
    ptype_detail: "",
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

  const handleDelete = (ptype_id) => {
    Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลประเภทสินค้า",
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
            import.meta.env.VITE_API_URL + "/admin/delProductType/" + ptype_id,
          );
          Swal.fire({
            icon: "success",
            title: response.data.message || "ลบข้อมูลสำเร็จ",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#5bc06d",
          });
        } catch (error) {
          console.error("Error deleting product type:", error);
          Swal.fire({
            icon: "error",
            title: error.response.data.message || "เกิดข้อผิดพลาดในการลบข้อมูล",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#5bc06d",
          });
        } finally {
          getProductType();
          setIsLoading(false);
        }
      }
    });
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

  const handleValidate = () => {
    // เช็ค Form ก่อนว่าข้อมูลครบมั้ย
    for (const item in formData) {
      console.log(item);
      if (item === "ptype_id") {
        continue;
      } else if (formData[item] === "") {
        Swal.fire({
          icon: "error",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
        setIsLoading(false);
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!handleValidate()) return;
    setIsLoading(true);
    if (formType === "add") {
      try {
        const response = await axios.post(
          import.meta.env.VITE_API_URL + "/admin/addProductType",
          formData,
        );
        Swal.fire({
          icon: "success",
          title: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
      } catch (error) {
        console.error("Error adding product type:", error);
        Swal.fire({
          icon: "error",
          title: error.response.data.message || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
      } finally {
        getProductType();
        setIsLoading(false);
      }
    } else if (formType === "edit" && selectedItem) {
      try {
        const response = await axios.put(
          import.meta.env.VITE_API_URL + "/admin/editProductType/" + selectedItem.ptype_id,
          formData,
        );
        Swal.fire({
          icon: "success",
          title: response.data.message,
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
      } catch (error) {
        console.error("Error editing product type:", error);
        Swal.fire({
          icon: "error",
          title: error.response.data.message || "เกิดข้อผิดพลาดในการแก้ไขข้อมูล",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
      } finally {
        getProductType();
        setIsLoading(false);
      }
    }
    handleBackToList();
  };

  const getProductType = async () => {
    // ดึงข้อมูลประเภทสินค้า
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getProductType",
      );
      setDetails(response.data.data || []);
    } catch (error) {
      console.error("Error fetching product type data:", error);
      setDetails([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProductType();
  }, []);

  useEffect(() => {
    if (formType === "edit" && selectedItem) {
      setFormData({
        ptype_id: selectedItem.ptype_id || "",
        ptype_name: selectedItem.ptype_name || "",
        ptype_detail: selectedItem.ptype_detail || "",
      });
      return;
    }
    if (formType === "add") {
      setFormData({
        ptype_id: "",
        ptype_name: "",
        ptype_detail: "",
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
                    <tr key={item.ptype_id} className="hover:bg-gray-100">
                      <th className="text-center">{index + 1}</th>
                      <td className="text-center">{item.ptype_id}</td>
                      <td className="text-start">{item.ptype_name}</td>
                      <td className="text-start">{item.ptype_detail}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-warning mr-2 w-17"
                          onClick={() => handleEdit(item)}
                        >
                          แก้ไข
                        </button>
                        <button className="btn btn-sm btn-error w-17"
                          onClick={() => handleDelete(item.ptype_id)}
                        >
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
              {formType === "edit" ? "แก้ไขประเภทสินค้า" : "เพิ่มประเภทสินค้า"}
            </div>
            <button
              className="text-4xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => handleBackToList()}
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
                  name="ptype_id"
                  value={formData.ptype_id}
                  onChange={handleFormChange}
                  placeholder="ระบบจะกรอกรหัสให้อัตโนมัติ"
                  disabled
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ประเภทสินค้า</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="ptype_name"
                  value={formData.ptype_name}
                  onChange={handleFormChange}
                  placeholder="กรอกประเภทสินค้า"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">รายละเอียด</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="ptype_detail"
                  value={formData.ptype_detail}
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
