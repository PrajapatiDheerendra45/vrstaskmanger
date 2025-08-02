import express from 'express';
import { deleteInterview, getAllInterviews, getInterviewByHrId, scheduleInterview, updateInterview } from '../controller/interviewController.js';

const router = express.Router();

router.post('/schedule', scheduleInterview);
router.get('/get/', getAllInterviews);
router.get('/getbyId/:id', getInterviewByHrId);
router.put('/update/:id', updateInterview);
router.delete('/delete/:id', deleteInterview);

export default router;
