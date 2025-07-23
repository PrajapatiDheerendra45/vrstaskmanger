import express from 'express';
import { upload } from '../middleware/upload.js';
import { createCandidate, deleteCandidate, getAllCandidates, getCandidateById, updateCandidate } from '../controller/candidateController.js';


const router = express.Router();

router.post('/create', upload.single('resume'), createCandidate);
router.get('/get', getAllCandidates);
router.get('/get/:id', getCandidateById);
router.put('/update/:id', upload.single('resume'), updateCandidate);
router.delete('/delete/:id', deleteCandidate);

export default router;
