import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTeacher } from "../../store/slices/adminSlice";
import { toggleTeacherModel } from "../../store/slices/popupSlice";
import { X } from "lucide-react";

const AddTeacher = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    expertise: "",
    maxStudents: "",
  });

  const handleCreateTeacher = (e) => {
    e.preventDefault();

    dispatch(createTeacher(formData));

    setFormData({
      name: "",
      email: "",
      password: "",
      department: "",
      expertise: "",
      maxStudents: "",
    });

    dispatch(toggleTeacherModel());
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
        <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden transition-all duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Add New Teacher
                </h2>

                <p className="text-blue-100 text-sm mt-1">
                  Create and manage teacher accounts
                </p>
              </div>

              <button
                type="button"
                onClick={() => dispatch(toggleTeacherModel())}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleCreateTeacher}
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
                  placeholder="Enter teacher name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
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
                  placeholder="Enter teacher email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter secure password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Department + Expertise */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Department
                </label>

                <select
                  required
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      department: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Expertise
                </label>

                <select
                  required
                  value={formData.expertise}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      expertise: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
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

                  <option value="Computer Networks">Computer Networks</option>

                  <option value="Operating Systems">Operating Systems</option>

                  <option value="Human-Computer Interaction">
                    Human-Computer Interaction
                  </option>

                  <option value="Big Data Analytics">Big Data Analytics</option>

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
                placeholder="Enter max students"
                value={formData.maxStudents}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxStudents: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 pt-5 border-t border-slate-200">
              <button
                type="button"
                onClick={() => dispatch(toggleTeacherModel())}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md hover:shadow-lg hover:scale-[1.02] transition"
              >
                Create Teacher
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTeacher;
