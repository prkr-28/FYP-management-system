import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../store/slices/studentSlice";
import {
  FileText,
  User,
  Clock,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  Star,
  Bell,
  ChevronRight,
  Calendar,
} from "lucide-react";
import { Link } from "react-router-dom";

/* ─── helpers ─── */
const fmt = (d) => {
  if (!d) return "N/A";
  return new Date(d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const statusConfig = {
  pending: {
    label: "Pending",
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    icon: AlertCircle,
  },
  approved: {
    label: "Approved",
    bg: "bg-green-100",
    text: "text-green-700",
    icon: CheckCircle,
  },
  rejected: {
    label: "Rejected",
    bg: "bg-red-100",
    text: "text-red-700",
    icon: XCircle,
  },
  completed: {
    label: "Completed",
    bg: "bg-purple-100",
    text: "text-purple-700",
    icon: Star,
  },
};

const feedbackBorder = {
  positive: "border-l-green-400  bg-green-50",
  negative: "border-l-red-400    bg-red-50",
  general: "border-l-violet-400 bg-violet-50",
};
const feedbackBadge = {
  positive: "bg-green-100  text-green-700",
  negative: "bg-red-100    text-red-700",
  general: "bg-violet-100 text-violet-700",
};

const notifDot = {
  request: "bg-violet-500",
  approval: "bg-green-500",
  rejection: "bg-red-500",
  feedback: "bg-blue-500",
  deadline: "bg-amber-500",
  general: "bg-slate-400",
  meeting: "bg-purple-500",
  system: "bg-slate-400",
};
const notifBadge = {
  request: "bg-violet-100 text-violet-700",
  approval: "bg-green-100  text-green-700",
  rejection: "bg-red-100    text-red-700",
  feedback: "bg-blue-100   text-blue-700",
  deadline: "bg-amber-100  text-amber-700",
  general: "bg-slate-100  text-slate-600",
  meeting: "bg-purple-100 text-purple-700",
  system: "bg-slate-100  text-slate-600",
};

/* ════════════════════════════════════════════ */
const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { dashboardStats } = useSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const project = dashboardStats?.project || {};
  const supervisorName = dashboardStats?.supervisorName || "";
  const upcomingDeadlines = dashboardStats?.upcomingDeadLined || [];
  const feedBackNotifications =
    dashboardStats?.feedBackNotifications?.slice(-2).reverse() || [];
  const topNotifications = dashboardStats?.topNotifications || [];

  const projStatus = project?.status;
  const sCfg = statusConfig[projStatus];
  const StatusIcon = sCfg?.icon || AlertCircle;

  const quickStats = [
    {
      label: "Project Title",
      value: project?.title || "No Project",
      icon: FileText,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      label: "Supervisor",
      value: supervisorName || "Not Assigned",
      icon: User,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Next Deadline",
      value: fmt(project?.deadline),
      icon: Clock,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Recent Feedback",
      value:
        feedBackNotifications.length > 0
          ? `${feedBackNotifications.length} new`
          : "No Feedback",
      icon: MessageSquare,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <>
      <div className="space-y-6">
        {/* ── Hero Banner ── */}
        <div
          className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg"
          style={{
            background:
              "linear-gradient(135deg,#7A5AF8 0%,#6366F1 60%,#818CF8 100%)",
          }}
        >
          <div className="absolute -top-10 -right-10 w-44 h-44 bg-white/10 rounded-full" />
          <div className="absolute -bottom-14 right-28 w-56 h-56 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <p className="text-white/70 text-sm font-medium mb-0.5">
              Welcome back,
            </p>
            <h1 className="text-2xl font-bold mb-1">
              {authUser?.name || "Student"}
            </h1>
            <p className="text-white/80 text-sm">
              Here's your project overview and recent updates
            </p>
            {sCfg && (
              <span className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold bg-white/20 backdrop-blur-sm">
                <StatusIcon className="w-4 h-4" /> Project: {sCfg.label}
              </span>
            )}
          </div>
        </div>

        {/* ── Quick Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map(({ label, value, icon: Icon, iconBg, iconColor }) => (
            <div key={label} className="card">
              <div className="flex items-center">
                <div className={`p-3 ${iconBg} rounded-xl flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${iconColor}`} />
                </div>
                <div className="ml-4 min-w-0">
                  <p className="text-sm font-medium text-slate-500">{label}</p>
                  <p className="text-base font-semibold text-slate-800 truncate">
                    {value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Main Grid: Project Overview + Latest Feedback ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Overview */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="card-title">Project Overview</h2>
              {/* <Link
                to="/student/proposal"
                className="flex items-center gap-0.5 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
              >
                View <ChevronRight className="w-3.5 h-3.5" />
              </Link> */}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Title
                </label>
                <p className="text-base font-semibold text-slate-800">
                  {project?.title || "No title available"}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                  Description
                </label>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                  {project?.description || "No description available"}
                </p>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Status
                  </label>
                  {sCfg ? (
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${sCfg.bg} ${sCfg.text}`}
                    >
                      <StatusIcon className="w-3 h-3" /> {sCfg.label}
                    </span>
                  ) : (
                    <span className="text-sm font-medium text-slate-500">
                      N/A
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">
                    Submission Deadline
                  </label>
                  <p className="text-sm font-semibold text-slate-700">
                    {fmt(project?.deadline)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Latest Feedback */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="card-title">Latest Feedback</h2>
              <Link
                to="/student/feedback"
                className="flex items-center gap-0.5 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {feedBackNotifications && feedBackNotifications.length > 0 ? (
              <div className="space-y-3">
                {feedBackNotifications.map((fb, i) => (
                  <div
                    key={fb._id || i}
                    className={`border-l-4 rounded-r-xl p-4 ${feedbackBorder[fb.type] || feedbackBorder.general}`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="text-sm font-bold text-slate-800">
                        {fb.title || "Supervisor Feedback"}
                      </p>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${feedbackBadge[fb.type] || feedbackBadge.general}`}
                      >
                        {fb.type || "general"}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {fb.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-2">
                      {fmt(fb.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mb-3">
                  <MessageSquare className="w-5 h-5 text-violet-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  No feedback yet
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Your supervisor's feedback will appear here
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Bottom Grid: Upcoming Deadlines + Notifications ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Upcoming Deadlines */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="card-title">Upcoming Deadlines</h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                <Calendar className="w-3 h-3" /> {upcomingDeadlines.length}{" "}
                upcoming
              </span>
            </div>

            {upcomingDeadlines.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeadlines.map((d, i) => (
                  <div
                    key={d._id || i}
                    className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-xl"
                  >
                    <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">
                        {d.name}
                      </p>
                      <p className="text-xs text-amber-600 font-medium mt-0.5">
                        {fmt(d.dueDate)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5 text-amber-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  No upcoming deadlines
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="card-header flex items-center justify-between">
              <h2 className="card-title">Notifications</h2>
              <Link
                to="/student/notifications"
                className="flex items-center gap-0.5 text-xs font-semibold text-violet-600 hover:text-violet-800 transition-colors"
              >
                View all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {topNotifications.length > 0 ? (
              <div className="divide-y divide-slate-50">
                {topNotifications.map((n, i) => (
                  <div
                    key={n._id || i}
                    className="flex gap-3 items-start py-3 first:pt-0 last:pb-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${notifDot[n.type] || "bg-slate-400"}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-700 leading-snug">
                        {n.message}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${notifBadge[n.type] || "bg-slate-100 text-slate-600"}`}
                        >
                          {n.type}
                        </span>
                        <span className="text-xs text-slate-400">
                          {fmt(n.createdAt)}
                        </span>
                      </div>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0 mt-1.5" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 bg-violet-100 rounded-2xl flex items-center justify-center mb-3">
                  <Bell className="w-5 h-5 text-violet-500" />
                </div>
                <p className="text-sm font-semibold text-slate-600">
                  All caught up!
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  No new notifications
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDashboard;
