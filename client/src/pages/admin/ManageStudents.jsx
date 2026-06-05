import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";
import {
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
  X,
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

  const students = useMemo(() => {
    const studentUsers = (users || []).filter(
      (user) => user.role?.toLowerCase() === "student",
    );
    return studentUsers.map((student) => {
      const studentProject = (projects || []).find(
        (proj) => proj.student === student._id,
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
                            {users?.find(
                              (user) => user._id === student.supervisor,
                            )?.name || "Assigned"}
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden transition-all duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingStudent ? "Edit Student" : "Add New Student"}
                    </h2>

                    <p className="text-blue-100 text-sm mt-1">
                      Manage student details and academic information
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCloseModel}
                    className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="p-6 space-y-5 max-h-[80vh] overflow-y-auto"
              >
                {/* Name + Email */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          name: e.target.value,
                        })
                      }
                      placeholder="Enter student name"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Enter student email"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                {/* Department */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Department
                  </label>

                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        department: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
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

                    <option value="Physics">Physics</option>
                  </select>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseModel}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
                  >
                    <span>Cancel</span>
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                  >
                    {editingStudent ? "Update Student" : "Create Student"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModel && studentToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl transition-all duration-200">
              {/* Header */}
              <div className="flex flex-col items-center px-6 pt-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <TriangleAlertIcon className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-xl font-bold text-slate-800">
                  Delete Student
                </h2>

                <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">
                    {studentToDelete.name}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-center gap-3 px-6 py-5 mt-4 border-t border-slate-200">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition-all duration-200"
                >
                  Cancel
                </button>

                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md"
                >
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
