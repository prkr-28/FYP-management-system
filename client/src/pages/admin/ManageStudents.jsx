import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import {
  getAllUsers,
  updateStudent,
  createStudent,
  deleteStudent,
} from "../../store/slices/adminSlice.js";
import { toggleStudentModel } from "../../store/slices/popupSlice";
import {
  CheckCircle,
  Plus,
  TriangleAlert,
  TriangleAlertIcon,
  User,
} from "lucide-react";

const ManageStudents = () => {
  const { users, projects } = useSelector((state) => state.admin);
  const { isCreateStudentModalOpen } = useSelector((state) => state.popup);
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
    const studentUsers = (users || []).filter(
      (user) => user.role?.toLowerCase() === "student",
    );
    return studentUsers.map((student) => {
      const studentProject = (projects || []).find(
        (proj) => proj.studentId === student._id,
      );
      return {
        ...student,
        projectTitle: studentProject ? studentProject.title || null : null,
        supervisor: studentProject ? studentProject.supervisor || null : null,
        projectStatus: studentProject ? studentProject.status || null : null,
      };
    });
  }, [users, projects]);

  const departments = useMemo(() => {
    const deptSet = new Set(
      (students || []).map((student) => student.department).filter(Boolean),
    );
    return Array.from(deptSet);
  }, [students]);

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filteredDepartment === "all" ||
      filteredDepartment.includes(student.department);
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
      dispatch(
        updateStudent({
          id: editingStudent._id,
          Data: formData,
        }),
      );
    }
    handleCloseModel();
  };

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

  const confirmDelete = () => {
    // Dispatch delete student action
    dispatch(deleteStudent(studentToDelete._id));
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
              <p className="text-sm font-medium text-slate-600">
                Total Students
              </p>
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
              <p className="text-sm font-medium text-slate-600">
                Completed Projects
              </p>
              <p className="text-lg font-semibold">
                {
                  students.filter((student) => student.status === "completed")
                    .length
                }
              </p>
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
              <p className="text-lg font-semibold">
                {students.filter((student) => !student.supervisor).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* filters */}
      {/* filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Students
            </label>

            <input
              type="text"
              className="input-field w-full p-2 ring-1 ring-slate-300 rounded-md focus:outline-none "
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Department Filter */}
          <div className="w-full md:w-60">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Filter Department
            </label>

            <select
              className="input-field w-full"
              value={filteredDepartment}
              onChange={(e) => setFilteredDepartment(e.target.value)}
            >
              <option value="all">All Departments</option>

              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* students table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Students List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Student Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Department and Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Supervisor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Project Title
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {student.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {student.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {student.department || "--"}
                      </div>
                      <div className="text-sm text-slate-500">
                        {student.createdAt
                          ? new Date(student.createdAt).getFullYear()
                          : "--"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {student.supervisor ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-green-800 bg-gray-100 text-xs font-medium">
                            {typeof student.supervisor === "object"
                              ? student.supervisor.name || "--"
                              : student.supervisor || "--"}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-red-800 bg-gray-100 text-xs font-medium">
                            Unassigned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {student.projectTitle || "No Project"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={() => handleEdit(student)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(student)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-4 whitespace-nowrap text-center text-sm text-slate-500"
                  >
                    No students found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Student Modal */}
        {showModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">
                  {editingStudent ? "Edit Student" : "Add New Student"}
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="input-field w-full p-2 ring-1 ring-slate-300 rounded-md focus:outline-none "
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="input-field w-full p-2 ring-1 ring-slate-300 rounded-md focus:outline-none "
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Department
                  </label>
                  <select
                    className="input-field w-full p-2 ring-1 ring-slate-300 rounded-md focus:outline-none "
                    required
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                  >
                    <option value="">Select Department</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Software Engineering">
                      Software Engineering
                    </option>
                    <option value="Data Science">Data Science</option>
                    <option value="Electrical Engineering">
                      Electrical Engineering
                    </option>
                    <option value="Mechanical Engineering">
                      Mechanical Engineering
                    </option>
                    <option value="Civil Engineering">Civil Engineering</option>
                    <option value="Business Administration">
                      Business Administration
                    </option>
                    <option value="Economics">Economics</option>
                    <option value="Physics"> Physics</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={handleCloseModel}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingStudent ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModel && studentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-sm p-6">
              <div className="flex flex-col items-center mb-4">
                <TriangleAlertIcon className="w-6 h-6 text-yellow-600 mr-2" />
                <h2 className="text-lg font-semibold text-yellow-600">
                  Confirm Deletion
                </h2>
              </div>
              <p className="mb-6 text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <span>
                  {studentToDelete.name} This action cannot be undone.
                </span>
                ?
              </p>
              <div className="flex justify-center space-x-2">
                <button onClick={cancelDelete} className="btn-secondary">
                  Cancel
                </button>
                <button onClick={confirmDelete} className="btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {isCreateStudentModalOpen && <AddStudent />}
      </div>
    </div>
  );
};

export default ManageStudents;
