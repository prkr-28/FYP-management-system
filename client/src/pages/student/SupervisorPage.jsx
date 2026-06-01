import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllSupervisors,
  getSupervisor,
  fetchProject,
  requestSupervisor,
} from "../../store/slices/studentSlice.js";

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
    () => !!(supervisor && supervisor.id),
    [supervisor],
  );

  const hasProject = useMemo(() => !!(project && project.id), [project]);

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
    dispatch(
      requestSupervisor({ supervisorId: selectedSupervisor.id, message }),
    );
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
        {hasProject && (
          <div className="card">
            <div className="card-header">
              <h1 className="card-title">Project Details</h1>
            </div>
            <div className="p-6">
              <p className="text-slate-600">
                <strong>Project Title:</strong> {project?.title || "-"}
              </p>
              <p className="text-slate-600">
                <strong>Project Description:</strong>{" "}
                {project?.description || "-"}
              </p>
            </div>
          </div>
        )}

        {/* request modal */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
            showRequestModal ? "" : "hidden"
          }`}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Request Supervisor</h2>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Select Supervisor
            </label>
            <select
              className="form-select w-full mb-4"
              value={selectedSupervisor?.id || ""}
              onChange={(e) => {
                const sup = supervisors.find(
                  (s) => s.id === parseInt(e.target.value),
                );
                setSelectedSupervisor(sup);
              }}
            >
              <option value="" disabled>
                -- Select Supervisor --
              </option>
              {supervisors.map((sup) => (
                <option key={sup.id} value={sup.id}>
                  {sup.name} ({sup.department})
                </option>
              ))}
            </select>

            <label className="block text-sm font-medium text-slate-700 mb-1">
              Message (optional)
            </label>
            <textarea
              className="form-textarea w-full mb-4"
              rows="4"
              placeholder="Add a message to your supervisor (optional)"
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
            ></textarea>

            <div className="flex justify-end space-x-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowRequestModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={submitRequest}>
                Send Request
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SupervisorPage;
