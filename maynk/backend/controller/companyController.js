import Company from "../models/companyModel.js";

// ➤ CREATE Company
export const createCompanyController = async (req, res) => {
  try {
    const newCompany = new Company({
      ...req.body,
      createdBy: req.body.createdBy || "64xxxx..." // pass _id here in real flow
    });
    const savedCompany = await newCompany.save();
    res.status(201).json({status:true,message:"Compnay registerd Successfully...!", data:savedCompany});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ➤ GET All Companies
export const getAllCompaniesController = async (req, res) => {
  try {
    const companies = await Company.find().populate("createdBy", "name email");
    res.status(200).json(companies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ GET Single Company
export const getCompanyByIdController = async (req, res) => {
  try {
    const userId = req.params.id;

    const companies = await Company.find({ createdBy: userId }).populate("createdBy", "name email");

    if (!companies || companies.length === 0) {
      return res.status(404).json({ message: "No companies found for this user" });
    }

    res.status(200).json(companies);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ➤ UPDATE Company
export const updateCompanyController = async (req, res) => {
  try {
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedCompany);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ➤ DELETE Company
export const deleteCompanyController = async (req, res) => {
  try {
    await Company.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
