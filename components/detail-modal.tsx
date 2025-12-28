"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import type { Json } from "@/types";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  data: Json | null;
}

export function DetailModal({
  isOpen,
  onClose,
  title,
  data,
}: DetailModalProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="cyber-card sm:max-w-[600px] border-primary/50 bg-card p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-4 border-b border-primary/20 bg-primary/5">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-mono text-primary neon-text uppercase tracking-widest text-sm">
              DATA_VIEW :: {title}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Raw JSON data view
          </DialogDescription>
        </DialogHeader>

        <div className="p-4 relative">
          <pre className="bg-black/50 p-4 rounded border border-primary/20 overflow-auto max-h-[400px] font-mono text-xs leading-relaxed text-primary/80">
            {JSON.stringify(data, null, 2)}
          </pre>

          <Button
            size="sm"
            variant="outline"
            className="absolute top-6 right-6 border-primary/30 bg-card/80 hover:bg-primary/20"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-accent" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span className="ml-2 font-mono text-[10px]">
              {copied ? "COPIED" : "COPY_JSON"}
            </span>
          </Button>
        </div>

        <div className="p-4 border-t border-primary/20 flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-primary/50 text-primary font-mono text-[10px] bg-transparent"
          >
            CLOSE_STREAM
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
