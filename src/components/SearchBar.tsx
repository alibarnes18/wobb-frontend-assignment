import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search influencers..." }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
        <Search className="w-5 h-5" />
      </div>
      <input
        type="text"
        className="w-full bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-950/80 border border-zinc-800 focus:border-indigo-500 text-zinc-100 placeholder-zinc-500 text-sm rounded-2xl pl-11 pr-10 py-3 outline-none transition-all shadow-inner"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-zinc-300 transition-colors"
          type="button"
        >
          <X className="w-4.5 h-4.5" />
        </button>
      )}
    </div>
  );
}
