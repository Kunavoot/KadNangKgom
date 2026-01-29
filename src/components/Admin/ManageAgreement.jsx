import React, { useMemo, useRef, useState } from "react";
import Loading from "../Loading";

const initialGroups = [
  {
    id: "g1",
    name: "ไก่",
    totalSlots: 5,
    rentedSlots: 2,
    stalls: [
      { id: "01001", status: "เช่าแล้ว" },
      { id: "01002", status: "เช่าแล้ว" },
      { id: "01003", status: "ว่าง" },
      { id: "01004", status: "ว่าง" },
      { id: "01005", status: "ว่าง" },
      { id: "01006", status: "ว่าง" },
      { id: "01007", status: "ว่าง" },
      { id: "01008", status: "ว่าง" },
      { id: "01009", status: "ว่าง" },
      { id: "01010", status: "ว่าง" },
    ],
  },
  {
    id: "g2",
    name: "ม้า",
    totalSlots: 5,
    rentedSlots: 2,
    stalls: [],
  },
  {
    id: "g3",
    name: "หนอน",
    totalSlots: 5,
    rentedSlots: 2,
    stalls: [],
  },
  {
    id: "g4",
    name: "นก",
    totalSlots: 5,
    rentedSlots: 2,
    stalls: [],
  },
  {
    id: "g5",
    name: "ปลา",
    totalSlots: 5,
    rentedSlots: 2,
    stalls: [],
  },
];

const initialContracts = [
  {
    id: "000001",
    stallId: "01001",
    renterId: "0000000001",
    productType: "อาหาร",
    rent: "50.00",
    startDate: "01/07/2568",
    endDate: "31/06/2570",
  },
  {
    id: "000002",
    stallId: "01003",
    renterId: "0000000002",
    productType: "อาหาร",
    rent: "50.00",
    startDate: "01/07/2568",
    endDate: "31/06/2570",
  },
  {
    id: "000003",
    stallId: "01005",
    renterId: "0000000003",
    productType: "อาหาร",
    rent: "50.00",
    startDate: "01/07/2568",
    endDate: "31/06/2570",
  },
  {
    id: "000004",
    stallId: "02001",
    renterId: "0000000004",
    productType: "อาหาร",
    rent: "50.00",
    startDate: "01/07/2568",
    endDate: "31/06/2570",
  },
  {
    id: "000005",
    stallId: "03001",
    renterId: "0000000005",
    productType: "อาหาร",
    rent: "50.00",
    startDate: "01/07/2568",
    endDate: "31/06/2570",
  },
  {
    id: "000005",
    stallId: "03001",
    renterId: "0000000005",
    productType: "อาหาร",
    rent: "50.00",
    startDate: "01/07/2568",
    endDate: "31/06/2570",
  },
  {
    id: "000005",
    stallId: "03001",
    renterId: "0000000005",
    productType: "อาหาร",
    rent: "50.00",
    startDate: "01/07/2568",
    endDate: "31/06/2570",
  },
  {
    id: "000006",
    stallId: "03001",
    renterId: "0000000005",
    productType: "อาหาร",
    rent: "50.00",
    startDate: "01/07/2568",
    endDate: "31/06/2570",
  },
];

const productTypes = ["อาหาร", "เสื้อผ้า", "ของใช้", "อุปกรณ์", "อื่นๆ"];
const sellDays = ["ทุกวัน", "เสาร์", "อาทิตย์", "เสาร์-อาทิตย์"];

function ManageAgreement() {
  const [isLoading] = useState(false);
  const [view, setView] = useState("list");
  const [groups] = useState(initialGroups);
  const [contracts, setContracts] = useState(initialContracts);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedStall, setSelectedStall] = useState(null);
  const [uploadedPlanName, setUploadedPlanName] = useState("");
  const [formData, setFormData] = useState({
    stallId: "",
    groupName: "",
    renterId: "",
    shopName: "",
    productType: "",
    sellDay: "",
    contractDate: "",
    endDate: "",
  });

  const uploadInputRef = useRef(null);

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) || null,
    [groups, selectedGroupId],
  );

  const handleOpenGroup = (groupId) => {
    setSelectedGroupId(groupId);
    setSelectedStall(null);
    setView("group");
  };

  const handleCloseGroup = () => {
    setSelectedGroupId(null);
    setSelectedStall(null);
    setView("list");
  };

  const handleOpenForm = (stall, group) => {
    setSelectedStall(stall || null);
    setFormData({
      stallId: stall?.id || "",
      groupName: group?.name || "",
      renterId: "",
      shopName: "",
      productType: "",
      sellDay: "",
      contractDate: "",
      endDate: "",
    });
    setView("form");
  };

  const handleBackFromForm = () => {
    if (selectedGroupId) {
      setSelectedStall(null);
      setView("group");
      return;
    }
    setSelectedStall(null);
    setSelectedGroupId(null);
    setView("list");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!formData.stallId) {
      handleBackFromForm();
      return;
    }
    setContracts((prev) => [
      ...prev,
      {
        id: String(prev.length + 1).padStart(6, "0"),
        stallId: formData.stallId,
        renterId: formData.renterId || "-",
        productType: formData.productType || "-",
        rent: "50.00",
        startDate: formData.contractDate || "-",
        endDate: formData.endDate || "-",
      },
    ]);
    handleBackFromForm();
  };

  const handleUploadClick = () => {
    if (uploadInputRef.current) {
      uploadInputRef.current.click();
    }
  };

  const handleUploadChange = (e) => {
    const file = e.target.files?.[0];
    setUploadedPlanName(file ? file.name : "");
  };

  const getStallClass = (status) => {
    if (status === "เช่าแล้ว") return "bg-[#ff7d7d]";
    if (status === "ว่าง") return "bg-[#a9ff9f]";
    return "bg-[#d9d9d9]";
  };

  return (
    <>
      {isLoading && <Loading />}

      {view === "list" && (
        <>
          <div className="flex items-center justify-end gap-4 pb-6">
            <input
              ref={uploadInputRef}
              type="file"
              className="hidden"
              onChange={handleUploadChange}
            />
            <button
              className="btn bg-[#FFE680] border-[#FFE680] shadow-sm hover:bg-[#f5db69] hover:border-[#f5db69]"
              onClick={handleUploadClick}
            >
              อัพโหลดแผนผัง
            </button>
            <button
              className="btn bg-[#9CF6A1] border-[#9CF6A1] shadow-sm hover:bg-[#84e98b] hover:border-[#84e98b]"
              onClick={() => handleOpenForm(null, null)}
            >
              จัดการสัญญาเช่า
            </button>
          </div>
          {uploadedPlanName && (
            <div className="text-sm text-gray-500 pb-4">
              ไฟล์แผนผังที่อัพโหลด: {uploadedPlanName}
            </div>
          )}

          <div className="overflow-x-auto mb-12">
            <table className="table">
              <thead>
                <tr className="bg-[#71FF7A]">
                  <th className="text-center">กลุ่มสังกัด</th>
                  <th className="text-center">จำนวนล็อค</th>
                  <th className="text-center">เช่าแล้ว</th>
                  <th className="text-center">ว่าง</th>
                  <th className="text-center">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {groups.map((group) => (
                  <tr key={group.id} className="hover:bg-gray-100">
                    <td className="text-center">{group.name}</td>
                    <td className="text-center">{group.totalSlots}</td>
                    <td className="text-center">{group.rentedSlots}</td>
                    <td className="text-center">
                      {group.totalSlots - group.rentedSlots}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-warning w-20"
                        onClick={() => handleOpenGroup(group.id)}
                      >
                        แก้ไข
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-[#71FF7A]">
                  <th className="text-center">รหัสสัญญา</th>
                  <th className="text-center">รหัสล็อค</th>
                  <th className="text-center">รหัสผู้ค้า</th>
                  <th className="text-center">ประเภทสินค้า</th>
                  <th className="text-center">ค่าเช่า</th>
                  <th className="text-center">วันที่เริ่มเช่า</th>
                  <th className="text-center">วันสิ้นสุดการเช่า</th>
                </tr>
              </thead>
              <tbody>
                {contracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-100">
                    <td className="text-center">{contract.id}</td>
                    <td className="text-center">{contract.stallId}</td>
                    <td className="text-center">{contract.renterId}</td>
                    <td className="text-center">{contract.productType}</td>
                    <td className="text-center">{contract.rent}</td>
                    <td className="text-center">{contract.startDate}</td>
                    <td className="text-center">{contract.endDate}</td>
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
              สัญญาเช่า : {selectedGroup.name}
            </div>
            <button
              className="text-4xl font-bold text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={handleCloseGroup}
            >
              ×
            </button>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {(selectedGroup.stalls.length
                ? selectedGroup.stalls
                : Array.from({ length: 10 }).map((_, index) => ({
                    id: `0${index + 1}000`,
                    status: "ไม่พร้อม",
                  })))
                .slice(0, 12)
                .map((stall) => (
                  <button
                    key={stall.id}
                    className={`h-[110px] w-full flex items-center justify-center text-3xl font-medium text-black shadow cursor-pointer ${getStallClass(
                      stall.status,
                    )}`}
                    onClick={() => handleOpenForm(stall, selectedGroup)}
                  >
                    {stall.id}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}

      {view === "form" && (
        <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#8EEA8B] px-6 py-4 flex items-center justify-between">
            <div className="text-3xl font-bold text-green-800">
              จัดการสัญญา
            </div>
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
                    }`}
                    name="stallId"
                    value={formData.stallId}
                    onChange={handleFormChange}
                    placeholder="รหัสล็อค"
                    disabled={Boolean(selectedStall)}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">กลุ่มสังกัด</span>
                  </label>
                  <input
                    className={`input input-bordered w-full ${
                      selectedStall ? "bg-gray-200" : ""
                    }`}
                    name="groupName"
                    value={formData.groupName}
                    onChange={handleFormChange}
                    placeholder="กลุ่มสังกัด"
                    disabled={Boolean(selectedStall)}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">รหัสผู้เช่า</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    name="renterId"
                    value={formData.renterId}
                    onChange={handleFormChange}
                    placeholder="กรอกรหัสผู้เช่า"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">ชื่อร้าน</span>
                  </label>
                  <input
                    className="input input-bordered w-full"
                    name="shopName"
                    value={formData.shopName}
                    onChange={handleFormChange}
                    placeholder="กรอกชื่อร้าน"
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">ประเภทสินค้า</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="productType"
                    value={formData.productType}
                    onChange={handleFormChange}
                  >
                    <option value="">เลือกประเภทสินค้า</option>
                    {productTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label">
                    <span className="label-text text-lg">วันที่ขาย</span>
                  </label>
                  <select
                    className="select select-bordered w-full"
                    name="sellDay"
                    value={formData.sellDay}
                    onChange={handleFormChange}
                  >
                    <option value="">เลือกวันที่ขาย</option>
                    {sellDays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">วันที่ทำสัญญา</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="contractDate"
                    value={formData.contractDate}
                    onChange={handleFormChange}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text text-lg">วันสิ้นสุดสัญญา</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered w-full"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleFormChange}
                  />
                </div>
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
