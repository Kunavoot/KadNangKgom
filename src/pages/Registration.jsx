import { useState, useEffect } from "react";
import Loading from "../components/Loading";
import Navbar from "../components/Navbar";
import axios from "axios";
import Swal from "sweetalert2";
import { BuddhistDatePicker } from "../utils/utils.jsx";
import { useNavigate } from "react-router-dom";

function Registration() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // จัดการข้อมูล
  const [prefix, setPrefix] = useState([]);
  const [productType, setProductType] = useState([]);
  const [formData, setFormData] = useState({
    trader_pname: "",
    trader_name: "",
    trader_sname: "",
    trader_tel: "",
    trader_shop: "",
    trader_ptype: "",
    trader_product: "",
    trader_addr_product: "",
    trader_addr: "",
    trader_business: "",
    trader_fsale: "",
    trader_has_car: 0,
    trader_car: "",
    trader_facebook: "",
    trader_line: "",
    trader_un: "",
    trader_pw: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "trader_addr") {
      setFormData((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value.trim() }));
    }
    setFormData((prev) => {
      const updatedValue = type === "checkbox" ? checked : value;
      return {
        ...prev,
        [name]: updatedValue,
        ...(name === "trader_has_car" && updatedValue == 0
          ? { trader_car: "" }
          : {}),
      };
    });
  };

  const handleValidate = () => {
    for (const item in formData) {
      if (typeof formData[item] === "string") {
        formData[item] = formData[item].trim();
      }
    } // ลบช่องว่างหน้าหลัง
    // เช็ค Form ก่อนว่าข้อมูลครบมั้ย
    for (const key in formData) {
      if (key === "trader_car" && formData.trader_has_car == 0) {
        continue;
      }
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
    if (formData.trader_business > new Date().toISOString()) {
      Swal.fire({
        icon: "error",
        title: "วันเริ่มทำธุรกิจต้องไม่เกินวันที่สมัคร",
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
    if (formData.trader_un.length < 6 || formData.trader_pw.length < 6) {
      Swal.fire({
        icon: "error",
        title: "ชื่อผู้ใช้และรหัสผ่านต้องมีความยาวไม่ต่ำกว่า 6 ตัวอักษร",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      setIsLoading(false);
      return false;
    }
    if (formData.trader_un.length > 20 || formData.trader_pw.length > 20) {
      Swal.fire({
        icon: "error",
        title: "ชื่อผู้ใช้และรหัสผ่านต้องมีความยาวไม่เกิน 20 ตัวอักษร",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      setIsLoading(false);
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!handleValidate()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/system/registerTrader",
        formData,
      );
      Swal.fire({
        icon: "success",
        title: response.data.message,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      navigate("/login");
    } catch (error) {
      console.error("Error adding sales:", error);
      Swal.fire({
        icon: "error",
        title: error.response.data.message || "เกิดข้อผิดพลาดในการเพิ่มข้อมูล",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
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
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้",
        timer: 1500,
        showConfirmButton: false,
      });
      setPrefix([]);
    }
  };

  const getProductType = async () => {
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/system/getProductType",
      );
      setProductType(response.data.data || []);
    } catch (error) {
      console.error("Error fetching product type data:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้",
        timer: 1500,
        showConfirmButton: false,
      });
      setProductType([]);
    }
  };

  useEffect(() => {
    getPrefix();
    getProductType();
  }, []);

  return (
    <>
      {isLoading && <Loading />}
      <div className="w-screen h-screen">
        <nav className="h-[18%]">
          <Navbar />
        </nav>

        {/* login box */}
        <div className="card bg-base-100 w-[70%] max-w-5xl py-8 m-auto my-8 shadow-[0px_0px_28.799999237060547px_0px_rgba(0,0,0,0.25)]">
          <h3 className="card text-2xl text-left pl-7 mt-3">
            ส่งฟอร์มเป็นผู้ค้า
          </h3>
          <div className="flex flex-row">
            <div className="flex-1 w-[45%] h-full text-left justify-center mx-auto">
              <fieldset className="fieldset w-[80%] m-auto">
                <div className="flex flex-row gap-3">
                  <div className="w-[60%]">
                    <label className="label mb-1" htmlFor="trader_pname">
                      คำนำหน้า
                    </label>
                    <select
                      className="select px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                      placeholder="คำนำหน้า"
                      id="trader_pname"
                      name="trader_pname"
                      value={formData.trader_pname}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        เลือกคำนำหน้า
                      </option>
                      {prefix.map((item) => (
                        <option key={item.id} value={item.title_th}>
                          {item.title_th}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="label mb-1" htmlFor="trader_name">
                      ชื่อ
                    </label>
                    <input
                      type="text"
                      className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                      placeholder="ชื่อ"
                      id="trader_name"
                      name="trader_name"
                      value={formData.trader_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <label className="label" htmlFor="trader_sname">
                  นามสกุล
                </label>
                <input
                  type="text"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="นามสกุล"
                  id="trader_sname"
                  name="trader_sname"
                  value={formData.trader_sname}
                  onChange={handleChange}
                />

                <label className="label" htmlFor="trader_tel">
                  เบอร์โทรศัพท์
                </label>
                <input
                  type="text"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="เบอร์โทรศัพท์"
                  id="trader_tel"
                  name="trader_tel"
                  value={formData.trader_tel}
                  onChange={handleChange}
                />

                <div className="flex flex-row gap-3">
                  <div className="w-[50%]">
                    <label className="label mb-1" htmlFor="trader_shop">
                      ชื่อร้านค้า
                    </label>
                    <input
                      type="text"
                      className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                      placeholder="ชื่อร้านค้า"
                      id="trader_shop"
                      name="trader_shop"
                      value={formData.trader_shop}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="w-[50%]">
                    <label className="label mb-1" htmlFor="trader_ptype">
                      ประเภทสินค้า
                    </label>
                    <select
                      className="select px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                      id="trader_ptype"
                      name="trader_ptype"
                      value={formData.trader_ptype}
                      onChange={handleChange}
                    >
                      <option value="" disabled>
                        เลือกประเภทสินค้า
                      </option>
                      {productType.map((item) => (
                        <option key={item.ptype_id} value={item.ptype_id}>
                          {item.ptype_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <label className="label" htmlFor="trader_product">
                  สินค้าที่ขาย
                </label>
                <input
                  type="text"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="สินค้าที่ขาย"
                  id="trader_product"
                  name="trader_product"
                  value={formData.trader_product}
                  onChange={handleChange}
                />

                <label className="label" htmlFor="trader_addr_product">
                  แหล่งที่มาของสินค้า
                </label>
                <input
                  type="text"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="แหล่งที่มาของสินค้า"
                  id="trader_addr_product"
                  name="trader_addr_product"
                  value={formData.trader_addr_product}
                  onChange={handleChange}
                />

                <label className="label" htmlFor="trader_addr">
                  ที่อยู่ผู้ค้า
                </label>
                <textarea
                  className="textarea h-28.5 px-3 w-full focus:outline-none focus:border-[#5bc06d] resize-none"
                  placeholder="ที่อยู่ผู้ค้า"
                  id="trader_addr"
                  name="trader_addr"
                  value={formData.trader_addr}
                  onChange={handleChange}
                ></textarea>
              </fieldset>
            </div>

            <div className="flex-1 w-[45%] h-full justify-items-center content-start">
              <fieldset className="fieldset w-[80%] m-auto">
                <div className="w-full relative z-20">
                  <label className="label">วันที่เริ่มทำธุรกิจ</label>
                  <BuddhistDatePicker
                    name="trader_business"
                    value={formData.trader_business}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        trader_business: date,
                      }))
                    }
                    className="input px-3 w-full focus:outline-none focus:border-[#5bc06d] cursor-default"
                    placeholder="เลือกวันที่เริ่มทำธุรกิจ"
                  />
                </div>

                <label className="label" htmlFor="trader_fsale">
                  สถานที่เคยขาย
                </label>
                <input
                  type="text"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="สถานที่เคยขาย"
                  id="trader_fsale"
                  name="trader_fsale"
                  value={formData.trader_fsale}
                  onChange={handleChange}
                />

                <div className="flex flex-col">
                  <label className="label">มีรถหรือไม่</label>
                  <div className="flex gap-4">
                    {/* ตัวเลือกที่ 1 */}
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <div className="flex items-center h-[3rem] gap-2">
                          <input
                            type="radio"
                            name="trader_has_car"
                            className="radio radio-xs max-h-4 w-4 radio-success"
                            value={1}
                            checked={formData.trader_has_car == 1}
                            onChange={handleChange}
                          />
                          <span className="label-text">มีรถ</span>
                        </div>
                      </label>
                    </div>

                    {/* ตัวเลือกที่ 2 */}
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <div className="flex items-center h-[3rem] gap-2">
                          <input
                            type="radio"
                            name="trader_has_car"
                            className="radio radio-xs max-h-4 w-4 radio-success"
                            value={0}
                            checked={formData.trader_has_car == 0}
                            onChange={handleChange}
                          />
                          <span className="label-text">ไม่มีรถ</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <label className="label" htmlFor="trader_car">
                  รถที่ใช้
                </label>
                <input
                  type="text"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="รถที่ใช้"
                  id="trader_car"
                  name="trader_car"
                  value={formData.trader_car}
                  onChange={handleChange}
                  disabled={formData.trader_has_car == 0}
                />

                <label className="label" htmlFor="trader_facebook">
                  Facebook
                </label>
                <input
                  type="text"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="Facebook"
                  id="trader_facebook"
                  name="trader_facebook"
                  value={formData.trader_facebook}
                  onChange={handleChange}
                />

                <label className="label" htmlFor="trader_line">
                  Line
                </label>
                <input
                  type="text"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="Line"
                  id="trader_line"
                  name="trader_line"
                  value={formData.trader_line}
                  onChange={handleChange}
                />

                <label className="label" htmlFor="trader_un">
                  Username
                </label>
                <input
                  type="text"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="Username"
                  id="trader_un"
                  name="trader_un"
                  value={formData.trader_un}
                  onChange={handleChange}
                />

                <label className="label" htmlFor="trader_pw">
                  Password
                </label>
                <input
                  type="password"
                  className="input px-3 w-full focus:outline-none focus:border-[#5bc06d]"
                  placeholder="Password"
                  id="trader_pw"
                  name="trader_pw"
                  value={formData.trader_pw}
                  onChange={handleChange}
                />
              </fieldset>
            </div>
          </div>
          <div className="flex justify-end pr-8">
            <button
              className="btn w-[42.5%] align-right mt-7 pr-5 bg-[#72DF82] hover:bg-[#5bc06d]"
              onClick={handleSubmit}
            >
              ดำเนินการต่อ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
