import express from "express";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js"; 
import noteRouter from "./routes/noteRouter.js"; 
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter); 
app.use("/api/notes", noteRouter); 

mongoose.connect("mongodb://127.0.0.1:27017/CRUD")
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1); 
    });
    
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
