import jwt from "jsonwebtoken";

function checkAuth() {
    return (req, res, next) => {
        const authorization = req.headers.authorization;
        if (!authorization) {
            return res.status(401).send({ error: "Unauthorized access" });
        }
        const token = authorization.split(" ")[1];
        try {
            const { _id } = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { _id };
            next();
        } catch (err) {
            return res.status(403).send({ error: "Invalid Token" });
        }
    };
}

export default checkAuth;
