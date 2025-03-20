import express from "express";
import Note from "../models/noteModel.js";
import checkAuth from "../middleware/auth.js";

const router = express.Router();
router.use(checkAuth());

router.get("/", async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user._id });
        res.send(notes);
    } catch (err) {
        res.status(500).send({ error: "Failed to fetch notes" });
    }
});
router.post("/", async (req, res) => {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).send({ error: "Title and content are required" });
    }
    try {
        const note = await Note.create({
            title,
            content,
            user: req.user._id
        });
        res.send({ message: "Note added", note });
    } catch (err) {
        res.status(500).send({ error: "Error creating note" });
    }
});
router.put("/:id", async (req, res) => {
    const noteId = req.params.id;
    try {
        const updatedNote = await Note.findOneAndUpdate(
            { _id: noteId, user: req.user._id },
            { $set: req.body },
            { new: true }
        );
        if (!updatedNote) return res.status(404).send({ error: "Note not found" });
        res.send({ message: "Note updated", note: updatedNote });
    } catch (err) {
        res.status(500).send({ error: "Failed to update note" });
    }
});
router.delete("/:id", async (req, res) => {
    const noteId = req.params.id;
    try {
        const deletedNote = await Note.findOneAndDelete({ _id: noteId, user: req.user._id });
        if (!deletedNote) return res.status(404).send({ error: "Note not found" });
        res.send({ message: "Note deleted", note: deletedNote });
    } catch (err) {
        res.status(500).send({ error: "Failed to delete note" });
    }
});

export default router;
