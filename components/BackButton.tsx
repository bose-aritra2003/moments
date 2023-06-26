'use client'

import {useRouter} from 'next/navigation'
import {Button} from "@/components/ui/Button";
import {HiChevronLeft} from "react-icons/hi2";

const BackButton = () => {
  const router = useRouter();

  return (
    <Button
      variant="subtle"
      onClick={() => router.back()}
    >
      <HiChevronLeft className='h-4 w-4 mr-1'/>
      Back
    </Button>
  )
}

export default BackButton