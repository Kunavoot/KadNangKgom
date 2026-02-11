import React, { forwardRef, useEffect, useState } from "react";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Loading from "../Loading";

dayjs.extend(buddhistEra);
dayjs.locale("th");

const thaiMonths = Array.from({ length: 12 }, (_, monthIndex) =>
  dayjs().month(monthIndex).format("MMMM"),
);

const currentYear = dayjs().year();
const calendarYears = Array.from(
  { length: 121 },
  (_, index) => currentYear - 60 + index,
);

const toDate = (dateValue) => {
  if (!dateValue) return null;
  const parsed = dayjs(dateValue);
  return parsed.isValid() ? parsed.toDate() : null;
};

const toStorageDate = (dateValue) => {
  if (!dateValue) return "";
  return dayjs(dateValue).format("YYYY-MM-DD");
};

const toThaiDisplayDate = (dateValue) => {
  if (!dateValue) return "";
  return dayjs(dateValue).format("DD/MM/BBBB");
};

const DateInput = forwardRef(({ value, onClick, placeholder }, ref) => (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    className="flex h-12 w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 text-left text-sm text-gray-700 transition hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200"
  >
    <span className={value ? "text-gray-700" : "text-gray-400"}>
      {value || placeholder}
    </span>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className="h-4 w-4 text-gray-500"
      aria-hidden="true"
    >
      <rect x="3.5" y="5.5" width="17" height="15" rx="2.5" />
      <path d="M7.5 3.5v4M16.5 3.5v4M3.5 9.5h17" />
    </svg>
  </button>
));

DateInput.displayName = "DateInput";

function BuddhistDatePicker({ value, onChange, placeholder }) {
  const selectedDate = toDate(value);

  return (
    <DatePicker
      selected={selectedDate}
      onChange={(date) => onChange(toStorageDate(date))}
      shouldCloseOnSelect
      popperPlacement="bottom-start"
      calendarClassName="buddhist-datepicker"
      wrapperClassName="w-full"
      customInput={<DateInput placeholder={placeholder} />}
      value={selectedDate ? toThaiDisplayDate(value) : ""}
      formatWeekDay={(dayName) => dayName.slice(0, 2)}
      renderCustomHeader={({
        date,
        changeMonth,
        changeYear,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div className="mb-3 flex items-center justify-between gap-2 rounded-lg bg-gray-50 p-2">
          <button
            type="button"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            className="h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {"<"}
          </button>

          <div className="flex items-center gap-2">
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700"
              value={dayjs(date).month()}
              onChange={({ target: { value: monthValue } }) =>
                changeMonth(Number(monthValue))
              }
            >
              {thaiMonths.map((month, monthIndex) => (
                <option key={month} value={monthIndex}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="rounded-md border border-gray-300 bg-white px-2 py-1 text-sm text-gray-700"
              value={dayjs(date).year()}
              onChange={({ target: { value: yearValue } }) =>
                changeYear(Number(yearValue))
              }
            >
              {calendarYears.map((yearValue) => (
                <option key={yearValue} value={yearValue}>
                  {yearValue + 543}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            className="h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-600 shadow-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            {">"}
          </button>
        </div>
      )}
    />
  );
}

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
                        onClick={() => console.log("View sale detail:", item.id)}
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
