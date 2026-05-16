import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/slices/authSlice";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { authUser, isLoggingIn } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Student",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const { email, password } = formData;
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

  if (validationErrors) {
    return;
  }

    dispatch(
  login({
    email: formData.email,
    password: formData.password,
    role: formData.role,
  })
);
  };

  useEffect(() => {
    if (authUser) {
      switch (authUser.role) {
        case "Student":
          navigate("/student");
          break;
        case "Teacher":
          navigate("/teacher");
          break;
        case "Admin":
          navigate("/admin");
          break;
        default:
          navigate("/login");
      }
    }
  }, [authUser, navigate]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full">
        
        {/* Header section matching the image layout */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-3">
            Welcome Back
          </p>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Sign in to continue
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Custom Role Selector (Tabbed Design) */}
          <div className="flex p-1 mb-6 bg-slate-100 rounded-xl border border-slate-200">
            {["Student", "Teacher", "Admin"].map((roleOption) => (
              <button
                key={roleOption}
                type="button"
                onClick={() => setFormData({ ...formData, role: roleOption })}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  formData.role === roleOption
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
                }`}
              >
                {roleOption}
              </button>
            ))}
          </div>

          {/* Email Input */}
          <div className="mb-5">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="piyu@gmail.com"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                  errors.email ? "border-red-500" : "border-slate-200"
                } text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-sm mt-1.5">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${
                  errors.password ? "border-red-500" : "border-slate-200"
                } text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-sm mt-1.5">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-3.5 px-4 bg-[#7A5AF8] text-white text-base font-semibold rounded-xl hover:bg-[#6849E8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A5AF8] transition-colors ${
              isLoggingIn ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoggingIn ? "Signing in..." : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-8">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="px-4 text-sm text-slate-400">New User?</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        {/* Footer Links */}
        <div className="flex items-center justify-between mt-2">
          <Link
            to="/register"
            className="text-sm font-medium text-[#7A5AF8] hover:text-[#6849E8] flex items-center group"
          >
            Create an account
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/forgot-password"
            className="text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            Forgot password?
          </Link>
        </div>
        
      </div>
    </div>
  );
};

export default LoginPage;