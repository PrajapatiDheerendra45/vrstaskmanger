import express from "express";

import { createCompanyController, deleteCompanyController, getAllCompaniesController, getCompanyByIdController, updateCompanyController } from "../controller/companyController.js";

const router = express.Router();

router.post("/create", createCompanyController);
router.get("/get", getAllCompaniesController);
router.get("/getbysingle/:id", getCompanyByIdController);
router.put("/update/:id", updateCompanyController);
router.delete("/delete/:id", deleteCompanyController);

export default router;
