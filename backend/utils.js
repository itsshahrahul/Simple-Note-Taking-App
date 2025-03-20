import jwt from "jsonwebtoken";

const createToken = (id) => 
    jwt.sign({ _id: id }, "mysecretkey", { expiresIn: "3d" });

export default createToken;
