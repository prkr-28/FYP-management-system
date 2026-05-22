import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import {getAllUsers, updateStudent ,createStudent,deleteStudent } from "../../store/slices/adminSlice";
import { toggleStudentModel } from "../../store/slices/popupSlice";
import { CheckCircle, Plus, TriangleAlert, User } from "lucide-react";

const ManageStudents = () => {
  const {users,projects} = useSelector((state) => state.admin);
  const {isCreateStudentModalOpen} = useSelector((state) => state.popup);
  const dispatch = useDispatch();
  const [showModel, setShowModel] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartment, setFilteredDepartment] = useState("all");
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

    useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const students = useMemo(() => {
    const studentUsers=(users || []).filter((user) => user.role?.toLowerCase() === "student");
    return studentUsers.map((student) => {
      const studentProject = (projects || []).find((proj) => proj.studentId === student.id);
      return {
        ...student,
        projectTitle: studentProject ? studentProject.title || null : null,
        supervisor: studentProject ? studentProject.supervisor || null : null,
        projectStatus: studentProject ? studentProject.status || null : null,
      };
    });
  }
  , [users, projects]);

  const departments = useMemo(() => {
    const deptSet = new Set((students || []).map((student) => student.department.filter(Boolean)));
    return Array.from(deptSet);
  }, [students]);

  const filterStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filteredDepartment === "all" || filteredDepartment.includes(student.department);
    return matchesSearch && matchesFilter;
  });

  const handleCloseModel = () => {
    setShowModel(false);
    setEditingStudent(null);
    setFormData({
      name: "",
      email: "",
      department: "",
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      dispatch(updateStudent({ id: editingStudent.id, data:formData }));
    } else {
      // Dispatch create student action
      dispatch(createStudent(formData));
    }
    handleCloseModel();
  }

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name || "",
      email: student.email || "",
      department: student.department || "",
    });
    setShowModel(true);
  };

  const handleDelete = (student) => {
    setStudentToDelete(student);
    setShowDeleteModel(true);
  };

  const confirmDelete = () => {    // Dispatch delete student action
    dispatch(deleteStudent(studentToDelete.id));
    setShowDeleteModel(false);
    setStudentToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModel(false);
    setStudentToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="card">
        <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="card-title">Manage Students</h2>
            <p className="card-subtitle">
              Add, edit, or manage students accounts
            </p>
          </div>

          <button
            className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
            onClick={() => dispatch(toggleStudentModel())}
          >
            <Plus className="w-5 h-5" />
            <span>Add new Student</span>
          </button>
        </div>
      </div>

      {/* stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Total Students</p>
              <p className="text-lg font-semibold">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Completed Projects</p>
              <p className="text-lg font-semibold">{students.filter((student) => student.status === "completed").length}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <TriangleAlert className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Unassigned</p>
              <p className="text-lg font-semibold">{students.filter((student) => !student.supervisor).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
    <div className="flex-1">
      <label className="block text-sm font-medium text-sky-700 mb-2">
        Search Students
      </label>
      <input type="text" className="input-field w-full" placeholder="Search by name or email...." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}/>
    </div>
        </div>
      </div>
    </div>
  );
};

export default ManageStudents;
