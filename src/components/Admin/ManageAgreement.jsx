import { useMemo, useState, useEffect } from "react";
import dayjs from "dayjs";
import Loading from "../Loading";
import axios from "axios";
import {
  BuddhistDatePicker,
  toDate,
  toThaiDisplayDate,
} from "../../utils/utils.jsx";
import Swal from "sweetalert2";
import { useAuth } from "../../service/AuthContext.jsx";

function ManageAgreement() {
  // จัดการหน้าเว็บ
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState("list");
  
  // ข้อมูล
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [agreement_summary, setAgreement_Summary] = useState([]);
  const [agreement_detail, setAgreement_Detail] = useState([]);
  const [agreement_list, setAgreement_List] = useState([]);
  const [selectedGroupId, setSelectedGroupId] = useState([]);
  const [selectedStall, setSelectedStall] = useState([]);
  const [filterDate, setFilterDate] = useState(dayjs().format("YYYY-MM-DD"));
  const sellDays = [
    { id: "1", name: "เสาร์" },
    { id: "2", name: "อาทิตย์" },
    { id: "3", name: "เสาร์-อาทิตย์" },
  ];
  const [formData, setFormData] = useState({
    agmt_market: "",
    group_id: "",
    group_name: "",
    agmt_trader: "",
    agmt_admin: "",
    agmt_status: "",
    agmt_start: "",
    agmt_end: "",
  });
  const [groupFilter, setGroupFilter] = useState({
    status: "3",
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: dayjs().add(1, "month").format("YYYY-MM-DD"),
  });

  const selectedGroup = useMemo(
    () => groups.find((group) => group.group_id === selectedGroupId) || null,
    [groups, selectedGroupId],
  );

  const sellDate = (status) => {
    if (status === "1") {
      return "เสาร์";
    } else if (status === "2") {
      return "อาทิตย์";
    } else if (status === "3") {
      return "เสาร์-อาทิตย์";
    }
  };

  const handleOpenGroup = (groupId) => {
    setSelectedGroupId(groupId);
    setSelectedStall([]);
    setView("group");
  };

  const handleCloseGroup = () => {
    setSelectedGroupId([]);
    setSelectedStall([]);
    setGroupFilter({
      status: "",
      startDate: "",
      endDate: "",
    });
    setAgreement_Detail([]);
    setAgreement_List([]);
    getAgreement_Summary();
    setView("list");
  };

  const handleOpenForm = (stall, group, filter) => {
    setSelectedStall(stall);
    console.log(stall);
    console.log("id", user.id);
    console.log("filter", filter);

    if (stall.market_rented === "1") {
      Swal.fire({
        icon: "error",
        title: "ล็อคนี้ถูกเช่าแล้ว",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      return;
    }
    setFormData({
      agmt_market: stall?.market_id || "",
      group_id: group?.group_id || "",
      group_name: group?.group_name || "",
      agmt_trader: "",
      agmt_admin: user?.id || "",
      agmt_status: filter?.status || "",
      agmt_start: filter?.startDate || "",
      agmt_end: filter?.endDate || "",
    });
    setView("form");
  };

  const handleBackFromForm = () => {
    setSelectedStall([]);
    setView("group");
    return;
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, value) => {
    setFormData((prev) => {
      if (name === "agmt_start") {
        const shouldResetEndDate =
          prev.agmt_end && value && dayjs(prev.agmt_end).isBefore(dayjs(value));
        return {
          ...prev,
          agmt_start: value,
          agmt_end: shouldResetEndDate ? "" : prev.agmt_end,
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleGroupFilterChange = (name, value) => {
    setGroupFilter((prev) => {
      if (name === "startDate") {
        const shouldResetEndDate =
          prev.endDate && value && dayjs(prev.endDate).isBefore(dayjs(value));
        return {
          ...prev,
          startDate: value,
          endDate: shouldResetEndDate ? "" : prev.endDate,
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleShowGroupData = () => {
    try {
      if (
        !selectedGroupId ||
        !groupFilter.status ||
        !groupFilter.startDate ||
        !groupFilter.endDate
      ) {
        Swal.fire({
          icon: "error",
          title: "กรุณาระบุข้อมูลให้ครบถ้วน",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
        return;
      }
      setIsLoading(true);
      getAgreement_Detail();
      getAgreement_List();
    } catch (error) {
      console.error("Error fetching agreement detail:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidate = () => {
    for (const item in formData) {
      if (typeof formData[item] === "string") {
        formData[item] = formData[item].trim();
      }
    } // ลบช่องว่างหน้าหลัง
    for (const item in formData) {
      if (formData[item] === "") {
        Swal.fire({
          icon: "error",
          title: "กรุณาระบุข้อมูลให้ครบถ้วน",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
        return false;
      }
    }
    return true;
  };

  const handleSave = async () => {
    if (!handleValidate()) return;
    setIsLoading(true);
    try {
      const response = await axios.post(
        import.meta.env.VITE_API_URL + "/admin/addAgreement",
        formData,
      );
      Swal.fire({
        icon: "success",
        title: response.data.message,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      handleBackFromForm();
    } catch (error) {
      console.error("Error adding agreement:", error);
      Swal.fire({
        icon: "error",
        title: error.response.data.message || "เกิดข้อผิดพลาดในการเพิ่มสัญญา",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
    } finally {
      setIsLoading(false);
      getAgreement_Detail();
      getAgreement_List();
    }
  };

  const handleDelete = async (list) => {
    Swal.fire({
      title: "ยืนยันการยกเลิกสัญญา",
      text: "คุณแน่ใจหรือไม่ว่าต้องการยกเลิกสัญญาเช่าล็อคนี้?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#c2c2c2ff",
      confirmButtonText: "ลบ",
      cancelButtonText: "ยกเลิก",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        try {
          const response = await axios.delete(
            import.meta.env.VITE_API_URL + "/admin/delAgreement",
            {
              params: {
                agmt_id: list.agmt_id,
                agmt_market: list.agmt_market,
              },
            },
          );
          Swal.fire({
            icon: "success",
            title: response.data.message || "ยกเลิกสัญญาสำเร็จ",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#5bc06d",
          });
        } catch (error) {
          console.error("Error deleting agreement:", error);
          Swal.fire({
            icon: "error",
            title:
              error.response.data.message || "เกิดข้อผิดพลาดในการยกเลิกสัญญา",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#5bc06d",
          });
        } finally {
          setIsLoading(false);
          getAgreement_Detail();
          getAgreement_List();
        }
      }
    });
  };

  const getStallClass = (status) => {
    if (status === "1") return "bg-[#ff7d7d]";
    if (status === "0") return "bg-[#a9ff9f]";
    return "bg-[#d9d9d9]";
  };

  const getGroup = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getGroup",
      );
      setGroups(response.data.data);
    } catch (error) {
      console.error("Error fetching group:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAgreement_Summary = async () => {
    try {
      setIsLoading(true);
      const Filter_Date = filterDate || dayjs().format("YYYY-MM-DD");
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getAgreement_Summary",
        {
          params: {
            filterDate: Filter_Date,
          },
        },
      );
      setAgreement_Summary(response.data.data);
    } catch (error) {
      console.error("Error fetching agreement summary:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAgreement_Detail = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getAgreement_Detail",
        {
          params: {
            group_id: selectedGroupId,
            agmt_status: groupFilter.status,
            agmt_start: groupFilter.startDate,
            agmt_end: groupFilter.endDate,
          },
        },
      );
      setAgreement_Detail(response.data.data);
    } catch (error) {
      console.error("Error fetching agreement detail:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAgreement_List = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        import.meta.env.VITE_API_URL + "/admin/getAgreement_List",
        {
          params: {
            group_id: selectedGroupId,
            agmt_status: groupFilter.status,
            agmt_start: groupFilter.startDate,
            agmt_end: groupFilter.endDate,
          },
        },
      );
      setAgreement_List(response.data.data);
    } catch (error) {
      console.error("Error fetching agreement list:", error);
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: error.response?.data?.message || "ไม่สามารถดึงข้อมูลได้",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getGroup();
  }, []);

  useEffect(() => {
    getAgreement_Summary();
  }, [filterDate]);

  return (
    <>
      {isLoading && <Loading />}

      {view === "list" && (
        <>
          <div className="flex items-center justify-between gap-4 pb-6">
            <div className="text-2xl font-bold">จัดการสัญญาเช่า</div>
            <div className="flex items-center w-50 gap-4">
              <BuddhistDatePicker
                value={filterDate}
                onChange={setFilterDate}
                placeholder="เลือกวันที่ค้นหา"
              />
            </div>
          </div>

          <div className="overflow-x-auto mb-12 h-150">
            <table className="table">
              <thead className="sticky top-0">
                <tr className="bg-[#71FF7A]">
                  <th className="text-center">กลุ่มสังกัด</th>
                  <th className="text-center">จำนวนล็อคตลาด</th>
                  <th className="text-center">ว่างวันเสาร์</th>
                  <th className="text-center">ว่างวันอาทิตย์</th>
                  <th className="text-center">ว่างวันเสาร์-อาทิตย์</th>
                  <th className="text-center">เช่าแล้ว</th>
                  <th className="text-center">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {agreement_summary.map((item) => (
                  <tr key={item.group_id} className="hover:bg-gray-100">
                    <td className="text-center">{item.group_name}</td>
                    <td className="text-center">{item.total_stalls}</td>
                    <td className="text-center">{item.available_sat}</td>
                    <td className="text-center">{item.available_sun}</td>
                    <td className="text-center">{item.absolute_available}</td>
                    <td className="text-center">{item.total_rented}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-warning w-20"
                        onClick={() => handleOpenGroup(item.group_id)}
                      >
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === "group" && selectedGroup && (
        <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#8EEA8B] px-6 py-4 flex items-center justify-between">
            <div className="text-3xl font-bold text-green-800">
              สัญญาเช่า : {selectedGroup.group_name}
            </div>
            <button
              className="text-4xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={handleCloseGroup}
            >
              ×
            </button>
          </div>
          <div className="p-8">
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-end">
              <div className="w-full md:w-1/4">
                <label className="label">
                  <span className="label-text text-lg">วันที่ขาย</span>
                </label>
                <select
                  className="select select-bordered w-full h-12"
                  value={groupFilter.status}
                  onChange={(e) =>
                    handleGroupFilterChange("status", e.target.value)
                  }
                >
                  <option value="" disabled>
                    เลือกวันที่ขาย
                  </option>
                  {sellDays.map((day) => (
                    <option key={day.id} value={day.id}>
                      {day.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/4">
                <label className="label">
                  <span className="label-text text-lg">
                    วันที่เริ่มต้นสัญญา
                  </span>
                </label>
                <BuddhistDatePicker
                  value={groupFilter.startDate}
                  onChange={(value) =>
                    handleGroupFilterChange("startDate", value)
                  }
                  placeholder="เลือกวันที่เริ่มต้นสัญญา"
                />
              </div>
              <div className="w-full md:w-1/4">
                <label className="label">
                  <span className="label-text text-lg">วันที่สิ้นสุดสัญญา</span>
                </label>
                <BuddhistDatePicker
                  value={groupFilter.endDate}
                  onChange={(value) =>
                    handleGroupFilterChange("endDate", value)
                  }
                  minDate={toDate(groupFilter.startDate)}
                  placeholder="เลือกวันที่สิ้นสุดสัญญา"
                />
              </div>
              <div className="ml-auto w-1/6">
                <button
                  className="btn bg-[#77e279] border-[#77e279] text-white shadow-sm hover:bg-[#68d56b] hover:border-[#68d56b] w-full h-10 text-lg"
                  onClick={handleShowGroupData}
                >
                  แสดงข้อมูล
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {agreement_detail.map((stall) => (
                <button
                  key={stall.market_id}
                  className={`h-[110px] w-full flex items-center justify-center text-3xl font-medium text-black shadow cursor-pointer ${getStallClass(
                    stall.market_rented,
                  )}`}
                  onClick={() =>
                    handleOpenForm(stall, selectedGroup, groupFilter)
                  }
                >
                  {stall.market_id}
                </button>
              ))}
            </div>

            <div className="overflow-x-auto mt-10">
              <div className="text-2xl font-bold pb-6">รายการสัญญาเช่า</div>
              <table className="table">
                <thead>
                  <tr className="bg-[#71FF7A]">
                    <th className="text-center">รหัสสัญญา</th>
                    <th className="text-center">รหัสล็อคตลาด</th>
                    <th className="text-center">ชื่อร้าน</th>
                    <th className="text-center">ประเภทสินค้า</th>
                    <th className="text-center">ค่าเช่า/วัน</th>
                    <th className="text-center">วันที่ขาย</th>
                    <th className="text-center">วันที่เริ่มต้นสัญญา</th>
                    <th className="text-center">วันที่สิ้นสุดสัญญา</th>
                    <th className="text-center">ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  {agreement_list.length === 0 ? (
                    <tr>
                      <td
                        colSpan="9"
                        className="text-center py-4 text-gray-500 hover:bg-gray-100"
                      >
                        ไม่พบข้อมูลสัญญา
                      </td>
                    </tr>
                  ) : (
                    agreement_list.map((list) => (
                      <tr key={list.agmt_id} className="hover:bg-gray-100">
                        <td className="text-center">{list.agmt_id}</td>
                        <td className="text-center">{list.agmt_market}</td>
                        <td className="text-center">{list.trader_shop}</td>
                        <td className="text-center">{list.ptype_name}</td>
                        <td className="text-center">{list.market_price}</td>
                        <td className="text-center">
                          {sellDate(list.agmt_status)}
                        </td>
                        <td className="text-center">
                          {toThaiDisplayDate(list.agmt_start)}
                        </td>
                        <td className="text-center">
                          {toThaiDisplayDate(list.agmt_end)}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn bg-[#ff6b6b] border-[#ff6b6b] text-white shadow-sm hover:bg-[#ff4d4d] hover:border-[#ff4d4d] w-30 h-8 text-md"
                            onClick={() => handleDelete(list)}
                          >
                            ยกเลิกสัญญา
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {view === "form" && (
        <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#8EEA8B] px-6 py-4 flex items-center justify-between">
            <div className="text-3xl font-bold text-green-800">จัดการสัญญา</div>
            <button
              className="text-4xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={handleBackFromForm}
            >
              ×
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="label">
                    <span className="label-text text-lg">รหัสล็อค</span>
                  </label>
                  <input
                    className={`input input-bordered w-full ${
                      selectedStall ? "bg-gray-200" : ""
                    } h-12`}
                    name="agmt_market"
                    value={formData.agmt_market}
                    onChange={handleFormChange}
                    placeholder="รหัสล็อค"
                    disabled
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">กลุ่มสังกัด</span>
                  </label>
                  <input
                    className={`input input-bordered w-full ${
                      selectedStall ? "bg-gray-200" : ""
                    } h-12`}
                    name="group_name"
                    value={formData.group_name}
                    onChange={handleFormChange}
                    placeholder="กลุ่มสังกัด"
                    disabled
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">รหัสผู้เช่า</span>
                  </label>
                  <input
                    className="input input-bordered w-full h-12"
                    name="agmt_trader"
                    value={formData.agmt_trader}
                    onChange={handleFormChange}
                    placeholder="กรอกรหัสผู้เช่า"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label">
                    <span className="label-text text-lg">วันที่ขาย</span>
                  </label>
                  <select
                    className="select select-bordered w-full h-12"
                    name="agmt_status"
                    value={formData.agmt_status}
                    onChange={handleFormChange}
                  >
                    <option value="" disabled>
                      เลือกวันที่ขาย
                    </option>
                    {sellDays.map((day) => (
                      <option key={day.id} value={day.id}>
                        {day.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">วันที่ทำสัญญา</span>
                  </label>
                  <BuddhistDatePicker
                    value={formData.agmt_start}
                    onChange={(value) => handleDateChange("agmt_start", value)}
                    placeholder="เลือกวันที่ทำสัญญา"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">วันสิ้นสุดสัญญา</span>
                  </label>
                  <BuddhistDatePicker
                    value={formData.agmt_end}
                    onChange={(value) => handleDateChange("agmt_end", value)}
                    minDate={toDate(formData.agmt_start)}
                    placeholder="เลือกวันสิ้นสุดสัญญา"
                  />
                </div>
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">รหัสผู้บริหาร</span>
                </label>
                <input
                  className="input input-bordered w-full h-12"
                  name="agmt_admin"
                  value={formData.agmt_admin}
                  onChange={handleFormChange}
                  placeholder="กรอกรหัสผู้บริหาร"
                />
              </div>
            </div>

            <div className="flex justify-end gap-6 pt-10">
              <button
                className="btn bg-[#ff7d7d] border-[#ff7d7d] text-white shadow-sm hover:bg-[#ff6b6b] hover:border-[#ff6b6b]"
                onClick={handleBackFromForm}
              >
                ย้อนกลับ
              </button>
              <button
                className="btn bg-[#77e279] border-[#77e279] text-white shadow-sm hover:bg-[#68d56b] hover:border-[#68d56b]"
                onClick={handleSave}
              >
                บันทึก
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ManageAgreement;
