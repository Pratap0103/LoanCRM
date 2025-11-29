import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Layout from "@/components/layout";
import { getDashboardStats, formatCurrency, formatDate } from "@/lib/localStorage";
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  Building2, 
  ThumbsUp, 
  ThumbsDown,
  ArrowRight,
  FileText,
  CreditCard,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  description?: string;
  variant?: "default" | "success" | "warning" | "destructive";
}

function StatCard({ title, value, icon, description, variant = "default" }: StatCardProps) {
  const variantStyles = {
    default: "bg-primary/10 text-primary",
    success: "bg-green-500/10 text-green-600 dark:text-green-400",
    warning: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400",
    destructive: "bg-destructive/10 text-destructive",
  };

  return (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-md ${variantStyles[variant]}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold" data-testid={`stat-${title.toLowerCase().replace(/\s+/g, "-")}`}>
          {value}
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(getDashboardStats());

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(getDashboardStats());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your loan management system</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            title="Total Leads"
            value={stats.totalLeads}
            icon={<Users className="w-4 h-4" />}
            description="All time leads"
          />
          <StatCard
            title="Document Pending"
            value={stats.documentPending}
            icon={<Clock className="w-4 h-4" />}
            variant="warning"
            description="Awaiting documents"
          />
          <StatCard
            title="Document Completed"
            value={stats.documentCompleted}
            icon={<CheckCircle2 className="w-4 h-4" />}
            variant="success"
            description="Documents verified"
          />
          <StatCard
            title="Bank Applications"
            value={stats.bankApplications}
            icon={<Building2 className="w-4 h-4" />}
            description="Total applications"
          />
          <StatCard
            title="Bank Approved"
            value={stats.bankApproved}
            icon={<ThumbsUp className="w-4 h-4" />}
            variant="success"
            description="Loans approved"
          />
          <StatCard
            title="Bank Rejected"
            value={stats.bankRejected}
            icon={<ThumbsDown className="w-4 h-4" />}
            variant="destructive"
            description="Loans rejected"
          />
        </div>

        {/* Recent Activity Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Recent Leads */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <div>
                <CardTitle className="text-base">Recent Leads</CardTitle>
                <CardDescription>Last 5 leads added</CardDescription>
              </div>
              <Link href="/leads">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentLeads.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No leads yet</p>
                ) : (
                  stats.recentLeads.map((lead) => (
                    <div 
                      key={lead.serialNo} 
                      className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                      data-testid={`recent-lead-${lead.serialNo}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{lead.fullName}</p>
                          <p className="text-xs text-muted-foreground">{lead.loanType}</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        #{lead.serialNo}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Documents */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <div>
                <CardTitle className="text-base">Recent Documents</CardTitle>
                <CardDescription>Latest document uploads</CardDescription>
              </div>
              <Link href="/documents/history">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentDocuments.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No documents yet</p>
                ) : (
                  stats.recentDocuments.map((doc) => (
                    <div 
                      key={doc.serialNo} 
                      className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                      data-testid={`recent-doc-${doc.serialNo}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{doc.fullName}</p>
                          <p className="text-xs text-muted-foreground">
                            {doc.completedAt ? formatDate(doc.completedAt) : "Pending"}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20">
                        Complete
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Bank Updates */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2 pb-2">
              <div>
                <CardTitle className="text-base">Recent Bank Updates</CardTitle>
                <CardDescription>Latest status changes</CardDescription>
              </div>
              <Link href="/status/history">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.recentBankUpdates.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4 text-center">No updates yet</p>
                ) : (
                  stats.recentBankUpdates.map((app) => (
                    <div 
                      key={app.appId} 
                      className="flex items-center justify-between p-3 rounded-md bg-muted/50"
                      data-testid={`recent-bank-${app.appId}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <CreditCard className="w-4 h-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate">{app.customerName}</p>
                          <p className="text-xs text-muted-foreground">{app.bankName}</p>
                        </div>
                      </div>
                      <Badge 
                        variant="outline"
                        className={
                          app.status === "Approved" || app.status === "Sanctioned"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                            : app.status === "Rejected"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20"
                        }
                      >
                        {app.status || "Pending"}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
