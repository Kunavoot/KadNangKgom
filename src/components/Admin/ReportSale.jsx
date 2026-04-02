import { useMemo, useState, useEffect, Fragment } from "react";
import Loading from "../Loading";
import axios from "axios";
import { formatCurrency, formatReportPeriod, BuddhistDatePicker, toThaiDisplayDate } from "../../utils/utils";
import { useAuth } from "../../service/AuthContext";

const reportTypes = [
  { key: "data_group", text: "กลุ่มสังกัด" },
  { key: "data_ptype", text: "ประเภทสินค้า" },
];

const days = [
  { key: "1", label: "เสาร์" },
  { key: "2", label: "อาทิตย์" },
  { key: "3", label: "เสาร์-อาทิตย์" },
];

function ReportSale() {
  const { user } = useAuth();
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const [activeType, setActiveType] = useState("data_group");
  const [selectedReportType, setSelectedReportType] = useState("day");
  const [selectedSellDay, setSelectedSellDay] = useState("3");
  const [selectedStartDate, setSelectedStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedEndDate, setSelectedEndDate] = useState(new Date().toISOString().split("T")[0]);

  // ข้อมูล
  const [reportSale, setReportSale] = useState([]);

  const activeLabelText =
    reportTypes.find((t) => t.key === activeType)?.text || "";

  const totals = useMemo(() => {
    return reportSale.reduce((sum, periodData) => {
      const items = periodData[activeType] || [];
      return sum + items.reduce((acc, item) => acc + (item.amount || 0), 0);
    }, 0);
  }, [reportSale, activeType]);

  const handlePrint = () => {
    const popup = window.open("", "_blank", "width=1024,height=768");
    if (!popup) {
      window.print();
      return;
    }

    const printDate = toThaiDisplayDate(new Date().toISOString());
    const reportTypeText = 
      selectedReportType === "day" ? "รายวัน" :
      selectedReportType === "week" ? "รายสัปดาห์" :
      selectedReportType === "month" ? "รายเดือน" :
      selectedReportType === "year" ? "รายปี" : "";

    const dayLabel = days.find(d => d.key === selectedSellDay)?.label || "";
    const periodText = `ประจำวันที่ ${toThaiDisplayDate(selectedStartDate)} ถึง ${toThaiDisplayDate(selectedEndDate)} (${dayLabel})`;

    let rowMarkup = "";
    reportSale.forEach((periodData) => {
      const formattedDate = formatReportPeriod(periodData.period, selectedReportType);
      
      // สร้างหัวข้อแถวแรกของ period
      let periodHeaderPrefix = "รายงานยอดขาย";
      if (selectedReportType === "day") periodHeaderPrefix = "รายงานยอดขายประจำวันที่";
      else if (selectedReportType === "week") periodHeaderPrefix = "รายงานยอดขายรอบวันที่";
      else if (selectedReportType === "month") periodHeaderPrefix = "รายงานยอดขายประจำเดือน";
      else if (selectedReportType === "year") periodHeaderPrefix = "รายงานยอดขายประจำปี";

      rowMarkup += `
        <tr style="font-weight: bold; text-decoration: underline;">
          <td colspan="2" class="text-start">${periodHeaderPrefix} ${formattedDate}</td>
        </tr>
      `;

      periodData[activeType].forEach((item) => {
        rowMarkup += `
          <tr>
            <td class="text-start" style="padding-left: 20px;">${item.name}</td>
            <td class="text-end">${formatCurrency(item.amount)}</td>
          </tr>
        `;
      });
    });

    popup.document.write(`
      <html>
        <head>
          <title>พิมพ์รายงานยอดขาย</title>
          <meta charset="utf-8" />
          <link href="https://fonts.googleapis.com/css2?family=Sarabun:wght@400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @page {
              size: portrait;
              margin: 1.5cm;
            }
            body {
              font-family: 'Sarabun', sans-serif;
              margin: 20px;
              color: #000;
              font-size: 14px;
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
            .company-info {
              display: flex;
              justify-content: space-between;
              align-items: end;
              margin-bottom: 0px;
              font-size: 12px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 14px;
            }
            th {
              border-top: 1px solid #000;
              border-bottom: 1px solid #000;
              padding: 10px 5px;
              font-weight: bold;
              text-align: center;
            }
            td {
              padding: 8px 5px;
            }
            .text-start { text-align: left; }
            .text-center { text-align: center; }
            .text-end { text-align: right; }
            
            .footer-signature {
              margin-top: 60px;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              padding-right: 40px;
            }
            .signature-line {
              margin-top: 40px;
              border-bottom: 1px dotted #000;
              width: 250px;
              text-align: center;
            }
            .signature-name {
              width: 250px;
              text-align: center;
              margin-top: 5px;
            }

            @media print {
              .no-print { display: none; }
              tr { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <div class="print-date"></div>
            <h1>รายงานยอดขาย${reportTypeText}</h1>
            <div class="period-text">${periodText}</div>
          </div>
          
          <div class="company-info">
            <div style="text-align: left;">
              <p>กาดนั้งก้อม หนองกระทิง</p>
              <p>ตำบล บ่อแฮ้ว อำเภอ เมืองลำปาง จังหวัด ลำปาง 52100</p>
            </div>
            <div style="text-align: right;">
              <p>หน้าที่ 1/1</p>
              <p>วันที่พิมพ์: ${printDate}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width: 70%; text-align: left;">${activeLabelText}</th>
                <th style="width: 30%; text-align: right;">ยอดขาย</th>
              </tr>
            </thead>
            <tbody>
              ${rowMarkup}
            </tbody>
            <tfoot>
              <tr style="border-top: 2px solid #000; border-bottom: 2px solid #000; font-weight: bold;">
                <td class="text-center">รวมทั้งสิ้น</td>
                <td class="text-end">${formatCurrency(totals)}</td>
              </tr>
            </tfoot>
          </table>

          <div class="footer-signature">
            <div>(ลงชื่อ)............................................................</div>
            <div class="signature-name">( ${user?.name || user?.username || "เจ้าหน้าที่"} )</div>
            <div style="margin-top: 5px; width: 250px; text-align: center;">ผู้จัดทำ</div>
          </div>

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

  const getReportSale = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getReportSale",
        {
          params: {
            report_type: selectedReportType,
            sell_day: selectedSellDay,
            start_date: selectedStartDate.split("T")[0],
            end_date: selectedEndDate.split("T")[0],
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
    getReportSale();
  }, [selectedReportType, selectedSellDay, selectedStartDate, selectedEndDate]);

  return (
    <>
      {isLoading && <Loading />}

      <div className="w-full">
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-row items-center justify-between">
            <div className="text-2xl font-bold">ยอดขาย</div>
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
            <div className="flex flex-wrap items-center justify-start gap-4">
              <span className="font-semibold text-lg hidden sm:block">
                ประเภทรายงาน
              </span>
              {reportTypes.map((type) => {
                const isActive = activeType === type.key;
                return (
                  <button
                    key={type.key}
                    type="button"
                    className={`btn min-h-11 h-11 rounded-2xl px-8 text-base font-medium shadow-none ${
                      isActive
                        ? "bg-[#95E49B] border-[#95E49B] hover:bg-[#85d98d] hover:border-[#85d98d]"
                        : "bg-white border-[#95E49B] hover:bg-[#e8f9ea] hover:border-[#95E49B]"
                    }`}
                    onClick={() => setActiveType(type.key)}
                  >
                    {type.text}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-lg mr-2 hidden sm:block">
                ตัวกรองข้อมูล
              </span>

              <div className="flex items-center gap-2">
                <label className="font-medium whitespace-nowrap">
                  ประเภทรายงาน
                </label>
                <select
                  className="select select-bordered min-h-11 h-11 w-30 rounded-xl bg-white"
                  value={selectedReportType}
                  onChange={(e) => setSelectedReportType(e.target.value)}
                >
                  <option disabled value="">
                    เลือกประเภทรายงาน
                  </option>
                  <option value="day">รายวัน</option>
                  <option value="week">รายสัปดาห์</option>
                  <option value="month">รายเดือน</option>
                  <option value="year">รายปี</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <label className="font-medium whitespace-nowrap">
                  วันที่ขาย
                </label>
                <select
                  className="select select-bordered min-h-11 h-11 w-30 rounded-xl bg-white"
                  value={selectedSellDay}
                  onChange={(e) => setSelectedSellDay(e.target.value)}
                >
                  {days.map((d) => (
                    <option key={d.key} value={d.key}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <label className="font-medium whitespace-nowrap pr-2">
                  วันที่
                </label>
                <BuddhistDatePicker
                  value={selectedStartDate}
                  onChange={setSelectedStartDate}
                  className="w-45"
                />
              </div>

              <div className="flex items-center">
                <label className="font-medium whitespace-nowrap pr-2">
                  ถึงวันที่
                </label>
                <BuddhistDatePicker
                  value={selectedEndDate}
                  onChange={setSelectedEndDate}
                  minDate={selectedStartDate}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto max-h-120 pb-4">
          <table className="table min-w-[900px] border-collapse">
            <thead className="sticky top-0">
              <tr className="bg-[#71FF7A]">
                <th className="w-[70%] text-center">{activeLabelText}</th>
                <th className="w-[30%] text-center">จำนวนเงิน</th>
              </tr>
            </thead>
            <tbody className="border-none">
              {reportSale.map((periodData, pIndex) => (
                <Fragment key={pIndex}>
                  <tr className="bg-gray-100 font-bold border-b-2 border-gray-300">
                    <td colSpan="2" className="text-left py-2">
                       รอบ/วันที่: {formatReportPeriod(periodData.period, selectedReportType)}
                        </td>
                  </tr>
                  {periodData[activeType].map((item, iIndex) => (
                    <tr key={`${pIndex}-${iIndex}`} className="hover:bg-gray-50 border-b border-gray-100">
                      <td className="text-center py-2">{item.name}</td>
                      <td className="text-end py-2 pr-10">
                        {formatCurrency(item.amount)}
                        </td>
                      </tr>
                  ))}
                </Fragment>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#71FF7A]">
                <td className="text-center font-bold">รวม</td>
                <td className="text-end font-bold pr-10">
                  {formatCurrency(totals)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
}

export default ReportSale;
