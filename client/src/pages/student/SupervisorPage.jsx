import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSupervisors,
  getSupervisor,
  fetchProject,
  requestSupervisor,
} from "../../store/slices/studentSlice.js";

import { X } from "lucide-react";

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

  return (
    <>
      <div className="space-y-2">
        {/* current supervisor */}
        <div className="card">
          <div className="card-header">
            <h1 className="card-title">Current Supervisor</h1>
            {hasSupervisor && (
              <span className="badge badge-approved">Assigned</span>
            )}
          </div>

          {/* supervisor details */}
          {hasSupervisor ? (
            <div className="space-y-6">
              <div className="flex items-start space-x-6">
                <img
                  src="/placeholder.png"
                  alt="Supervisor"
                  className="w-20 h-20 rounded-full object-cover shadow-md"
                />

                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {supervisor?.name || "-"}
                    </h3>
                    <p className="text-slate-600 text-lg">
                      {supervisor?.department || "-"}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                        Email
                      </label>
                      <p className="text-slate-800 font-medium">
                        {supervisor?.email || "-"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                        Expertise
                      </label>
                      <p className="text-slate-800 font-medium">
                        {Array.isArray(supervisor?.expertise) &&
                        supervisor.expertise.length > 0
                          ? supervisor.expertise.join(", ")
                          : supervisor?.expertise || "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <p className="text-slate-600 mb-4">
                You currently do not have a supervisor assigned.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => setShowRequestModal(true)}
              >
                Request Supervisor
              </button>
            </div>
          )}
        </div>

        {/* project details */}
        {hasProject ? (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Project Details</h2>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Title
                    </label>
                    <p className="text-lg text-slate-800 font-medium mt-1">
                      {project?.title || "-"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Status
                    </label>
                    <div>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded text-sm font-medium ${
                          project.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : project.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : project.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {project.status || "-"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Deadline
                    </label>
                    <p className="text-lg text-slate-800 font-medium mt-1">
                      {project?.deadline
                        ? formatDeadline(project.deadline)
                        : "No deadline set"}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                      Created At
                    </label>
                    <p className="text-lg text-slate-800 font-medium mt-1">
                      {project?.createdAt
                        ? formatDeadline(project.createdAt)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-500 uppercase tracking-wide">
                  Description
                </label>
                <p className="text-slate-800 mt-2 leading-relaxed whitespace-pre-wrap">
                  {project?.description || "No description provided."}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Project Required</h2>
            </div>
            <div className="p-6 text-center">
              <p className="text-slate-600 text-lg mb-4">
                You have't submitted a project proposal yet. You cannot request
                a supervisor.
              </p>
            </div>
          </div>
        )}

        {/* Available supervisors to request if student has a project but no supervisor */}
        {hasProject && !hasSupervisor && (
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">Available Supervisor</h2>
              <p className="text-sm text-slate-600">
                Browse through the list of available supervisors and select one
                to send a request.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {supervisors && supervisors.length > 0 ? (
                supervisors.map((sup) => (
                  <div
                    key={sup._id}
                    className="border rounded-lg p-4 flex flex-col justify-between"
                  >
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        {sup.name}
                      </h3>
                      <p className="text-slate-600">{sup.department}</p>
                      <p className="text-slate-600 mt-2">
                        Expertise:{" "}
                        {Array.isArray(sup.expertise) &&
                        sup.expertise.length > 0
                          ? sup.expertise.join(", ")
                          : sup.expertise || "N/A"}
                      </p>
                    </div>
                    <button
                      className="btn btn-primary mt-4"
                      onClick={() => handleOpenRequest(sup)}
                    >
                      Request Supervisor
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-slate-600 text-center col-span-full">
                  No supervisors available at the moment.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Request Supervisor Modal */}
        {showRequestModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Request Supervisor
                  </h3>
                  <button
                    className="text-slate-400 hover:text-slate-600"
                    onClick={() => {
                      setShowRequestModal(false);
                      setSelectedSupervisor(null);
                      setRequestMessage("");
                    }}
                  >
                    <X />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-md">
                    <p className="text-slate-600">{selectedSupervisor?.name}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-md">
                    <label className="block text-slate-600 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      className="border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="4"
                      placeholder="Introduce yourself and explain why you want this professor to supervisor your project."
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t border-slate-200">
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
                      className="btn-primary"
                      onClick={submitRequest}
                      disabled={!requestMessage.trim()}
                    >
                      Send Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SupervisorPage;
