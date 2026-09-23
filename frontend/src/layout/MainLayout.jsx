import { Outlet } from "react-router";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <div>
      <Navbar/>

      <main className="h-[100vh] bg-red-100">
        <Outlet/>
      </main>
    </div>
  );
};

export default MainLayout;