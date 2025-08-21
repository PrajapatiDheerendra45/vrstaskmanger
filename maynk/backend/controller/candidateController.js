import Candidate from '../models/Candidate.js';

// ✅ Create Candidate
export const createCandidate = async (req, res) => {
  try {
    const { fullName, email, phone, experience, comments, createdBy, position, location } = req.body;
    const resumePath = req.file ? req.file.path : '';

    const candidate = await Candidate.create({
      fullName,
      email,
      position,
      phone,
      experience,
      location,
      comments,
      resume: resumePath,
      createdBy,
    });

    res.status(201).json({status:true,message:"Candidate Created Successfully..!",data:candidate});
  } catch (error) {
    res.status(500).json({ message: 'Candidate creation failed', error });
  }
};

// ✅ Get All Candidates
export const getAllCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Fetching candidates failed', error });
  }
};

// ✅ Get Candidates by Logged-in User
export const getCandidatesByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const candidates = await Candidate.find({ createdBy: userId }).sort({ createdAt: -1 });
    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Fetching candidates failed', error });
  }
};

// ✅ Get Single Candidate
export const getCandidateById = async (req, res) => {
  try {
    const { id } = req.params; // id = createdBy's user _id
    const candidates = await Candidate.find({ createdBy: id });
    
    if (!candidates || candidates.length === 0) {
      return res.status(404).json({ message: "No candidates found for this user" });
    }

    res.status(200).json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch candidates", error });
  }
};

export const getCandidateByIdParticular = async (req, res) => {
  try {
    const candidateId = req.params.id;

    const candidate = await Candidate.findById(candidateId);

    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: "Candidate not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: candidate,
    });
  } catch (error) {
    console.error("Error fetching candidate:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ✅ Update Candidate
export const updateCandidate = async (req, res) => {
  try {
    const { fullName, email, phone, experience, comments, position, location } = req.body;
    const resumePath = req.file ? req.file.path : undefined;

    const updateData = {
      fullName,
      email,
      position,
      phone,
      experience,
      location,
      comments
    };

    if (resumePath) updateData.resume = resumePath;

    const updated = await Candidate.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) return res.status(404).json({ message: 'Candidate not found' });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Updating candidate failed', error });
  }
};

// ✅ Delete Candidate
export const deleteCandidate = async (req, res) => {
  try {
    const deleted = await Candidate.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Candidate not found' });
    res.status(200).json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Deleting candidate failed', error });
  }
};
