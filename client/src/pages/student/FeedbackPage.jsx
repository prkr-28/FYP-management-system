import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProject, getFeedBack } from "../../store/slices/studentSlice";
import {
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BookOpen,
  Calendar,
  User,
} from "lucide-react";

/* ─── type config ─── */
const typeConfig = {
  positive: {
    border: "border-l-green-400",
    bg: "bg-green-50",
    badge: "bg-green-100 text-green-700",
    icon: <ThumbsUp className="w-4 h-4 text-green-600" />,
    iconBox: "bg-green-100",
  },
  negative: {
    border: "border-l-red-400",
    bg: "bg-red-50",
    badge: "bg-red-100 text-red-700",
    icon: <ThumbsDown className="w-4 h-4 text-red-600" />,
    iconBox: "bg-red-100",
  },
  general: {
    border: "border-l-violet-400",
    bg: "bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
    icon: <MessageSquare className="w-4 h-4 text-violet-600" />,
    iconBox: "bg-violet-100",
  },
};

const fmt = (d) => {
  if (!d) return "";
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/* ════════════════════════════════════════════════ */
const FeedbackPage = () => {
  const dispatch = useDispatch();
  const { project, feedback } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchProject());
  }, [dispatch]);

  useEffect(() => {
    if (project?._id) dispatch(getFeedBack(project._id));
  }, [dispatch, project?._id]);

  const list = feedback || [];

  const feedbackStats = [
    {
      title: "Total Feedback",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-700",
      valueColor: "text-blue-900",
      Icon: MessageCircle,
      value: list.length,
    },
    {
      title: "Positive",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-700",
      valueColor: "text-green-900",
      Icon: ThumbsUp,
      value: list.filter((f) => f.type === "positive").length,
    },
    {
      title: "Needs Revision",
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-700",
      valueColor: "text-yellow-900",
      Icon: ThumbsDown,
      value: list.filter((f) => f.type === "negative").length,
    },
  ];

  return (
    <>
      <div className="space-y-6">
        <div className="card">
          {/* ── card-header ── */}
          <div className="card-header">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="card-title">Feedback</h2>
                  <p className="text-sm text-slate-400 mt-0.5">
                    Supervisor feedback on your project submissions
                  </p>
                </div>
              </div>

              {/* project pill */}
              {project?.title && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-50 border border-violet-100 rounded-xl self-start">
                  <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                  <span className="text-xs font-semibold text-violet-700 max-w-[180px] truncate">
                    {project.title}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {feedbackStats.map((stat, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl ${stat.bg} flex items-center gap-3`}
              >
                <div
                  className={`w-10 h-10 ${stat.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <stat.Icon className={`w-5 h-5 ${stat.textColor}`} />
                </div>
                <div>
                  <p
                    className={`text-xs font-semibold uppercase tracking-wide ${stat.textColor}`}
                  >
                    {stat.title}
                  </p>
                  <p className={`text-xl font-bold ${stat.valueColor}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Feedback List ── */}
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
                <MessageCircle className="w-7 h-7 text-violet-400" />
              </div>
              <p className="text-base font-semibold text-slate-600">
                No feedback yet
              </p>
              <p className="text-sm text-slate-400 mt-1">
                Your supervisor's feedback will appear here once submitted.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {list.map((fb, i) => {
                const cfg = typeConfig[fb.type] || typeConfig.general;
                return (
                  <div
                    key={fb._id || i}
                    className={`border-l-4 rounded-r-xl p-5 ${cfg.border} ${cfg.bg}`}
                  >
                    {/* top row */}
                    <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-7 h-7 rounded-lg ${cfg.iconBox} flex items-center justify-center flex-shrink-0`}
                        >
                          {cfg.icon}
                        </div>
                        <p className="text-sm font-bold text-slate-800">
                          {fb.title}
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${cfg.badge}`}
                      >
                        {fb.type || "general"}
                      </span>
                    </div>

                    {/* message */}
                    <p className="text-sm text-slate-600 leading-relaxed ml-9">
                      {fb.message}
                    </p>

                    {/* footer */}
                    <div className="flex items-center gap-4 mt-3 ml-9">
                      {fb.createdAt && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Calendar className="w-3.5 h-3.5" />
                          {fmt(fb.createdAt)}
                        </div>
                      )}
                      {fb.supervisorName && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <User className="w-3.5 h-3.5" />
                          {fb.supervisorName}
                        </div>
                      )}
                      {fb.supervisorEmail && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Mail className="w-3.5 h-3.5" />
                          {fb.supervisorEmail}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FeedbackPage;
