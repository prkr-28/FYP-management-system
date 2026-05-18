export const isAuthorized = (requiredRole) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized: Please log in"
            });
        }
        if (req.user.role !== requiredRole) {
            return res.status(403).json({
                success: false,
                message: "Forbidden: You are not authorized to perform this action"
            });
        }
        next();
    };
};