import { Request, Response } from "express";
import { umsLogin } from "../../scrapper/umsLogin";
import { studentDetailUpdate } from "../../services/saveToDB/studentDetailUpdate";

export const getStudentLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { reg_no, password } = req.body;
    const studentInfo = await umsLogin({ reg_no, password });
    if (studentInfo.login) {
      await studentDetailUpdate(reg_no, { password: password });
    }
    res.status(200).json(studentInfo);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
}