import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { getActiveSession, logout, initializeStorage } from "@/lib/localStorage";
import { Button } from "@/components/ui/button";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  Building2, 
  ClipboardCheck,
  LogOut,
  ChevronRight,
  Clock,
  History,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Lead Management",
    icon: Users,
    href: "/leads",
  },
];

const documentItems = [
  {
    title: "Document Pending",
    icon: Clock,
    href: "/documents/pending",
  },
  {
    title: "Document History",
    icon: History,
    href: "/documents/history",
  },
];

const bankItems = [
  {
    title: "Bank Pending",
    icon: Clock,
    href: "/bank/pending",
  },
  {
    title: "Bank History",
    icon: History,
    href: "/bank/history",
  },
];

const statusItems = [
  {
    title: "Status Pending",
    icon: ClipboardCheck,
    href: "/status/pending",
  },
  {
    title: "Status History",
    icon: History,
    href: "/status/history",
  },
];

export default function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [session, setSession] = useState(getActiveSession());

  useEffect(() => {
    initializeStorage();
    const currentSession = getActiveSession();
    setSession(currentSession);
    
    if (!currentSession && location !== "/") {
      setLocation("/");
    }
  }, [location, setLocation]);

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  if (!session) {
    return null;
  }

  const sidebarStyle = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  } as React.CSSProperties;

  return (
    <SidebarProvider style={sidebarStyle}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-semibold text-sm">Loan Tracker</h1>
                <p className="text-xs text-muted-foreground capitalize">{session.role} Account</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Documents
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {documentItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-1">
                <Building2 className="w-3 h-3" />
                Bank Selection
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {bankItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="flex items-center gap-1">
                <ClipboardCheck className="w-3 h-3" />
                Bank Status
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {statusItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={location === item.href}
                      >
                        <Link href={item.href}>
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 border-t border-sidebar-border">
            <Button 
              variant="ghost" 
              className="w-full justify-start" 
              onClick={handleLogout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 min-w-0">
          <header className="flex items-center gap-2 p-3 border-b bg-background sticky top-0 z-10">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
            <nav className="flex items-center text-sm text-muted-foreground">
              <span className="capitalize">{location.split("/")[1] || "dashboard"}</span>
              {location.split("/")[2] && (
                <>
                  <ChevronRight className="w-4 h-4 mx-1" />
                  <span className="capitalize">{location.split("/")[2]}</span>
                </>
              )}
            </nav>
          </header>
          
          <main className="flex-1 overflow-auto">
            <div className="min-h-full flex flex-col">
              <div className="flex-1 p-4 sm:p-6">
                {children}
              </div>
              
              {/* Footer */}
              <footer className="text-center text-xs text-muted-foreground py-3 border-t" data-testid="footer">
                www.botivate.in
              </footer>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
