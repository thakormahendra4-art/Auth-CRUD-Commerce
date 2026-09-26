import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRegister } from "../hooks/auth.hook";

const RegisterPage = () => {
  const {
    message,
    onSubmit,
    handleSubmit,
    errors,
    register,
    watch,
    isSyncing,
    navigate,
  } = useRegister();
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
        stagger: 0.06,
        duration: 0.45,
        delay: 0.15,
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
          Create Account
        </h2>

        <p className="text-center text-gray-500 mb-6">Register your account</p>

        {message && (
          <p className="text-center text-sm text-blue-600 mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="form-item">
            <input
              type="text"
              placeholder="Name"
              {...register("name", {
                required: "Name is required",
              })}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div className="form-item">
            <input
              type="tel"
              placeholder="Mobile"
              {...register("mobile", {
                required: "Mobile is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit mobile number",
                },
              })}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="form-item">
            <input
              type="email"
              placeholder="Email"
              {...register("email", {
                required: "Email is required",
              })}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-item">
            <input
              type="password"
              placeholder="Password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-item">
            <input
              type="password"
              placeholder="Confirm Password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (val) =>
                  val === watch("password") || "Passwords do not match",
              })}
              className="w-full px-4 py-3 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="form-item">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Register as
            </label>
            <select
              {...register("role")}
              defaultValue="customer"
              className="w-full px-4 py-3 border rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="customer">Customer / Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* Register Button */}
          <div className="form-item">
            <button
              type="submit"
              disabled={isSyncing}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60 active:scale-95"
            >
              {isSyncing ? "Syncing..." : "Register"}
            </button>
          </div>
        </form>

        {/* Login Navigation */}
        <div className="form-item text-center mt-4">
          <p className="text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
