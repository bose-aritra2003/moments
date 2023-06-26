'use client'

import SignIn from "@/components/SignIn";
import {useRef} from "react";
import {useOnClickOutside} from "@/hooks/useOnClickOutside";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/Button";
import {X} from "lucide-react";

const Page = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useOnClickOutside(containerRef, () => {
    router.back();
  });

  return (
    <div className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-10">
      <div
        ref={containerRef}
        className="container flex items-center h-full max-w-lg mx-auto"
      >
        <div
          className="relative bg-white w-full h-fit py-20 px-2 rounded-lg"
        >
          <div className="absolute top-4 right-4">
            <Button
              size='icon'
              variant='ghost'
              aria-label='close modal'
              onClick={() => router.back()}
            >
              <X className="h-5 w-5"/>
            </Button>
          </div>
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default Page;