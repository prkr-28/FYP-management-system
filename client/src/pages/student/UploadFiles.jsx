import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchProject,
  uploadProjectFiles,
} from "../../store/slices/studentSlice";

const UploadFiles = () => {
  const dispatch = useDispatch();
  const { project, files } = useSelector((state) => state.student);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const reportRef = useRef(null);
  const presRef = useRef(null);
  const codeRef = useRef(null);

  useEffect(() => {
    if (!project) {
      dispatch(fetchProject());
    }
  }, [dispatch]);

  const handleFileChange = (e) => {
    const fileArray = Array.from(e.target.files) || [];
    setSelectedFiles((prev) => [...prev, ...fileArray]);
    e.target.value = null; // Clear the input after selection
  };

  const handleUpload = () => {
    if (!project) {
      toast.error("No project found to upload files for.");
      return;
    }
    if (selectedFiles.length === 0) {
      toast.error("Please select files to upload.");
      return;
    }
    dispatch(
      uploadProjectFiles({ projectId: project._id, files: selectedFiles }),
    );
  };
  return <></>;
};

export default UploadFiles;
