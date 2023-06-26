import {FC} from "react";
import {Cake, Smile, Text, UserCheck2, Users2} from "lucide-react";
import Link from "next/link";
import {format} from "date-fns";
import {nFormatter} from "@/lib/utils";
import {Badge} from "@/components/ui/Badge";

interface CommunityCardProps {
  name: string;
  subscriberCount: number;
  postCount: number;
  isNsfw?: boolean;
  creatorName: string;
  subscribed?: boolean;
}

const CommunityCard: FC<CommunityCardProps> = ({name, subscriberCount, postCount, isNsfw, creatorName, subscribed}) => {
  return (
    <Link
      href={`/c/${name}`}
      className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last shadow hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-center px-4 py-2">
        <p className="font-semibold py-3 flex gap-2 truncate items-center">
          c/{name}
          {
            isNsfw && (
              <Badge
                variant="outline"
                className="text-[0.5rem] px-1 border border-rose-600 text-rose-600"
              >
                NSFW
              </Badge>
            )
          }
        </p>
        {
          subscribed && (
            <UserCheck2 className="h-4 w-4"/>
          )
        }
      </div>

      <dl className="divide-y divide-gray-100 px-4 py-2 text-sm leading-6 bg-white">
        <div className="flex justify-between gap-x-3 py-3">
          <dt className="text-gray-500 flex gap-2 items-center">
            <Cake className="h-4 w-4"/>
            Created
          </dt>
          <dd className="text-gray-900">
            <time dateTime={new Date().toDateString()}>
              {
                format(new Date(), 'MMMM d, yyyy')
              }
            </time>
          </dd>
        </div>

        <div className="flex justify-between gap-x-3 py-3">
          <dt className="text-gray-500 flex gap-2 items-center">
            <Smile className="h-4 w-4" />
            By
          </dt>
          <dd className="text-gray-900 truncate">
            u/{ creatorName }
          </dd>
        </div>

        <div className="flex justify-between gap-x-3 py-3">
          <dt className="text-gray-500 flex gap-2 items-center truncate">
            <Users2 className="h-4 w-4" />
            Subscribers
          </dt>
            <dd className="text-gray-900">
              { nFormatter(subscriberCount, 1) }
            </dd>
        </div>

        <div className="flex justify-between gap-x-3 py-3">
          <dt className="text-gray-500 flex gap-2 items-center truncate">
            <Text className="h-4 w-4" />
            Posts
          </dt>
          <dd className="text-gray-900 flex justify-end">
            { nFormatter(postCount, 1) }
          </dd>
        </div>
      </dl>
    </Link>
  );
}
export default CommunityCard;