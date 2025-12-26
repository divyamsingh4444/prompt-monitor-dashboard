export function CyberSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative h-12 w-12">
        <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 rounded-full border-2 border-t-primary animate-spin" />
        <div className="absolute inset-2 rounded-full border border-secondary/20" />
        <div className="absolute inset-2 rounded-full border-t-secondary animate-spin [animation-duration:1.5s]" />
      </div>
    </div>
  )
}
