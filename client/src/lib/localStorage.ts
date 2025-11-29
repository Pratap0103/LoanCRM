import type { 
  User, 
  Lead, 
  DocumentRecord, 
  BankApplication, 
  ActiveSession,
  LocalStorageData 
} from "@shared/schema";

const STORAGE_KEYS = {
  USERS: "users",
  LEADS: "leads",
  DOCUMENT_PENDING: "documentPending",
  DOCUMENT_HISTORY: "documentHistory",
  BANK_PENDING: "bankPending",
  BANK_HISTORY: "bankHistory",
  BANK_STATUS_PENDING: "bankStatusPending",
  BANK_STATUS_HISTORY: "bankStatusHistory",
  ACTIVE_USER: "activeUser",
  LAST_SERIAL_NO: "lastSerialNo",
  LAST_BANK_APP_NO: "lastBankAppNo",
  INITIALIZED: "loanTrackerInitialized",
} as const;

// Default users
const defaultUsers: User[] = [
  { id: "admin", password: "admin123", role: "admin" },
  { id: "user", password: "user123", role: "user" },
];

// Dummy data for initial load
const dummyLeads: Lead[] = [
  {
    serialNo: 1,
    fullName: "Rajesh Kumar",
    phone: "9876543210",
    email: "rajesh.kumar@email.com",
    panCard: "ABCDE1234F",
    loanType: "Home Loan",
    requestedAmount: 5000000,
    monthlyIncome: 150000,
    notes: "Looking for 20-year term",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    serialNo: 2,
    fullName: "Priya Sharma",
    phone: "9876543211",
    email: "priya.sharma@email.com",
    panCard: "FGHIJ5678K",
    loanType: "Personal Loan",
    requestedAmount: 500000,
    monthlyIncome: 75000,
    notes: "For wedding expenses",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    serialNo: 3,
    fullName: "Amit Patel",
    phone: "9876543212",
    email: "amit.patel@email.com",
    panCard: "KLMNO9012P",
    loanType: "Business Loan",
    requestedAmount: 2000000,
    monthlyIncome: 200000,
    notes: "Expanding retail business",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    serialNo: 4,
    fullName: "Sneha Reddy",
    phone: "9876543213",
    email: "sneha.reddy@email.com",
    panCard: "QRSTU3456V",
    loanType: "Car Loan",
    requestedAmount: 800000,
    monthlyIncome: 90000,
    notes: "New SUV purchase",
    createdAt: new Date().toISOString(),
  },
  {
    serialNo: 5,
    fullName: "Vikram Singh",
    phone: "9876543214",
    email: "vikram.singh@email.com",
    panCard: "WXYZ7890A",
    loanType: "Education Loan",
    requestedAmount: 1500000,
    monthlyIncome: 60000,
    notes: "MBA program abroad",
    createdAt: new Date().toISOString(),
  },
];

const dummyDocumentPending: DocumentRecord[] = [
  {
    serialNo: 1,
    fullName: "Rajesh Kumar",
    phone: "9876543210",
    email: "rajesh.kumar@email.com",
    panCard: "ABCDE1234F",
    loanType: "Home Loan",
    requestedAmount: 5000000,
    monthlyIncome: 150000,
    notes: "Looking for 20-year term",
  },
  {
    serialNo: 2,
    fullName: "Priya Sharma",
    phone: "9876543211",
    email: "priya.sharma@email.com",
    panCard: "FGHIJ5678K",
    loanType: "Personal Loan",
    requestedAmount: 500000,
    monthlyIncome: 75000,
    notes: "For wedding expenses",
  },
];

const dummyDocumentHistory: DocumentRecord[] = [
  {
    serialNo: 3,
    fullName: "Amit Patel",
    phone: "9876543212",
    email: "amit.patel@email.com",
    panCard: "KLMNO9012P",
    loanType: "Business Loan",
    requestedAmount: 2000000,
    monthlyIncome: 200000,
    notes: "Expanding retail business",
    documents: {
      idProof: { uploaded: true, fileName: "aadhaar.pdf" },
      addressProof: { uploaded: true, fileName: "electricity_bill.pdf" },
      salarySlips: { uploaded: true, fileName: "salary_slips.pdf" },
      bankStatements: { uploaded: true, fileName: "bank_statement.pdf" },
      photo: { uploaded: true, fileName: "photo.jpg" },
      signature: { uploaded: true, fileName: "signature.jpg" },
      otherDocuments: { uploaded: false },
    },
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const dummyBankPending: DocumentRecord[] = [
  {
    serialNo: 3,
    fullName: "Amit Patel",
    phone: "9876543212",
    email: "amit.patel@email.com",
    panCard: "KLMNO9012P",
    loanType: "Business Loan",
    requestedAmount: 2000000,
    monthlyIncome: 200000,
    notes: "Expanding retail business",
    documents: {
      idProof: { uploaded: true, fileName: "aadhaar.pdf" },
      addressProof: { uploaded: true, fileName: "electricity_bill.pdf" },
      salarySlips: { uploaded: true, fileName: "salary_slips.pdf" },
      bankStatements: { uploaded: true, fileName: "bank_statement.pdf" },
      photo: { uploaded: true, fileName: "photo.jpg" },
      signature: { uploaded: true, fileName: "signature.jpg" },
      otherDocuments: { uploaded: false },
    },
    completedAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

const dummyBankHistory: BankApplication[] = [
  {
    appId: "BANK-HDFC-00001",
    serialNo: 4,
    customerName: "Sneha Reddy",
    phone: "9876543213",
    bankName: "HDFC",
    loanType: "Car Loan",
    amount: 800000,
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    appId: "BANK-ICICI-00001",
    serialNo: 4,
    customerName: "Sneha Reddy",
    phone: "9876543213",
    bankName: "ICICI",
    loanType: "Car Loan",
    amount: 800000,
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const dummyBankStatusPending: BankApplication[] = [
  {
    appId: "BANK-HDFC-00001",
    serialNo: 4,
    customerName: "Sneha Reddy",
    phone: "9876543213",
    bankName: "HDFC",
    loanType: "Car Loan",
    amount: 800000,
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    appId: "BANK-ICICI-00001",
    serialNo: 4,
    customerName: "Sneha Reddy",
    phone: "9876543213",
    bankName: "ICICI",
    loanType: "Car Loan",
    amount: 800000,
    appliedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
];

const dummyBankStatusHistory: BankApplication[] = [
  {
    appId: "BANK-SBI-00001",
    serialNo: 5,
    customerName: "Vikram Singh",
    phone: "9876543214",
    bankName: "SBI",
    loanType: "Education Loan",
    amount: 1500000,
    status: "Approved",
    remarks: "All documents verified",
    appliedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// Initialize localStorage with default data
export function initializeStorage(): void {
  const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
  
  if (!isInitialized) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
    localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(dummyLeads));
    localStorage.setItem(STORAGE_KEYS.DOCUMENT_PENDING, JSON.stringify(dummyDocumentPending));
    localStorage.setItem(STORAGE_KEYS.DOCUMENT_HISTORY, JSON.stringify(dummyDocumentHistory));
    localStorage.setItem(STORAGE_KEYS.BANK_PENDING, JSON.stringify(dummyBankPending));
    localStorage.setItem(STORAGE_KEYS.BANK_HISTORY, JSON.stringify(dummyBankHistory));
    localStorage.setItem(STORAGE_KEYS.BANK_STATUS_PENDING, JSON.stringify(dummyBankStatusPending));
    localStorage.setItem(STORAGE_KEYS.BANK_STATUS_HISTORY, JSON.stringify(dummyBankStatusHistory));
    localStorage.setItem(STORAGE_KEYS.LAST_SERIAL_NO, "5");
    localStorage.setItem(STORAGE_KEYS.LAST_BANK_APP_NO, JSON.stringify({ HDFC: 1, ICICI: 1, SBI: 1 }));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, "true");
  }
}

// Generic get/set helpers
function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

// User operations
export function getUsers(): User[] {
  return getItem<User[]>(STORAGE_KEYS.USERS, defaultUsers);
}

export function validateUser(username: string, password: string): User | null {
  const users = getUsers();
  return users.find((u) => u.id === username && u.password === password) || null;
}

export function getActiveSession(): ActiveSession | null {
  return getItem<ActiveSession | null>(STORAGE_KEYS.ACTIVE_USER, null);
}

export function setActiveSession(session: ActiveSession | null): void {
  if (session) {
    setItem(STORAGE_KEYS.ACTIVE_USER, session);
  } else {
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  }
}

export function logout(): void {
  setActiveSession(null);
}

// Lead operations
export function getLeads(): Lead[] {
  return getItem<Lead[]>(STORAGE_KEYS.LEADS, []);
}

export function addLead(lead: Omit<Lead, "serialNo" | "createdAt">): Lead {
  const leads = getLeads();
  const lastSerialNo = getItem<number>(STORAGE_KEYS.LAST_SERIAL_NO, 0);
  const newSerialNo = lastSerialNo + 1;
  
  const newLead: Lead = {
    ...lead,
    serialNo: newSerialNo,
    createdAt: new Date().toISOString(),
  };
  
  leads.push(newLead);
  setItem(STORAGE_KEYS.LEADS, leads);
  setItem(STORAGE_KEYS.LAST_SERIAL_NO, newSerialNo);
  
  // Also add to document pending
  const documentPending = getDocumentPending();
  const docRecord: DocumentRecord = {
    serialNo: newSerialNo,
    fullName: lead.fullName,
    phone: lead.phone,
    email: lead.email,
    panCard: lead.panCard,
    loanType: lead.loanType,
    requestedAmount: lead.requestedAmount,
    monthlyIncome: lead.monthlyIncome,
    notes: lead.notes,
  };
  documentPending.push(docRecord);
  setItem(STORAGE_KEYS.DOCUMENT_PENDING, documentPending);
  
  return newLead;
}

export function updateLead(serialNo: number, updates: Partial<Lead>): Lead | null {
  const leads = getLeads();
  const index = leads.findIndex((l) => l.serialNo === serialNo);
  if (index === -1) return null;
  
  leads[index] = { ...leads[index], ...updates };
  setItem(STORAGE_KEYS.LEADS, leads);
  return leads[index];
}

// Document operations
export function getDocumentPending(): DocumentRecord[] {
  return getItem<DocumentRecord[]>(STORAGE_KEYS.DOCUMENT_PENDING, []);
}

export function getDocumentHistory(): DocumentRecord[] {
  return getItem<DocumentRecord[]>(STORAGE_KEYS.DOCUMENT_HISTORY, []);
}

export function saveDocuments(serialNo: number, documents: DocumentRecord["documents"]): DocumentRecord | null {
  const pending = getDocumentPending();
  const index = pending.findIndex((d) => d.serialNo === serialNo);
  if (index === -1) return null;
  
  const record = { ...pending[index], documents, completedAt: new Date().toISOString() };
  
  // Remove from pending
  pending.splice(index, 1);
  setItem(STORAGE_KEYS.DOCUMENT_PENDING, pending);
  
  // Add to history
  const history = getDocumentHistory();
  history.unshift(record);
  setItem(STORAGE_KEYS.DOCUMENT_HISTORY, history);
  
  // Add to bank pending
  const bankPending = getBankPending();
  bankPending.push(record);
  setItem(STORAGE_KEYS.BANK_PENDING, bankPending);
  
  return record;
}

export function updateDocumentHistory(serialNo: number, documents: DocumentRecord["documents"]): DocumentRecord | null {
  const history = getDocumentHistory();
  const index = history.findIndex((d) => d.serialNo === serialNo);
  if (index === -1) return null;
  
  history[index] = { ...history[index], documents };
  setItem(STORAGE_KEYS.DOCUMENT_HISTORY, history);
  return history[index];
}

// Bank operations
export function getBankPending(): DocumentRecord[] {
  return getItem<DocumentRecord[]>(STORAGE_KEYS.BANK_PENDING, []);
}

export function getBankHistory(): BankApplication[] {
  return getItem<BankApplication[]>(STORAGE_KEYS.BANK_HISTORY, []);
}

export function applyToBanks(record: DocumentRecord, selectedBanks: string[]): BankApplication[] {
  const bankAppNos = getItem<Record<string, number>>(STORAGE_KEYS.LAST_BANK_APP_NO, {});
  const newApplications: BankApplication[] = [];
  
  for (const bank of selectedBanks) {
    const currentNo = bankAppNos[bank] || 0;
    const newNo = currentNo + 1;
    bankAppNos[bank] = newNo;
    
    const appId = `BANK-${bank}-${String(newNo).padStart(5, "0")}`;
    const application: BankApplication = {
      appId,
      serialNo: record.serialNo,
      customerName: record.fullName,
      phone: record.phone,
      bankName: bank,
      loanType: record.loanType,
      amount: record.requestedAmount,
      appliedAt: new Date().toISOString(),
    };
    
    newApplications.push(application);
  }
  
  // Save bank app numbers
  setItem(STORAGE_KEYS.LAST_BANK_APP_NO, bankAppNos);
  
  // Add to bank history
  const bankHistory = getBankHistory();
  bankHistory.push(...newApplications);
  setItem(STORAGE_KEYS.BANK_HISTORY, bankHistory);
  
  // Add to bank status pending
  const statusPending = getBankStatusPending();
  statusPending.push(...newApplications);
  setItem(STORAGE_KEYS.BANK_STATUS_PENDING, statusPending);
  
  // Remove from bank pending
  const bankPending = getBankPending();
  const updatedBankPending = bankPending.filter((b) => b.serialNo !== record.serialNo);
  setItem(STORAGE_KEYS.BANK_PENDING, updatedBankPending);
  
  return newApplications;
}

// Bank status operations
export function getBankStatusPending(): BankApplication[] {
  return getItem<BankApplication[]>(STORAGE_KEYS.BANK_STATUS_PENDING, []);
}

export function getBankStatusHistory(): BankApplication[] {
  return getItem<BankApplication[]>(STORAGE_KEYS.BANK_STATUS_HISTORY, []);
}

export function updateBankStatus(
  appId: string, 
  status: BankApplication["status"], 
  remarks: string
): BankApplication | null {
  const pending = getBankStatusPending();
  const index = pending.findIndex((a) => a.appId === appId);
  if (index === -1) return null;
  
  const application = {
    ...pending[index],
    status,
    remarks,
    updatedAt: new Date().toISOString(),
  };
  
  // Remove from pending
  pending.splice(index, 1);
  setItem(STORAGE_KEYS.BANK_STATUS_PENDING, pending);
  
  // Add to history
  const history = getBankStatusHistory();
  history.unshift(application);
  setItem(STORAGE_KEYS.BANK_STATUS_HISTORY, history);
  
  // Update bank history as well
  const bankHistory = getBankHistory();
  const bankIndex = bankHistory.findIndex((a) => a.appId === appId);
  if (bankIndex !== -1) {
    bankHistory[bankIndex] = application;
    setItem(STORAGE_KEYS.BANK_HISTORY, bankHistory);
  }
  
  return application;
}

// Dashboard statistics
export function getDashboardStats() {
  const leads = getLeads();
  const documentPending = getDocumentPending();
  const documentHistory = getDocumentHistory();
  const bankHistory = getBankHistory();
  const bankStatusHistory = getBankStatusHistory();
  
  const approved = bankStatusHistory.filter((a) => a.status === "Approved" || a.status === "Sanctioned");
  const rejected = bankStatusHistory.filter((a) => a.status === "Rejected");
  
  return {
    totalLeads: leads.length,
    documentPending: documentPending.length,
    documentCompleted: documentHistory.length,
    bankApplications: bankHistory.length,
    bankApproved: approved.length,
    bankRejected: rejected.length,
    recentLeads: leads.slice(-5).reverse(),
    recentDocuments: documentHistory.slice(0, 5),
    recentBankUpdates: bankStatusHistory.slice(0, 5),
  };
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
