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
    trader_status: "1", // 1 = กำลังค้าขาย, 0 = สิ้นสุดการค้า
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [selectedTraderFile, setSelectedTraderFile] = useState(null);
  const [previewTraderImage, setPreviewTraderImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState("");

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

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "product") {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewImage(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (type === "trader") {
        setSelectedTraderFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewTraderImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleOpenModal = (img) => {
    setModalImage(img);
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!handleValidate()) return;
    setIsLoading(true);
    try {
      const data = new FormData();
      // Append all text fields
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      // Append file if selected
      if (selectedFile) {
        data.append("trader_pic_product", selectedFile);
      }
      if (selectedTraderFile) {
        data.append("trader_pic_trader", selectedTraderFile);
      }

      let response;
      if (formType === "add") {
        response = await axios.post(
          import.meta.env.VITE_API_URL + "/admin/addTrader",
          data,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      } else if (formType === "edit" && selectedItem) {
        response = await axios.put(
          import.meta.env.VITE_API_URL +
            `/admin/editTrader/${selectedItem.trader_no}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } },
        );
      }

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        getTrader();
        handleBackToList();
      }
    } catch (error) {
      console.error("Error saving trader:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response.data.message || "ไม่สามารถบันทึกข้อมูลได้",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "ยืนยันการลบ",
      text: "คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้?",
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
            import.meta.env.VITE_API_URL + `/admin/delTrader/${id}`,
          );
          if (response.status === 200) {
            Swal.fire({
              icon: "success",
              title: response.data.message || "ลบข้อมูลสำเร็จ",
              confirmButtonText: "ตกลง",
              confirmButtonColor: "#5bc06d",
            });
            getTrader();
          }
        } catch (error) {
          console.error("Error deleting trader:", error);
          Swal.fire({
            icon: "error",
            title: error.response.data.message || "เกิดข้อผิดพลาดในการลบข้อมูล",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#5bc06d",
          });
        } finally {
          setIsLoading(false);
          getTrader();
        }
      }
    });
  };

  const handleValidate = () => {
    // เช็ค Form ก่อนว่าข้อมูลครบมั้ย
    for (const item in formData) {
      if (item === "trader_no") {
        continue;
      }
      if (!formData[item]) {
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
    // เช็คเงื่อนไขบาง Form
    if (!formData.trader_shop) {
      Swal.fire({
        icon: "error",
        title: "กรุณากรอกชื่อร้านค้า",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      setIsLoading(false);
      return false;
    }
    if (!formData.trader_name.match(/^[ก-๙]+$/)) {
      Swal.fire({
        icon: "error",
        title: "ชื่อผู้ค้าต้องเป็นภาษาไทยเท่านั้น",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      setIsLoading(false);
      return false;
    }
    if (!formData.trader_sname.match(/^[ก-๙]+$/)) {
      Swal.fire({
        icon: "error",
        title: "นามสกุลผู้ค้าต้องเป็นภาษาไทยเท่านั้น",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      setIsLoading(false);
      return false;
    }
    if (
      !formData.trader_tel.match(/^[0-9]+$/) ||
      formData.trader_tel.length !== 10
    ) {
      Swal.fire({
        icon: "error",
        title: "เบอร์โทรศัพท์ต้องเป็นตัวเลขเท่านั้นและมีความยาว 10 หลัก",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      setIsLoading(false);
      return false;
    }
    if (formData.trader_birth > formData.trader_date) {
      Swal.fire({
        icon: "error",
        title: "วันเกิดต้องน้อยกว่าวันเข้ารับตำแหน่ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      setIsLoading(false);
      return false;
    }
    if (!formData.trader_un.match(/^[a-zA-Z0-9]+$/)) {
      Swal.fire({
        icon: "error",
        title: "ชื่อผู้ใช้ต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      setIsLoading(false);
      return false;
    }
    if (!formData.trader_pw.match(/^[a-zA-Z0-9]+$/)) {
      Swal.fire({
        icon: "error",
        title: "รหัสผ่านต้องเป็นภาษาอังกฤษหรือตัวเลขเท่านั้น",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      setIsLoading(false);
      return false;
    }
    return true;
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
      setPreviewImage(
        selectedItem.trader_pic_product
          ? `${import.meta.env.VITE_BACKEND_URL}/image/product/${selectedItem.trader_pic_product}`
          : null,
      );
      setPreviewTraderImage(
        selectedItem.trader_pic_trader
          ? `${import.meta.env.VITE_BACKEND_URL}/image/trader/${selectedItem.trader_pic_trader}`
          : null,
      );
      setSelectedFile(null);
      setSelectedTraderFile(null);
      return;
    }
    if (formType === "add") {
      setPreviewImage(null);
      setPreviewTraderImage(null);
      setSelectedFile(null);
      setSelectedTraderFile(null);
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
          <div className="overflow-x-auto overflow-y-auto h-150">
            <table className="table">
              {/* head */}
              <thead className="sticky top-0">
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
                    <tr key={item.trader_no} className="hover:bg-gray-100 h-10">
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
                      <td className="text-start flex justify-between items-center">
                        {visiblePasswordId === item.trader_no
                          ? item.trader_pw
                          : "********"}
                        <button
                          type="button"
                          className="btn btn-ghost h-10 btn-xs"
                          onMouseDown={() =>
                            setVisiblePasswordId(item.trader_no)
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
                        <button
                          className="btn btn-sm btn-error w-17"
                          onClick={() => handleDelete(item.trader_no)}
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
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Left Column: Form Fields */}
              <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">
                      <span className="label-text text-lg">รหัสผู้ค้า</span>
                    </label>
                    <input
                      className="input input-bordered w-full bg-gray-100"
                      name="trader_no"
                      value={formData.trader_no}
                      onChange={handleFormChange}
                      placeholder="ระบบจะกรอกรหัสให้อัตโนมัติ"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-lg">ชื่อร้านค้า</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="trader_shop"
                      value={formData.trader_shop}
                      onChange={handleFormChange}
                      placeholder="กรอกชื่อร้านค้า"
                    />
                  </div>
                  <div className="flex w-full gap-4">
                    <div className="flex flex-col w-1/4">
                      <label className="label">
                        <span className="label-text text-lg">คำนำหน้าชื่อ</span>
                      </label>
                      <select
                        className="select select-bordered w-full"
                        name="trader_pname"
                        value={formData.trader_pname}
                        onChange={handleFormChange}
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
                      <span className="label-text text-lg">สินค้าที่ขาย</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="trader_product"
                      value={formData.trader_product}
                      onChange={handleFormChange}
                      placeholder="กรอกสินค้าที่ขาย"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">
                      <span className="label-text text-lg">
                        แหล่งที่มาของสินค้า
                      </span>
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
                  <div className="md:col-span-2">
                    <label className="label">
                      <span className="label-text text-lg">สถานที่เคยขาย</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="trader_fsale"
                      value={formData.trader_fsale}
                      onChange={handleFormChange}
                      placeholder="กรอกสถานที่เคยขาย"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-lg">
                        วันที่เริ่มทำธุรกิจ
                      </span>
                    </label>
                    <BuddhistDatePicker
                      name="trader_business"
                      value={formData.trader_business}
                      onChange={(date) =>
                        setFormData((prev) => ({
                          ...prev,
                          trader_business: date,
                        }))
                      }
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
                      <span className="label-text text-lg">การอบรมที่สนใจ</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="trader_course"
                      value={formData.trader_course}
                      onChange={handleFormChange}
                      placeholder="กรอกการอบรมที่สนใจ"
                    />
                  </div>
                  <div>
                    <label className="label">
                      <span className="label-text text-lg">กิจกรรมที่ชอบ</span>
                    </label>
                    <input
                      className="input input-bordered w-full"
                      name="trader_hobby"
                      value={formData.trader_hobby}
                      onChange={handleFormChange}
                      placeholder="กรอกกิจกรรมที่ชอบ"
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
                  <div>
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
                      placeholder="กรอกชื่อผู้ใช้"
                      disabled={formType === "edit"}
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
                      <option value="1">กำลังค้าขาย</option>
                      <option value="0">สิ้นสุดการค้าขาย</option>
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
              </div>

              <div className="w-full lg:w-1/3 flex flex-col items-center gap-8">
                {/* รูปภาพผู้ค้า */}
                <div className="w-8/10 flex flex-col items-center gap-4">
                  <div className="text-xl text-gray-700">รูปภาพผู้ค้า</div>
                  <div
                    className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-green-500 transition-colors"
                    onClick={() =>
                      previewTraderImage && handleOpenModal(previewTraderImage)
                    }
                  >
                    {previewTraderImage ? (
                      <img
                        src={previewTraderImage}
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
                    id="trader_pic_trader"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "trader")}
                  />
                  <label
                    htmlFor="trader_pic_trader"
                    className="btn bg-blue-500 hover:bg-blue-600 text-white border-none w-full"
                  >
                    {previewTraderImage
                      ? "เปลี่ยนรูปภาพผู้ค้า"
                      : "อัพโหลดรูปภาพผู้ค้า"}
                  </label>
                </div>

                <div className="w-8/10 flex flex-col items-center gap-4">
                  <div className="text-xl text-gray-700">รูปภาพสินค้า</div>
                  <div
                    className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center overflow-hidden bg-gray-50 cursor-pointer hover:border-green-500 transition-colors"
                    onClick={() =>
                      previewImage && handleOpenModal(previewImage)
                    }
                  >
                    {previewImage ? (
                      <img
                        src={previewImage}
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
                    id="trader_pic_product"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, "product")}
                  />
                  <label
                    htmlFor="trader_pic_product"
                    className="btn bg-blue-500 hover:bg-blue-600 text-white border-none w-full"
                  >
                    {previewImage
                      ? "เปลี่ยนรูปภาพสินค้า"
                      : "อัพโหลดรูปภาพสินค้า"}
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
