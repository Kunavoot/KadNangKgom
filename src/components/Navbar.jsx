import { React, useEffect } from "react";
import { useAuth } from "../service/AuthContext.jsx";

function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  console.log("Navbar - isLoggedIn:", isLoggedIn);
  console.log("Navbar - user:", user);
  
  useEffect(() => {
    console.log("Navbar - isLoggedIn changed:", isLoggedIn);
    console.log("Navbar - user changed:", user);
  }, [isLoggedIn, user]);

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

        {isLoggedIn ? (
          <div className="navbar-end">
            <ul
              className="flex flex-row text-2xl gap-8"
              style={{ marginRight: ["2rem"] }}
            >
              <li>
                <p className="text-[#CFCFCF] cursor-default">
                  คุณ {user ? user.username : "ผู้ใช้"}
                </p>
              </li>
              <li>
                <a onClick={() => logout()} className="text-white cursor-pointer">
                  ออกจากระบบ
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="navbar-end">
            <ul
              className="menu menu-horizontal text-2xl gap-8"
              style={{ marginRight: ["2rem"] }}
            >
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
        )}
      </div>

      {/* Menu */}
      <div className="bg-[#EDEDED] w-full h-1/3 content-center text-center ">
        <ul className="menu menu-horizontal rounded-box text-xl gap-8">
          <li>
            <a className="hover:font-bold" href="#">
              หน้าแรก
            </a>
          </li>
          <li>
            <a className="hover:font-bold" href="#">
              แผนผัง
            </a>
          </li>
          <li>
            <a className="hover:font-bold" href="#">
              เกี่ยวกับเรา
            </a>
          </li>
          <li>
            <a className="hover:font-bold" href="#">
              ติดต่อเรา
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
