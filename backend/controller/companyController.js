import Company from "../models/companyModel.js";

// ➤ CREATE Company
export const createCompanyController = async (req, res) => {
  try {
    const { companyName, email, phone, industry, address, city, state, zip, hrname, createdBy } = req.body;

    // Check for duplicate company by email or company name
    const existingCompany = await Company.findOne({
      $or: [
        { email: email.toLowerCase() },
        { companyName: { $regex: new RegExp(`^${companyName}$`, 'i') } }
      ]
    });

    if (existingCompany) {
      if (existingCompany.email.toLowerCase() === email.toLowerCase()) {
        return res.status(400).json({ 
          status: false, 
          message: "A company with this email already exists!" 
        });
      } else {
        return res.status(400).json({ 
          status: false, 
          message: "A company with this name already exists!" 
        });
      }
    }

    const newCompany = new Company({
      companyName,
      email: email.toLowerCase(),
      phone,
      industry,
      address,
      city,
      state,
      zip,
      hrname,
      createdBy: createdBy || "64xxxx..." // pass _id here in real flow
    });
    const savedCompany = await newCompany.save();
    res.status(201).json({status:true,message:"Company registered Successfully...!", data:savedCompany});
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
