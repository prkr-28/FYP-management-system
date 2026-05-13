import { asyncHandler } from "../middlewares/assyncHandler";
import ErrorHandler from "../middlewares/error";
import userModel from "../models/userModel";

export const registerUser = asyncHandler(async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return next(new ErrorHandler('Please fill all the fields', 400));
        }
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return next(new ErrorHandler('User already exists', 400));
        }
        const user = await userModel.create({ name, email, password });
        const token = user.getSignedJwtToken();
        res.status(201).json({ success: true, token });
    } catch (error) {
        next(error);
    }
});