// App.js

import { ChatContextProvider } from "./context/chatContext";
import SideBar from "./components/SideBar";
import ChatView from "./components/ChatView";
import MyopiaForm from "./Pages/Form";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import ToggleTheme from "./components/ToggleTheme";
import Test from "./Pages/Test";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Orders from "./components/Orders";
import UploadPrescription from "./Pages/User";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the ProtectedRoute component

const App = () => {
  const [thm, setThm] = useState(true);
  const [open, setOpen] = useState(true);
  const [isLogin, setIsLogin] = useState();

  useEffect(() => {
    if (localStorage.getItem("theme") === "light") setThm(false);

    function handleResize() {
      window.innerWidth <= 720 ? setOpen(false) : setOpen(true);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setIsLogin(true);
    }
  }, []);

  return (
    <ChatContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Landing isAuth={isLogin} setLogin={setIsLogin} />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuth={isLogin}>
                <div className="flex">
                  <SideBar setThm={setThm} open={open} setOpen={setOpen} />
                  <main className="w-full relative flex flex-col h-screen p-2 overflow-hidden bg-base-200 text-base-content">
                    <Dashboard />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute isAuth={isLogin}>
                <div className="flex">
                  <SideBar setThm={setThm} open={open} setOpen={setOpen} />
                  <main className="w-full relative flex flex-col h-screen p-2 overflow-hidden bg-base-200 text-base-content">
                    <Inventory />
                  </main>
                </div>
              </ProtectedRoute>
            }
          />
          <Route
            path="/place-order"
            element={
              
                <UploadPrescription />
              
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute isAuth={isLogin}>
                <div className="flex">
                  <SideBar setThm={setThm} open={open} setOpen={setOpen} />
                  <Orders />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ChatContextProvider>
  );
};

export default App;
