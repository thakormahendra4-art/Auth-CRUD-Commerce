import { useRegister } from "../hooks/auth.hook";


const RegisterPage = () => {


  const {message,onSubmit,handleSubmit,errors,register,isSyncing,navigate} = useRegister()

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mb-6">Register your account</p>

        {message && (
          <p className="text-center text-sm text-blue-600 mb-4">{message}</p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <input
            type="text"
            placeholder="First Name"
            {...register("firstName", {
              required: "First name is required",
            })}
            className="w-full px-4 py-3 border rounded-lg"
          />

          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}

          {/* Last Name */}
          <input
            type="text"
            placeholder="Last Name"
            {...register("lastName", {
              required: "Last name is required",
            })}
            className="w-full px-4 py-3 border rounded-lg"
          />

          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}

          {/* Mobile */}
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
            className="w-full px-4 py-3 border rounded-lg"
          />

          {errors.mobile && (
            <p className="text-red-500 text-sm">{errors.mobile.message}</p>
          )}

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
            })}
            className="w-full px-4 py-3 border rounded-lg"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
            className="w-full px-4 py-3 border rounded-lg"
          />

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={isSyncing}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-60"
          >
            {isSyncing ? "Syncing..." : "Register"}
          </button>
        </form>

        {/* Login Navigation */}
        <div className="text-center mt-4">
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
