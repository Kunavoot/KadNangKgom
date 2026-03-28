import { React, useEffect } from "react";
import { useAuth } from "../service/AuthContext.jsx";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

function Navbar() {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLogout = () => {
    try {
      navigate("/");
      logout();
      Swal.fire({
        icon: "success",
        title: "ออกจากระบบเสร็จสิ้น",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {/* Nav */}
      <div className="navbar bg-linear-to-r from-[#A9F481] to-[#00AF35] shadow-sm h-2/3 w-full">
        <div className="navbar-start" />

        <div className="navbar-center">
          <div className="flex items-center gap-3">
            <img src="/logo.jpg" alt="logo" className="w-20 rounded-full" />
            <p className="text-4xl text-white cursor-default">กาดนั่งก้อม</p>
          </div>
        </div>

        {isLoggedIn ? (
          <div className="navbar-end">
            <ul
              className="flex flex-row text-2xl gap-8"
              style={{ marginRight: ["2rem"] }}
            >
              <li>
                <a
                  onClick={() =>
                    user?.role === "admin"
                      ? navigate("/admin")
                      : navigate("/trader")
                  }
                  className="text-[#CFCFCF] cursor-pointer"
                >
                  คุณ {user ? user.name : "ผู้ใช้"}
                </a>
              </li>
              <li>
                <a
                  onClick={() => handleLogout()}
                  className="text-white cursor-pointer"
                >
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
                <a
                  onClick={() => navigate("/registration")}
                  className="text-[#CFCFCF]"
                >
                  สมัครสมาชิก
                </a>
              </li>
              <li>
                <a onClick={() => navigate("/login")} className="text-white">
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
            <a onClick={() => navigate("/")} className="hover:font-bold">
              หน้าแรก
            </a>
          </li>
          <li>
            <a onClick={() => navigate("/map")} className="hover:font-bold">
              แผนผัง
            </a>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Navbar;
