import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createTeacher } from "../../store/slices/adminSlice";
import { toggleTeacherModel } from "../../store/slices/popupSlice";

const AddTeacher = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    expertise: "",
    maxStudents: "",
  });

  const handleCreateTeacher = () => {
    // Dispatch action to create teacher
    dispatch(createTeacher(formData));
    setFormData({
      name: "",
      email: "",
      department: "",
      expertise: "",
      maxStudents: "",
    });
    dispatch(toggleTeacherModel());
  };
  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 mx-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Add New Teacher</h2>
          </div>
          <form onSubmit={handleCreateTeacher} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter teacher name"
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
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="input-field w-full p-2 ring-1 ring-slate-300 rounded-md focus:outline-none "
                required
              />
            </div>
            <div className="mb-4">
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
                <option value="Mathematics">Software Engineering</option>
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
                onClick={() => dispatch(toggleTeacherModel())}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddTeacher;
