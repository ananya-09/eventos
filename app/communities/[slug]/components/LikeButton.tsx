import { motion } from "framer-motion";
import { Heart } from "lucide-react";

type LikeButtonProps = {
  isLiked: boolean;
  likesCount: number;
  isLiking: boolean;
  onLikeToggle: (e: React.MouseEvent) => void;
};

export default function LikeButton({
  isLiked,
  likesCount,
  isLiking,
  onLikeToggle,
}: LikeButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onLikeToggle}
      disabled={isLiking}
      className={`flex items-center gap-2 text-sm font-medium transition-colors ${
        isLiked ? "text-red-500" : "text-slate-500 hover:text-red-500"
      }`}
    >
      <div
        className={`flex items-center justify-center p-1.5 rounded-full transition-colors ${
          isLiked ? "bg-red-50 text-red-500" : "bg-slate-50 text-slate-500 group-hover:bg-red-50 group-hover:text-red-500"
        }`}
      >
        <motion.div
          animate={{ scale: isLiked ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.2 }}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-red-500" : ""}`} />
        </motion.div>
      </div>
      <span>{likesCount.toLocaleString()}</span>
    </motion.button>
  );
}
