import multer from "multer";
import path from "path";
import ErrorHandler from "../middlewares/error.js";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ensureDirectoryExists = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath;
        if (req.route.path.includes("/upload:/projectId")) {
            uploadPath = path.join(__dirname, "../uploads/projects", req.params.projectId);
        }
        else if (req.route.path.includes("/upload:/userId")) {
            uploadPath = path.join(__dirname, "../uploads/users", req.params.userId);
        }
        else {
            uploadPath = path.join(__dirname, "../uploads/temp");
        }

        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + "-" + uniqueSuffix + ext);
    }
});
const fileFilter = (req, file, cb) => {
    const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "application/zip",
        "application/x-zip-compressed",
        "application/x-rar-compressed",
        "application/x-rar",
        "application/vnd.rar",
        "application/octet-stream",
        "image/jpeg",
        "image/png",
        "image/gif",
        "text/plain",
        "application/javascript",
        "text/css",
        "text/html",
        "application/json",
    ];

    const allowedExtensions = [
        ".pdf",
        ".doc",
        ".docx",
        ".ppt",
        ".pptx",
        ".zip",
        ".rar",
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".txt",
        ".js",
        ".css",
        ".html",
        ".json",
    ];


    const file_ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(file_ext)) {
        cb(null, true);
    } else {
        cb(new ErrorHandler("Unsupported file type", 400), false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 10 * 1024 * 1024, files: 10 } });

const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({ message: "File size exceeds the 10MB limit." });
        }
        if (err.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({ message: "Too many files uploaded. Maximum is 10." });
        }
        return res.status(400).json({ message: err.message });
    }
    if (err) {
        return res.status(400).json({ message: err.message });
    }
    next();
}

export { upload, handleUploadError };