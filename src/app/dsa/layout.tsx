"use client";

export default function DsaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-background">
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden p-6">
        {children}
      </main>
    </div>
  );
}
