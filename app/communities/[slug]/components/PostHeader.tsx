import Image from "next/image";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import PostActionsDropdown from "./PostActionsDropdown";

type PostHeaderProps = {
  author: {
    id?: string;
    name: string;
    image: string | null;
  };
  createdAt: string;
  showControls: boolean;
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export default function PostHeader({
  author,
  createdAt,
  showControls,
  onEditClick,
  onDeleteClick,
}: PostHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-[#34629f] font-bold overflow-hidden border border-blue-200/50 shadow-sm relative">
          {author.image ? (
            <Image
              src={author.image}
              alt={author.name}
              fill
              className="object-cover"
              sizes="40px"
            />
          ) : (
            author.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h4 className="font-medium text-slate-900 leading-none">{author.name}</h4>
          <p className="text-sm text-slate-500 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>

      {showControls && (
        <PostActionsDropdown
          onEditClick={onEditClick}
          onDeleteClick={onDeleteClick}
        />
      )}
    </div>
  );
}
