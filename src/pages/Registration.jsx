import React from "react";
import Navbar from "../components/Navbar";

function Registration() {
  return (
    <>
      <div className="w-screen h-screen">
        <nav className="h-[18%]">
          <Navbar />
        </nav>

        {/* login box */}
        <div className="card bg-base-100 w-[50%] min-h-[50%] py-5 m-auto mt-16 shadow-[0px_0px_28.799999237060547px_0px_rgba(0,0,0,0.25)]">
          <h3 className="card text-2xl text-left pl-7 mt-3">
            ส่งฟอร์มเป็นผู้ค้า
          </h3>
          <div className="flex flex-row">
            <div className="flex-1 w-[45%] h-full text-left justify-center mx-auto">
              <fieldset className="fieldset w-[80%] m-auto">
                <div className="flex flex-row gap-3">
                  <div className="w-[60%]">
                    <label className="label mb-1">คำนำหน้า</label>
                    <select
                      className="select px-3 w-full focus:color-[#5bc06d]"
                      placeholder="คำนำหน้า"
                    >
                      <option value="">เลือกคำนำหน้า</option>
                      <option value="Mr">นาย</option>
                      <option value="Mrs">นาง</option>
                      <option value="Ms">นางสาว</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="label mb-1">ชื่อจริง</label>
                    <input
                      type="text"
                      className="input px-3 w-full focus:border-[#5bc06d]"
                      placeholder="ชื่อจริง"
                    />
                  </div>
                </div>

                <label className="label">นามสกุล</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="นามสกุล"
                />

                <label className="label">ชื่อร้านค้า</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="ชื่อร้านค้า"
                />

                <label className="label">สินค้าที่ขาย</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="สินค้าที่ขาย"
                />

                <label className="label">แหล่งที่มาของสินค้า</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="แหล่งที่มาของสินค้า"
                />

                <label className="label">ที่อยู่ผู้ค้า</label>
                <input
                  type="text"
                  className="input h-22 px-3 w-full focus:border-[#5bc06d]"
                />
              </fieldset>
            </div>

            <div className="flex-1 w-[45%] h-full justify-items-center content-center">
              <fieldset className="fieldset w-[80%] m-auto">
                <label className="label">วันที่เริ่มทำธุรกิจ</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="วันที่เริ่มทำธุรกิจ"
                />

                <label className="label">สถานที่เคยขาย</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="สถานที่เคยขาย"
                />

                <div className="flex flex-col">
                  <label className="label">มีรถหรือไม่</label>
                  <div className="flex gap-4">
                    {/* ตัวเลือกที่ 1 */}
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="role"
                          className="radio radio-xs radio-success" // สีเขียวเข้ากับธีมกาดนั่งก้อม
                          value="customer"
                          //   checked={role === "customer"}
                          //   onChange={(e) => setRole(e.target.value)}
                        />
                        <span className="label-text">มีรถ</span>
                      </label>
                    </div>

                    {/* ตัวเลือกที่ 2 */}
                    <div className="form-control">
                      <label className="label cursor-pointer gap-2">
                        <input
                          type="radio"
                          name="role"
                          className="radio radio-xs radio-success"
                          value="vendor"
                          //   checked={role === "vendor"}
                          //   onChange={(e) => setRole(e.target.value)}
                        />
                        <span className="label-text">ไม่มีรถ</span>
                      </label>
                    </div>
                  </div>
                </div>

                <label className="label">รถที่ใช้</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="รถที่ใช้"
                  disabled
                />

                <label className="label">เบอร์โทรศัพท์</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="เบอร์โทรศัพท์"
                />

                <label className="label">Facebook</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="Facebook"
                />

                <label className="label">Line</label>
                <input
                  type="text"
                  className="input px-3 w-full focus:border-[#5bc06d]"
                  placeholder="Line"
                />
              </fieldset>
            </div>
          </div>
          <div className="flex justify-end pr-8">
            <button className="btn w-[42.5%] align-right mt-7 pr-5 bg-[#72DF82] hover:bg-[#5bc06d]">
              ดำเนินการต่อ
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Registration;
