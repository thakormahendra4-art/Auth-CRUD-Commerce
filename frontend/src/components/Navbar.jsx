import { NavLink, useNavigate } from "react-router";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("pendingRegistration");

    navigate("/");
  };

  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <NavLink to="/main" className="text-2xl font-bold text-gray-900">
          My<span className="text-lime-500">Logo</span>
        </NavLink>

        {/* Navigation Links */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/main"
            className="text-gray-700 transition hover:text-lime-500"
          >
            Home
          </NavLink>

          <NavLink
            to="about"
            className="text-gray-700 transition hover:text-lime-500"
          >
            About
          </NavLink>

          <NavLink
            to="product"
            className="text-gray-700 transition hover:text-lime-500"
          >
            Product
          </NavLink>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-lime-500 hover:text-gray-900"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
