import { asyncHandler } from "../middlewares/assyncHandler.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userModel.js";
import { getResetPasswordEmailTemplate } from "../utils/emailTemplates.js";
import { generateToken } from "../utils/generateToken.js";
import crypto from 'crypto';


export const registerUser = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
        return next(new ErrorHandler('Please fill all the fields', 400));
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return next(new ErrorHandler('User already exists', 400));
    }
    const user = new User({ name, email, password, role });
    await user.save();
    generateToken(user, 201, 'Registered successfully', res);
});

export const login = asyncHandler(async (req, res, next) => {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
        return next(new ErrorHandler('Please fill all the fields', 400));
    }
    const user = await User.findOne({ email, role }).select('+password');
    if (!user) {
        return next(new ErrorHandler('Invalid email or password or role', 401));
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }
    generateToken(user, 200, 'Logged in successfully', res);
});
export const logout = asyncHandler(async (req, res, next) => {
    res.status(200).cookie("token", "", {
        expires: new Date(
            Date.now()
        ),
        httpOnly: true,
    }).json({
        success: true,
        message: 'Logged out successfully'
    });
});
export const getUser = asyncHandler(async (req, res, next) => {
    const user = req.user;
    res.status(200).json({
        success: true,
        user
    });
});
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new ErrorHandler('User not found', 404));
    }
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    const message = getResetPasswordEmailTemplate(resetPasswordUrl);
    try {
        await sendEmail({
            to: user.email,
            subject: "FYP SYSYTEM - Password Reset Request",
            message
        });
        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        });
    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new ErrorHandler('Email not sent', 500));
    }
});
export const resetPassword = asyncHandler(async (req, res, next) => {
    const { token } = req.params;
    const resetPasswordToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ErrorHandler('Invalid or expired token', 400));
    }
    if (!req.body.password || !req.body.confirmPassword) {
        return next(new ErrorHandler('Please fill all the fields', 400));
    }
    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password and confirm password do not match', 400));
    }
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    generateToken(user, 200, 'Password reset successfully', res);
});