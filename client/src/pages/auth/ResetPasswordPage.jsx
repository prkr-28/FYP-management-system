import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// Assuming you have this action exported from your authSlice
// import { resetPassword } from "../../store/slices/authSlice"; 
import { Lock, Eye, EyeOff, ArrowLeft, AlertCircle } from "lucide-react";
import { resetPassword } from "../../store/slices/authSlice";

const ResetPasswordPage = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isUpdatingPassword } = useSelector((state) => state.auth);
  const token = searchParams.get("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear specific field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    // Clear general error as well
    if (errors.general) {
      setErrors((prev) => ({ ...prev, general: null }));
    }
  };

  const validateForm = () => {
    const { password, confirmPassword } = formData;
    const newErrors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0 ? null : newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (validationErrors) {
      return;
    }

    try {
      await dispatch(resetPassword({ token, password: formData.password, confirmPassword: formData.confirmPassword })).unwrap();
      navigate("/login");
    } catch (error) {
      setErrors((prev) => ({
        ...prev,
        general: error.message || "Failed to reset password. Please try again."
      }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-3">
            Secure Account
          </p>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Set new password
          </h1>
          <p className="text-slate-500">
            Your new password must be different to previously used passwords.
          </p>
        </div>

        {/* General Error Alert */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start text-red-600">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
            <span className="text-sm font-medium">{errors.general}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Password Input */}
          <div className="mb-5">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
              New Password
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

          {/* Confirm Password Input */}
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                id="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${
                  errors.confirmPassword ? "border-red-500" : "border-slate-200"
                } text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1.5">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            disabled={isUpdatingPassword}
            className={`w-full py-3.5 px-4 bg-[#7A5AF8] text-white text-base font-semibold rounded-xl hover:bg-[#6849E8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A5AF8] transition-colors ${
              isUpdatingPassword ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isUpdatingPassword ? "Resetting password..." : "Reset password"}
          </button>
        </form>

        {/* Footer Link */}
        <div className="mt-8 text-center sm:text-left">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-500 hover:text-slate-800 flex items-center justify-center sm:justify-start group transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to log in
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ResetPasswordPage;


