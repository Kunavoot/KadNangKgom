import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../service/AuthContext.jsx";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      Swal.fire({
        icon: "error",
        title: "คุณได้เข้าสู่ระบบอยู่แล้ว",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#5bc06d",
      });
      navigate("/");
    }
  }, []);

  const handleLogin = () => {
    try {
      if (username === "" || password === "") {
        Swal.fire({
          icon: "error",
          title: "กรุณากรอกข้อมูลให้ครบถ้วน",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#5bc06d",
        });
        return;
      }

      axios
        .post(
          import.meta.env.VITE_API_URL +
            "/system/login?username=" +
            username +
            "&password=" +
            password,
        )
        .then((response) => {
          Swal.fire({
            icon: "success",
            title: "เข้าสู่ระบบสำเร็จ",
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#5bc06d",
          });
          // เก็บข้อมูลผู้ใช้
          const userData = {
            username: response.data.data.username,
            name: response.data.data.name,
            fullname: response.data.data.fullname,
            role: response.data.data.role,
          };
          login(userData);

          if (response.data.data.role === "admin") {
            navigate("/admin");
          } else {
            navigate("/trader");
          }
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: error.response.data.message,
            confirmButtonText: "ตกลง",
            confirmButtonColor: "#5bc06d",
          });
        });
    } catch (error) {
      console.error(error);
    }
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
            <fieldset
              className="fieldset w-[80%] m-auto"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleLogin();
                }
              }}
            >
              <label className="label">Username</label>
              <input
                type="text"
                className="input px-3 w-full focus:border-[#5bc06d]"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />

              <label className="label">Password</label>
              <input
                type="password"
                className="input px-3 w-full focus:border-[#5bc06d]"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                className="btn w-full mt-7 bg-[#72DF82] hover:bg-[#5bc06d]"
                onClick={() => handleLogin()}
              >
                ดำเนินการต่อ
              </button>
            </fieldset>

            <div className="mt-4 text-sm">
              <label className="text-[#7D7D7D]">ต้องการเข้าร่วมกับเรา?</label>
              <a
                onClick={() => navigate("/registration")}
                className="cursor-pointer text-[#5bc06d] hover:underline ml-2"
              >
                สมัครสมาชิก
              </a>
            </div>
          </div>
          <div className="flex-1 w-[45%] justify-items-center content-center">
            <img
              className="h-[90%] text-center"
              src={`${import.meta.env.BASE_URL}login_img.png`}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
