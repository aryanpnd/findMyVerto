import { Request, Response } from "express";
import { scrapeStudentBasicInfo } from '../scrapper/studentDetailsScrapper';

/**
 * Get student basic information
 * @param req 
 * @param res 
 */
export const getStudentBasicInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no, password } = req.body;
    
    const studentInfo = await scrapeStudentBasicInfo({reg_no, password});
    res.status(200).json(studentInfo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

