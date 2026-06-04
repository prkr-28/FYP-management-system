import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  downloadFile,
  fetchProject,
  uploadProjectFiles,
} from "../../store/slices/studentSlice";
import {
  Archive,
  FileText,
  FileCode,
  Upload,
  X,
  File,
  Image,
  CheckCircle2,
  Download,
  FolderOpen,
  Clock,
} from "lucide-react";

const UploadFiles = () => {
  const dispatch = useDispatch();
  const { project } = useSelector((state) => state.student);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragOver, setDragOver] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const reportRef = useRef(null);
  const presRef = useRef(null);
  const codeRef = useRef(null);

  useEffect(() => {
    if (!project) dispatch(fetchProject());
  }, [dispatch]);

  const handleFileChange = (e) => {
    const fileArray = Array.from(e.target.files) || [];
    setSelectedFiles((prev) => [...prev, ...fileArray]);
    e.target.value = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(null);
    const fileArray = Array.from(e.dataTransfer.files) || [];
    setSelectedFiles((prev) => [...prev, ...fileArray]);
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file to upload.");
      return;
    }
    dispatch(
      uploadProjectFiles({ projectId: project._id, files: selectedFiles }),
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

  const handleDownloadFile = async (file) => {
    if (!file?.projectId || !file?.fileId) {
      toast.error("Invalid file or project ID");
      return;
    }
    setDownloadingId(file.fileId);
    try {
      const res = await dispatch(
        downloadFile({ projectId: file.projectId, fileId: file.fileId }),
      );
      if (res.meta.requestStatus !== "fulfilled") return;
      const url = URL.createObjectURL(res.payload.blob);
      const a = Object.assign(document.createElement("a"), {
        href: url,
        download: file.fileName || "downloaded_file",
      });
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast.success(`"${file.fileName}" downloaded successfully.`);
    } catch {
      toast.error("Download failed. Please try again.");
    } finally {
      setDownloadingId(null);
    }
  };

  const formatSize = (bytes) => {
    if (!bytes) return "—";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getFileIconByName = (fileName) => {
    const ext = fileName?.split(".").pop().toLowerCase();
    if (["pdf", "doc", "docx"].includes(ext))
      return { icon: FileText, color: "text-blue-500", bg: "bg-blue-50" };
    if (["jpg", "jpeg", "png"].includes(ext))
      return { icon: Image, color: "text-purple-500", bg: "bg-purple-50" };
    if (["zip", "rar", "tar", "gz"].includes(ext))
      return { icon: Archive, color: "text-orange-500", bg: "bg-orange-50" };
    if (["ppt", "pptx"].includes(ext))
      return { icon: FileCode, color: "text-green-500", bg: "bg-green-50" };
    return { icon: File, color: "text-slate-400", bg: "bg-slate-100" };
  };

  const uploadZones = [
    {
      id: "report",
      ref: reportRef,
      icon: FileText,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      hoverBorder: "hover:border-blue-400",
      label: "Report",
      desc: "PDF, DOC, DOCX",
      accept: ".pdf,.doc,.docx",
    },
    {
      id: "presentation",
      ref: presRef,
      icon: Archive,
      iconColor: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      hoverBorder: "hover:border-green-400",
      label: "Presentation",
      desc: "PDF, PPT, PPTX",
      accept: ".pdf,.ppt,.pptx",
    },
    {
      id: "code",
      ref: codeRef,
      icon: FileCode,
      iconColor: "text-orange-500",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      hoverBorder: "hover:border-orange-400",
      label: "Source Code",
      desc: "ZIP, RAR, TAR, GZ",
      accept: ".zip,.rar,.tar,.gz",
    },
  ];

  const uploadedFiles = project?.files || [];

  return (
    <div className="p-6 space-y-5">
      {/* ── Upload Card ── */}
      <div className="card p-0 overflow-hidden">
        <div className="h-1 w-full bg-blue-500" />

        <div className="px-6 pt-5 pb-4 border-b border-slate-200 flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
            <Upload className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <h1 className="card-title">Upload Project Files</h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Upload your reports, presentations, and code archives.
            </p>
          </div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Upload Zones */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {uploadZones.map((zone) => {
              const Icon = zone.icon;
              const isActive = dragOver === zone.id;
              return (
                <label
                  key={zone.id}
                  className={`relative flex flex-col items-center text-center gap-3 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 group
                    ${isActive ? `${zone.bgColor} ${zone.borderColor} scale-[1.02]` : `border-slate-200 bg-slate-50/50 ${zone.hoverBorder} hover:bg-white`}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(zone.id);
                  }}
                  onDragLeave={() => setDragOver(null)}
                  onDrop={handleDrop}
                >
                  <div
                    className={`w-14 h-14 rounded-2xl ${zone.bgColor} flex items-center justify-center transition-transform duration-200 group-hover:scale-110`}
                  >
                    <Icon className={`w-7 h-7 ${zone.iconColor}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">
                      {zone.label}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{zone.desc}</p>
                  </div>
                  <span
                    className={`text-xs font-medium px-3 py-1.5 rounded-lg border ${zone.borderColor} ${zone.bgColor} ${zone.iconColor}`}
                  >
                    Choose File
                  </span>
                  <p className="text-xs text-slate-400">or drag & drop here</p>
                  <input
                    type="file"
                    accept={zone.accept}
                    className="hidden"
                    ref={zone.ref}
                    onChange={handleFileChange}
                    multiple
                  />
                </label>
              );
            })}
          </div>

          {/* Selected Files */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Selected Files
                {selectedFiles.length > 0 && (
                  <span className="ml-2 badge bg-blue-100 text-blue-600 normal-case tracking-normal font-medium text-xs">
                    {selectedFiles.length}
                  </span>
                )}
              </h2>
              {selectedFiles.length > 0 && (
                <button
                  onClick={() => setSelectedFiles([])}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  Clear all
                </button>
              )}
            </div>

            {selectedFiles.length === 0 ? (
              <div className="flex flex-col items-center py-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-2">
                  <File className="w-4 h-4 text-slate-400" />
                </div>
                <p className="text-sm text-slate-400">No files selected yet.</p>
                <p className="text-xs text-slate-300 mt-0.5">
                  Choose files from the upload zones above.
                </p>
              </div>
            ) : (
              <ul className="space-y-2">
                {selectedFiles.map((file, index) => {
                  const {
                    icon: Icon,
                    color,
                    bg,
                  } = getFileIconByName(file.name);
                  return (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
                        >
                          <Icon className={`w-4 h-4 ${color}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-400">
                            {formatSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSelectedFile(index)}
                        className="ml-4 w-7 h-7 flex items-center justify-center rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>

        {/* Upload Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-4 flex-wrap">
          <p className="flex items-center gap-1.5 text-xs text-slate-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
            Files are securely stored and accessible to your supervisor.
          </p>
          <button
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            Upload{" "}
            {selectedFiles.length > 0
              ? `${selectedFiles.length} File${selectedFiles.length > 1 ? "s" : ""}`
              : "Files"}
          </button>
        </div>
      </div>

      {/* ── Uploaded Files Card ── */}
      <div className="card p-0 overflow-hidden">
        <div className="h-1 w-full bg-green-500" />

        <div className="px-6 pt-5 pb-4 border-b border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
              <FolderOpen className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <h2 className="card-title">Uploaded Files</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                All files previously submitted for your project.
              </p>
            </div>
          </div>
          {uploadedFiles.length > 0 && (
            <span className="badge bg-green-100 text-green-700 text-xs font-medium px-3 py-1">
              {uploadedFiles.length} file{uploadedFiles.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="px-6 py-5">
          {uploadedFiles.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                <FolderOpen className="w-6 h-6 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 font-medium">
                No files uploaded yet
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Files you upload above will appear here for download.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 px-4 py-2 text-xs font-medium text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <span className="col-span-5">File Name</span>
                <span className="col-span-2">Type</span>
                <span className="col-span-2">Size</span>
                <span className="col-span-2">Uploaded</span>
                <span className="col-span-1 text-right">Action</span>
              </div>

              {uploadedFiles.map((file, index) => {
                const {
                  icon: Icon,
                  color,
                  bg,
                } = getFileIconByName(file.fileName || file.name || "");
                const isDownloading = downloadingId === file.fileId;
                return (
                  <div
                    key={file.fileId || index}
                    className="grid grid-cols-12 items-center px-4 py-3 rounded-lg border border-slate-200 hover:border-blue-200 hover:bg-blue-50/30 transition-all duration-150 group"
                  >
                    {/* Name */}
                    <div className="col-span-10 md:col-span-5 flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className={`w-4 h-4 ${color}`} />
                      </div>
                      <p className="text-sm font-medium text-slate-800 truncate">
                        {file.fileName || file.name || "Unnamed file"}
                      </p>
                    </div>

                    {/* Type */}
                    <div className="hidden md:flex col-span-2">
                      <span className="badge bg-slate-100 text-slate-600 text-xs uppercase">
                        {(file.fileName || file.name || "").split(".").pop() ||
                          "—"}
                      </span>
                    </div>

                    {/* Size */}
                    <div className="hidden md:block col-span-2">
                      <p className="text-xs text-slate-500">
                        {formatSize(file.size)}
                      </p>
                    </div>

                    {/* Date */}
                    <div className="hidden md:flex col-span-2 items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <p className="text-xs text-slate-500">
                        {formatDate(file.uploadedAt || file.createdAt)}
                      </p>
                    </div>

                    {/* Download button */}
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      <button
                        onClick={() =>
                          handleDownloadFile({
                            ...file,
                            projectId: project?._id,
                          })
                        }
                        disabled={isDownloading}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                        title={`Download ${file.fileName || "file"}`}
                      >
                        {isDownloading ? (
                          <svg
                            className="w-3.5 h-3.5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                        ) : (
                          <Download className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
