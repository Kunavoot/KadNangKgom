import { React, useState } from "react";
import Navbar from "../../components/Navbar";
import ManageAdmin from "../../components/Admin/ManageAdmin";

function AdminPage() {
  const [isPage, setIsPage] = useState("");
  return (
    <>
      <div className="w-screen h-screen flex flex-col overflow-hidden">
        <div className="h-[18%] shrink-0">
          <Navbar />
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="drawer md:drawer-open h-full">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content h-full w-full p-4">
              {/* Page content here */}
              {/* <label
                htmlFor="my-drawer-3"
                className="btn drawer-button lg:hidden"
              >
                Open drawer
              </label> */}
              {isPage === "" && (
                <div className="h-full flex justify-center items-center">
                  <div className="text-4xl font-bold text-gray-400 text-center">
                    ยินดีต้อนรับเข้าสู่ระบบ Admin
                  </div>
                </div>
              )}
              {isPage === "manageAdmin" && <ManageAdmin />}
            </div>

            {/* Drawer Side */}
            <div className="drawer-side h-full z-20">
              <label
                htmlFor="my-drawer-3"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>

              <ul className="menu bg-base-200 min-h-full w-72 p-4 flex flex-col justify-between text-base-content no-scrollbar overflow-y-auto">
                <div>
                  {/* Header: Admin - ลดขนาดลง เหลือ 2xl และลด margin-bottom */}
                  <h1 className="text-2xl font-bold text-center mb-6 text-gray-600 mt-2">
                    Admin
                  </h1>

                  {/* กลุ่มที่ 1 - ลดขนาดหัวข้อเหลือ text-lg */}
                  <li className="menu-title text-lg font-bold text-gray-700 mb-1 opacity-100">
                    จัดการข้อมูล
                  </li>
                  {/* รายการเมนู - ใช้ขนาดมาตรฐาน (ไม่ต้องใส่ class text-...) */}
                  <li>
                    <a className={isPage === "manageAdmin" ? "bg-[#71FF7A]" : ""} onClick={() => setIsPage("manageAdmin")}>ผู้บริหาร</a>
                  </li>
                  <li>
                    <a>ผู้ค้า</a>
                  </li>
                  <li>
                    <a>กลุ่มสังกัด</a>
                  </li>
                  <li>
                    <a>ประเภทสมาชิก</a>
                  </li>
                  <li>
                    <a>ประเภทสินค้า</a>
                  </li>

                  {/* กลุ่มที่ 2 - ลดระยะห่างด้านบน (mt) */}
                  <li className="menu-title text-lg font-bold text-gray-700 mt-4 mb-1 opacity-100">
                    จัดการพื้นที่ตลาด
                  </li>
                  <li>
                    <a>เตรียมพื้นที่ตลาด</a>
                  </li>
                  <li>
                    <a>สัญญาเช่า</a>
                  </li>

                  {/* กลุ่มที่ 3 */}
                  <li className="menu-title text-lg font-bold text-gray-700 mt-4 mb-1 opacity-100">
                    รายงาน
                  </li>
                  <li>
                    <a>ยอดขาย</a>
                  </li>
                  <li>
                    <a>พื้นที่ตลาด</a>
                  </li>
                </div>

                {/* ส่วนปุ่มออกจากระบบ - ลดขนาดความสูงและตัวหนังสือ */}
                <div className="mt-6 mb-2">
                  <button
                    onClick={() => console.log("Logout clicked")}
                    className="btn btn-error w-full text-white text-lg min-h-12 rounded-xl bg-[#ff7675] border-none hover:bg-[#fab1a0] font-bold"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
