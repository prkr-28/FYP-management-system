import ErrorHandler from "../middlewares/error.js";
import { SupervisorRequest } from "../models/supervisorRequestModel.js";

export const createRequest = async (requestData) => {
    const existingRequest = await SupervisorRequest.findOne({
        student: requestData.student,
        supervisor: requestData.supervisor,
        status: "pending",
    });

    if (existingRequest) {
        throw new ErrorHandler("You have already sent a request to this supervisor. Please wait for their response.", 400);
    }

    const newRequest = await SupervisorRequest.create(requestData);
    return await newRequest;
}