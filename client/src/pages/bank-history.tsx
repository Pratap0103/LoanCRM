import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Layout from "@/components/layout";
import { getBankHistory, formatCurrency, formatDate } from "@/lib/localStorage";
import type { BankApplication } from "@shared/schema";
import { Building2, CheckCircle2, Phone, CreditCard } from "lucide-react";

export default function BankHistoryPage() {
  const [applications, setApplications] = useState<BankApplication[]>([]);

  useEffect(() => {
    setApplications(getBankHistory());
  }, []);

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

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Bank Selection History</h1>
          <p className="text-muted-foreground">All bank applications submitted</p>
        </div>

        {/* Stats Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-md">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-sm text-muted-foreground">Total Bank Applications</p>
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
                      <TableHead>App ID</TableHead>
                      <TableHead className="w-16">Serial</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Bank</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {applications.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          No bank applications yet
                        </TableCell>
                      </TableRow>
                    ) : (
                      applications.map((app) => (
                        <TableRow key={app.appId} data-testid={`row-app-${app.appId}`}>
                          <TableCell className="font-mono text-sm font-medium">
                            {app.appId}
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">#{app.serialNo}</Badge>
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
                No bank applications yet
              </CardContent>
            </Card>
          ) : (
            applications.map((app) => (
              <Card key={app.appId} data-testid={`card-app-${app.appId}`}>
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
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Applied</p>
                      <p className="text-sm">{formatDate(app.appliedAt)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
