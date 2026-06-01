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
  const [showRequestModel, setShowRequestModal] = useState(false);
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

  return <></>;
};

export default SupervisorPage;
