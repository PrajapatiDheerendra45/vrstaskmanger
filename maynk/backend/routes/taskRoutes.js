import express from 'express';
import { createTask, deleteTask, getAllTasks, getTaskById, updateTask } from '../controller/taskController.js';


const router = express.Router();

router.post('/create', createTask);
router.get('/get', getAllTasks);
router.get('/get/:id', getTaskById);
router.put('/update/:id', updateTask);
router.delete('/delete/:id', deleteTask);

export default router;
