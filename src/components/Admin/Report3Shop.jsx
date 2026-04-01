import { useMemo, useState, useEffect } from "react";
import Loading from "../Loading";
import axios from "axios";
import { formatCurrency, BuddhistDatePicker } from "../../utils/utils";

function Report3Shop() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState("3");

  // ข้อมูล
  const [reportSale, setReportSale] = useState(null);

  const currentYear = new Date().getFullYear();
  const years = [...Array.from({ length: 5 }, (_, i) => currentYear - i)];
  const months = [
    { key: "1", label: "มกราคม" },
    { key: "2", label: "กุมภาพันธ์" },
    { key: "3", label: "มีนาคม" },
    { key: "4", label: "เมษายน" },
    { key: "5", label: "พฤษภาคม" },
    { key: "6", label: "มิถุนายน" },
    { key: "7", label: "กรกฎาคม" },
    { key: "8", label: "สิงหาคม" },
    { key: "9", label: "กันยายน" },
    { key: "10", label: "ตุลาคม" },
    { key: "11", label: "พฤศจิกายน" },
    { key: "12", label: "ธันวาคม" },
  ];
  const days = [
    { key: "1", label: "เสาร์" },
    { key: "2", label: "อาทิตย์" },
    { key: "3", label: "เสาร์-อาทิตย์" },
  ];

  const rows = useMemo(() => {
    console.log(reportSale);
    return reportSale || [];
  }, [reportSale]);

  const handlePrint = () => {
    const popup = window.open("", "_blank", "width=1024,height=768");
    if (!popup) {
      window.print();
      return;
    }

    const yearText = `ปี ${parseInt(selectedYear) + 543}`;
    const monthText = `เดือน${months.find((m) => m.key == selectedMonth)?.label}`;
    const dayText = `วัน${days.find((d) => d.key === selectedDay)?.label}`;

    const subHeaderText = `ประจำ${monthText} ${yearText} (${dayText})`;

    const rowMarkup = rows
      .map((groupEntry, index) => {
        const isPageBreak = (index + 1) % 5 === 0 && index !== rows.length - 1;
        return `
          <tr>
            <td rowspan="3">${groupEntry.group}</td>
            <td class="text-start">1. ${groupEntry.shops[0].shop_name}</td>
            <td class="text-end">${formatCurrency(groupEntry.shops[0].week_amount)}</td>
            <td class="text-end">${formatCurrency(groupEntry.shops[0].month_amount)}</td>
            <td class="text-end">${formatCurrency(groupEntry.shops[0].year_amount)}</td>
          </tr>
          <tr>
            <td class="text-start">2. ${groupEntry.shops[1].shop_name}</td>
            <td class="text-end">${formatCurrency(groupEntry.shops[1].week_amount)}</td>
            <td class="text-end">${formatCurrency(groupEntry.shops[1].month_amount)}</td>
            <td class="text-end">${formatCurrency(groupEntry.shops[1].year_amount)}</td>
          </tr>
          <tr class="${isPageBreak ? "page-break" : ""}">
            <td class="text-start">3. ${groupEntry.shops[2].shop_name}</td>
            <td class="text-end">${formatCurrency(groupEntry.shops[2].week_amount)}</td>
            <td class="text-end">${formatCurrency(groupEntry.shops[2].month_amount)}</td>
            <td class="text-end">${formatCurrency(groupEntry.shops[2].year_amount)}</td>
          </tr>
        `;
      })
      .join("");

    popup.document.write(`
      <html>
        <head>
          <title>พิมพ์รายงาน ร้านค้ายอดนิยม 3 อันดับ</title>
          <meta charset="utf-8" />
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            body {
              font-family: 'Sarabun', sans-serif;
              margin: 40px;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .header h1 {
              font-size: 24px;
              margin: 0 0 10px;
              color: #000;
            }
            .header p {
              font-size: 16px;
              margin: 0;
              color: #555;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              text-align: center;
              padding: 12px;
              font-size: 14px;
            }
            th {
              background-color: #f4f4f4;
              color: #333;
              font-weight: 600;
            }
            @media print {
              body {
                margin: 0;
                padding: 20px;
              }
              @page {
                margin: 1cm;
              }
              .page-break {
                page-break-after: always;
                break-after: page;
              }
            }
            .text-start {
              text-align: start;
            }
            .text-end {
              text-align: end;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>รายงานยอดขาย</h1>
            <h3>ร้านค้ายอดนิยม 3 อันดับ</h3>
            <p>${subHeaderText}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 20%;">กลุ่มสังกัด</th>
                <th style="width: 20%;">ชื่อร้านค้า</th>
                <th style="width: 20%;">รายสัปดาห์</th>
                <th style="width: 20%;">รายเดือน</th>
                <th style="width: 20%;">รายปี</th>
              </tr>
            </thead>
            <tbody>${rowMarkup}</tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
        </body>
      </html>
    `);

    popup.document.close();
  };

  const getReport3Shop = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getReport3Shop",
        {
          params: {
            year: selectedYear,
            month: selectedMonth,
            sell_day: selectedDay,
          },
        },
      );
      setReportSale(response.data.data);
    } catch (error) {
      console.error("Error fetching report sale:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getReport3Shop();
  }, [selectedYear, selectedMonth, selectedDay]);

  return (
    <>
      {isLoading && <Loading />}

      <div className="w-full">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-row items-center justify-between">
            <div className="text-2xl font-bold">ร้านค้ายอดนิยม 3 อันดับ</div>
            <button
              type="button"
              className="btn min-h-11 h-11 rounded-2xl border-2 border-[#ff7f7f] bg-white px-6 text-base font-medium text-black shadow-none hover:bg-[#fff2f2] hover:border-[#ff6b6b]"
              onClick={handlePrint}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M6 7V3h12v4h2a2 2 0 0 1 2 2v7h-4v5H6v-5H2V9a2 2 0 0 1 2-2h2Zm10-2H8v2h8V5Zm0 10H8v4h8v-4Zm2-2h2V9h-2v4Z" />
              </svg>
              <span className="hidden sm:inline">พิมพ์รายงาน</span>
            </button>
          </div>

          <div className="flex flex-col gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-lg mr-2 hidden sm:block">
                ตัวกรองข้อมูล
              </span>

              <div className="flex items-center gap-2">
                <label className="font-medium whitespace-nowrap">วันที่ขาย</label>
                <select
                  className="select select-bordered min-h-11 h-11 w-30 rounded-xl bg-white"
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {days.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-medium whitespace-nowrap">ปี</label>
                <select
                  className="select select-bordered min-h-11 h-11 w-30 rounded-xl bg-white"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {parseInt(y) + 543}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-medium whitespace-nowrap">เดือน</label>
                <select
                  className="select select-bordered min-h-11 h-11 w-30 rounded-xl bg-white"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {months.map((m) => (
                    <option key={m.key} value={m.key}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-120 pb-4">
          <table className="table min-w-[900px] border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-[#71FF7A]">
                <th className="w-[20%] text-center">กลุ่มสังกัด</th>
                <th className="w-[20%] text-center">ชื่อร้านค้า</th>
                <th className="w-[20%] text-center">รายเดือน</th>
              </tr>
            </thead>
            {rows.map((groupEntry) => (
              <tbody key={groupEntry.group} className="group border-none">
                <tr className="border-b border-gray-100 group-hover:bg-gray-100">
                  <td
                    className="border-b border-gray-100 text-start align-middle"
                    rowSpan={3}
                  >
                    {groupEntry.group}
                  </td>
                  <td className="border-b border-gray-100 text-start">
                    1. {groupEntry.shops[0].shop_name}
                  </td>
                  <td className="border-b border-gray-100 text-end">
                    {formatCurrency(groupEntry.shops[0].month_amount)}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 group-hover:bg-gray-100">
                  <td className="border-b border-gray-100 text-start">
                    2. {groupEntry.shops[1].shop_name}
                  </td>
                  <td className="border-b border-gray-100 text-end">
                    {formatCurrency(groupEntry.shops[1].month_amount)}
                  </td>
                </tr>
                <tr className="border-b border-gray-100 group-hover:bg-gray-100">
                  <td className="border-b border-gray-100 text-start">
                    3. {groupEntry.shops[2].shop_name}
                  </td>
                  <td className="border-b border-gray-100 text-end">
                    {formatCurrency(groupEntry.shops[2].month_amount)}
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </>
  );
}

export default Report3Shop;
