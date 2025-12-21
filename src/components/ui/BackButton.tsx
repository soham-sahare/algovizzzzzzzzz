"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  className?: string;
  label?: string;
}

export default function BackButton({ className, label = "Back" }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className={cn(
        "group flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-6",
        className
      )}
    >
      <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      {label}
    </button>
  );
}
