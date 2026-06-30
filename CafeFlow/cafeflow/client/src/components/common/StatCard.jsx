import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, trend, color = 'orange' }) => {
  const colorMap = {
    orange: 'from-orange-400 to-orange-600',
    green: 'from-emerald-400 to-emerald-600',
    blue: 'from-sky-400 to-sky-600',
    purple: 'from-violet-400 to-violet-600',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex items-center justify-between hover:shadow-lg transition-shadow duration-200"
    >
      <div>
        <p className="text-xs font-medium text-gray-400 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
        {trend && <p className="text-xs text-emerald-500 font-medium mt-1">{trend}</p>}
      </div>
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colorMap[color]} flex items-center justify-center text-white shadow-soft`}>
        <Icon size={22} />
      </div>
    </motion.div>
  );
};

export default StatCard;
