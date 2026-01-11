import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <div className="w-screen h-screen">
        <nav className="h-[18%]">
          <Navbar />
        </nav>

        <div className="w-screen h-[55%] my-6 bg-[url('/public/wide_backgroud.jpg')] bg-cover bg-center overflow-auto"></div>

        <footer className="w-full absolute bottom-0">
          <Footer />
        </footer>
      </div>
    </>
  );
}

export default Home;
