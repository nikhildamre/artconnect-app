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
    whileHover={{ scale: 1.02 }}
    onClick={onClick}
    className={`flex shrink-0 items-center gap-2.5 rounded-2xl px-3.5 py-2.5 text-sm transition-all duration-300 min-w-fit ${
      isActive
        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
        : "bg-card text-foreground border border-border hover:border-secondary/50 hover:shadow-sm"
    }`}
  >
    <span className="text-base">{category.icon}</span>
    <div className="text-left">
      <div className="font-semibold text-sm">{category.name}</div>
      <div className={`text-xs leading-tight ${isActive ? 'text-white/70' : 'text-muted-foreground'}`}>
        {category.description}
      </div>
    </div>
  </motion.button>
);

export default CategoryPill;
