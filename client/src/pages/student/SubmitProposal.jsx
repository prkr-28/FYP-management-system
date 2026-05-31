import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitProjectProposal } from "../../store/slices/studentSlice";

const SubmitProposal = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(submitProjectProposal(formData));
      setFormData({ title: "", description: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    loading || !formData.title.trim() || !formData.description.trim();

  return (
    <div className="p-6 space-y-6">
      {/* Card — full width, stretched */}
      <div className="card p-0 overflow-hidden">
        {/* Colored top accent bar */}
        <div className="h-1 w-full bg-blue-500" />

        {/* Header Section */}
        <div className="px-8 pt-6 pb-5 border-b border-slate-200 flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                />
              </svg>
            </div>
            <div>
              <h1 className="card-title">Submit Proposal</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Please fill out all sections of your project proposal. Make sure
                to be detailed and clear about your project goals.
              </p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="px-8 py-7 space-y-5">
            {/* Project Title */}
            <div className="space-y-2">
              <label className="label mb-0">
                Project Title
                <span className="text-red-400 ml-1">*</span>
              </label>
              <p className="text-xs text-slate-400 -mt-1">
                A clear, concise name for your final year project.
              </p>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter your project title"
                maxLength={200}
                className="input text-sm"
              />
              <div className="flex justify-end">
                <span className="text-xs text-slate-400">
                  {formData.title.length}/200
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-slate-100" />

            {/* Project Description */}
            <div className="space-y-2">
              <label className="label mb-0">
                Project Description
                <span className="text-red-400 ml-1">*</span>
              </label>
              <p className="text-xs text-slate-400 -mt-1">
                Describe your objectives, methodology, tools/technologies, and
                expected outcomes.
              </p>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of your project..."
                maxLength={2000}
                rows={8}
                className="input resize-none leading-relaxed text-sm"
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                    />
                  </svg>
                  Tip: Include problem statement, scope, and tech stack
                </div>
                <span
                  className={`text-xs ${formData.description.length > 1800 ? "text-yellow-500 font-medium" : "text-slate-400"}`}
                >
                  {formData.description.length}/2000
                </span>
              </div>
            </div>

            {/* Guidelines callout */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-5 py-4 flex gap-3">
              <svg
                className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <p className="text-xs text-blue-600 leading-relaxed">
                Your proposal will be reviewed by your assigned supervisor. You
                may be asked to revise it before final approval. Ensure all
                information is accurate and complete before submitting.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 flex-wrap">
            {submitted ? (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-2 rounded-lg font-medium">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Proposal submitted successfully!
              </div>
            ) : (
              <p className="flex items-center gap-1.5 text-xs text-slate-400">
                <span className="text-red-400">*</span> Required fields must be
                completed before submitting.
              </p>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ title: "", description: "" })}
                className="btn-outline btn-small"
              >
                Clear
              </button>
              <button
                type="submit"
                disabled={isDisabled}
                className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                      />
                    </svg>
                    Submit Proposal
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitProposal;
