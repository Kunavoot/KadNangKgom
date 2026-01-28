import React from "react";
import Loading from "../Loading";

function ManageTrader() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = React.useState(false);
  const [isForm, setIsFrom] = React.useState(false);
  const [formType, setFormType] = React.useState(""); // Add, Edit สำหรับจัดการฟอร์ม

  // ข้อมูล
  const [details, setDetails] = React.useState([]);
  const [typeMembers, setTypeMembers] = React.useState([
    "สมาชิกทั่วไป",
    "สมาชิกพิเศษ",
    "สมาชิก VIP",
  ]);
  const [typeProducts, setTypeProducts] = React.useState([
    "สินค้าทั่วไป",
    "สินค้าพิเศษ",
    "สินค้า Premium",
  ]);
  const [selectedItem, setSelectedItem] = React.useState(null);
  const [formData, setFormData] = React.useState({
    id: "",
    name: "",
    shop: "",
    type_member: "",
    type_product: "",
    username: "",
    password: "",
  });

  const handleEdit = (item) => {
    // Logic สำหรับแก้ไขข้อมูลผู้ค้า
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

  const getTrader = () => {
    setIsLoading(true);
    try {
      // ดึงข้อมูลผู้ค้าจาก API หรือฐานข้อมูล
      setDetails([
        {
          id: "90000000001",
          name: "นาย xxxxxx xxxxxx",
          shop: "ร้าน xxxxxx",
          type_member: "สมาชิกทั่วไป",
          type_product: "สินค้าทั่วไป",
          username: "admin01",
          password: "123456",
        },
        {
          id: "90000000002",
          name: "นางสาว yyyyyy yyyyyy",
          shop: "ร้าน yyyyyy",
          type_member: "สมาชิกพิเศษ",
          type_product: "สินค้าพิเศษ",
          username: "admin02",
          password: "abcdef",
        },
      ]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching trader data:", error);
    }
  };

  const getTypeMembers = () => {
    // ดึงข้อมูลประเภทสมาชิกจาก API หรือฐานข้อมูล
    setIsLoading(true);
    try {
      setTypeMembers(["สมาชิกทั่วไป", "สมาชิกพิเศษ", "สมาชิก VIP"]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching type members:", error);
    }
  };

  const getTypeProducts = () => {
    // ดึงข้อมูลประเภทสินค้าจาก API หรือฐานข้อมูล
    setIsLoading(true);
    try {
      setTypeProducts(["สินค้าทั่วไป", "สินค้าพิเศษ", "สินค้า Premium"]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching type products:", error);
    }
  };

  React.useEffect(() => {
    getTrader();
    getTypeMembers();
    getTypeProducts();
  }, []);

  React.useEffect(() => {
    if (formType === "edit" && selectedItem) {
      setFormData({
        id: selectedItem.id || "",
        name: selectedItem.name || "",
        shop: selectedItem.shop || "",
        type_member: selectedItem.type_member || "",
        type_product: selectedItem.type_product || "",
        username: selectedItem.username || "",
        password: selectedItem.password || "",
      });
      return;
    }
    if (formType === "add") {
      setFormData({
        id: "",
        name: "",
        shop: "",
        type_member: "",
        type_product: "",
        username: "",
        password: "",
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
              เพิ่มผู้ค้า
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
                    <tr key={item.id || index} className="hover:bg-gray-100">
                      <th className="text-center">{index + 1}</th>
                      <td className="text-center">{item.id}</td>
                      <td className="text-start">{item.name}</td>
                      <td className="text-start">{item.shop}</td>
                      <td className="text-start">{item.type_member}</td>
                      <td className="text-start">{item.type_product}</td>
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
        <>
          {/* Form เพิ่มข้อมูลผู้ค้า หรือแก้ไขผู้ค้า */}
          <div className="flex items-center gap-3 py-4">
            <button
              className="btn btn-sm btn-circle btn-ghost text-2xl content-center"
              onClick={handleBackToList}
            >
              &lt;
            </button>
            <div className="text-xl font-bold">
              {formType === "edit" ? "แก้ไขผู้ค้า" : "เพิ่มผู้ค้า"}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">
                <span className="label-text">รหัส</span>
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
                <span className="label-text">ชื่อ-นามสกุล</span>
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
                <span className="label-text">ชื่อผู้ใช้</span>
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
                <span className="label-text">รหัสผ่าน</span>
              </label>
              <input
                type="password"
                className="input input-bordered w-full"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="กรอกรหัสผ่าน"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-6">
            <button className="btn" onClick={handleBackToList}>
              ยกเลิก
            </button>
            <button
              className="btn bg-[#7BE397] border-[#7BE397] shadow-sm hover:bg-[#68d284] hover:border-[#68d284]"
              onClick={handleSave}
            >
              บันทึก
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default ManageTrader;
