import { useMemo, useState, useEffect } from "react";
import Loading from "../Loading";
import axios from "axios";
import { formatCurrency, toThaiDisplayDateTime } from "../../utils/utils";
import { useAuth } from "../../service/AuthContext";
import Swal from "sweetalert2";

function Report3Shop() {
  const { user } = useAuth();
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
    let iframe = document.getElementById("print-iframe");
    if (!iframe) {
      iframe = document.createElement("iframe");
      iframe.id = "print-iframe";
      iframe.style.position = "absolute";
      iframe.style.top = "-10000px";
      iframe.style.left = "-10000px";
      iframe.style.width = "0";
      iframe.style.height = "0";
      iframe.style.border = "none";
      document.body.appendChild(iframe);
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

    // ข้อมูลสำหรับรายงาน
    const printDate = toThaiDisplayDateTime(new Date().toISOString());
    const yearText = `ปี ${parseInt(selectedYear) + 543}`;
    const monthText = `${months.find((m) => m.key == selectedMonth)?.label}`;
    const dayLabel = days.find((d) => d.key === selectedDay)?.label || "";
    const periodText = `ประจำเดือน${monthText} ${yearText} (${dayLabel})`;

    let rowMarkup = "";
    if (!rows || rows.length === 0) {
      rowMarkup = "<tr><td colspan='3' class='text-center'>ไม่พบข้อมูล</td></tr>";
    } else {
      rows.forEach((groupEntry) => {
        rowMarkup += `
          <tr>
            <td rowspan="3" style="vertical-align: middle; border: 1px solid #000; text-align: center;">${groupEntry.group}</td>
            <td class="text-start" style="border: 1px solid #000; padding-left: 10px;">1. ${groupEntry.shops[0].shop_name}</td>
            <td class="text-end" style="border: 1px solid #000; padding-right: 10px;">${formatCurrency(groupEntry.shops[0].month_amount)}</td>
          </tr>
          <tr>
            <td class="text-start" style="border: 1px solid #000; padding-left: 10px;">2. ${groupEntry.shops[1].shop_name}</td>
            <td class="text-end" style="border: 1px solid #000; padding-right: 10px;">${formatCurrency(groupEntry.shops[1].month_amount)}</td>
          </tr>
          <tr>
            <td class="text-start" style="border: 1px solid #000; padding-left: 10px;">3. ${groupEntry.shops[2].shop_name}</td>
            <td class="text-end" style="border: 1px solid #000; padding-right: 10px;">${formatCurrency(groupEntry.shops[2].month_amount)}</td>
          </tr>
        `;
      });
    }

    iframeDoc.open();
    iframeDoc.write(`
      <html>
        <head>
          <title>พิมพ์รายงาน ร้านค้ายอดนิยม 3 อันดับ</title>
          <meta charset="utf-8" />
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap" rel="stylesheet">
          <script src="https://unpkg.com/pagedjs/dist/paged.polyfill.js" defer></script>
          <style>
            @page {
              size: portrait;
              margin: 1.5cm;
              @top-right {
                content: "หน้าที่ " counter(page) " / " counter(pages);
                font-family: 'Sarabun', sans-serif;
                font-size: 11px;
                font-weight: normal;
              }
            }
            @page {
              margin-top: 1.5cm;
              margin-bottom: 1.5cm;
            }
            body {
              font-family: 'Sarabun', sans-serif;
              color: #000;
              font-size: 14px;
              margin: 0;
              padding: 0;
            }
            .report-container {
              width: 100%;
              position: relative;
              /* เผื่อพื้นที่ด้านล่างสำหรับลายเซ็นต์ */
              padding-bottom: 4cm;
            }
            .report-header {
              text-align: center;
              margin-bottom: 30px;
              position: relative;
            }
            .report-header h1 {
              font-size: 22px;
              margin: 0 0 5px;
              font-weight: bold;
            }
            .report-header h3 {
              font-size: 18px;
              margin: 0 0 5px;
              font-weight: bold;
            }
            .company-info {
              display: flex;
              justify-content: space-between;
              align-items: end;
              margin-bottom: 10px;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
              border: 1px solid #000;
            }
            th {
              border: 1px solid #000;
              padding: 10px 5px;
              font-weight: bold;
              text-align: center;
            }
            td {
              padding: 8px 5px;
            }
            tr {
              break-inside: avoid;
            }
            .text-start { text-align: left; }
            .text-center { text-align: center; }
            .text-end { text-align: right; }
            .footer-signature {
              position: absolute;
              bottom: 0;
              right: 0;
              display: flex;
              flex-direction: column;
              align-items: center;
              width: 250px;
            }
            .signature-name {
              width: 250px;
              text-align: center;
              margin-top: 5px;
            }
            .pagedjs_margin-top-right > .pagedjs_margin-content {
              text-align: right;
            }
          </style>
          <script>
            window.PagedConfig = {
              auto: true,
              after: (flow) => {
                setTimeout(() => {
                  window.print();
                  window.onafterprint = function() {
                    if (window.frameElement) {
                      window.frameElement.parentNode.removeChild(window.frameElement);
                    }
                  };
                }, 800);
              }
            };
          </script>
        </head>
        <body>
          <div class="report-container">
            <div class="report-header">
              <h1>รายงานยอดขาย</h1>
              <h3>ร้านค้ายอดนิยม 3 อันดับ</h3>
              <div class="period-text">${periodText}</div>
            </div>
            
            <div class="company-info">
              <div style="text-align: left;">
                <p>กาดนั้งก้อม หนองกระทิง</p>
                <p>ตำบล บ่อแฮ้ว อำเภอ เมืองลำปาง จังหวัด ลำปาง 52100</p>
              </div>
              <div style="text-align: right;">
                <p>วันที่พิมพ์: ${printDate}</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 20%;">กลุ่มสังกัด</th>
                  <th style="width: 50%;">ชื่อร้านค้า</th>
                  <th style="width: 30%;">ยอดขายรายเดือน</th>
                </tr>
              </thead>
              <tbody>
                ${rowMarkup}
              </tbody>
            </table>

            <div class="footer-signature">
              <div>(ลงชื่อ)............................................................</div>
              <div class="signature-name">( ${user?.fullname || "ไม่พบข้อมูล"} )</div>
              <div style="margin-top: 5px; width: 250px; text-align: center;">ผู้จัดทำ</div>
            </div>
          </div>
        </body>
      </html>
    `);
    iframeDoc.close();
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
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้",
        timer: 1500,
        showConfirmButton: false,
      });
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
            {rows.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  ไม่พบข้อมูล
                </td>
              </tr>
            ) : rows.map((groupEntry) => (
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
