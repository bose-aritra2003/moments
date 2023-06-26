import {Loader2} from "lucide-react";

const CommunitiesLoader = () => {
  return (
    <div className="flex col-span-2 gap-2 items-center justify-center transition-all">
      <Loader2 className="animate-spin h-7 w-7 text-emerald-500" />
      <p className="text-gray-500 text-sm">Loading communities ...</p>
    </div>
  );
}
export default CommunitiesLoader;