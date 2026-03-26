import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login, error, clearError, isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    await login(data);
  };

  useEffect(() => {
    if (isAuthenticated && currentUser) {
        if(currentUser.role === 'USER'){
            navigate('/user-dashboard')
        } else if (currentUser.role === 'AUTHOR'){
            navigate('/author-dashboard')
        } else if (currentUser.role === 'ADMIN'){
            navigate('/admin-dashboard')
        }
    }
  }, [isAuthenticated, currentUser, navigate]);

  useEffect(() => {
    if(error){
        toast.error(error);
        clearError();
    }
  }, [error, clearError])

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
            New here?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
