import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const DeadlinesPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    projectTitle: "",
    projectName: "",
    supervisor: "",
    deadlineData: "",
    description: "",
  });

  const [selectedProject, setSelectedProject] = useState(null);
  const [query, setQuery] = useState("");
  const { projects } = useSelector((state) => state.admin);
  const [viewProjects, setViewProjects] = useState(projects || []);

  useEffect(() => {
    setViewProjects(projects || []);
  }, [projects]);

  const projectRows = useMemo(() => {
    return viewProjects.map((project) => ({
      _id: project._id,
      title: project.title,
      studentName: project.student?.name || "N/A",
      studentEmail: project.student?.email || "N/A",
      studentDepartment: project.student?.department || "N/A",
      supervisor: project.supervisor?.name || "N/A",
      deadline: project.deadlines
        ? new Date(project.deadlines).toLocaleDateString()
        : "N/A",
      updatedAt: project.updatedAt
        ? new Date(project.updatedAt).toLocaleDateString()
        : "N/A",
    }));
  }, [viewProjects]);

  const filteredProjects = projectRows.filter((project) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchLower) ||
      project.studentName.toLowerCase().includes(searchLower) ||
      project.studentEmail.toLowerCase().includes(searchLower)
    );
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!selectedProject||!formData.deadlineData){
      toast.error("Please select a project and enter a deadline.");
      return;
    }
    let deadlineData ={
      name: selectedProject?.student.name|| "N/A",
      dueDate:selectedProject?.deadlineDate
    }}

  return <></>;
};

export default DeadlinesPage;
