import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout";
import { getDocumentHistory, updateDocumentHistory, formatCurrency, formatDate } from "@/lib/localStorage";
import type { DocumentRecord } from "@shared/schema";
import { documentTypes } from "@shared/schema";
import { FileText, Eye, Edit, CheckCircle2, Phone, Mail, CreditCard, Save, X } from "lucide-react";

const documentLabels: Record<string, string> = {
  idProof: "ID Proof",
  addressProof: "Address Proof",
  salarySlips: "Salary Slips",
  bankStatements: "Bank Statements",
  photo: "Photo",
  signature: "Signature",
  otherDocuments: "Other Documents",
};

type DocumentState = Record<string, { uploaded: boolean; fileName: string }>;

export default function DocumentsHistoryPage() {
  const { toast } = useToast();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<DocumentRecord | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editDocs, setEditDocs] = useState<DocumentState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDocuments(getDocumentHistory());
  }, []);

  const handleView = (record: DocumentRecord) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleEdit = (record: DocumentRecord) => {
    setSelectedRecord(record);
    // Initialize edit state
    const initialDocs: DocumentState = {};
    documentTypes.forEach((type) => {
      const doc = record.documents?.[type];
      initialDocs[type] = {
        uploaded: doc?.uploaded || false,
        fileName: doc?.fileName || "",
      };
    });
    setEditDocs(initialDocs);
    setIsEditModalOpen(true);
  };

  const handleCheckboxChange = (type: string, checked: boolean) => {
    setEditDocs((prev) => ({
      ...prev,
      [type]: { ...prev[type], uploaded: checked },
    }));
  };

  const handleFileChange = (type: string, fileName: string) => {
    setEditDocs((prev) => ({
      ...prev,
      [type]: { ...prev[type], fileName, uploaded: fileName.length > 0 },
    }));
  };

  const handleSaveEdit = async () => {
    if (!selectedRecord) return;

    setIsSubmitting(true);

    try {
      const docData: DocumentRecord["documents"] = {};
      Object.entries(editDocs).forEach(([key, value]) => {
        docData[key as typeof documentTypes[number]] = {
          uploaded: value.uploaded,
          fileName: value.fileName || undefined,
        };
      });

      updateDocumentHistory(selectedRecord.serialNo, docData);
      setDocuments(getDocumentHistory());
      setIsEditModalOpen(false);

      toast({
        title: "Documents Updated",
        description: `Documents for ${selectedRecord.fullName} have been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update documents. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  const getUploadedCount = (record: DocumentRecord) => {
    if (!record.documents) return 0;
    return Object.values(record.documents).filter((d) => d.uploaded).length;
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Document History</h1>
          <p className="text-muted-foreground">Completed document collections</p>
        </div>

        {/* Stats Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500/10 rounded-md">
                <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Completed Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Desktop Table View */}
        <Card className="hidden sm:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted z-10">
                    <TableRow>
                      <TableHead className="w-32">Action</TableHead>
                      <TableHead className="w-16">Serial</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Income</TableHead>
                      <TableHead>Docs</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No document history
                        </TableCell>
                      </TableRow>
                    ) : (
                      documents.map((doc) => (
                        <TableRow key={doc.serialNo} data-testid={`row-doc-${doc.serialNo}`}>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleView(doc)}
                                data-testid={`button-view-${doc.serialNo}`}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(doc)}
                                data-testid={`button-edit-${doc.serialNo}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">#{doc.serialNo}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{doc.fullName}</TableCell>
                          <TableCell>{doc.phone}</TableCell>
                          <TableCell className="font-mono text-sm">{doc.panCard}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.loanType}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(doc.requestedAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(doc.monthlyIncome)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                              {getUploadedCount(doc)}/{documentTypes.length}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Card View */}
        <div className="sm:hidden space-y-3">
          {documents.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No document history
              </CardContent>
            </Card>
          ) : (
            documents.map((doc) => (
              <Card key={doc.serialNo} data-testid={`card-doc-${doc.serialNo}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{doc.fullName}</h3>
                      <Badge variant="outline" className="mt-1">{doc.loanType}</Badge>
                    </div>
                    <Badge variant="secondary">#{doc.serialNo}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {doc.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-mono">{doc.panCard}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                        {getUploadedCount(doc)}/{documentTypes.length} Documents
                      </Badge>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-3 border-t">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleView(doc)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => handleEdit(doc)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Modal */}
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Document Details
              </DialogTitle>
              <DialogDescription>
                {selectedRecord?.fullName} - #{selectedRecord?.serialNo}
              </DialogDescription>
            </DialogHeader>

            {selectedRecord && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground text-xs">Phone</Label>
                    <p className="font-medium">{selectedRecord.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">PAN Card</Label>
                    <p className="font-medium font-mono">{selectedRecord.panCard}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Loan Type</Label>
                    <Badge variant="outline">{selectedRecord.loanType}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Amount</Label>
                    <p className="font-medium">{formatCurrency(selectedRecord.requestedAmount)}</p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <Label className="text-sm font-medium">Documents</Label>
                  <div className="mt-2 space-y-2">
                    {documentTypes.map((type) => {
                      const doc = selectedRecord.documents?.[type];
                      return (
                        <div
                          key={type}
                          className="flex items-center justify-between p-2 rounded-md bg-muted/50"
                        >
                          <span className="text-sm">{documentLabels[type]}</span>
                          {doc?.uploaded ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              {doc.fileName || "Uploaded"}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not Uploaded</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {selectedRecord.completedAt && (
                  <p className="text-sm text-muted-foreground">
                    Completed on: {formatDate(selectedRecord.completedAt)}
                  </p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Edit className="w-5 h-5" />
                Edit Documents
              </DialogTitle>
              <DialogDescription>
                {selectedRecord?.fullName} - #{selectedRecord?.serialNo}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3">
              {documentTypes.map((type) => (
                <div
                  key={type}
                  className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-md border bg-muted/30"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      id={`edit-${type}`}
                      checked={editDocs[type]?.uploaded || false}
                      onCheckedChange={(checked) => handleCheckboxChange(type, checked as boolean)}
                    />
                    <Label htmlFor={`edit-${type}`} className="flex-1 cursor-pointer text-sm">
                      {documentLabels[type]}
                    </Label>
                  </div>
                  <Input
                    type="text"
                    placeholder="File name"
                    value={editDocs[type]?.fileName || ""}
                    onChange={(e) => handleFileChange(type, e.target.value)}
                    className="text-sm sm:w-40"
                  />
                </div>
              ))}
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSaveEdit} disabled={isSubmitting}>
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
