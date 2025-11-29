import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { getBankStatusPending, updateBankStatus, formatCurrency, formatDate } from "@/lib/localStorage";
import { bankStatusOptions, type BankApplication } from "@shared/schema";
import { ClipboardCheck, Clock, Phone, Building2, Edit, Save, X } from "lucide-react";

export default function StatusPendingPage() {
  const { toast } = useToast();
  const [applications, setApplications] = useState<BankApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<BankApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [remarks, setRemarks] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setApplications(getBankStatusPending());
  }, []);

  const handleUpdateStatus = (app: BankApplication) => {
    setSelectedApp(app);
    setStatus("");
    setRemarks("");
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!selectedApp || !status) {
      toast({
        title: "Error",
        description: "Please select a status",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      updateBankStatus(
        selectedApp.appId,
        status as BankApplication["status"],
        remarks
      );

      setApplications(getBankStatusPending());
      setIsModalOpen(false);

      toast({
        title: "Status Updated",
        description: `Application ${selectedApp.appId} has been updated to ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Bank Status Pending</h1>
          <p className="text-muted-foreground">Applications awaiting status update</p>
        </div>

        {/* Stats Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-md">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-sm text-muted-foreground">Pending Status Updates</p>
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
                      <TableHead>App ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Applied Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No pending status updates
                        </TableCell>
                      </TableRow>
                    ) : (
                      applications.map((app) => (
                        <TableRow key={app.appId} data-testid={`row-status-${app.appId}`}>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => handleUpdateStatus(app)}
                              data-testid={`button-update-${app.appId}`}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Update
                            </Button>
                          </TableCell>
                          <TableCell className="font-mono text-sm font-medium">
                            {app.appId}
                          </TableCell>
                          <TableCell className="font-medium">{app.customerName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{app.bankName}</Badge>
                          </TableCell>
                          <TableCell>{app.loanType}</TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(app.amount)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(app.appliedAt)}
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
          {applications.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No pending status updates
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.appId} data-testid={`card-status-${app.appId}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-sm font-medium text-primary">{app.appId}</p>
                      <h3 className="font-semibold mt-1">{app.customerName}</h3>
                    </div>
                    <Badge variant="secondary">Pending</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <Badge variant="outline">{app.bankName}</Badge>
                      <span className="text-muted-foreground">-</span>
                      <span>{app.loanType}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {app.phone}
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-semibold">{formatCurrency(app.amount)}</p>
                    </div>
                    <Button onClick={() => handleUpdateStatus(app)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Update Status
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Update Status Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5" />
                Update Bank Status
              </DialogTitle>
              <DialogDescription>
                Update the status for this bank application
              </DialogDescription>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground text-xs">App ID</Label>
                    <p className="font-mono font-medium">{selectedApp.appId}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Customer</Label>
                    <p className="font-medium">{selectedApp.customerName}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Bank</Label>
                    <Badge variant="outline">{selectedApp.bankName}</Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Amount</Label>
                    <p className="font-medium">{formatCurrency(selectedApp.amount)}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger data-testid="select-status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankStatusOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="remarks">Remarks</Label>
                  <Textarea
                    id="remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Add any remarks..."
                    rows={3}
                    data-testid="input-remarks"
                  />
                </div>
              </div>
            )}

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !status}
                data-testid="button-save-status"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
