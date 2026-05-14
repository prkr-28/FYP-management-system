export const generateToken = (user, statusCode, message, res) => {

    const token = user.generateToken();

    res.status(statusCode)
        .cookie("token", token, {
            expires: new Date(
                Date.now() +
                Number(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000
            ),
            httpOnly: true,
        })
        .json({
            success: true,
            user,
            message,
            token,
        });
};