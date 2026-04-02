import React, { forwardRef } from "react";
import dayjs from "dayjs";
import buddhistEra from "dayjs/plugin/buddhistEra";
import "dayjs/locale/th";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

dayjs.extend(buddhistEra);
dayjs.locale("th");

export const thaiMonths = Array.from({ length: 12 }, (_, monthIndex) =>
  dayjs().month(monthIndex).format("MMMM"),
);

export const currentYear = dayjs().year();
export const calendarYears = Array.from(
  { length: 121 },
  (_, index) => currentYear - 60 + index,
);

export const toDate = (dateValue) => {
  if (!dateValue) return null;
  const parsed = dayjs(dateValue);
  return parsed.isValid() ? parsed.toDate() : null;
};

export const toStorageDate = (dateValue) => {
  if (!dateValue) return "";
  return dayjs(dateValue).format("YYYY-MM-DD");
};

export const toThaiDisplayDate = (dateValue) => {
  if (!dateValue) return "-";
  return dayjs(dateValue).format("DD/MM/BBBB");
};

const DateInput = forwardRef(({ value, onClick, placeholder, disabled, className }, ref) => {
  const baseClasses = "flex h-10 w-full items-center justify-between rounded-sm border px-4 text-left text-sm transition focus:outline-none";
  const defaultFocus = className ? "" : "focus:ring-2 focus:ring-gray-200";
  const stateClasses = disabled
    ? "cursor-not-allowed border-gray-200 bg-gray-200 text-gray-500"
    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400";

  return (
  <button
    type="button"
    ref={ref}
    onClick={onClick}
    disabled={disabled}
    className={`${baseClasses} ${defaultFocus} ${stateClasses} ${className || ""}`}
  >
    <span className={value ? (disabled ? "text-gray-500" : "text-gray-700") : "text-gray-400"}>
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
  );
});

DateInput.displayName = "DateInput";

export function BuddhistDatePicker({ value, onChange, minDate, maxDate, placeholder, disabled, className }) {
  const selectedDate = toDate(value);

  const getDayClassName = (date) => {
    if (!minDate && !maxDate) return undefined;
    
    const dDate = dayjs(date);
    const isSelected = selectedDate && dDate.isSame(dayjs(selectedDate), "day");
    
    if (isSelected) return undefined;

    let isSelectable = true;
    if (minDate) isSelectable = isSelectable && (dDate.isSame(dayjs(minDate), "day") || dDate.isAfter(dayjs(minDate), "day"));
    if (maxDate) isSelectable = isSelectable && (dDate.isSame(dayjs(maxDate), "day") || dDate.isBefore(dayjs(maxDate), "day"));
    
    // Highlight the selectable dates within the bounded range
    return isSelectable ? "!bg-blue-50 !text-blue-700 !font-semibold !rounded-full hover:!bg-blue-100" : undefined;
  };

  return (
    <DatePicker
      disabled={disabled}
      selected={selectedDate}
      onChange={(date) => onChange(toStorageDate(date))}
      minDate={minDate || undefined}
      maxDate={maxDate || undefined}
      dayClassName={getDayClassName}
      shouldCloseOnSelect
      popperPlacement="bottom-start"
      calendarClassName="buddhist-datepicker"
      wrapperClassName="w-full"
      customInput={<DateInput placeholder={placeholder} disabled={disabled} className={className} />}
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

export const formatCurrency = (value) => {
  if (!value) return "0.00";
  // ลบ comma เดิมออกก่อนแปลงเป็นตัวเลข เพื่อป้องกันค่าผิดเพี้ยน
  const stringValue = String(value).replace(/,/g, "");
  const numberValue = parseFloat(stringValue);
  if (isNaN(numberValue)) return "0.00";

  return numberValue.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true, // บังคับให้ใส่ comma
  });
};

export const formatReportPeriod = (period, type) => {
  if (!period) return "-";

  if (type === "day") {
    return dayjs(period).format("DD/MM/BBBB");
  } else if (type === "week") {
    // แยกกรณีช่วงวัน "YYYY-MM-DD - YYYY-MM-DD"
    const dates = String(period).split(" - ");
    if (dates.length === 2) {
      return `${dayjs(dates[0]).format("DD/MM/BBBB")} - ${dayjs(dates[1]).format("DD/MM/BBBB")}`;
    }
    return dayjs(period).format("DD/MM/BBBB");
  } else if (type === "month") {
    return dayjs(period).format("MM/BBBB");
  } else if (type === "year") {
    return dayjs(period).format("BBBB");
  }

  return period;
};
