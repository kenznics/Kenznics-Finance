import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// SKena aturan validasi 
const transactionSchema = z.object({
    title: z.string().min(3, "Judul minimal 3 karakter"),
    amount: z.number().positive("Jumlah uang harus angka positif"),
    type: z.enum(["INCOME", "EXPENSE"], { message: "Tipe harus INCOME atau EXPENSE" })
});

export const validateTransaction = (req: Request, res: Response, next: NextFunction) => {
    const result = transactionSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            status: "fail",
            errors: result.error.issues.map(issue => issue.message)
        });
        return;
    }

    next();
};