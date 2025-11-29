import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout";
import { getDocumentPending, saveDocuments, formatCurrency } from "@/lib/localStorage";
import type { DocumentRecord } from "@shared/schema";
import { documentTypes } from "@shared/schema";
import { FileText, Upload, ArrowLeft, Save, X } from "lucide-react";

const documentLabels: Record<string, string> = {
  idProof: "ID Proof (Aadhaar/Passport/Voter ID)",
  addressProof: "Address Proof",
  salarySlips: "Salary Slips (Last 3 months)",
  bankStatements: "Bank Statements (Last 6 months)",
  photo: "Passport Size Photo",
  signature: "Signature",
  otherDocuments: "Other Documents",
};

type DocumentState = Record<string, { uploaded: boolean; fileName: string }>;

export default function DocumentsAddPage() {
  const params = useParams<{ serialNo: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [record, setRecord] = useState<DocumentRecord | null>(null);
  const [documents, setDocuments] = useState<DocumentState>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const serialNo = Number(params.serialNo);
    const pending = getDocumentPending();
    const found = pending.find((d) => d.serialNo === serialNo);
    
    if (found) {
      setRecord(found);
      // Initialize document state
      const initialDocs: DocumentState = {};
      documentTypes.forEach((type) => {
        initialDocs[type] = { uploaded: false, fileName: "" };
      });
      setDocuments(initialDocs);
    } else {
      toast({
        title: "Record Not Found",
        description: "The document record was not found.",
        variant: "destructive",
      });
      setLocation("/documents/pending");
    }
  }, [params.serialNo, setLocation, toast]);

  const handleCheckboxChange = (type: string, checked: boolean) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: { ...prev[type], uploaded: checked },
    }));
  };

  const handleFileChange = (type: string, fileName: string) => {
    setDocuments((prev) => ({
      ...prev,
      [type]: { ...prev[type], fileName, uploaded: fileName.length > 0 },
    }));
  };

  const handleSubmit = async () => {
    if (!record) return;

    setIsSubmitting(true);

    try {
      // Convert to the correct format
      const docData: DocumentRecord["documents"] = {};
      Object.entries(documents).forEach(([key, value]) => {
        docData[key as typeof documentTypes[number]] = {
          uploaded: value.uploaded,
          fileName: value.fileName || undefined,
        };
      });

      saveDocuments(record.serialNo, docData);

      toast({
        title: "Documents Saved",
        description: `Documents for ${record.fullName} have been saved successfully.`,
      });

      setLocation("/documents/history");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save documents. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  if (!record) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/documents/pending")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Add Documents</h1>
            <p className="text-muted-foreground">Upload required documents for this lead</p>
          </div>
        </div>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Customer Information</CardTitle>
                <CardDescription>Pre-filled details from the lead</CardDescription>
              </div>
              <Badge variant="secondary" className="text-base">
                #{record.serialNo}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Full Name</Label>
                <p className="font-medium">{record.fullName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Phone</Label>
                <p className="font-medium">{record.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Email</Label>
                <p className="font-medium truncate">{record.email}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">PAN Card</Label>
                <p className="font-medium font-mono">{record.panCard}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Loan Type</Label>
                <Badge variant="outline">{record.loanType}</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Requested Amount</Label>
                <p className="font-medium">{formatCurrency(record.requestedAmount)}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Monthly Income</Label>
                <p className="font-medium">{formatCurrency(record.monthlyIncome)}</p>
              </div>
              {record.notes && (
                <div className="sm:col-span-2">
                  <Label className="text-muted-foreground text-xs">Notes</Label>
                  <p className="text-sm">{record.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Document Checklist */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Checklist
            </CardTitle>
            <CardDescription>
              Check the documents received and optionally upload files
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {documentTypes.map((type) => (
                <div
                  key={type}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 rounded-md border bg-muted/30"
                  data-testid={`doc-item-${type}`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      id={type}
                      checked={documents[type]?.uploaded || false}
                      onCheckedChange={(checked) => handleCheckboxChange(type, checked as boolean)}
                      data-testid={`checkbox-${type}`}
                    />
                    <Label
                      htmlFor={type}
                      className="flex-1 cursor-pointer font-medium"
                    >
                      {documentLabels[type]}
                    </Label>
                  </div>
                  <div className="flex items-center gap-2 sm:w-64">
                    <Input
                      type="text"
                      placeholder="File name (optional)"
                      value={documents[type]?.fileName || ""}
                      onChange={(e) => handleFileChange(type, e.target.value)}
                      className="text-sm"
                      data-testid={`input-file-${type}`}
                    />
                    {documents[type]?.uploaded && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 shrink-0">
                        <Upload className="w-3 h-3 mr-1" />
                        Done
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setLocation("/documents/pending")}
            data-testid="button-cancel"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            data-testid="button-save"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSubmitting ? "Saving..." : "Save Documents"}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
