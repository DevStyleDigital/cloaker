import { Command, Search } from 'lucide-react';

export const InputSearch = () => (
  <div className="flex px-3 bg-black/5 rounded-xl items-center max-lg:hidden">
    <button>
      <Search className="text-black/20" />
    </button>
    <input
      type="text"
      className="w-full h-full p-[.6rem] bg-transparent text-black/20 bottom-0 outline-none placeholder-black/20"
      placeholder="Pesquise por uma campanha"
    />
    <span className="text-black/20 flex">
      <Command /> /
    </span>
  </div>
);
