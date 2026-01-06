"use client";

import { Copy, Check, X, FileJson, Download } from "lucide-react";
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
import { downloadJson } from "@/lib/utils/client";

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
    if (!data) return;
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!data) return;
    downloadJson(data, title);
  };

  const jsonString = data ? JSON.stringify(data, null, 2) : "{}";
  const lineCount = jsonString.split("\n").length;
  const charCount = jsonString.length;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="cyber-card sm:max-w-[800px] lg:max-w-[900px] border-primary/80 bg-card p-0 gap-0 overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.3)] animate-in fade-in-0 zoom-in-95 duration-200"
      >
        {/* Enhanced Header */}
        <DialogHeader className="p-5 border-b border-primary/80 bg-card relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-md bg-primary/20 border border-primary/60">
                <FileJson className="w-4 h-4 text-primary" />
              </div>
              <div>
                <DialogTitle className="font-mono text-primary font-bold uppercase tracking-widest text-sm mb-1">
                  DATA_VIEW :: {title}
                </DialogTitle>
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/90">
                  <span>{lineCount} lines</span>
                  <span>•</span>
                  <span>{charCount.toLocaleString()} chars</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive border border-primary/40 hover:border-destructive/60 rounded-md transition-all duration-300"
            >
              <X className="w-4 h-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
          <DialogDescription className="sr-only">
            Raw JSON data view
          </DialogDescription>
        </DialogHeader>

        {/* Content Area */}
        <div className="p-5 relative bg-gradient-to-b from-card to-black/20">
          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-4">
            <Button
              size="sm"
              variant="outline"
              className="border-primary/60 bg-card/90 hover:bg-primary/20 hover:border-primary/80 transition-all duration-300 backdrop-blur-sm shadow-lg font-mono text-[10px] px-3 py-2"
              onClick={copyToClipboard}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-accent drop-shadow-[0_0_6px_rgba(0,255,100,0.8)] mr-2" />
                  <span>COPIED</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-primary mr-2" />
                  <span>COPY_JSON</span>
                </>
              )}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-primary/60 bg-card/90 hover:bg-primary/20 hover:border-primary/80 transition-all duration-300 backdrop-blur-sm shadow-lg font-mono text-[10px] px-3 py-2"
              onClick={handleDownload}
            >
              <Download className="w-3.5 h-3.5 text-primary mr-2" />
              <span>DOWNLOAD</span>
            </Button>
          </div>

          {/* JSON Display */}
          <div className="relative">
            <pre className="bg-black/70 p-5 rounded-lg border border-primary/60 overflow-auto max-h-[65vh] font-mono text-xs leading-relaxed text-foreground/90 shadow-2xl shadow-black/50 scrollbar-thin scrollbar-thumb-primary/40 scrollbar-track-transparent hover:scrollbar-thumb-primary/60 transition-colors">
              <code className="block whitespace-pre-wrap break-words">
                {jsonString}
              </code>
            </pre>
            {/* Gradient overlay for better readability */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent pointer-events-none rounded-b-lg" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
