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

        <div className="w-80% h-10 bg-danger">
          <h1>LoginPage</h1>
        </div>

        <div className="card bg-base-100 w-96 shadow-sm">
          <figure>
            <img
              src="https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp"
              alt="Shoes"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Card Title</h2>
            <p>
              A card component has a figure, a body part, and inside body there
              are title and actions parts
            </p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">Buy Now</button>
            </div>
          </div>
        </div>
        <button className="btn btn-dash">Default</button>
        <button className="btn btn-dash btn-primary">Primary</button>
        <button className="btn btn-dash btn-secondary">Secondary</button>
        <button className="btn btn-dash btn-accent">Accent</button>
        <button className="btn btn-dash btn-info">Info</button>
        <button className="btn btn-dash btn-success">Success</button>
        <button className="btn btn-dash btn-warning">Warning</button>
        <button className="btn btn-dash btn-error">Error</button>
      </div>
    </>
  );
}

export default Home;
