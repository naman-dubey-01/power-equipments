export default function Loading() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center p-8"
      style={{ paddingTop: 'calc(var(--header-height) + 40px)' }}
    >
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-slate-200" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
        Loading Power Equipments...
      </span>
    </div>
  )
}
