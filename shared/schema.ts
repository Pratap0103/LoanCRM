import { z } from "zod";

// User types for authentication
export const userSchema = z.object({
  id: z.string(),
  password: z.string(),
  role: z.enum(["admin", "user"]),
});

export type User = z.infer<typeof userSchema>;

// Lead types
export const loanTypes = [
  "Personal Loan",
  "Home Loan",
  "Business Loan",
  "Car Loan",
  "Education Loan",
  "Gold Loan",
] as const;

export const leadSchema = z.object({
  serialNo: z.number(),
  fullName: z.string().min(1, "Full name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  panCard: z.string().min(10, "Valid PAN card is required"),
  loanType: z.enum(loanTypes),
  requestedAmount: z.number().min(1, "Amount must be greater than 0"),
  monthlyIncome: z.number().min(1, "Income must be greater than 0"),
  notes: z.string().optional(),
  createdAt: z.string(),
});

export type Lead = z.infer<typeof leadSchema>;

export const insertLeadSchema = leadSchema.omit({ serialNo: true, createdAt: true });
export type InsertLead = z.infer<typeof insertLeadSchema>;

// Document types
export const documentTypes = [
  "idProof",
  "addressProof",
  "salarySlips",
  "bankStatements",
  "photo",
  "signature",
  "otherDocuments",
] as const;

export const documentRecordSchema = z.object({
  serialNo: z.number(),
  fullName: z.string(),
  phone: z.string(),
  email: z.string(),
  panCard: z.string(),
  loanType: z.string(),
  requestedAmount: z.number(),
  monthlyIncome: z.number(),
  notes: z.string().optional(),
  documents: z.record(z.enum(documentTypes), z.object({
    uploaded: z.boolean(),
    fileName: z.string().optional(),
  })).optional(),
  completedAt: z.string().optional(),
});

export type DocumentRecord = z.infer<typeof documentRecordSchema>;

// Bank application types
export const bankNames = [
  "HDFC",
  "ICICI",
  "SBI",
  "Axis",
  "Kotak",
  "IndusInd",
  "Bajaj",
  "Others",
] as const;

export const bankStatusOptions = [
  "Approved",
  "Rejected",
  "Documents Required",
  "Query",
  "Under Review",
  "Sanctioned",
] as const;

export const bankApplicationSchema = z.object({
  appId: z.string(),
  serialNo: z.number(),
  customerName: z.string(),
  phone: z.string(),
  bankName: z.string(),
  loanType: z.string(),
  amount: z.number(),
  status: z.enum(bankStatusOptions).optional(),
  remarks: z.string().optional(),
  appliedAt: z.string(),
  updatedAt: z.string().optional(),
});

export type BankApplication = z.infer<typeof bankApplicationSchema>;

// Active session type
export const activeSessionSchema = z.object({
  userId: z.string(),
  role: z.string(),
  loginTime: z.string(),
});

export type ActiveSession = z.infer<typeof activeSessionSchema>;

// LocalStorage data structure
export interface LocalStorageData {
  users: User[];
  leads: Lead[];
  documentPending: DocumentRecord[];
  documentHistory: DocumentRecord[];
  bankPending: DocumentRecord[];
  bankHistory: BankApplication[];
  bankStatusPending: BankApplication[];
  bankStatusHistory: BankApplication[];
  activeUser: ActiveSession | null;
  lastSerialNo: number;
  lastBankAppNo: Record<string, number>;
}
