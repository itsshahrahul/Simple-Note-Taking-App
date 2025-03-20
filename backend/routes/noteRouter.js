import express from "express";
import checkAuth from "../middleware/auth.js";
import { getNotes, createNote, updateNote, deleteNote } from "../controllers/noteController.js";

const router = express.Router();
router.use(checkAuth());

router.get("/", getNotes);
router.post("/", createNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);

export default router;
