import express from "express";
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from "../controller/eventController.js";


const router = express.Router();

// POST: Create
router.post("/create", createEvent);

// GET: All
router.get("/get", getAllEvents);

// GET: Single
router.get("/event/:id", getEventById);

// PUT: Update
router.put("/update/:id", updateEvent);

// DELETE: Remove
router.delete("/delete/:id", deleteEvent);

export default router;
