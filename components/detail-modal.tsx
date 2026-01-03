"use client";

import { Copy, Check } from "lucide-react";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui";
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
      <DialogContent className="cyber-card sm:max-w-[700px] border-primary/50 bg-card p-0 gap-0 overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.2)]">
        <DialogHeader className="p-5 border-b border-primary/30 bg-primary/10 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <DialogTitle className="font-mono text-primary neon-text uppercase tracking-widest text-sm">
              DATA_VIEW :: {title}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Raw JSON data view
          </DialogDescription>
        </DialogHeader>

        <div className="p-5 relative">
          <pre className="bg-black/60 p-5 rounded border border-primary/30 overflow-auto max-h-[500px] font-mono text-xs leading-relaxed text-primary/90 shadow-inner scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent">
            {JSON.stringify(data, null, 2)}
          </pre>

          <Button
            size="sm"
            variant="outline"
            className="absolute top-7 right-7 border-primary/40 bg-card/90 hover:bg-primary/20 hover:border-primary/60 transition-all duration-300 backdrop-blur-sm shadow-lg"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-accent drop-shadow-[0_0_6px_rgba(0,255,100,0.8)]" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-primary" />
            )}
            <span className="ml-2 font-mono text-[10px]">
              {copied ? "COPIED" : "COPY_JSON"}
            </span>
          </Button>
        </div>

        <div className="p-5 border-t border-primary/30 flex justify-end bg-primary/5">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-primary/50 text-primary font-mono text-[10px] bg-transparent hover:bg-primary/10 hover:border-primary/70 transition-all duration-300"
          >
            CLOSE_STREAM
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
