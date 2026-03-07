import React, { useEffect, useState } from "react";
import Loading from "../Loading";
import { BuddhistDatePicker } from "../../utils/utils.jsx";

function Sales() {
  const [isLoading, setIsLoading] = useState(false);
  const [salesHistory, setSalesHistory] = useState([]);

  const defaultFormData = {
    memberId: "90000000001",
    saleDate: "",
    amount: "",
    bestProduct: "",
    suggestion: "",
  };

  const [formData, setFormData] = useState(defaultFormData);

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
      ...defaultFormData,
      memberId: prev.memberId,
    }));
  };

  const handleSaleDateChange = (value) => {
    setFormData((prev) => ({ ...prev, saleDate: value }));
  };

  const handleSubmit = () => {
    // TODO: เชื่อม API ส่งยอดขาย
    console.log("Submitted sales data:", formData);
  };

  const formatAmount = (value) => Number(value).toFixed(2);

  return (
    <>
      {isLoading && <Loading />}

      <div className="w-full">
        <div className="text-2xl font-bold mb-4">ส่งยอดขาย</div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-2">
          <div>
            <label className="label py-1">
              <span className="label-text text-lg">รหัสสมาชิก</span>
            </label>
            <input
              className="input input-bordered w-full bg-gray-200"
              name="memberId"
              value={formData.memberId}
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
              name="bestProduct"
              value={formData.bestProduct}
              onChange={handleFormChange}
              placeholder="กรอกสินค้า"
            />
          </div>

          <div>
            <label className="label py-1">
              <span className="label-text text-lg">วันที่ส่งยอดขาย</span>
            </label>
            <BuddhistDatePicker
              value={formData.saleDate}
              onChange={handleSaleDateChange}
              placeholder="วว/ดด/ปปปป"
            />
          </div>

          <div className="row-span-2">
            <label className="label py-1">
              <span className="label-text text-lg">ข้อเสนอแนะ</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full h-[122px] resize-none"
              name="suggestion"
              value={formData.suggestion}
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
              name="amount"
              type="number"
              min="0"
              step="0.01"
              value={formData.amount}
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
