"use client"

import { HeartHandshake, Search } from "lucide-react"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/Command"
import {FC, useEffect, useState} from "react";
import {useDebounce} from "@/hooks/useDebounce";
import {useRouter} from "next/navigation";
import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import {Community, Prisma} from "@prisma/client";
import Link from "next/link";

const SearchBox: FC = () => {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedValue = useDebounce<string>(input, 500);

  const router = useRouter();

  const { data: queryResults, refetch, isFetched, isFetching } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`/api/search?q=${input}`);
      return data as (Community & {
        _count: Prisma.CommunityCountOutputType
      })[]
    },
    queryKey: ['search-query'],
    enabled: false, //We only want to query when we type and not when this component renders thus false
  });

  useEffect(() => {
    //IIFE
    (async () => await refetch())();
  }, [debouncedValue]);

  return (
    <>
      <Search
        className="h-8 w-8 p-1 rounded-md hover:bg-gray-200 transition-colors text-emerald-900 cursor-pointer"
        onClick={() => setOpen(true)}
      />
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
      >
        <CommandInput
          value={input}
          onValueChange={(e) => setInput(e)}
          isLoading={isFetching}
          className="outline-none border-none focus:border-none focus:outline-none ring-0"
          placeholder='Explore communities...' />
        <CommandList className="pb-1">
          <CommandGroup heading="Communities">
            {
              queryResults?.map((community) => (
                <CommandItem
                  key={community.id}
                  value={community.name}
                  onSelect={(e) => {
                    router.push(`/c/${e}`);
                    router.refresh();
                  }}
                >
                  <HeartHandshake className="mr-2 h-5 w-5 text-emerald-700" />
                  <Link
                    href={`/c/${community.name}`}
                    onClick={() => setOpen(false)}
                  >
                    c/{community.name}
                  </Link>
                </CommandItem>
              ))
            }
          </CommandGroup>
          {
            isFetched && <CommandEmpty>No results found</CommandEmpty>
          }
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default SearchBox;
