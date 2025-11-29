import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { getLeads, addLead, formatCurrency, formatDate } from "@/lib/localStorage";
import { loanTypes, type Lead } from "@shared/schema";
import { Plus, Search, Users, Phone, Mail, CreditCard } from "lucide-react";

export default function LeadsPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    panCard: "",
    loanType: "" as typeof loanTypes[number] | "",
    requestedAmount: "",
    monthlyIncome: "",
    notes: "",
  });

  useEffect(() => {
    setLeads(getLeads());
  }, []);

  const filteredLeads = leads.filter((lead) => {
    const term = searchTerm.toLowerCase();
    return (
      lead.fullName.toLowerCase().includes(term) ||
      lead.phone.includes(term) ||
      lead.loanType.toLowerCase().includes(term)
    );
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      phone: "",
      email: "",
      panCard: "",
      loanType: "",
      requestedAmount: "",
      monthlyIncome: "",
      notes: "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.loanType) {
      toast({
        title: "Validation Error",
        description: "Please select a loan type",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const newLead = addLead({
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        panCard: formData.panCard.toUpperCase(),
        loanType: formData.loanType as typeof loanTypes[number],
        requestedAmount: Number(formData.requestedAmount),
        monthlyIncome: Number(formData.monthlyIncome),
        notes: formData.notes,
      });

      setLeads(getLeads());
      setIsModalOpen(false);
      resetForm();

      toast({
        title: "Lead Added Successfully",
        description: `Lead #${newLead.serialNo} has been created for ${newLead.fullName}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add lead. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-page-title">Lead Management</h1>
            <p className="text-muted-foreground">Manage all your loan leads</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} data-testid="button-add-lead">
            <Plus className="w-4 h-4 mr-2" />
            Add Lead
          </Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, phone, or loan type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
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
                      <TableHead className="w-16">Serial</TableHead>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>PAN</TableHead>
                      <TableHead>Loan Type</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Income</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLeads.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                          {searchTerm ? "No leads match your search" : "No leads yet. Add your first lead!"}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLeads.map((lead) => (
                        <TableRow key={lead.serialNo} data-testid={`row-lead-${lead.serialNo}`}>
                          <TableCell>
                            <Badge variant="secondary">#{lead.serialNo}</Badge>
                          </TableCell>
                          <TableCell className="font-medium">{lead.fullName}</TableCell>
                          <TableCell>{lead.phone}</TableCell>
                          <TableCell className="max-w-[150px] truncate">{lead.email}</TableCell>
                          <TableCell className="font-mono text-sm">{lead.panCard}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{lead.loanType}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(lead.requestedAmount)}
                          </TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(lead.monthlyIncome)}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {formatDate(lead.createdAt)}
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
          {filteredLeads.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-muted-foreground">
                {searchTerm ? "No leads match your search" : "No leads yet. Add your first lead!"}
              </CardContent>
            </Card>
          ) : (
            filteredLeads.map((lead) => (
              <Card key={lead.serialNo} data-testid={`card-lead-${lead.serialNo}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{lead.fullName}</h3>
                      <Badge variant="outline" className="mt-1">{lead.loanType}</Badge>
                    </div>
                    <Badge variant="secondary">#{lead.serialNo}</Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      {lead.phone}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{lead.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <CreditCard className="w-4 h-4" />
                      <span className="font-mono">{lead.panCard}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Requested</p>
                      <p className="font-semibold">{formatCurrency(lead.requestedAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Income</p>
                      <p className="font-medium">{formatCurrency(lead.monthlyIncome)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Add Lead Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Add New Lead
              </DialogTitle>
              <DialogDescription>
                Enter the lead details below. All fields are required.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Enter full name"
                    required
                    data-testid="input-fullName"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter phone number"
                    required
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter email"
                    required
                    data-testid="input-email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panCard">PAN Card</Label>
                  <Input
                    id="panCard"
                    value={formData.panCard}
                    onChange={(e) => setFormData({ ...formData, panCard: e.target.value.toUpperCase() })}
                    placeholder="Enter PAN card"
                    maxLength={10}
                    required
                    data-testid="input-panCard"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loanType">Loan Type</Label>
                  <Select
                    value={formData.loanType}
                    onValueChange={(value) => setFormData({ ...formData, loanType: value as typeof loanTypes[number] })}
                  >
                    <SelectTrigger data-testid="select-loanType">
                      <SelectValue placeholder="Select loan type" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="requestedAmount">Requested Amount</Label>
                  <Input
                    id="requestedAmount"
                    type="number"
                    value={formData.requestedAmount}
                    onChange={(e) => setFormData({ ...formData, requestedAmount: e.target.value })}
                    placeholder="Enter amount"
                    min="1"
                    required
                    data-testid="input-requestedAmount"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="monthlyIncome">Monthly Income</Label>
                  <Input
                    id="monthlyIncome"
                    type="number"
                    value={formData.monthlyIncome}
                    onChange={(e) => setFormData({ ...formData, monthlyIncome: e.target.value })}
                    placeholder="Enter monthly income"
                    min="1"
                    required
                    data-testid="input-monthlyIncome"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes..."
                    rows={3}
                    data-testid="input-notes"
                  />
                </div>
              </div>

              <DialogFooter className="gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} data-testid="button-submit">
                  {isSubmitting ? "Adding..." : "Add Lead"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
