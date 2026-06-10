import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteNotification,
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../../store/slices/notificationSlice";
import {
  ChevronDown,
  MessageCircle,
  Clock5,
  BadgeCheck,
  Calendar,
  Settings,
  User,
  AlertCircle,
  Clock,
  CheckCircle2,
  Bell,
  Trash2,
  CheckCheck,
  Eye,
} from "lucide-react";

/* ─── icon per type ─── */
const getNotificationIcon = (type) => {
  const base = "w-5 h-5";
  switch (type) {
    case "feedback":
      return (
        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
          <MessageCircle className={`${base} text-blue-600`} />
        </div>
      );
    case "deadline":
      return (
        <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
          <Clock5 className={`${base} text-red-600`} />
        </div>
      );
    case "approval":
      return (
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <BadgeCheck className={`${base} text-green-600`} />
        </div>
      );
    case "meeting":
      return (
        <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
          <Calendar className={`${base} text-purple-600`} />
        </div>
      );
    case "system":
      return (
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
          <Settings className={`${base} text-slate-500`} />
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0 relative">
          <User className="w-4 h-4 text-violet-600 absolute top-2" />
          <ChevronDown className="w-3.5 h-3.5 text-violet-600 absolute top-5" />
        </div>
      );
  }
};

/* ─── priority badge ─── */
const PriorityBadge = ({ priority }) => {
  const map = {
    high: "bg-red-100    text-red-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-green-100  text-green-700",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[priority] || "bg-slate-100 text-slate-600"}`}
    >
      {priority || "normal"}
    </span>
  );
};

/* ─── type badge ─── */
const TypeBadge = ({ type }) => {
  const map = {
    feedback: "bg-blue-100   text-blue-700",
    deadline: "bg-red-100    text-red-700",
    approval: "bg-green-100  text-green-700",
    meeting: "bg-purple-100 text-purple-700",
    system: "bg-slate-100  text-slate-600",
    request: "bg-violet-100 text-violet-700",
    rejection: "bg-rose-100   text-rose-700",
    general: "bg-slate-100  text-slate-600",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${map[type] || "bg-slate-100 text-slate-600"}`}
    >
      {type || "general"}
    </span>
  );
};

/* ─── date helper ─── */
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

/* ════════════════════════════════════════════════ */
const NotificationsPage = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state) => state.notification.list);
  const unreadCount = useSelector((state) => state.notification.unreadCount);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const markAsReadHandler = (id) => dispatch(markNotificationAsRead(id));
  const markAllAsReadHandler = () => dispatch(markAllNotificationsAsRead());
  const deleteNotificationHandler = (id) => dispatch(deleteNotification(id));

  const stats = [
    {
      title: "Total",
      value: notifications.length,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      titleColor: "text-blue-700",
      valueColor: "text-blue-900",
      Icon: Bell,
    },
    {
      title: "Unread",
      value: unreadCount,
      bg: "bg-red-50",
      iconBg: "bg-red-100",
      textColor: "text-red-600",
      titleColor: "text-red-700",
      valueColor: "text-red-900",
      Icon: AlertCircle,
    },
    {
      title: "High Priority",
      value: notifications.filter((n) => n.priority === "high").length,
      bg: "bg-yellow-50",
      iconBg: "bg-yellow-100",
      textColor: "text-yellow-600",
      titleColor: "text-yellow-700",
      valueColor: "text-yellow-900",
      Icon: Clock,
    },
    {
      title: "This Week",
      value: notifications.filter((n) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return new Date(n.createdAt || n.date) >= weekAgo;
      }).length,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      textColor: "text-green-600",
      titleColor: "text-green-700",
      valueColor: "text-green-900",
      Icon: CheckCircle2,
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
                  <Bell className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <h2 className="card-title">Notifications</h2>
                  <p className="text-sm text-slate-400 mt-0.5 max-w-md leading-snug">
                    Stay updated with the latest news related to your projects,
                    deadlines, and feedback.
                  </p>
                </div>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsReadHandler}
                  className="btn-outline btn-small flex items-center gap-1.5 self-start"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark All as Read
                </button>
              )}
            </div>
          </div>

          {/* ── Stats ── */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {stats.map((stat, i) => (
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
                    className={`text-xs font-semibold uppercase tracking-wide ${stat.titleColor}`}
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

          {/* ── Notification List ── */}
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
                <Bell className="w-7 h-7 text-violet-400" />
              </div>
              <p className="text-base font-semibold text-slate-600">
                All caught up!
              </p>
              <p className="text-sm text-slate-400 mt-1">
                No notifications right now. Check back later.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`flex items-start justify-between gap-4 px-4 py-4 rounded-xl transition-colors
                    ${notification.isRead ? "bg-white" : "bg-violet-50/60"}`}
                >
                  {/* Left: icon + content */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {getNotificationIcon(notification.type)}

                    <div className="flex-1 min-w-0">
                      {/* top row: title + badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-sm font-semibold text-slate-800 truncate">
                          {notification.title ||
                            notification.message?.slice(0, 50)}
                        </p>
                        <TypeBadge type={notification.type} />
                        <PriorityBadge priority={notification.priority} />
                        {!notification.isRead && (
                          <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
                        )}
                      </div>

                      {/* message */}
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {notification.message}
                      </p>

                      {/* timestamp */}
                      <p className="text-xs text-slate-400 mt-1.5">
                        {formatDate(
                          notification.createdAt || notification.date,
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 pt-0.5">
                    {!notification.isRead && (
                      <button
                        onClick={() => markAsReadHandler(notification._id)}
                        className="btn-outline btn-small flex items-center gap-1"
                        title="Mark as read"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Read</span>
                      </button>
                    )}
                    <button
                      onClick={() =>
                        deleteNotificationHandler(notification._id)
                      }
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium
                        border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationsPage;
