import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  Receipt,
  Settings,
  LogOut,
  ChevronsUpDown,
  UserCircle,
  CreditCard,
  PieChart
} from "lucide-react";
import { AppLogo, AppLogoText } from "@/components/ui/logo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const sidebarVariants = {
  open: { width: "15rem" },
  closed: { width: "4rem" }, // Adjusted slightly to fit icons nicely
};

const contentVariants = {
  open: { display: "block", opacity: 1 },
  closed: { display: "block", opacity: 1 },
};

const variants = {
  open: {
    x: 0,
    opacity: 1,
    transition: { x: { stiffness: 1000, velocity: -100 } },
  },
  closed: {
    x: -20,
    opacity: 0,
    transition: { x: { stiffness: 100 } },
  },
};

const transitionProps = {
  type: "tween",
  ease: "easeOut",
  duration: 0.2,
  staggerChildren: 0.1,
};

const staggerVariants = {
  open: {
    transition: { staggerChildren: 0.03, delayChildren: 0.02 },
  },
};

export function SessionNavBar() {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const location = useLocation();
  const pathname = location.pathname;
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Quotes', path: '/quotes', icon: FileText },
    { name: 'Invoices', path: '/invoices', icon: Receipt },
    { name: 'Payments', path: '/payments', icon: CreditCard },
    { name: 'Reports', path: '/reports', icon: PieChart },
  ];

  return (
    <motion.div
      className={cn("sidebar fixed left-0 top-0 z-40 h-full shrink-0 border-r border-gray-200 bg-white shadow-sm")}
      initial={isCollapsed ? "closed" : "open"}
      animate={isCollapsed ? "closed" : "open"}
      variants={sidebarVariants}
      transition={transitionProps}
      onMouseEnter={() => setIsCollapsed(false)}
      onMouseLeave={() => setIsCollapsed(true)}
    >
      <motion.div
        className={`relative z-40 flex text-muted-foreground h-full shrink-0 flex-col bg-white transition-all overflow-hidden`}
        variants={contentVariants}
      >
        <motion.ul variants={staggerVariants} className="flex h-full flex-col">
          <div className="flex grow flex-col items-center">
            
            {/* Header / Logo section */}
            <div className="flex h-16 w-full shrink-0 border-b border-gray-200 p-2 items-center justify-start px-4">
              <div className="flex w-full items-center">
                <AppLogo className="h-8 w-8 shrink-0" />
                <motion.div variants={variants} className="ml-3 overflow-hidden whitespace-nowrap">
                  {!isCollapsed && <AppLogoText className="text-xl" />}
                </motion.div>
              </div>
            </div>

            {/* Navigation links */}
            <div className="flex h-full w-full flex-col pt-4">
              <div className="flex grow flex-col gap-4">
                <ScrollArea className="h-16 grow px-3">
                  <div className={cn("flex w-full flex-col gap-1")}>
                    {navLinks.map((item) => {
                      const Icon = item.icon;
                      const isActive = pathname.startsWith(item.path);
                      return (
                        <Link
                          key={item.name}
                          to={item.path}
                          className={cn(
                            "flex h-10 w-full flex-row items-center rounded-xl px-2 py-1.5 transition hover:bg-gray-100 hover:text-gray-900",
                            isActive && "bg-blue-50 text-blue-600 hover:text-blue-700 hover:bg-blue-100 font-semibold"
                          )}
                        >
                          <Icon className={cn("h-[22px] w-[22px] shrink-0", isActive ? "text-blue-600" : "text-gray-500")} />
                          <motion.li variants={variants} className="overflow-hidden whitespace-nowrap">
                            {!isCollapsed && (
                              <p className={cn("ml-4 text-[15px] font-medium", isActive ? "text-blue-700 font-semibold" : "text-gray-700")}>
                                {item.name}
                              </p>
                            )}
                          </motion.li>
                        </Link>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Bottom section (Settings & Profile) */}
              <div className="flex flex-col px-3 pb-3 pt-2 border-t border-gray-200 bg-gray-50/50">
                <Link
                  to="/settings"
                  className={cn(
                    "flex h-10 w-full flex-row items-center rounded-xl px-2 py-1.5 transition hover:bg-gray-100 hover:text-gray-900",
                    pathname.startsWith("/settings") && "bg-blue-50 text-blue-600 font-semibold"
                  )}
                >
                  <Settings className={cn("h-[22px] w-[22px] shrink-0", pathname.startsWith("/settings") ? "text-blue-600" : "text-gray-500")} />
                  <motion.li variants={variants} className="overflow-hidden whitespace-nowrap">
                    {!isCollapsed && (
                      <p className={cn("ml-4 text-[15px] font-medium", pathname.startsWith("/settings") ? "text-blue-700 font-semibold" : "text-gray-700")}>
                        Settings
                      </p>
                    )}
                  </motion.li>
                </Link>
                
                <div className="mt-2">
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger className="w-full focus:outline-none">
                      <div className="flex h-12 w-full flex-row items-center rounded-xl px-2 py-1.5 transition hover:bg-gray-200 cursor-pointer border border-transparent hover:border-gray-300 bg-white shadow-sm">
                        <Avatar className="h-[28px] w-[28px] shrink-0 bg-primary">
                          <AvatarFallback className="text-white bg-primary text-xs font-bold">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <motion.li
                          variants={variants}
                          className="flex w-full items-center ml-3 overflow-hidden whitespace-nowrap"
                        >
                          {!isCollapsed && (
                            <>
                              <div className="flex flex-col items-start overflow-hidden w-full">
                                <p className="text-sm font-bold text-gray-900 truncate w-full text-left">
                                  {user?.company_name || user?.username || 'User'}
                                </p>
                                <p className="text-[11px] text-gray-500 truncate w-full text-left font-medium">
                                  {user?.email || 'user@example.com'}
                                </p>
                              </div>
                              <ChevronsUpDown className="ml-auto h-4 w-4 text-gray-400 shrink-0" />
                            </>
                          )}
                        </motion.li>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="right" align="end" sideOffset={10} className="w-56 shadow-xl rounded-xl">
                      <div className="flex flex-row items-center gap-3 p-3 bg-gray-50/50 rounded-t-xl">
                        <Avatar className="h-10 w-10 bg-primary shadow-sm">
                          <AvatarFallback className="text-white bg-primary text-sm font-bold">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col text-left overflow-hidden">
                          <span className="text-sm font-bold text-gray-900 truncate">
                            {user?.username || 'User'}
                          </span>
                          <span className="text-xs text-gray-500 truncate font-medium">
                            {user?.email || 'user@example.com'}
                          </span>
                        </div>
                      </div>
                      <DropdownMenuSeparator className="bg-gray-100" />
                      <DropdownMenuItem
                        asChild
                        className="flex items-center gap-2 cursor-pointer py-2.5 font-medium rounded-lg m-1 hover:bg-gray-100"
                      >
                        <Link to="/settings">
                          <UserCircle className="h-[18px] w-[18px] text-gray-500" /> My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 py-2.5 font-medium rounded-lg m-1"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-[18px] w-[18px]" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

            </div>
          </div>
        </motion.ul>
      </motion.div>
    </motion.div>
  );
}
