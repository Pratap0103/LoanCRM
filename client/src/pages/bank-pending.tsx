import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { getBankPending, formatCurrency } from "@/lib/localStorage";
import type { DocumentRecord } from "@shared/schema";
import { Building2, Clock, Phone, CreditCard } from "lucide-react";

export default function BankPendingPage() {
  const [, setLocation] = useLocation();
  const [records, setRecords] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    setRecords(getBankPending());
  }, []);

  const handleApplyToBanks = (serialNo: number) => {
    setLocation(`/bank/apply/${serialNo}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Bank Selection Pending</h1>
          <p className="text-muted-foreground">Leads ready for bank application</p>
        </div>

        {/* Stats Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-md">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{records.length}</p>
                <p className="text-sm text-muted-foreground">Ready for Bank Selection</p>
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
                      <TableHead>Loan Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {records.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No leads pending for bank selection
                        </TableCell>
                      </TableRow>
                    ) : (
                      records.map((record) => (
                        <TableRow key={record.serialNo} data-testid={`row-bank-${record.serialNo}`}>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => handleApplyToBanks(record.serialNo)}
                              data-testid={`button-apply-${record.serialNo}`}
                            >
                              <Building2 className="w-4 h-4 mr-1" />
                              Apply
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">#{record.serialNo}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{record.fullName}</TableCell>
                          <TableCell>{record.phone}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{record.loanType}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(record.requestedAmount)}
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
          {records.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                No leads pending for bank selection
              </CardContent>
            </Card>
          ) : (
            records.map((record) => (
              <Card key={record.serialNo} data-testid={`card-bank-${record.serialNo}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{record.fullName}</h3>
                      <Badge variant="outline" className="mt-1">{record.loanType}</Badge>
                    </div>
                    <Badge variant="secondary">#{record.serialNo}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {record.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-semibold text-foreground">
                        {formatCurrency(record.requestedAmount)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t">
                    <Button
                      className="w-full"
                      onClick={() => handleApplyToBanks(record.serialNo)}
                    >
                      <Building2 className="w-4 h-4 mr-2" />
                      Apply to Banks
                    </Button>
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
