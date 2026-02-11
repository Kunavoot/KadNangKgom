import { useState } from "react";
import Navbar from "../../components/Navbar";
import EditInfo from "../../components/Trader/EditInfo";
import Sales from "../../components/Trader/Sales";

function TraderPage() {
  const [isPage, setIsPage] = useState("");
  return (
    <>
      <div className="w-screen h-screen flex flex-col">
        <div className="h-[18%] shrink-0">
          <Navbar />
        </div>
        <div className="flex-1">
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
                    ยินดีต้อนรับเข้าสู่ระบบ Trader
                  </div>
                </div>
              )}
              {isPage === "editInfo" && <EditInfo />}
              {isPage === "sales" && <Sales />}
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
                  <h1 className="text-2xl font-bold text-center mb-6 text-gray-600 mt-2">
                    Trader
                  </h1>
                  <li>
                    <a
                      className={isPage === "editInfo" ? "bg-[#71FF7A]" : ""}
                      onClick={() => setIsPage("editInfo")}
                    >
                      แก้ไขข้อมูลผู้ค้า
                    </a>
                  </li>
                  <li>
                    <a
                      className={isPage === "sales" ? "bg-[#71FF7A]" : ""}
                      onClick={() => setIsPage("sales")}
                    >
                      ส่งยอดขาย
                    </a>
                  </li>

                  {/* ส่วนปุ่มออกจากระบบ */}
                  <div className="mt-6 mb-2">
                    <button
                      onClick={() => console.log("Logout clicked")}
                      className="btn btn-error w-full text-white text-lg min-h-12 rounded-xl bg-[#ff7675] border-none hover:bg-[#fab1a0] font-bold"
                    >
                      ออกจากระบบ
                    </button>
                  </div>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default TraderPage;
