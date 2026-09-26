import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLogin } from "../hooks/auth.hook";

const LoginPage = () => {
  const { handleSubmit, onSubmit, register, errors, navigate, isLoading, error } =
    useLogin();
  const cardRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        cardRef.current,
        { y: 35, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }
      );
      gsap.from(".form-item", {
        y: 15,
        opacity: 0,
        stagger: 0.08,
        duration: 0.5,
        delay: 0.2,
        ease: "power2.out",
      });
    },
    { scope: cardRef }
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div
        ref={cardRef}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Welcome Back
        </h2>

        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="form-item">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="form-item">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              {...register("password", {
                required: "Password is required",
              })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Login Button */}
          <div className="form-item">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>

        {/* Register Navigation */}
        <div className="form-item text-center mt-4">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
