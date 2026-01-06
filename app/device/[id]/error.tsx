"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui";

export default function DeviceDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to console for debugging
    console.error("Device detail error:", error);
  }, [error]);

  // Determine error message based on error
  const getErrorMessage = () => {
    if (
      error.message?.includes("404") ||
      error.message?.includes("not found")
    ) {
      return "Device not found";
    }
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("network")
    ) {
      return "Unable to connect to server";
    }
    return "Something went wrong while loading device details";
  };

  const errorMessage = getErrorMessage();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="cyber-card p-8 max-w-md w-full text-center border-destructive/40">
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 rounded-md bg-destructive/20 border-2 border-destructive/50">
              <AlertTriangle className="w-12 h-12 text-destructive" />
            </div>

            <div className="space-y-2">
              <h2 className="font-mono text-xl font-bold text-destructive uppercase tracking-widest">
                ERROR_LOADING_DEVICE
              </h2>
              <p className="text-sm font-mono text-muted-foreground">
                {errorMessage}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full">
              <Button
                onClick={reset}
                disabled
                className="flex-1 font-mono text-xs uppercase tracking-widest border-muted-foreground/30 bg-muted/20 text-muted-foreground/50 cursor-not-allowed opacity-60"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                RETRY
              </Button>
              <Link href="/" className="flex-1">
                <Button
                  variant="outline"
                  className="w-full font-mono text-xs uppercase tracking-widest border-primary/50 bg-transparent hover:bg-primary/10 hover:border-primary/70 transition-all duration-300"
                >
                  <Home className="w-4 h-4 mr-2" />
                  RETURN_TO_DASHBOARD
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
