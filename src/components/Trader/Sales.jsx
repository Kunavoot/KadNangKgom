import { useEffect, useState } from "react";
import Loading from "../Loading";
import { BuddhistDatePicker, formatCurrency } from "../../utils/utils.jsx";
import { useAuth } from "../../service/AuthContext";
import axios from "axios";
import Swal from "sweetalert2";

function Sales() {
  // จัดการหน้าเว็บ
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // ข้อมูล
  const [salesHistory, setSalesHistory] = useState([]);
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

  const selectedAgreement = agreement.find(
    (item) => String(item.agmt_id) === String(formData.sale_id),
  );

  const formatAmount = (value) => Number(value).toFixed(2);

  const getSalesHistory = () => {
    setIsLoading(true);
    try {
      // จำลองข้อมูลประวัติการส่งยอดขาย
      setSalesHistory([
        {
          id: 1,
          amount: 3000.0,
          saleDate: "01/05/2568",
          bestProduct: "ลูกชิ้นหมู",
          suggestion: "อยากให้มี..................",
        },
        {
          id: 2,
          amount: 3000.0,
          saleDate: "02/05/2568",
          bestProduct: "ลูกชิ้นหมู",
          suggestion: "อยากให้มี..................",
        },
        {
          id: 3,
          amount: 3000.0,
          saleDate: "08/05/2568",
          bestProduct: "ลูกชิ้นหมู",
          suggestion: "อยากให้มี..................",
        },
        {
          id: 4,
          amount: 3000.0,
          saleDate: "09/05/2568",
          bestProduct: "ลูกชิ้นหมู",
          suggestion: "อยากให้มี..................",
        },
        {
          id: 5,
          amount: 3000.0,
          saleDate: "15/05/2568",
          bestProduct: "ลูกชิ้นหมู",
          suggestion: "อยากให้มี..................",
        },
      ]);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching sales history:", error);
    }
  };

  useEffect(() => {
    getSalesHistory();
  }, []);
  
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
    for (const key in formData) {
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

    if (formData.sale_amount < 0) {
      Swal.fire({
        icon: "error",
        title: "ยอดขายต้องไม่เป็นลบ",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      return false;
    }

    if (formData.sale_date > new Date().toISOString().split("T")[0]) {
      Swal.fire({
        icon: "error",
        title: "วันที่ส่งยอดขายต้องไม่เกินวันที่ปัจจุบัน",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      return false;
    }

    if (formData.sale_date > new Date().toISOString().split("T")[0]) {
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
      getAgreement(response.data.data[0].sale_trader);
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
    getSales();
  }, []);

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
          <table className="table min-w-[980px]">
            <thead>
              <tr className="bg-[#71E67D]">
                <th className="text-center w-[8%]">ครั้งที่</th>
                <th className="text-center w-[14%]">จำนวนเงิน</th>
                <th className="text-center w-[18%]">วันที่ส่งยอดขาย</th>
                <th className="text-center w-[14%]">สินค้าที่ขายดี</th>
                <th className="text-center">ข้อเสนอแนะ</th>
                <th className="text-center w-[12%]">รายละเอียด</th>
              </tr>
            </thead>
            <tbody>
              {salesHistory.length > 0 ? (
                salesHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-100">
                    <td className="text-center">{item.id}</td>
                    <td className="text-center">{formatAmount(item.amount)}</td>
                    <td className="text-center">{item.saleDate}</td>
                    <td className="text-center">{item.bestProduct}</td>
                    <td className="text-center">{item.suggestion}</td>
                    <td className="text-center">
                      <button
                        type="button"
                        className="underline underline-offset-2 hover:text-gray-600"
                        onClick={() =>
                          console.log("View sale detail:", item.id)
                        }
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
    </>
  );
}

export default Sales;
