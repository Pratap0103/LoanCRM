import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/layout";
import { getBankPending, applyToBanks, formatCurrency } from "@/lib/localStorage";
import { bankNames, type DocumentRecord } from "@shared/schema";
import { Building2, ArrowLeft, Send, X } from "lucide-react";

export default function BankApplyPage() {
  const params = useParams<{ serialNo: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [record, setRecord] = useState<DocumentRecord | null>(null);
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const serialNo = Number(params.serialNo);
    const pending = getBankPending();
    const found = pending.find((d) => d.serialNo === serialNo);
    
    if (found) {
      setRecord(found);
    } else {
      toast({
        title: "Record Not Found",
        description: "The record was not found.",
        variant: "destructive",
      });
      setLocation("/bank/pending");
    }
  }, [params.serialNo, setLocation, toast]);

  const handleBankToggle = (bank: string) => {
    setSelectedBanks((prev) =>
      prev.includes(bank) ? prev.filter((b) => b !== bank) : [...prev, bank]
    );
  };

  const handleSubmit = async () => {
    if (!record) return;

    if (selectedBanks.length === 0) {
      toast({
        title: "No Banks Selected",
        description: "Please select at least one bank to apply.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const applications = applyToBanks(record, selectedBanks);

      toast({
        title: "Applications Submitted",
        description: `${applications.length} bank application(s) have been created.`,
      });

      setLocation("/bank/history");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit applications. Please try again.",
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
            onClick={() => setLocation("/bank/pending")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Apply to Banks</h1>
            <p className="text-muted-foreground">Select banks for loan application</p>
          </div>
        </div>

        {/* Customer Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Customer Information</CardTitle>
                <CardDescription>Lead details for bank application</CardDescription>
              </div>
              <Badge variant="secondary" className="text-base">
                #{record.serialNo}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label className="text-muted-foreground text-xs">Full Name</Label>
                <p className="font-medium">{record.fullName}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Phone</Label>
                <p className="font-medium">{record.phone}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Loan Type</Label>
                <Badge variant="outline">{record.loanType}</Badge>
              </div>
              <div>
                <Label className="text-muted-foreground text-xs">Requested Amount</Label>
                <p className="font-semibold text-lg">{formatCurrency(record.requestedAmount)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bank Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Select Banks
            </CardTitle>
            <CardDescription>
              Choose one or more banks for the loan application
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {bankNames.map((bank) => (
                <div
                  key={bank}
                  className={`flex items-center gap-3 p-4 rounded-md border cursor-pointer transition-colors ${
                    selectedBanks.includes(bank)
                      ? "bg-primary/10 border-primary"
                      : "bg-muted/30 hover:bg-muted/50"
                  }`}
                  onClick={() => handleBankToggle(bank)}
                  data-testid={`bank-option-${bank}`}
                >
                  <Checkbox
                    checked={selectedBanks.includes(bank)}
                    onCheckedChange={() => handleBankToggle(bank)}
                    data-testid={`checkbox-bank-${bank}`}
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Building2 className={`w-4 h-4 ${selectedBanks.includes(bank) ? "text-primary" : "text-muted-foreground"}`} />
                    <Label className="cursor-pointer font-medium">{bank}</Label>
                  </div>
                </div>
              ))}
            </div>

            {selectedBanks.length > 0 && (
              <div className="mt-4 p-3 bg-primary/10 rounded-md">
                <p className="text-sm font-medium">
                  Selected Banks: {selectedBanks.length}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedBanks.map((bank) => (
                    <Badge key={bank} variant="secondary">
                      {bank}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={() => setLocation("/bank/pending")}
            data-testid="button-cancel"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedBanks.length === 0}
            data-testid="button-submit"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting
              ? "Submitting..."
              : `Apply to ${selectedBanks.length} Bank${selectedBanks.length !== 1 ? "s" : ""}`}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
