import mongoose from "mongoose";

const deadlineSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Deadline name/title is required"],
            trim: true,
            maxlength: [100, "Deadline name cannot exceed 100 characters"],
        },
        dueDate: {
            type: Date,
            required: [true, "Due date is required"],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Creator user ID is required"],
        },
        project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Project",
            required: [true, "Associated project ID is required"],
        },
    },
    {
        timestamps: true,
    }
);

//indexing for better query performance
deadlineSchema.index({ dueDate: 1 });
deadlineSchema.index({ project: 1 });
deadlineSchema.index({ createdBy: 1 });

export const Deadline = mongoose.models.Deadline || mongoose.model("Deadline", deadlineSchema);