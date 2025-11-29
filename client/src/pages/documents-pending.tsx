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
import { getDocumentPending, formatCurrency } from "@/lib/localStorage";
import type { DocumentRecord } from "@shared/schema";
import { FileText, Upload, Phone, Mail, CreditCard, Clock } from "lucide-react";

export default function DocumentsPendingPage() {
  const [, setLocation] = useLocation();
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);

  useEffect(() => {
    setDocuments(getDocumentPending());
  }, []);

  const handleAddDocuments = (serialNo: number) => {
    setLocation(`/documents/add/${serialNo}`);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Document Pending</h1>
          <p className="text-muted-foreground">Leads awaiting document collection</p>
        </div>

        {/* Stats Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-500/10 rounded-md">
                <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold">{documents.length}</p>
                <p className="text-sm text-muted-foreground">Pending Documents</p>
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
                      <TableHead className="w-24">Action</TableHead>
                      <TableHead className="w-16">Serial</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Income</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          No pending documents
                        </TableCell>
                      </TableRow>
                    ) : (
                      documents.map((doc) => (
                        <TableRow key={doc.serialNo} data-testid={`row-doc-${doc.serialNo}`}>
                          <TableCell>
                            <Button
                              size="sm"
                              onClick={() => handleAddDocuments(doc.serialNo)}
                              data-testid={`button-add-docs-${doc.serialNo}`}
                            >
                              <Upload className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">#{doc.serialNo}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{doc.fullName}</TableCell>
                          <TableCell>{doc.phone}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{doc.email}</TableCell>
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
                No pending documents
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
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{doc.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-mono">{doc.panCard}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Amount</p>
                      <p className="font-semibold">{formatCurrency(doc.requestedAmount)}</p>
                    </div>
                    <Button
                      onClick={() => handleAddDocuments(doc.serialNo)}
                      data-testid={`button-add-docs-mobile-${doc.serialNo}`}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Add Documents
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
