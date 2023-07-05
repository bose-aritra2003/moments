import {Loader2} from "lucide-react";

const InfiniteScrollLoader = () => {
  return (
    <div className="flex col-span-2 gap-2 items-center justify-center transition-all">
      <Loader2 className="animate-spin h-7 w-7 text-blue-500" />
      <p className="text-gray-500 text-sm">Loading more posts ...</p>
    </div>
  );
}
export default InfiniteScrollLoader;