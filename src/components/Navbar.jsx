import React from "react";

function Navbar() {
  return (
    <>
      {/* Nav */}
      <div className="navbar bg-linear-to-r from-[#A9F481] to-[#00AF35] shadow-sm h-2/3 w-full">
        <div className="navbar-start" />

        <div className="navbar-center">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="logo" className="w-20 rounded-full" />
            <p className="text-4xl text-white">กาดนั่งก้อม</p>
          </div>
        </div>

        <div className="navbar-end">
          <ul className="menu menu-horizontal px-1 text-2xl">
            <li>
              <a href="#" className="text-[#CFCFCF]">
                สมัครสมาชิก
              </a>
            </li>
            <li>
              <a href="#" className="text-white">
                เข้าสู่ระบบ
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-[#EDEDED] w-full h-1/3 content-center text-center ">
        <ul className="menu menu-horizontal bg-base-200 rounded-box text-xl">
          <li className="px-3">
            <a href="#">หน้าแรก</a>
          </li>
          <li>
            <a href="#">แผนผัง</a>
          </li>
          <li>
            <a href="#">เกี่ยวกับเรา</a>
          </li>
          <li>
            <a href="#">ติดต่อเรา</a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
