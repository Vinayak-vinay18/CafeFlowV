import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

const Pagination = ({ page, pages, onPageChange }) => {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
    (n) => n === 1 || n === pages || Math.abs(n - page) <= 1
  );

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-orange-200 dark:border-gray-700 disabled:opacity-40 hover:bg-orange-50 dark:hover:bg-gray-800"
      >
        <MdChevronLeft size={18} />
      </button>
      {pageNumbers.map((n, idx) => (
        <span key={n} className="flex items-center">
          {idx > 0 && pageNumbers[idx - 1] !== n - 1 && <span className="px-1 text-gray-400">...</span>}
          <button
            onClick={() => onPageChange(n)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              n === page ? 'bg-orange-gradient text-white shadow-soft' : 'hover:bg-orange-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
            }`}
          >
            {n}
          </button>
        </span>
      ))}
      <button
        disabled={page === pages}
        onClick={() => onPageChange(page + 1)}
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-orange-200 dark:border-gray-700 disabled:opacity-40 hover:bg-orange-50 dark:hover:bg-gray-800"
      >
        <MdChevronRight size={18} />
      </button>
    </div>
  );
};

export default Pagination;
