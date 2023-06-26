import {buttonVariants} from "@/components/ui/Button";
import {CgSpinner} from "react-icons/cg";
import {ThumbsDown, ThumbsUp} from "lucide-react";

const PostVoteSkeleton = () => {
  return (
    <div className="flex flex-col pr-4 w-16 items-center">
      <div className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
        <ThumbsUp className="h-5 w-5" />
      </div>
      <div className="text-center py-2 font-medium text-sm text-gray-900">
        <CgSpinner className="text-gray-900 h-5 w-5 animate-spin"/>
      </div>
      <div className={buttonVariants({ variant: 'ghost', size: 'sm' })}>
        <ThumbsDown className="h-5 w-5" />
      </div>
    </div>
  )
};
export default PostVoteSkeleton;