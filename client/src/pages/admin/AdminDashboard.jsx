import { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import AddTeacher from "../../components/modal/AddTeacher";
import { toast } from "react-toastify";
import {
  getAllProjects,
  getDashBoardStats,
} from "../../store/slices/adminSlice";
import { fetchNotifications } from "../../store/slices/notificationSlice";
import { downloadFile } from "../../store/slices/projectSlice";
import {
  User,
  Box,
  AlertCircle,
  Folder,
  AlertTriangle,
  PlusIcon,
  FileTextIcon,
  X,
  Download,
} from "lucide-react";
import {
  toggleStudentModel,
  toggleTeacherModel,
} from "../../store/slices/popupSlice.js";
import { axiosInstance } from "../../lib/axios.js";

const AdminDashboard = () => {
  const { isCreateStudentModelOpen, isCreateTeacherModelOpen } = useSelector(
    (state) => state.popup,
  );

  const { stats, projects } = useSelector((state) => state.admin);
  //const { projects } = useSelector((state) => state.project);
  const { notifications } = useSelector((state) => state.notification.list);

  const dispatch = useDispatch();

  const [isReportModelOpen, setIsReportModelOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");

  useEffect(() => {
    dispatch(getDashBoardStats());
    dispatch(fetchNotifications());
    dispatch(getAllProjects());
  }, [dispatch]);

  const nearingDeadlines = useMemo(() => {
    const now = new Date();
    const threeDays = 3 * 24 * 60 * 60 * 1000;

    return (projects || []).filter((p) => {
      if (!p.deadline) return false;
      const d = new Date(p.deadline);
      return d >= now && d.getTime() - now.getTime() <= threeDays;
    }).length;
  }, [projects]);

  const files = useMemo(() => {
    return (projects || []).flatMap((p) =>
      (p.files || []).map((f) => ({
        projectId: p._id,
        projectTitle: p.title,
        studentName: p.student?.name,
        originalName: f.originalName,
        uploadedAt: f.uploadedAt,
        fileId: f._id,
      })),
    );
  }, [projects]);

  const filteredFiles = files.filter(
    (f) =>
      f.originalName.toLowerCase().includes(reportSearch.toLowerCase()) ||
      f.projectTitle.toLowerCase().includes(reportSearch.toLowerCase()) ||
      f.studentName.toLowerCase().includes(reportSearch.toLowerCase()),
  );

  console.log(filteredFiles);

  const handleDownload = async ({ projectId, fileId, name }) => {
    try {
      const res = await axiosInstance.get(
        `/project/${projectId}/files/${fileId}/download`,
        {
          responseType: "blob",
        },
      );

      // If server returned an error JSON wrapped as blob, parse and show it
      if (res.data.type === "application/json") {
        const text = await res.data.text();
        const err = JSON.parse(text);
        toast.error(err.message || "Download failed.");
        return;
      }

      const url = URL.createObjectURL(res.data);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: file.originalName || "downloaded_file",
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`"${file.originalName}" downloaded successfully.`);
    } catch (err) {
      // Axios error with blob response — try to parse the JSON error body
      if (err.response?.data instanceof Blob) {
        try {
          const text = await err.response.data.text();
          const parsed = JSON.parse(text);
          toast.error(parsed.message || "Download failed.");
        } catch {
          toast.error("Download failed. Please try again.");
        }
      } else {
        toast.error(
          err.response?.data?.message || "Download failed. Please try again.",
        );
      }
    }
  };

  const supervisorsBucket = useMemo(() => {
    const map = new Map();
    (projects || []).forEach((p) => {
      if (!p?.supervisor?.name) return;
      const name = p.supervisor.name;
      map.set(name, (map.get(name) || 0) + 1);
    });

    const arr = Array.from(map.entries()).map(([name, count]) => ({
      name,
      count,
    }));
    arr.sort((a, b) => b.count - a.count);
    return arr;
  }, [projects]);

  const latestNotifications = useMemo(() => {
    return (notifications || []).slice(0, 6);
  }, [notifications]);

  const getBulletColor = (type, priority) => {
    const t = (type || "").toLowerCase();
    const p = (priority || "").toLowerCase();
    if (p === "high" && (t === "rejection" || t === "reject"))
      return "bg-red-600";
    if (p === "medium" && (t === "deadline" || t === "due"))
      return "bg-orange-500";
    if (p === "high") return "bg-red-500";
    if (p === "medium") return "bg-yellow-500";
    if (p === "low") return "bg-slate-400";
    // type-based fallback
    if (t === "approval" || t === "approved") return "bg-green-600";
    if (t === "request") return "bg-blue-600";
    if (t === "feedback") return "bg-purple-600";
    if (t === "meeting") return "bg-cyan-600";
    if (t === "system") return "bg-slate-600";
    return "bg-slate-400";
  };

  const getBadgeClasses = (kind, value) => {
    const v = (value || "").toLowerCase();
    if (kind === "type") {
      if (["rejection", "reject"].includes(v)) return "bg-red-100 text-red-800";
      if (["approval", "approved"].includes(v))
        return "bg-green-100 text-green-800";
      if (["deadline", "due"].includes(v))
        return "bg-orange-100 text-orange-800";
      if (v === "request") return "bg-blue-100 text-blue-800";
      if (v === "feedback") return "bg-purple-100 text-purple-800";
      if (v === "meeting") return "bg-cyan-100 text-cyan-800";
      if (v === "system") return "bg-slate-100 text-slate-800";
      return "bg-gray-100 text-gray-800";
    }
    // priority
    if (v === "high") return "bg-red-100 text-red-800";
    if (v === "medium") return "bg-yellow-100 text-yellow-800";
    if (v === "low") return "bg-gray-100 text-gray-800";
    return "bg-slate-100 text-slate-800";
  };

  const dashboardStats = [
    {
      title: "Total Students",
      value: stats?.totalStudents ?? 0,
      bg: "bg-blue-100",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      Icon: User,
    },
    {
      title: "Total Teachers",
      value: stats?.totalTeachers ?? 0,
      bg: "bg-green-100",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      Icon: Box,
    },
    {
      title: "Pending Requests",
      value: stats?.pendingRequests ?? 0,
      bg: "bg-orange-100",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      Icon: AlertCircle,
    },
    {
      title: "Active Projects",
      value: stats?.totalProjects ?? 0,
      bg: "bg-yellow-100",
      iconBg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      Icon: Folder,
    },
    {
      title: "Nearing Deadlines",
      value: nearingDeadlines,
      bg: "bg-red-100",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      Icon: AlertTriangle,
    },
  ];

  const actionButtons = [
    {
      label: "Add Student",
      onClick: () => dispatch(toggleStudentModel()),
      btnClass: "btn-primary",
      Icon: PlusIcon, // lucide-react icon
    },
    {
      label: "Add Teacher",
      onClick: () => dispatch(toggleTeacherModel()),
      btnClass: "btn-secondary",
      Icon: PlusIcon,
    },
    {
      label: "View Reports",
      onClick: () => setIsReportModelOpen(true),
      btnClass: "btn-outline",
      Icon: FileTextIcon,
    },
  ];

  return (
    <>
      {/* header */}
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-lg mt-2">
            Manage the entire project management system and oversee all
            activities.
          </p>
        </div>

        {/* stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {dashboardStats.map((iten, idx) => {
            return (
              <div className={`p-4 rounded-lg shadow-md ${iten.bg}`} key={idx}>
                <div className="flex items-center">
                  <div className={`p-2 rounded-lg ${iten.iconBg}`}>
                    <iten.Icon className={`w-6 h-6 ${iten.iconColor}`} />
                  </div>
                  <div className="ml-3">
                    <h2 className="text-sm font-semibold text-slate-600">
                      {iten.title}
                    </h2>
                    <p className="text-sm font-bold text-slate-800">
                      {iten.value}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* charts and activities */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* vertical bar chart */}
          <div className="lg:col-span-2 card">
            <div className="card-header">
              <h3 className="card-title">Projects per Supervisor</h3>
            </div>
            {supervisorsBucket.length == 0 ? (
              <div className="h-64 flex items-center justify-center text-slate-500">
                No data available
              </div>
            ) : (
              <div className="h-72">
                <ResponsiveContainer width={"100%"} height={"100%"}>
                  <BarChart
                    data={supervisorsBucket}
                    margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                    barCategoryGap={"20%"}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey={"name"}
                      tick={{ fontSize: 12, fill: "#334155" }}
                      axisLine={{ stroke: "#CBD5E1" }}
                      tickLine={{ stroke: "#CBD5E1" }}
                      interval={0}
                      height={50}
                      dy={10}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "#334155" }}
                      axisLine={{ stroke: "#CBD5E1" }}
                      tickLine={{ stroke: "#CBD5E1" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(99,102,241,0.05" }}
                      contentStyle={{ borderRadius: 8, borderColor: "#CBD5E1" }}
                      formatter={(value, name) => [
                        value,
                        name === "count" ? "ProjectAssigned" : name,
                      ]}
                      labelFormatter={(label) => `Supervisor: ${label}`}
                    />
                    <Bar dataKey="count" fill="#8884d8">
                      {supervisorsBucket.map((entry, index) => {
                        const colors = [
                          "#60A5FA",
                          "#34D399",
                          "#FBBF24",
                          "#F87171",
                          "#A78BFA",
                        ];
                        return (
                          <Cell
                            key={`cell-${index}`}
                            fill={colors[index % colors.length]}
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* latest notifications */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Latest Notifications</h3>
            </div>
            <div className="divide-y overflow-y-auto max-h-72">
              {latestNotifications.length === 0 ? (
                <div className="p-4 text-center text-slate-500">
                  No notifications found.
                </div>
              ) : (
                latestNotifications.map((n) => (
                  <div
                    key={n._id}
                    className="flex items-start space-x-3 p-3 hover:bg-slate-50 rounded"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1 ${getBulletColor(
                        n.type,
                        n.priority,
                      )}`}
                    ></div>
                    <div>
                      <p className="text-sm font-medium text-slate-800">
                        {n.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {n.message.length > 60
                          ? n.message.substring(0, 60) + "..."
                          : n.message}
                      </p>
                      <div className="mt-1 space-x-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(
                            "type",
                            n.type,
                          )}`}
                        >
                          {n.type}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium ${getBadgeClasses(
                            "priority",
                            n.priority,
                          )}`}
                        >
                          {n.priority}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* actions */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Actions</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {actionButtons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className={`flex items-center justify-center space-x-2 ${btn.btnClass}`}
              >
                <btn.Icon className="w-4 h-4 mr-2" />
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {isReportModelOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl mx-4 max-h-screen overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  All Files
                </h3>
                <button
                  className="text-slate-400 hover:text-slate-600"
                  onClick={() => setIsReportModelOpen(false)}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4">
                <input
                  type="text"
                  className="input w-full"
                  placeholder="Search by file name or student name"
                  value={reportSearch}
                  onChange={(e) => setReportSearch(e.target.value)}
                />
              </div>

              {filteredFiles.length === 0 ? (
                <div>No files found</div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((f, i) => {
                    return (
                      <div
                        className="flex items-center justify-between p-3 bg-slate-50 rounded"
                        key={i}
                      >
                        <div>
                          <div className="font-medium text-slate-800">
                            {f.originalName}
                          </div>

                          <div className="text-sm text-slate-500">
                            {f.projectTitle} - {f.studentName}
                          </div>
                        </div>

                        <button>
                          <Download
                            className="w-5 h-5 text-blue-600 hover:text-blue-800"
                            onClick={() =>
                              handleDownload({
                                projectId: f.projectId,
                                fileId: f.fileId,
                                name: f.originalName,
                              })
                            }
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {isCreateStudentModelOpen && <AddStudent />}
        {isCreateTeacherModelOpen && <AddTeacher />}
      </div>
    </>
  );
};

export default AdminDashboard;
