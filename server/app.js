import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookiesParser from 'cookie-parser';
import connectDB from './config/db.js';
import rateLimit from 'express-rate-limit';
import ErrorHandler from './middlewares/error.js';
dotenv.config();

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



app.use(express.json());
app.use(cookiesParser());
app.use(express.urlencoded({ extended: true }));

app.use(ErrorHandler);


export default app;
