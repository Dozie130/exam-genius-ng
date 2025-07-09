
import React, { memo } from 'react';
import { BookOpen, User, LogOut, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useNavigate } from 'react-router-dom';
import NetworkStatus from '@/components/NetworkStatus';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = memo(({ children, title }: LayoutProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white/95 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-50 supports-[backdrop-filter]:bg-white/80">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1.5 sm:p-2 transition-all duration-200 group touch-manipulation"
              onClick={handleRefresh}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && handleRefresh()}
              aria-label="Refresh application"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                  SmartExam NG
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden xs:block">Excel in Your Exams</p>
              </div>
              <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-hover:text-blue-600 transition-all duration-200 opacity-0 group-hover:opacity-100 group-hover:rotate-180 hidden sm:block" />
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center space-x-1 sm:space-x-2 hover:shadow-md transition-shadow h-8 sm:h-9 px-2 sm:px-3"
                    >
                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                      <span className="hidden sm:inline text-sm">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="w-48 sm:w-56 bg-white/95 backdrop-blur-sm border shadow-lg z-50"
                    sideOffset={5}
                  >
                    <DropdownMenuItem disabled className="text-gray-600 text-sm">
                      <span className="truncate">{user.email}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={signOut} 
                      className="text-red-600 hover:bg-red-50 focus:bg-red-50 text-sm"
                    >
                      <LogOut className="w-4 h-4 mr-2 flex-shrink-0" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button 
                  onClick={() => navigate('/auth')}
                  className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 h-8 sm:h-9 px-3 sm:px-4 text-sm touch-manipulation"
                >
                  <span className="hidden xs:inline">Sign In</span>
                  <User className="w-4 h-4 xs:hidden" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 safe-area-inset">
        {title && (
          <div className="mb-4 sm:mb-6 animate-fade-in">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        <div className="animate-fade-in content-visibility-auto">
          {children}
        </div>
      </main>
      <NetworkStatus />
    </div>
  );
});

Layout.displayName = 'Layout';

export default Layout;
