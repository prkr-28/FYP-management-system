import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const {isRequestingForToken} = useSelector((state)=>state.auth);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call or use your actual dispatch
      // await dispatch(forgetPassword({ email })).unwrap();
      
      setIsLoading(false);
      setIsSuccess(true);
    } catch (err) {
      setError("Failed to send password reset email");
      setIsLoading(false);
    }
  };

  // Success State UI
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-3">
            Check your email
          </h1>
          <p className="text-slate-500 mb-8">
            We've sent a password reset link to <br />
            <span className="font-medium text-slate-900">{email}</span>
          </p>
          
          <Link
            to="/login"
            className="w-full inline-flex justify-center items-center py-3.5 px-4 bg-[#7A5AF8] text-white text-base font-semibold rounded-xl hover:bg-[#6849E8] transition-colors"
          >
            Back to log in
          </Link>
        </div>
      </div>
    );
  }

  // Main Form UI
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full">
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left">
          <p className="text-xs font-bold tracking-widest text-indigo-600 uppercase mb-3">
            Account Recovery
          </p>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
            Forgot password?
          </h1>
          <p className="text-slate-500">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="email"
                id="email"
                placeholder="piyu@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                  error ? "border-red-500" : "border-slate-200"
                } text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors`}
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-1.5">{error}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3.5 px-4 bg-[#7A5AF8] text-white text-base font-semibold rounded-xl hover:bg-[#6849E8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#7A5AF8] transition-colors ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Sending..." : "Reset password"}
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

export default ForgotPasswordPage;