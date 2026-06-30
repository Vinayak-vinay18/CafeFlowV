import { MdInbox } from 'react-icons/md';

const EmptyState = ({ icon: Icon = MdInbox, title = 'No data found', message = 'There is nothing here yet.', action }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="w-16 h-16 rounded-2xl bg-orange-light flex items-center justify-center text-primary-500 mb-4">
        <Icon size={30} />
      </div>
      <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">{title}</h3>
      <p className="text-sm text-gray-400 mt-1 max-w-xs">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;
