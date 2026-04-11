import { useEffect, useState } from "react";
import Loading from "../Loading";
import { BuddhistDatePicker, formatCurrency, toThaiDisplayDate } from "../../utils/utils.jsx";
import { useAuth } from "../../service/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

function Sales() {
  // จัดการหน้าเว็บ
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState([]);

  // ข้อมูล
  const [formData, setFormData] = useState({
    sale_id: "",
    sale_date: "",
    sale_trader: "",
    sale_shop: "",
    sale_ptype: "",
    sale_ptype_name: "",
    sale_group: "",
    sale_group_name: "",
    sale_amount: "",
    sale_best: "",
    sale_suggest: "",
    sale_mtype: "",
    sale_mtype_name: "",
    sale_sell_day: "",
  });
  const [agreement, setAgreement] = useState([]);
  const [salesHistory, setSalesHistory] = useState([]);

  const selectedAgreement = agreement.find(
    (item) => String(item.agmt_id) === String(formData.sale_id),
  );

  const getSalesHistory = async (trader_no) => {
    if (!trader_no && !formData.sale_trader) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/trader/getSalesHistory",
        {
          params: {
            sale_trader: trader_no || formData.sale_trader,
          },
        },
      );
      setSalesHistory(response.data.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching sales history:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };
  
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFormData((prev) => ({
      ...prev,
      sale_id: "",
      sale_date: "",
      sale_group: "",
      sale_group_name: "",
      sale_amount: "",
      sale_best: "",
      sale_suggest: "",
    }));
  };

  const handleSaleDateChange = (value) => {
    setFormData((prev) => ({ ...prev, sale_date: value }));
  };

  const handleValidate = () => {
    const data = {};
    for (const item in formData) {
      data[item] =
        typeof formData[item] === "string"
          ? formData[item].trim()
          : formData[item];
    }
    for (const key in data) {
      if (data[key] === "") {
        Swal.fire({
          icon: "error",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
        return false;
      }
    }

    if (data.sale_amount < 0) {
      Swal.fire({
        icon: "error",
        title: "ยอดขายต้องไม่เป็นลบ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      return false;
    }

    if (data.sale_date > new Date().toISOString().split("T")[0]) {
      Swal.fire({
        icon: "error",
        title: "วันที่ส่งยอดขายต้องไม่เกินวันที่ปัจจุบัน",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      return false;
    }
    return true;
  }

  const handleSubmit = async () => {
    if (!handleValidate()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/trader/sendSales",
        formData,
      );
      Swal.fire({
        icon: "success",
        title: response.data.message,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      getSalesHistory();
      handleReset();
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
    console.log("Submitted sales data:", formData);
  };

  const handleSelectAgreement = (value) => {
    const selectedAgreement = agreement.find(
      (item) => String(item.agmt_id) === String(value),
    );
    setFormData((prev) => ({
      ...prev,
      sale_id: Number(value) || "",
      sale_group: selectedAgreement?.market_group || "",
      sale_group_name: selectedAgreement?.group_name || "",
      sale_sell_day: selectedAgreement?.agmt_status || "",
    }));
  };


  const getSales = async () => {
    if (!user || !user.username) return;

    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/trader/getSales",
        {
          params: {
            username: user.username,
          },
        },
      );

      const data = response.data.data[0];
      setFormData({
        sale_id: "",
        sale_date: "",
        sale_trader: data.sale_trader,
        sale_shop: data.trader_shop,
        sale_ptype: data.trader_ptype,
        sale_ptype_name: data.trader_ptype_name,
        sale_group: "",
        sale_amount: "",
        sale_best: "",
        sale_suggest: "",
        sale_mtype: data.trader_mtype,
        sale_mtype_name: data.trader_mtype_name,
      });
      getAgreement(data.sale_trader);
      getSalesHistory(data.sale_trader);
    } catch (error) {
      console.error("Error fetching sales :", error);
      Swal.fire({
        icon: "error",
        title: error.response.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAgreement = async (trader_no) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/trader/getAgreement",
        {
          params: {
            trader_no: trader_no,
          },
        },
      );
      setAgreement(response.data.data);
    } catch (error) {
      console.error("Error fetching agreement :", error);
      Swal.fire({
        icon: "error",
        title: error.response.data.message || "เกิดข้อผิดพลาดในการดึงข้อมูล",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.username) {
      getSales();
    }
  }, [user?.username]);

  return (
    <>
      {isLoading && <Loading />}

      <div className="w-full">
        <div className="text-2xl font-bold mb-4">ส่งยอดขาย</div>

        <div className="grid grid-cols-1 grid-cols-2 gap-x-10 gap-y-2">
          <div className="flex gap-x-2">
            <div className="w-1/2">
              <label className="label py-1">
                <span className="label-text text-lg">รหัสสมาชิก</span>
              </label>
              <input
                className="input input-bordered w-full bg-gray-200"
                name="sale_trader"
                value={
                  formData.sale_trader
                    ? String(formData.sale_trader).padStart(6, "0")
                    : ""
                }
                onChange={handleFormChange}
                disabled
              />
            </div>
            <div className="w-1/2">
              <label className="label py-1">
                <span className="label-text text-lg">ชื่อร้านค้า</span>
              </label>
              <input
                className="input input-bordered w-full bg-gray-200"
                name="sale_shop"
                value={formData.sale_shop || ""}
                onChange={handleFormChange}
                disabled
              />
            </div>
          </div>

          <div>
            <label className="label py-1">
              <span className="label-text text-lg">สัญญาเช่า</span>
            </label>
            <select
              className="select select-bordered w-full"
              name="sale_id"
              value={formData.sale_id || ""}
              onChange={(e) => handleSelectAgreement(e.target.value)}
            >
              <option value="" disabled>
                เลือกสัญญาเช่า
              </option>
              {agreement.map((item) => (
                <option key={item.agmt_id} value={item.agmt_id}>
                  {String(item.agmt_id).padStart(6, "0")}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label py-1">
              <span className="label-text text-lg">ประเภทสินค้า</span>
            </label>
            <input
              className="input input-bordered w-full bg-gray-200"
              name="sale_ptype_name"
              value={formData.sale_ptype_name || ""}
              onChange={handleFormChange}
              disabled
            />
          </div>

          <div>
            <label className="label py-1">
              <span className="label-text text-lg">กลุ่มสังกัด</span>
            </label>
            <input
              className="input input-bordered w-full bg-gray-200"
              name="sale_group_name"
              value={formData?.sale_group_name || ""}
              onChange={handleFormChange}
              disabled
            />
          </div>

          <div>
            <label className="label py-1">
              <span className="label-text text-lg">สินค้าที่ขายดี</span>
            </label>
            <input
              className="input input-bordered w-full"
              name="sale_best"
              value={formData.sale_best}
              onChange={handleFormChange}
              placeholder="กรอกชื่อสินค้าขายดี"
            />
          </div>

          <div>
            <label className="label py-1">
              <span className="label-text text-lg">วันที่ส่งยอดขาย</span>
            </label>
            <BuddhistDatePicker
              value={formData?.sale_date}
              onChange={handleSaleDateChange}
              minDate={
                selectedAgreement?.agmt_start
                  ? new Date(selectedAgreement.agmt_start)
                  : undefined
              }
              maxDate={
                selectedAgreement?.agmt_end
                  ? new Date(selectedAgreement.agmt_end)
                  : undefined
              }
              placeholder="วว/ดด/ปปปป"
              disabled={!selectedAgreement}
            />
          </div>

          <div className="row-span-2">
            <label className="label py-1">
              <span className="label-text text-lg">ข้อเสนอแนะ</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-[122px] resize-none"
              name="sale_suggest"
              value={formData.sale_suggest}
              onChange={handleFormChange}
              placeholder="กรอกข้อเสนอแนะ"
            />
          </div>

          <div>
            <label className="label py-1">
              <span className="label-text text-lg">จำนวนเงิน</span>
            </label>
            <input
              className="input input-bordered w-full"
              name="sale_amount"
              type="number"
              min="0"
              step="1.00"
              value={formData.sale_amount}
              onChange={handleFormChange}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4 mb-2">
          <button
            type="button"
            className="btn h-11 min-h-11 rounded-xl border-2 border-[#ff7f7f] bg-white px-10 text-base font-medium text-black shadow-none hover:bg-[#fff2f2] hover:border-[#ff6b6b]"
            onClick={handleReset}
          >
            รีเซ็ต
          </button>
          <button
            type="button"
            className="btn h-11 min-h-11 rounded-xl border-2 border-[#86dc8f] bg-white px-10 text-base font-medium text-black shadow-none hover:bg-[#f0fff2] hover:border-[#74cb7d]"
            onClick={handleSubmit}
          >
            ส่งยอดขาย
          </button>
        </div>

        <div className="text-2xl font-bold mt-4 mb-2">ประวัติการส่งยอดขาย</div>

        <div className="overflow-x-auto pb-2">
          <table className="table max-h-100">
            <thead>
              <tr className="bg-[#71E67D] h-10">
                <th className="text-center w-[8%]">ครั้งที่</th>
                <th className="text-center w-[5%]">สัญญาเช่า</th>
                <th className="text-center w-[18%]">วันที่ส่งยอดขาย</th>
                <th className="text-center w-[14%]">จำนวนเงิน</th>
                <th className="text-center w-[14%]">สินค้าที่ขายดี</th>
                <th className="text-center">ข้อเสนอแนะ</th>
                <th className="text-center w-[12%]">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {salesHistory.length > 0 ? (
                salesHistory.map((item) => (
                  <tr key={item.row_num} className="hover:bg-gray-100 h-10">
                    <td className="text-center">{item.row_num}</td>
                    <td className="text-center">{item.sale_id?.toString().padStart(6, "0") || "-"}</td>
                    <td className="text-center">{toThaiDisplayDate(item.sale_date) || "-"}</td>
                    <td className="text-center">{formatCurrency(item.sale_amount) || "-"}</td>
                    <td className="text-center">{item.sale_best || "-"}</td>
                    <td className="text-center">{item.sale_suggest || "-"}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="underline underline-offset-2 cursor-pointer hover:text-gray-600"
                        onClick={() => {
                          setSelectedSale(item);
                          setIsModalOpen(true);
                        }}
                      >
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    ไม่พบข้อมูล
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedSale && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 transition-opacity">
          <div className="bg-white rounded-2xl p-8 w-full max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <button 
              type="button"
              className="btn btn-sm btn-circle btn-ghost absolute right-4 top-4 focus:outline-none focus:bg-gray-200"
              onClick={() => {
                setIsModalOpen(false);
                setTimeout(() => setSelectedSale(null), 200);
              }}
            >
              ✕
            </button>
            
            <h3 className="text-2xl font-bold mb-6">รายละเอียดยอดขาย</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
              <div>
                <label className="label py-1">
                  <span className="label-text text-lg">ครั้งที่</span>
                </label>
                <input
                  className="input input-bordered w-full bg-gray-200 text-black"
                  value={selectedSale.row_num}
                  disabled
                />
              </div>
              
              <div>
                <label className="label py-1">
                  <span className="label-text text-lg">สัญญาเช่า</span>
                </label>
                <input
                  className="input input-bordered w-full bg-gray-200 text-black"
                  value={selectedSale.sale_id?.toString().padStart(6, "0") || "-"}
                  disabled
                />
              </div>
              
              <div>
                <label className="label py-1">
                  <span className="label-text text-lg">วันที่ส่งยอดขาย</span>
                </label>
                <input
                  className="input input-bordered w-full bg-gray-200 text-black"
                  value={toThaiDisplayDate(selectedSale.sale_date) || "-"}
                  disabled
                />
              </div>
              
              <div>
                <label className="label py-1">
                  <span className="label-text text-lg">จำนวนเงิน</span>
                </label>
                <input
                  className="input input-bordered w-full bg-gray-200 text-black"
                  value={formatCurrency(selectedSale.sale_amount) || "-"}
                  disabled
                />
              </div>
              
              <div>
                <label className="label py-1">
                  <span className="label-text text-lg">ประเภทสินค้า</span>
                </label>
                <input
                  className="input input-bordered w-full bg-gray-200 text-black"
                  value={selectedSale.ptype_name || "-"}
                  disabled
                />
              </div>
              
              <div>
                <label className="label py-1">
                  <span className="label-text text-lg">กลุ่มสังกัด</span>
                </label>
                <input
                  className="input input-bordered w-full bg-gray-200 text-black"
                  value={selectedSale.group_name || "-"}
                  disabled
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="label py-1">
                  <span className="label-text text-lg">สินค้าที่ขายดี</span>
                </label>
                <input
                  className="input input-bordered w-full bg-gray-200 text-black"
                  value={selectedSale.sale_best  || "-"}
                  disabled
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="label py-1">
                  <span className="label-text text-lg">ข้อเสนอแนะ</span>
                </label>
                <textarea
                  className="textarea textarea-bordered w-full h-[122px] resize-none bg-gray-200 text-black"
                  value={selectedSale.sale_suggest || "-"}
                  disabled
                />
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                className="btn h-11 min-h-11 rounded-xl border-2 border-[#ff7f7f] bg-white px-10 text-base font-medium text-black shadow-none hover:bg-[#fff2f2] hover:border-[#ff6b6b]"
                onClick={() => {
                  setIsModalOpen(false);
                  setTimeout(() => setSelectedSale(null), 200);
                }}
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Sales;
