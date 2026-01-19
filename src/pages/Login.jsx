import React from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../service/AuthContext.jsx";

function Home() {
  const { login } = useAuth();

  const handleLogin = (e) => {
    e.preventDefault();
    // ตัวอย่างข้อมูลผู้ใช้
    const userData = {
      username: "Kunavoot",
      email: "kunavoot@mail.com",
    };

    login(userData);
  };

  return (
    <>
      <div className="min-w-screen min-h-screen">
        <nav className="h-[18%]">
          <Navbar />
        </nav>

        {/* login box */}
        <div className="card flex flex-row bg-base-100 w-[50%] h-[50%] m-auto mt-16 shadow-[0px_0px_28.799999237060547px_0px_rgba(0,0,0,0.25)]">
          <div className="flex-1 w-[45%] h-[80%] text-center justify-center m-auto">
            <h3 className="card text-2xl text-left pl-7 mb-7">เข้าสู่ระบบ</h3>
            <fieldset className="fieldset w-[80%] m-auto">
              <label className="label">Username</label>
              <input
                type="text"
                className="input px-3 w-full focus:border-[#5bc06d]"
                placeholder="Username"
              />

              <label className="label">Password</label>
              <input
                type="password"
                className="input px-3 w-full focus:border-[#5bc06d]"
                placeholder="Password"
              />

              <button className="btn w-full mt-7 bg-[#72DF82] hover:bg-[#5bc06d]" onClick={(e) =>handleLogin(e)}>
                ดำเนินการต่อ
              </button>
            </fieldset>

            <div className="mt-4 text-sm">
              <label className="text-[#7D7D7D]">ต้องการเข้าร่วมกับเรา?</label>
              <a href="#" className="text-[#5bc06d] hover:underline ml-2">
                สมัครสมาชิก
              </a>
            </div>
          </div>
          <div className="flex-1 w-[45%] justify-items-center content-center">
            <img
              className="h-[90%] text-center"
              src="../../public/login_img.png"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
