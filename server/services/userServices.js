import { User } from "../models/userModel.js";
export const createUser = async (userData) => {
    try {
        const user = new User(userData);
        await user.save();
        return user;
    } catch (error) {
        throw new Error("Error creating user: " + error.message);
    }
}

export const updateUser = async (userId, updateData) => {
    try {
        const user = await User.findByIdAndUpdate(userId, updateData, { new: true, runValidators: true }).select('-password');
        return user;
    } catch (error) {
        throw new Error("Error updating user: " + error.message);
    }
}

export const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password -resetPasswordToken -resetPasswordExpire');
        return user;
    } catch (error) {
        throw new Error("Error fetching user: " + error.message);
    }
}

export const deleteUser = async (userId) => {
    try {
        await User.findByIdAndDelete(userId);
    } catch (error) {
        throw new Error("Error deleting user: " + error.message);
    }
}

export const getAllUsers = async () => {
    try {
        const query = { role: { $in: ["Student"] } };
        const users = await User.find(query).select('-password -resetPasswordToken -resetPasswordExpire').sort({ createdAt: -1 });
        return users;
    } catch (error) {
        throw new Error("Error fetching users: " + error.message);
    }
}