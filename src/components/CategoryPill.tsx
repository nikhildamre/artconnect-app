import { motion } from "framer-motion";
import { Category } from "@/data/mockData";

interface CategoryPillProps {
  category: Category;
  isActive?: boolean;
  onClick?: () => void;
}

const CategoryPill = ({ category, isActive, onClick }: CategoryPillProps) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all ${
      isActive
        ? "bg-gradient-burgundy text-primary-foreground shadow-gold"
        : "bg-card text-foreground border border-border hover:border-secondary"
    }`}
  >
    <span className="text-base">{category.icon}</span>
    <span>{category.name}</span>
  </motion.button>
);

export default CategoryPill;
