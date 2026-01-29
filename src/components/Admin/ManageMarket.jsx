import React, { useMemo, useState } from "react";
import Loading from "../Loading";

const initialGroups = [
  {
    id: "g1",
    name: "ไก่",
    totalSlots: 5,
    rentedSlots: 2,
    stalls: [
      {
        stallId: "01001",
        size: "4 x 4 ม.",
        pricePerDay: "50.00",
        location: "ข้างบกี",
        status: "เช่าแล้ว",
      },
      {
        stallId: "01002",
        size: "4 x 4 ม.",
        pricePerDay: "50.00",
        location: "ข้างบกี",
        status: "เช่าแล้ว",
      },
      {
        stallId: "01003",
        size: "4 x 4 ม.",
        pricePerDay: "50.00",
        location: "ข้างบกี",
        status: "ว่าง",
      },
      {
        stallId: "01004",
        size: "4 x 4 ม.",
        pricePerDay: "50.00",
        location: "ข้างบกี",
        status: "ว่าง",
      },
      {
        stallId: "01005",
        size: "4 x 4 ม.",
        pricePerDay: "50.00",
        location: "ข้างบกี",
        status: "ปรับปรุง",
      },
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

function ManageMarket() {
  const [isLoading] = useState(false);
  const [groups, setGroups] = useState(initialGroups);
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [isForm, setIsForm] = useState(false);
  const [formType, setFormType] = useState("");
  const [selectedStall, setSelectedStall] = useState(null);
  const [formData, setFormData] = useState({
    stallId: "",
    size: "",
    pricePerDay: "",
    location: "",
    status: "ว่าง",
  });

  const selectedGroup = useMemo(
    () => groups.find((group) => group.id === selectedGroupId) || null,
    [groups, selectedGroupId],
  );

  const handleSelectGroup = (groupId) => {
    setSelectedGroupId(groupId);
    setIsForm(false);
    setFormType("");
    setSelectedStall(null);
  };

  const handleBackToSummary = () => {
    setSelectedGroupId(null);
    setIsForm(false);
    setFormType("");
    setSelectedStall(null);
  };

  const handleAdd = () => {
    setFormType("add");
    setIsForm(true);
    setSelectedStall(null);
    setFormData({
      stallId: "",
      size: "4 x 4 ม.",
      pricePerDay: "50.00",
      location: "",
      status: "ว่าง",
    });
  };

  const handleEdit = (stall) => {
    setFormType("edit");
    setIsForm(true);
    setSelectedStall(stall);
    setFormData({ ...stall });
  };

  const handleDelete = (stallId) => {
    if (!selectedGroupId) return;
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== selectedGroupId) return group;
        return {
          ...group,
          stalls: group.stalls.filter((stall) => stall.stallId !== stallId),
        };
      }),
    );
  };

  const handleBackToDetail = () => {
    setIsForm(false);
    setFormType("");
    setSelectedStall(null);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!selectedGroupId) return;
    setGroups((prev) =>
      prev.map((group) => {
        if (group.id !== selectedGroupId) return group;
        if (formType === "add") {
          return { ...group, stalls: [...group.stalls, { ...formData }] };
        }
        if (formType === "edit" && selectedStall) {
          return {
            ...group,
            stalls: group.stalls.map((stall) =>
              stall.stallId === selectedStall.stallId
                ? { ...stall, ...formData }
                : stall,
            ),
          };
        }
        return group;
      }),
    );
    handleBackToDetail();
  };

  return (
    <>
      {isLoading && <Loading />}
      {!selectedGroup && (
        <>
          <div className="flex flex-row justify-between py-4">
            <div className="text-2xl font-bold">จัดการเตรียมพื้นที่ตลาด</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {groups.map((group) => (
              <button
                key={group.id}
                className="bg-[#D9F7C9] border border-[#CDEEC1] shadow-sm p-4 h-[45] cursor-pointer text-center flex flex-col justify-between hover:shadow-md transition"
                onClick={() => handleSelectGroup(group.id)}
              >
                <div>
                  <div className="text-sm text-gray-700">กลุ่ม</div>
                  <div className="text-2xl font-semibold">{group.name}</div>
                </div>
                <div className="flex items-center justify-between pt-4">
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">จำนวนล็อค</div>
                    <div className="text-2xl font-semibold">
                      {group.totalSlots}
                    </div>
                  </div>
                  <div className="w-px h-10 bg-[#7CCF7B]" />
                  <div className="flex-1">
                    <div className="text-sm text-gray-700">เช่าแล้ว</div>
                    <div className="text-2xl font-semibold">
                      {group.rentedSlots}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {selectedGroup && !isForm && (
        <>
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <button
                className="btn btn-sm btn-circle btn-ghost text-2xl content-center"
                onClick={handleBackToSummary}
              >
                &lt;
              </button>
              <div className="text-2xl font-bold">จัดการเตรียมพื้นที่ตลาด</div>
            </div>
            <button
              className="btn bg-[#7BE397] border-[#7BE397] shadow-sm hover:bg-[#68d284] hover:border-[#68d284]"
              onClick={handleAdd}
            >
              เพิ่มข้อมูล
            </button>
          </div>

          <div className="flex flex-wrap gap-6 pb-6">
            <div className="bg-[#89E989] shadow-md w-[140px] h-[120px] flex flex-col items-center justify-center">
              <div className="text-sm font-medium">กลุ่ม</div>
              <div className="text-2xl font-semibold">{selectedGroup.name}</div>
            </div>
            <div className="bg-[#89E989] shadow-md w-[140px] h-[120px] flex flex-col items-center justify-center">
              <div className="text-sm font-medium">จำนวนล็อค</div>
              <div className="text-2xl font-semibold">
                {selectedGroup.totalSlots}
              </div>
            </div>
            <div className="bg-[#89E989] shadow-md w-[140px] h-[120px] flex flex-col items-center justify-center">
              <div className="text-sm font-medium">เช่าแล้ว</div>
              <div className="text-2xl font-semibold">
                {selectedGroup.rentedSlots}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr className="bg-[#71FF7A]">
                  <th className="text-center w-[5%]"></th>
                  <th className="text-center">รหัสล็อค</th>
                  <th className="text-center">ขนาดพื้นที่</th>
                  <th className="text-center">ค่าเช่า/วัน</th>
                  <th className="text-center">ตำแหน่ง</th>
                  <th className="text-center">สถานะ</th>
                  <th className="text-center w-[20%]">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {selectedGroup.stalls.length > 0 ? (
                  selectedGroup.stalls.map((stall, index) => (
                    <>
                      <tr
                        key={stall.stallId || index}
                        className="hover:bg-gray-100"
                      >
                        <th className="text-center">{index + 1}</th>
                        <td className="text-center">{stall.stallId}</td>
                        <td className="text-center">{stall.size}</td>
                        <td className="text-center">{stall.pricePerDay}</td>
                        <td className="text-center">{stall.location}</td>
                        <td className="text-center">
                          <span
                            className={
                              stall.status === "ว่าง"
                                ? "badge badge-success text-center"
                                : stall.status === "เช่าแล้ว"
                                  ? "badge badge-error text-center"
                                  : "badge badge-warning text-center"
                            }
                          >
                            {stall.status}
                          </span>
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-warning mr-2 w-17"
                            onClick={() => handleEdit(stall)}
                          >
                            แก้ไข
                          </button>
                          <button
                            className="btn btn-sm btn-error w-17"
                            onClick={() => handleDelete(stall.stallId)}
                          >
                            ลบ
                          </button>
                        </td>
                      </tr>
                    </>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {selectedGroup && isForm && (
        <div className="border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#8EEA8B] px-6 py-4 flex items-center justify-between">
            <div className="text-3xl font-bold text-green-800">
              {formType === "edit" ? "แก้ไขล็อคตลาด" : "เพิ่มล็อคตลาด"}
            </div>
            <button
              className="text-4xl font-bold text-gray-500 hover:text-gray-700"
              onClick={handleBackToDetail}
            >
              ×
            </button>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="label">
                  <span className="label-text text-lg">รหัสล็อค</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="stallId"
                  value={formData.stallId}
                  onChange={handleFormChange}
                  placeholder="กรอกรหัสล็อค"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ขนาดพื้นที่</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="size"
                  value={formData.size}
                  onChange={handleFormChange}
                  placeholder="เช่น 4 x 4 ม."
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ค่าเช่า/วัน</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="pricePerDay"
                  value={formData.pricePerDay}
                  onChange={handleFormChange}
                  placeholder="เช่น 50.00"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">ตำแหน่ง</span>
                </label>
                <input
                  className="input input-bordered w-full"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  placeholder="กรอกตำแหน่ง"
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text text-lg">สถานะ</span>
                </label>
                <select
                  className="select select-bordered w-full"
                  name="status"
                  value={formData.status}
                  onChange={handleFormChange}
                >
                  <option value="ว่าง">ว่าง</option>
                  <option value="เช่าแล้ว">เช่าแล้ว</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-6 pt-10">
              <button
                className="btn bg-[#ff7d7d] border-[#ff7d7d] text-white shadow-sm hover:bg-[#ff6b6b] hover:border-[#ff6b6b]"
                onClick={handleBackToDetail}
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

export default ManageMarket;
