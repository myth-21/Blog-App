import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useState, useEffect } from "react";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    clearErrors,
  } = useForm();
  const navigate = useNavigate();
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const onSubmit = async (newUser) => {
    try {
      let endpoint = "http://localhost:4000/user-api/users";
      if (newUser.role === "AUTHOR") {
        endpoint = "http://localhost:4000/author-api/users";
      } else if (newUser.role === "ADMIN") {
        endpoint = "http://localhost:4000/admin-api/register";
      }

      // Create form data object
      const formData = new FormData();
      //get user object
      let { role, profilePic, ...userObj } = newUser;
      
      // Explicitly append role as it's required by schema
      formData.append("role", role);

      //add all fields except role and profilePic to FormData object
      Object.keys(userObj).forEach((key) => {
        formData.append(key, userObj[key]);
      });
      // add profilePic to Formdata object if it exists
      if (profilePic && profilePic[0]) {
        formData.append("profilePic", profilePic[0]);
      }

      const res = await axios.post(endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        toast.success("Registration successful! Please login.");
        reset();
        setPreview(null);
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        toast.error(err.response.data.message);
      } else {
        toast.error("Registration failed");
      }
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-100 py-10">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Register
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              First Name
            </label>
            <input
              type="text"
              {...register("firstName", { required: "First name is required" })}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <input
              type="text"
              {...register("lastName")}
              className="w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

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

          {/* Profile Picture */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Profile Picture
            </label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              {...register("profilePic")}
              onChange={(e) => {
                //get image file
                const file = e.target.files[0];
                // validation for image format
                if (file) {
                  if (!["image/jpeg", "image/png"].includes(file.type)) {
                    setError("profilePic", { message: "Only JPG or PNG allowed" });
                    setPreview(null);
                    return;
                  }
                  //validation for file size
                  if (file.size > 2 * 1024 * 1024) {
                    setError("profilePic", { message: "File size must be less than 2MB" });
                    setPreview(null);
                    return;
                  }
                  //Converts file → temporary browser URL(create preview URL)
                  const previewUrl = URL.createObjectURL(file);
                  setPreview(previewUrl);
                  clearErrors("profilePic");
                } else {
                  setPreview(null);
                }
              }}
              className="w-full rounded-md border border-gray-300 p-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            {errors.profilePic && (
              <p className="mt-1 text-xs text-red-500">{errors.profilePic.message}</p>
            )}
            {preview && (
              <div className="mt-3 flex justify-center">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full border"
                />
              </div>
            )}
          </div>

          {/* Role Selection */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Register as:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="USER"
                  {...register("role", { required: "Please select a role" })}
                  defaultChecked
                />
                <span className="text-sm">User</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="AUTHOR"
                  {...register("role", { required: "Please select a role" })}
                />
                <span className="text-sm">Author</span>
              </label>
            </div>
            {errors.role && (
              <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 focus:outline-none"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
