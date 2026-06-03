import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSupervisors,
  getSupervisor,
  fetchProject,
  requestSupervisor,
} from "../../store/slices/studentSlice.js";
import {
  X,
  UserCheck,
  BookOpen,
  Mail,
  Cpu,
  Calendar,
  Clock,
  AlignLeft,
  Users,
} from "lucide-react";

const SupervisorPage = () => {
  const dispatch = useDispatch();
  const { authUser } = useSelector((state) => state.auth);
  const { project, supervisors, supervisor } = useSelector(
    (state) => state.student,
  );
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [requestMessage, setRequestMessage] = useState("");

  useEffect(() => {
    dispatch(fetchProject());
    dispatch(getSupervisor());
    dispatch(fetchAllSupervisors());
  }, [dispatch]);

  const hasSupervisor = useMemo(
    () => !!(supervisor && supervisor._id),
    [supervisor],
  );
  const hasProject = useMemo(() => !!(project && project._id), [project]);

  const formatDeadline = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleOpenRequest = (sup) => {
    setSelectedSupervisor(sup);
    setShowRequestModal(true);
  };

  const submitRequest = () => {
    if (!selectedSupervisor) return;
    const message =
      requestMessage.trim() ||
      `${authUser.name} is requesting ${selectedSupervisor.name} to be their supervisor for their project.`;
    dispatch(requestSupervisor({ teacherId: selectedSupervisor._id, message }));
    setShowRequestModal(false);
    setSelectedSupervisor(null);
    setRequestMessage("");
  };

  const InfoField = ({ icon: Icon, label, value, children }) => (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5">
        {Icon && <Icon className="w-3.5 h-3.5 text-slate-400" />}
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      {children || (
        <p className="text-slate-800 font-medium text-sm pl-5">{value}</p>
      )}
    </div>
  );

  return (
    <>
      <div className="p-6 space-y-5">
        {/* ── Current Supervisor Card ── */}
        <div className="card p-0 overflow-hidden">
          <div className="h-1 w-full bg-blue-500" />
          <div className="px-6 pt-5 pb-4 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <UserCheck className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h1 className="card-title">Current Supervisor</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your assigned FYP supervisor
                </p>
              </div>
            </div>
            {hasSupervisor && (
              <span className="badge badge-approved">Assigned</span>
            )}
          </div>

          {hasSupervisor ? (
            <div className="px-6 py-6">
              <div className="flex items-start gap-5">
                <img
                  src="/placeholder.png"
                  alt="Supervisor"
                  className="w-16 h-16 rounded-xl object-cover shadow-sm border border-slate-200 flex-shrink-0"
                />
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {supervisor?.name || "-"}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {supervisor?.department || "-"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <InfoField
                      icon={Mail}
                      label="Email"
                      value={supervisor?.email || "-"}
                    />
                    <InfoField icon={Cpu} label="Expertise">
                      <div className="flex flex-wrap gap-1.5 pl-5">
                        {Array.isArray(supervisor?.expertise) &&
                        supervisor.expertise.length > 0 ? (
                          supervisor.expertise.map((e, i) => (
                            <span
                              key={i}
                              className="badge badge-approved text-xs px-2 py-0.5"
                            >
                              {e}
                            </span>
                          ))
                        ) : (
                          <p className="text-slate-800 font-medium text-sm">
                            {supervisor?.expertise || "-"}
                          </p>
                        )}
                      </div>
                    </InfoField>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-1">
                <Users className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-slate-500 text-sm max-w-xs">
                You currently do not have a supervisor assigned. Browse
                available supervisors below to send a request.
              </p>
              <button
                className="btn-primary flex items-center gap-2 mt-1"
                onClick={() => setShowRequestModal(true)}
              >
                <UserCheck className="w-4 h-4" /> Request Supervisor
              </button>
            </div>
          )}
        </div>

        {/* ── Project Details Card ── */}
        {hasProject ? (
          <div className="card p-0 overflow-hidden">
            <div className="h-1 w-full bg-green-500" />
            <div className="px-6 pt-5 pb-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <h2 className="card-title">Project Details</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your submitted FYP proposal
                </p>
              </div>
            </div>

            <div className="px-6 py-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoField
                  icon={BookOpen}
                  label="Title"
                  value={project?.title || "-"}
                />
                <InfoField
                  icon={Calendar}
                  label="Deadline"
                  value={
                    project?.deadline
                      ? formatDeadline(project.deadline)
                      : "No deadline set"
                  }
                />

                <InfoField icon={null} label="Status">
                  <div className="pl-0">
                    <span
                      className={`badge text-xs px-2.5 py-1 ${
                        project.status === "approved"
                          ? "badge-approved"
                          : project.status === "pending"
                            ? "badge-pending"
                            : project.status === "rejected"
                              ? "badge-rejected"
                              : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {project.status || "-"}
                    </span>
                  </div>
                </InfoField>

                <InfoField
                  icon={Clock}
                  label="Created At"
                  value={
                    project?.createdAt ? formatDeadline(project.createdAt) : "-"
                  }
                />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <InfoField icon={AlignLeft} label="Description">
                  <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-wrap pl-5 mt-1">
                    {project?.description || "No description provided."}
                  </p>
                </InfoField>
              </div>
            </div>
          </div>
        ) : (
          <div className="card p-0 overflow-hidden">
            <div className="h-1 w-full bg-yellow-400" />
            <div className="px-6 pt-5 pb-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-yellow-100 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-yellow-600" />
              </div>
              <h2 className="card-title">Project Required</h2>
            </div>
            <div className="px-6 py-10 flex flex-col items-center text-center gap-2">
              <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mb-1">
                <BookOpen className="w-6 h-6 text-yellow-500" />
              </div>
              <p className="text-slate-500 text-sm max-w-xs">
                You haven't submitted a project proposal yet. You cannot request
                a supervisor until a proposal is submitted.
              </p>
            </div>
          </div>
        )}

        {/* ── Available Supervisors Card ── */}
        {hasProject && !hasSupervisor && (
          <div className="card p-0 overflow-hidden">
            <div className="h-1 w-full bg-blue-500" />
            <div className="px-6 pt-5 pb-4 border-b border-slate-200 flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <h2 className="card-title">Available Supervisors</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Browse and send a request to your preferred supervisor.
                </p>
              </div>
            </div>

            <div className="p-6">
              {supervisors && supervisors.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {supervisors.map((sup) => (
                    <div
                      key={sup._id}
                      className="border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-blue-300 hover:shadow-sm transition-all duration-200 bg-white group"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-blue-600 font-semibold text-sm">
                              {sup.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-semibold text-slate-800 text-sm leading-tight">
                              {sup.name}
                            </h3>
                            <p className="text-xs text-slate-500">
                              {sup.department}
                            </p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1.5">
                            Expertise
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {Array.isArray(sup.expertise) &&
                            sup.expertise.length > 0 ? (
                              sup.expertise.map((e, i) => (
                                <span
                                  key={i}
                                  className="badge bg-blue-50 text-blue-600 text-xs px-2 py-0.5 rounded-full"
                                >
                                  {e}
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-slate-500">
                                {sup.expertise || "N/A"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn-primary w-full flex items-center justify-center gap-2 mt-4 text-sm"
                        onClick={() => handleOpenRequest(sup)}
                      >
                        <UserCheck className="w-3.5 h-3.5" /> Request
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Users className="w-5 h-5 text-slate-400" />
                  </div>
                  <p className="text-slate-500 text-sm">
                    No supervisors available at the moment.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Request Modal ── */}
      {showRequestModal && (
        <div className="modal-overlay">
          <div className="modal-content w-full max-w-md mx-4">
            <div className="h-1 w-full bg-blue-500 rounded-t-lg" />
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-blue-500" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">
                    Request Supervisor
                  </h3>
                </div>
                <button
                  className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                  onClick={() => {
                    setShowRequestModal(false);
                    setSelectedSupervisor(null);
                    setRequestMessage("");
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Supervisor info */}
                <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <div className="w-9 h-9 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0">
                    <span className="text-blue-700 font-semibold text-sm">
                      {selectedSupervisor?.name?.charAt(0)?.toUpperCase() ||
                        "?"}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedSupervisor?.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {selectedSupervisor?.department}
                    </p>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="label">
                    Message{" "}
                    <span className="text-slate-400 font-normal">
                      (Optional)
                    </span>
                  </label>
                  <textarea
                    className="input resize-none text-sm leading-relaxed"
                    rows="4"
                    placeholder="Introduce yourself and explain why you'd like this professor to supervise your project..."
                    value={requestMessage}
                    onChange={(e) => setRequestMessage(e.target.value)}
                  />
                  <p className="text-xs text-slate-400 mt-1.5">
                    A personalised message increases your chances of acceptance.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    className="btn-outline"
                    onClick={() => {
                      setShowRequestModal(false);
                      setSelectedSupervisor(null);
                      setRequestMessage("");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary flex items-center gap-2"
                    onClick={submitRequest}
                  >
                    <UserCheck className="w-4 h-4" /> Send Request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SupervisorPage;
