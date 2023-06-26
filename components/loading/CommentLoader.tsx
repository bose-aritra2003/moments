import {Loader2} from "lucide-react";

const CommentLoader = () => {
  return (
    <div className="flex gap-2 items-center justify-center transition-all">
      <Loader2 className="animate-spin h-7 w-7 text-emerald-500" />
      <p className="text-gray-500 text-sm">Loading comments...</p>
    </div>
  );
}
export default CommentLoader;