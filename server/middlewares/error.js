class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req, res, next) => {

    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

    // Duplicate key
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400);
    }

    // Mongoose validation
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors)
            .map(val => val.message)
            .join(", ");

        err = new ErrorHandler(message, 400);
    }

    // JWT invalid
    if (err.name === "JsonWebTokenError") {
        err = new ErrorHandler(
            "JSON web token is invalid, try again",
            400
        );
    }

    // JWT expired
    if (err.name === "TokenExpiredError") {
        err = new ErrorHandler(
            "JSON web token is expired, try again",
            400
        );
    }

    // Invalid ObjectId
    if (err.name === "CastError") {
        err = new ErrorHandler("Invalid ID format", 400);
    }

    return res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};

export default ErrorHandler;