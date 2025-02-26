import React, { useState, useEffect, useContext } from "react";
import { MdClose, MdMenu, MdDelete } from "react-icons/md";
import { AiOutlineGithub } from "react-icons/ai";
import { useLocation, Link } from "react-router-dom";
import { ChatContext } from "../context/chatContext";
import bot from "./Untitled design-3.png";
import ToggleTheme from "./ToggleTheme";
import axios from "axios";
const SideBar = (props) => {
  const [, , clearChat] = useContext(ChatContext);
  const { setThm, setOpen, open } = props;
  const location = useLocation();
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [showQrPopup, setShowQrPopup] = useState(false);

  function handleResize() {
    window.innerWidth <= 720 ? setOpen(false) : setOpen(true);
  }

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  function clear() {
    clearChat();
  }

  async function generateQrCode() {
    try {
      // Fetch pharmacist information from the backend
      const response = await axios.get("http://localhost:5000/api/pharmacist", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
  
      const { _id, name} = response.data;
  
      if (!_id || !name) {
        console.error("Pharmacist information is missing.");
        return;
      }
  
      // Create a URL for placing orders
      const orderUrl = `http://localhost:5173/place-order?pharmacistId=${_id}&pharmacistName=${encodeURIComponent(name)}`;
  
      // Generate QR code with the order URL
      const url = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
        orderUrl
      )}`;
  
      const qrResponse = await fetch(url);
      const blob = await qrResponse.blob();
      const blobUrl = URL.createObjectURL(blob);
      setQrCodeUrl(blobUrl);
      setShowQrPopup(true);
    } catch (error) {
      console.error("Error generating QR code:", error);
    }
  }

  const currentPath = location.pathname;

  const navItems = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/inventory", label: "Inventory" },
    { path: "/orders", label: "Orders" },
  ];

  return (
    <section
      className={`${
        open ? "w-[400px]" : "w-16"
      } overflow-y-hidden bg-base-200 text-base-content flex flex-col justify-between items-center h-screen pt-4 duration-200 shadow-lg border-blue-100`}>
      <div className="w-full">
        <div className="flex items-center justify-between w-full">
          <div className={`flex items-center ${!open && "hidden"}`}>
            <img src={bot} alt="logo" className="w-24 h-24" />
            <h1 className="text-lg font-semibold caveat-a">PharmAssist</h1>
          </div>
          <button
            className="btn btn-square btn-ghost shadow-md"
            onClick={() => setOpen(!open)}
          >
            {open ? <MdClose size={24} /> : <MdMenu size={24} />}
          </button>
        </div>
        <div className="p-5 flex justify-content-center">
          {open && localStorage.getItem("name")}
        </div>
        <ul className="w-full menu rounded-box px-4 py-3">
          {currentPath === "/bot" && (
            <li>
              <button
                className="flex items-center gap-2 my-2 w-full py-3 rounded-md hover:bg-neutral-focus shadow-md"
                onClick={clear}
              >
                <MdDelete size={20} />
                <span className={`${!open && "hidden"}`}>Clear chat</span>
              </button>
            </li>
          )}
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex bg-base-100 items-center my-2 gap-2 w-full py-3 px-2 rounded-md hover:bg-neutral-focus shadow-md ${
                  currentPath === item.path ? "opacity-50 cursor-default" : ""
                }`}
              >
                <span className={`${!open && "hidden"}`}>{item.label}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              className="flex items-center bg-base-100 font-lg gap-2 my-2 w-full py-3 rounded-md hover:bg-neutral-focus shadow-md"
              onClick={generateQrCode}
            >
              <span className={`${!open && "hidden"}`}>
                Generate QR Code To Receive Orders
              </span>
            </button>
          </li>
        </ul>
      </div>

      <div className="w-full">
        <ul className="w-full px-4">
          <li>
            <ToggleTheme setThm={setThm} open={open} />
          </li>
          <li>
            <a
              className="flex items-center gap-2 w-full py-2 px-2 hover:bg-neutral-focus rounded-md shadow-md"
              rel="noreferrer"
              target="_blank"
              href="https://github.com/harshitamahb/PharmAssist-GoogleGirlHackathon/"
            >
              <AiOutlineGithub size={20} />
              <span className={`${!open && "hidden"}`}>Github</span>
            </a>
          </li>
        </ul>
      </div>

      {showQrPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-base-100 p-6 rounded-lg shadow-lg w-full max-w-md mx-4 md:mx-0">
            <img src={qrCodeUrl} alt="QR Code" className="mb-4 w-full h-auto" />
            <div className="flex justify-between">
              <a
                href={qrCodeUrl}
                download="qr-code.png"
                className="btn btn-primary shadow-md"
              >
                Download QR Code
              </a>
              <button
                className="btn btn-secondary shadow-md"
                onClick={() => setShowQrPopup(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SideBar;
