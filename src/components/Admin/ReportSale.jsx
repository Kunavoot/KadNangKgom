import React, { useMemo, useState } from "react";

const reportSources = {
  group: {
    label: "กลุ่มสังกัด",
    rows: ["ไก่", "ม้า", "หนอน", "นก", "ปลา"],
  },
  product: {
    label: "ประเภทสินค้า",
    rows: ["อาหาร", "เครื่องดื่ม", "เสื้อผ้า", "พืชสมุนไพร", "ของทำมือ"],
  },
};

const amountTemplate = {
  day: 30000,
  week: 60000,
  month: 240000,
  year: 2880000,
};

const reportTypes = [
  { key: "group", text: "กลุ่มสังกัด" },
  { key: "product", text: "ประเภทสินค้า" },
];

function ReportSale() {
  const [activeType, setActiveType] = useState("group");

  const activeReport = reportSources[activeType];

  const rows = useMemo(
    () =>
      activeReport.rows.map((name) => ({
        name,
        ...amountTemplate,
      })),
    [activeReport],
  );

  const totals = useMemo(
    () =>
      rows.reduce(
        (acc, row) => ({
          day: acc.day + row.day,
          week: acc.week + row.week,
          month: acc.month + row.month,
          year: acc.year + row.year,
        }),
        { day: 0, week: 0, month: 0, year: 0 },
      ),
    [rows],
  );

  const formatBaht = (amount) => `${amount.toLocaleString("th-TH")} บาท`;

  const handlePrint = () => {
    const popup = window.open("", "_blank", "width=1024,height=768");
    if (!popup) {
      window.print();
      return;
    }

    const rowMarkup = rows
      .map(
        (row) => `
          <tr>
            <td>${row.name}</td>
            <td>${formatBaht(row.day)}</td>
            <td>${formatBaht(row.week)}</td>
            <td>${formatBaht(row.month)}</td>
            <td>${formatBaht(row.year)}</td>
          </tr>
        `,
      )
      .join("");

    popup.document.write(`
      <html>
        <head>
          <title>พิมพ์รายงานยอดขาย</title>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: "Noto Sans Thai Looped", sans-serif;
              margin: 24px;
              color: #111;
            }
            h1 {
              margin: 0 0 16px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th,
            td {
              border: 1px solid #c9c9c9;
              text-align: center;
              padding: 10px;
            }
          </style>
        </head>
        <body>
          <h1>ยอดขาย (${activeReport.label})</h1>
          <table>
            <thead>
              <tr>
                <th>${activeReport.label}</th>
                <th>รายวัน</th>
                <th>รายสัปดาห์</th>
                <th>รายเดือน</th>
                <th>รายปี</th>
              </tr>
            </thead>
            <tbody>${rowMarkup}</tbody>
            <tfoot>
              <tr>
                <td>รวม</td>
                <td>${formatBaht(totals.day)}</td>
                <td>${formatBaht(totals.week)}</td>
                <td>${formatBaht(totals.month)}</td>
                <td>${formatBaht(totals.year)}</td>
              </tr>
            </tfoot>
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

  return (
    <div className="w-full">
      <div className="flex flex-col gap-3 py-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="text-2xl font-bold">ยอดขาย</div>

        <div className="flex flex-wrap items-center justify-start gap-3 xl:justify-center">
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

        <div className="flex justify-start xl:justify-end">
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
            พิมพ์รายงาน
          </button>
        </div>
      </div>

      <div className="overflow-x-auto pb-4">
        <table className="table min-w-[900px]">
          <thead>
            <tr className="bg-[#71FF7A]">
              <th className="text-center">{activeReport.label}</th>
              <th className="text-center">รายวัน</th>
              <th className="text-center">รายสัปดาห์</th>
              <th className="text-center">รายเดือน</th>
              <th className="text-center">รายปี</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name} className="hover:bg-gray-100">
                <td className="text-center">{row.name}</td>
                <td className="text-center">{formatBaht(row.day)}</td>
                <td className="text-center">{formatBaht(row.week)}</td>
                <td className="text-center">{formatBaht(row.month)}</td>
                <td className="text-center">{formatBaht(row.year)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-[#71FF7A]">
              <td className="text-center font-medium">รวม</td>
              <td className="text-center font-medium">{formatBaht(totals.day)}</td>
              <td className="text-center font-medium">{formatBaht(totals.week)}</td>
              <td className="text-center font-medium">{formatBaht(totals.month)}</td>
              <td className="text-center font-medium">{formatBaht(totals.year)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default ReportSale;
