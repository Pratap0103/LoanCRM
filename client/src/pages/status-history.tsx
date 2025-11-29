import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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
import Layout from "@/components/layout";
import { getBankStatusHistory, formatCurrency, formatDate } from "@/lib/localStorage";
import type { BankApplication } from "@shared/schema";
import { CheckCircle2, Eye, Phone, Building2, ThumbsUp, ThumbsDown, Clock, History } from "lucide-react";

export default function StatusHistoryPage() {
  const [applications, setApplications] = useState<BankApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<BankApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setApplications(getBankStatusHistory());
  }, []);

  const handleView = (app: BankApplication) => {
    setSelectedApp(app);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) {
      return <Badge variant="secondary">Pending</Badge>;
    }

    const statusStyles: Record<string, string> = {
      Approved: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      Sanctioned: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
      Rejected: "bg-destructive/10 text-destructive border-destructive/20",
      "Documents Required": "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      Query: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      "Under Review": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
    };

    return (
      <Badge variant="outline" className={statusStyles[status] || ""}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status?: string) => {
    if (!status) return <Clock className="w-6 h-6 text-muted-foreground" />;
    
    if (status === "Approved" || status === "Sanctioned") {
      return <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400" />;
    }
    if (status === "Rejected") {
      return <ThumbsDown className="w-6 h-6 text-destructive" />;
    }
    return <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />;
  };

  // Calculate stats
  const approved = applications.filter((a) => a.status === "Approved" || a.status === "Sanctioned").length;
  const rejected = applications.filter((a) => a.status === "Rejected").length;

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Bank Status History</h1>
          <p className="text-muted-foreground">Completed status updates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary/10 rounded-md">
                  <History className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{applications.length}</p>
                  <p className="text-sm text-muted-foreground">Total Updates</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-500/10 rounded-md">
                  <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{approved}</p>
                  <p className="text-sm text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-destructive/10 rounded-md">
                  <ThumbsDown className="w-6 h-6 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Desktop Table View */}
        <Card className="hidden sm:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="max-h-[500px] overflow-y-auto">
                <Table>
                  <TableHeader className="sticky top-0 bg-muted z-10">
                    <TableRow>
                      <TableHead className="w-24">Action</TableHead>
                      <TableHead>App ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Final Status</TableHead>
                      <TableHead>Updated Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No status history
                        </TableCell>
                      </TableRow>
                    ) : (
                      applications.map((app) => (
                        <TableRow key={app.appId} data-testid={`row-history-${app.appId}`}>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleView(app)}
                              data-testid={`button-view-${app.appId}`}
                            >
                              <Eye className="w-4 h-4" />
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
                          <TableCell>{getStatusBadge(app.status)}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {app.updatedAt ? formatDate(app.updatedAt) : "-"}
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
                No status history
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.appId} data-testid={`card-history-${app.appId}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-mono text-sm font-medium text-primary">{app.appId}</p>
                      <h3 className="font-semibold mt-1">{app.customerName}</h3>
                    </div>
                    {getStatusBadge(app.status)}
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
                    <Button variant="outline" onClick={() => handleView(app)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* View Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Application Details
              </DialogTitle>
              <DialogDescription>
                Complete status information
              </DialogDescription>
            </DialogHeader>

            {selectedApp && (
              <div className="space-y-4">
                <div className="flex items-center justify-center py-4">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-2">
                      {getStatusIcon(selectedApp.status)}
                    </div>
                    <div>{getStatusBadge(selectedApp.status)}</div>
                  </div>
                </div>

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
                    <Label className="text-muted-foreground text-xs">Loan Type</Label>
                    <p className="font-medium">{selectedApp.loanType}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Amount</Label>
                    <p className="font-medium">{formatCurrency(selectedApp.amount)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Phone</Label>
                    <p className="font-medium">{selectedApp.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Applied Date</Label>
                    <p className="font-medium">{formatDate(selectedApp.appliedAt)}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground text-xs">Updated Date</Label>
                    <p className="font-medium">
                      {selectedApp.updatedAt ? formatDate(selectedApp.updatedAt) : "-"}
                    </p>
                  </div>
                </div>

                {selectedApp.remarks && (
                  <div className="pt-2 border-t">
                    <Label className="text-muted-foreground text-xs">Remarks</Label>
                    <p className="text-sm mt-1">{selectedApp.remarks}</p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
