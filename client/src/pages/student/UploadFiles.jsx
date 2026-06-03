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
    const activeProject = project;
    // if (!activeProject) {
    //   const action = dispatch(fetchProject());
    //   if (fetchProject.fulfilled.match(action)) {
    //     activeProject = action.payload?.project || action.payload;
    //   }
    // }

    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload.");
      return;
    }

    dispatch(
      uploadProjectFiles({
        projectId: activeProject._id,
        files: selectedFiles,
      }),
    )
      .unwrap()
      .then(() => {
        toast.success("Files uploaded successfully!");
        setSelectedFiles([]);
      })
      .catch(() => {
        toast.error("Failed to upload files. Please try again.");
      });
  };

  const handleRemoveSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split(".").pop().toLowerCase();
    switch (extension) {
      case "pdf":
        return "📄";
      case "doc":
      case "docx":
        return "📝";
      case "jpg":
      case "jpeg":
      case "png":
        return "🖼️";
      default:
        return "📁";
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="card">
          <div className="card=header">
            <h1 className="card-title">Upload Project Files</h1>
            <p className="card-subtitle">
              Upload your project files including reports, presentations, and
              code files.
            </p>
          </div>

          {/* upload section */}
          <div className="grid, grid-cols-1 md:grid-cols-3 gap-3">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              <div className="mb-4">
                <input
                  type="file"
                  id="fileInput"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="fileInput"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  <span>📁 Select Files</span>
                </label>
                <p className="text-sm text-slate-500">
                  Drag and drop files here or click to browse (PDF, DOCX, JPG,
                  PNG)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFiles;
