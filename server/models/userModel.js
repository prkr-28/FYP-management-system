import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxLength: [30, 'Name cannot exceed 30 characters'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        select: false
    },
    role: {
        type: String,
        default: 'Student',
        enum: ['Student', 'Teacher', 'Admin']
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    department: {
        type: String,
        trim: true,
        default: null
    },
    expertise: {
        type: [String],
        default: []
    },
    maxStudents: {
        type: Number,
        default: 10,
        min: [1, 'Max students must be at least 1']
    },
    assignedStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    supervisor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    projects: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        default: null
    }
}, { timestamps: true });

export default mongoose.model('User', userSchema);