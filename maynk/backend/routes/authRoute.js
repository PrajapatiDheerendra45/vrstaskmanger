import express from 'express';
import { deleteUser, getAllUsers, getAllUsersById, loginUser, registerUser, updateUser, forgotPassword, resetPassword, googleLogin, getUserDashboardStats } from '../controller/authController.js';


const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/google-login', googleLogin);
router.get('/getusers', getAllUsers);
router.get('/getusers/:_id', getAllUsersById);
router.get('/dashboard-stats/:userId', getUserDashboardStats);
router.put("/update/:_id", updateUser);
router.delete("/delete/:_id", deleteUser);

export default router;
