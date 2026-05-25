import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddTeacher from "../../components/modal/AddTeacher";
import { getAllUsers, updateTeacher } from "../../store/slices/adminSlice";
import {
  BadgeCheck,
  CheckCircle,
  Plus,
  TriangleAlertIcon,
  User,
  X,
} from "lucide-react";
import { toggleTeacherModel } from "../../store/slices/popupSlice";

const ManageTeachers = () => {
  const { users } = useSelector((state) => state.admin);
  const { isCreateTeacherModalOpen } = useSelector((state) => state.popup);
  const dispatch = useDispatch();
  const [showModel, setShowModel] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartment, setFilteredDepartment] = useState("all");
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    expertise: "",
    role: "Teacher",
    maxStudents: 10,
  });

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const teachers = useMemo(() => {
    return (users || []).filter(
      (user) => user.role?.toLowerCase() === "teacher",
    );
  }, [users]);

  const departments = useMemo(() => {
    const deptSet = new Set(
      (teachers || []).map((teacher) => teacher.department).filter(Boolean),
    );
    return Array.from(deptSet);
  }, [teachers]);

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filteredDepartment === "all" ||
      filteredDepartment.includes(teacher.department);
    return matchesSearch && matchesFilter;
  });

  const handleCloseModel = () => {
    setShowModel(false);
    setEditingTeacher(null);
    setFormData({
      name: "",
      email: "",
      department: "",
      expertise: "",
      role: "Teacher",
      maxStudents: 10,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingTeacher) {
      dispatch(
        updateTeacher({
          id: editingTeacher._id,
          Data: formData,
        }),
      );
    }
    handleCloseModel();
  };

  const handleEdit = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      department: teacher.department || "",
      expertise: Array.isArray(teacher.expertise)
        ? teacher.expertise[0]
        : teacher.expertise || "",
      maxStudents:
        typeof teacher.maxStudents === "number" ? teacher.maxStudents : 10,
    });
    setShowModel(true);
  };

  const handleDelete = (teacher) => {
    setTeacherToDelete(teacher);
    setShowDeleteModel(true);
  };

  const confirmDelete = () => {
    // Dispatch delete teacher action
    dispatch(deleteTeacher(teacherToDelete._id));
    setShowDeleteModel(false);
    setTeacherToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteModel(false);
    setTeacherToDelete(null);
  };

  return (
    <div className="space-y-6">
      {/* header */}
      <div className="card">
        <div className="card-header flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h2 className="card-title">Manage Teachers</h2>
            <p className="card-subtitle">
              Add, edit, or manage teachers accounts
            </p>
          </div>

          <button
            className="btn-primary flex items-center space-x-2 mt-4 md:mt-0"
            onClick={() => dispatch(toggleTeacherModel())}
          >
            <Plus className="w-5 h-5" />
            <span>Add new Teacher</span>
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
                Total Teachers
              </p>
              <p className="text-lg font-semibold">{teachers.length}</p>
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
                Assigned Students
              </p>
              <p className="text-lg font-semibold">
                {teachers.reduce(
                  (sum, t) => sum + (t.assignedStudents?.length || 0),
                  0,
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BadgeCheck className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-600">Departments</p>
              <p className="text-lg font-semibold">{departments.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Search Teachers
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

      {/* teachers table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Teachers List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full table-auto">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Teacher Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Expertise
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Join Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => (
                  <tr key={teacher._id} className="hover:bg-slate-50">
                    {/* Teacher Name */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">
                        {teacher.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {teacher.email}
                      </div>
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {teacher.department || "--"}
                      </div>
                    </td>

                    {/* Expertise */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      {Array.isArray(teacher.expertise) &&
                      teacher.expertise.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {teacher.expertise.map((exp, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {exp}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-slate-500">--</div>
                      )}
                    </td>

                    {/* Join Date */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900">
                        {teacher.createdAt
                          ? new Date(teacher.createdAt).toLocaleString()
                          : "--"}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={() => handleEdit(teacher)}
                        >
                          Edit
                        </button>

                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(teacher)}
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
                    No teachers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add/Edit Teacher Modal */}
        {showModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {editingTeacher ? "Edit Teacher" : "Add New Teacher"}
                    </h2>
                    <p className="text-blue-100 text-sm mt-1">
                      Update teacher details and information
                    </p>
                  </div>

                  <button
                    onClick={handleCloseModel}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition"
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
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Enter teacher name"
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
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="Enter teacher email"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    />
                  </div>
                </div>

                {/* Department + Expertise */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      <option value="Civil Engineering">
                        Civil Engineering
                      </option>
                      <option value="Business Administration">
                        Business Administration
                      </option>
                      <option value="Economics">Economics</option>
                      <option value="Physics">Physics</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Expertise
                    </label>

                    <select
                      value={formData.expertise}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          expertise: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      required
                    >
                      <option value="">Select Expertise</option>

                      <option value="Artificial Intelligence">
                        Artificial Intelligence
                      </option>

                      <option value="Machine Learning">Machine Learning</option>

                      <option value="Data Science">Data Science</option>

                      <option value="Cybersecurity">Cybersecurity</option>

                      <option value="Cloud Computing">Cloud Computing</option>

                      <option value="Software Development">
                        Software Development
                      </option>

                      <option value="Web Development">Web Development</option>

                      <option value="Mobile App Development">
                        Mobile App Development
                      </option>

                      <option value="Database Systems">Database Systems</option>

                      <option value="Computer Networks">
                        Computer Networks
                      </option>

                      <option value="Operating Systems">
                        Operating Systems
                      </option>

                      <option value="Human-Computer Interaction">
                        Human-Computer Interaction
                      </option>

                      <option value="Big Data Analytics">
                        Big Data Analytics
                      </option>

                      <option value="Blockchain Technology">
                        Blockchain Technology
                      </option>

                      <option value="Internet of Things (IoT)">
                        Internet of Things (IoT)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Max Students */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Maximum Students
                  </label>

                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maxStudents: e.target.value,
                      })
                    }
                    placeholder="Enter max students"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseModel}
                    className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
                  >
                    {editingTeacher ? "Update Teacher" : "Create Teacher"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModel && teacherToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl transition-all duration-200">
              {/* Header */}
              <div className="flex flex-col items-center px-6 pt-6">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <TriangleAlertIcon className="w-8 h-8 text-red-600" />
                </div>

                <h2 className="text-xl font-bold text-slate-800">
                  Delete Teacher
                </h2>

                <p className="text-sm text-slate-500 text-center mt-2 leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-slate-700">
                    {teacherToDelete.name}
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

        {isCreateTeacherModalOpen && <AddTeacher />}
      </div>
    </div>
  );
};

export default ManageTeachers;
