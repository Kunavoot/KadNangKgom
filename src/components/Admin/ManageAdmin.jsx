import React from "react";

function ManageAdmin() {
  const [isForm, setIsFrom] = React.useState(false);
  const [formType, setFormType] = React.useState(""); // Add, Edit สำหรับจัดการฟอร์ม
  const [details, setDetails] = React.useState([]);
  const [selectedItem, setSelectedItem] = React.useState("");

    const handleEdit = (item) => {
    // Logic สำหรับแก้ไขข้อมูลผู้บริหาร
    setFormType("edit");
    setIsFrom(true);
    setSelectedItem(item);
    console.log("Editing id:", item);
  }

  const getAdmin = () => {
    setDetails([
      {
        id: "90000000001",
        name: "นาย xxxxxx xxxxxx",
        username: "admin01",
        password: "123456",
      },
      {
        id: "90000000002",
        name: "นางสาว yyyyyy yyyyyy",
        username: "admin02",
        password: "abcdef",
      },
    ]);
  };

  React.useEffect(() => {
    getAdmin();
  }, []);

  return (
    <>
      {!isForm ? (
        <>
          {/* Header */}
          <div className="flex flex-row justify-between py-4">
            <div className="text-2xl font-bold">จัดการข้อมูลผู้บริหาร</div>
            <button className="btn bg-[#7BE397] border-[#7BE397] shadow-sm hover:bg-[#68d284] hover:border-[#68d284]">
              เพิ่มผู้บริหาร
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="table">
              {/* head */}
              <thead>
                <tr className="bg-[#71FF7A]">
                  <th className="text-center w-[5%]"></th>
                  <th className="text-center w-[10%]">รหัส</th>
                  <th className="text-start">ชื่อ-นามสกุล</th>
                  <th className="text-start w-[10%]">ชื่อผู้ใช้</th>
                  <th className="text-start w-[10%]">รหัสผ่าน</th>
                  <th className="text-center w-[20%]">ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {details.length > 0 ? (
                  // ถ้ามีข้อมูล ให้ map แถวออกมา
                  details.map((item, index) => (
                    <tr key={item.id || index} className="hover:bg-gray-100">
                      <th className="text-center">{index + 1}</th>
                      <td className="text-center">{item.id}</td>
                      <td className="text-start">{item.name}</td>
                      <td className="text-start">{item.username}</td>
                      <td className="text-start">{item.password}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-warning mr-2 w-17" onClick={() => handleEdit(item.id)}>
                          แก้ไข
                        </button>
                        <button className="btn btn-sm btn-error w-17">
                          ลบ
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  // ถ้าไม่มีข้อมูล ให้แสดงแถวนี้แถวเดียว
                  <tr>
                    <td colSpan="6" className="text-center">
                      ไม่พบข้อมูล
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <>
            {/* Form เพิ่มข้อมูลผู้บริหาร หรือแก้ไขผู้บริหาร */}
        </>
      )}
    </>
  );
}

export default ManageAdmin;
