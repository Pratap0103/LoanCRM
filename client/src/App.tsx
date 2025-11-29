import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { initializeStorage, getActiveSession } from "@/lib/localStorage";

import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import LeadsPage from "@/pages/leads";
import DocumentsPendingPage from "@/pages/documents-pending";
import DocumentsAddPage from "@/pages/documents-add";
import DocumentsHistoryPage from "@/pages/documents-history";
import BankPendingPage from "@/pages/bank-pending";
import BankApplyPage from "@/pages/bank-apply";
import BankHistoryPage from "@/pages/bank-history";
import StatusPendingPage from "@/pages/status-pending";
import StatusHistoryPage from "@/pages/status-history";
import NotFound from "@/pages/not-found";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const [, setLocation] = useLocation();
  const session = getActiveSession();

  useEffect(() => {
    if (!session) {
      setLocation("/");
    }
  }, [session, setLocation]);

  if (!session) {
    return null;
  }

  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LoginPage} />
      <Route path="/dashboard">
        {() => <ProtectedRoute component={DashboardPage} />}
      </Route>
      <Route path="/leads">
        {() => <ProtectedRoute component={LeadsPage} />}
      </Route>
      <Route path="/documents/pending">
        {() => <ProtectedRoute component={DocumentsPendingPage} />}
      </Route>
      <Route path="/documents/add/:serialNo">
        {() => <ProtectedRoute component={DocumentsAddPage} />}
      </Route>
      <Route path="/documents/history">
        {() => <ProtectedRoute component={DocumentsHistoryPage} />}
      </Route>
      <Route path="/bank/pending">
        {() => <ProtectedRoute component={BankPendingPage} />}
      </Route>
      <Route path="/bank/apply/:serialNo">
        {() => <ProtectedRoute component={BankApplyPage} />}
      </Route>
      <Route path="/bank/history">
        {() => <ProtectedRoute component={BankHistoryPage} />}
      </Route>
      <Route path="/status/pending">
        {() => <ProtectedRoute component={StatusPendingPage} />}
      </Route>
      <Route path="/status/history">
        {() => <ProtectedRoute component={StatusHistoryPage} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  useEffect(() => {
    initializeStorage();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
