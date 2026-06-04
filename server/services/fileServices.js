import ErrorHandler from "../middlewares/error.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const streamDownload = (filePath, originalName, res) => {
    try {
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "File not found" });
        }
        res.download(filePath, originalName, (err) => {
            if (err) {
                console.error("Error during file download:", err);
                return res.status(500).json({ success: false, message: "Error occurred while downloading file" });
            }
        });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error during file download:", error.message);
            return res.status(error.statusCode || 500).json({ success: false, error: error.message || "Error occurred while downloading file" });
        }
        return res.status(500).json({ success: false, error: "Error occurred while downloading file" });
    }
}