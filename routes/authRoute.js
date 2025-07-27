import express from 'express';
import { deleteUser, getAllUsers, getAllUsersById, loginUser, registerUser, updateUser } from '../controller/authController.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/getusers', getAllUsers);
router.get('/getusers/:_id', getAllUsersById);
router.put("/update/:_id", updateUser);
router.delete("/delete/:_id", deleteUser);

export default router;
