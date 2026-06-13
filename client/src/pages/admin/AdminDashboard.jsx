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

const AdminDashboard = () => {
  const { isCreateStudentModelOpen, isCreateTeacherModelOpen } = useSelector(
    (state) => state.popup,
  );

  const { stats } = useSelector((state) => state.admin);
  const { projects } = useSelector((state) => state.project);
  const { notifications } = useSelector((state) => state.notification.list);

  const dispatch = useDispatch();

  const [isReportModelOpen, setIsReportModelOpen] = useState(false);
  const [reportSearch, setReportSearch] = useState("");

  ueEffect(() => {
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
    return (projects || []).flatmap((p) =>
      (p.files || []).map((f) => ({
        projectId: p._id,
        projectTitle: p.title,
        studentName: p.student?.name,
        originalName: f.originalName,
        uploadedAt: f.uploadedAt,
      })),
    );
  }, [projects]);

  const filteredFiles = files.filter(
    (f) =>
      f.originalName.toLowerCase().includes(reportSearch.toLowerCase()) ||
      f.projectTitle.toLowerCase().includes(reportSearch.toLowerCase()) ||
      f.studentName.toLowerCase().includes(reportSearch.toLowerCase()),
  );

  const handleDownload = ({projectId , fileId,name}) => {
    const res= await dispatch(downloadFile({ projectId, fileId }));
    if (res.error) {
      toast.error(res.error.message || "Failed to download file");
      return;
    }
    const url = window.URL.createObjectURL(new Blob([res.payload.blob]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", name);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const supervisorBucket=useMemo(()=>{
    const map=new Map();
    (projects||[]).forEach((p)=>{
      const supervisor=p.supervisor?.name;
      if(!map.has(supervisor)){
        map.set(supervisor,0);
      }
      map.set(supervisor,map.get(supervisor)+1);
    });
    const arr= Array.from(map.entries()).map(([supervisor,count])=>({supervisor,count}));
    arr.sort((a,b)=>b.count-a.count);
    return arr;
  },[projects]);

  return <></>;
};

export default AdminDashboard;
