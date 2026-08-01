import Dropdown from "@/components/ui/dropdown";
import { MoreVertical, Edit3, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

type PostActionsDropdownProps = {
  onEditClick: () => void;
  onDeleteClick: () => void;
};

export default function PostActionsDropdown({
  onEditClick,
  onDeleteClick,
}: PostActionsDropdownProps) {
  const trigger = (
    <motion.button
      whileTap={{ scale: 0.9 }}
      className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
    >
      <MoreVertical className="w-5 h-5" />
    </motion.button>
  );

  const items = [
    {
      label: "Edit Post",
      onClick: onEditClick,
      icon: <Edit3 className="w-4 h-4" />,
    },
    {
      label: "Delete Post",
      onClick: onDeleteClick,
      icon: <Trash2 className="w-4 h-4" />,
      variant: "danger" as const,
    },
  ];

  return <Dropdown trigger={trigger} items={items} align="right" />;
}
