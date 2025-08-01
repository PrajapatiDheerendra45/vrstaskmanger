import Interview from '../models/Interview.js';

// Schedule Interview
export const scheduleInterview = async (req, res) => {
  try {
    const interview = new Interview(req.body);
    await interview.save();
    res.status(201).json({ success: true, message: 'Interview scheduled', interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Interviews
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, interviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Interview by ID
export const getInterviewByHrId = async (req, res) => {
  try {
    const interview = await Interview.find({ hr: req.params.id });
    
    if (!interview || interview.length === 0) {
      return res.status(404).json({ success: false, message: 'Interview not found' });
    }

    res.status(200).json({
      success: true,
      message: "Interview list fetched successfully!",
      interview
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// Update Interview
export const updateInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.status(200).json({ success: true, message: 'Interview updated', interview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Interview
export const deleteInterview = async (req, res) => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) return res.status(404).json({ success: false, message: 'Interview not found' });
    res.status(200).json({ success: true, message: 'Interview deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
