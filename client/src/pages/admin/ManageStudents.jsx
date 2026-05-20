import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudent from "../../components/modal/AddStudent";

const ManageStudents = () => {
  const {users,projects} = useSelector((state) => state.admin);
  const {isCreateStudentModelOpen} = useSelector(state.popups);
  const dispatch = useDispatch();
  const [showModel, setShowModel] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredDepartment, setFilteredDepartment] = useState([]);
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  });

  const students = useMemo(() => {
    return users.filter(user => user.role === "Student");
  }
  , [users]);

  useEffect(() => {
    // Fetch students when component mounts
  }, [dispatch]);
  return <></>;
};

export default ManageStudents;
