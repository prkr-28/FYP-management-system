import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookiesParser from 'cookie-parser';
import connectDB from './config/db.js';
import rateLimit from 'express-rate-limit';
import { errorMiddleware } from './middlewares/error.js';
import authRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}
));

const uploadsDir = path.join(__dirname, 'uploads');
const tempDir = path.join(uploadsDir, 'temp');

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
}

app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({ extended: true }));



app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/student", studentRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/project", projectRoutes);
app.use(errorMiddleware);


export default app;
