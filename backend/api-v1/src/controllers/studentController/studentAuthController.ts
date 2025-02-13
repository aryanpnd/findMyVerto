import { Request, Response } from "express";
import { umsLogin } from "../../scrapper/umsLogin";

export const getStudentLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no, password } = req.body;
    const studentInfo = await umsLogin({ reg_no, password });
    res.status(200).json(studentInfo);
  } catch (error: any) {
    res.json({ error: error.message });
  }
}