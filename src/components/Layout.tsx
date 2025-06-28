
import React from 'react';
import { BookOpen } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout = ({ children, title }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">SmartExam NG</h1>
                <p className="text-sm text-gray-600">Excel in Your Exams</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">Welcome!</p>
              <p className="text-xs text-gray-600">Ready to practice?</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {title && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default Layout;
