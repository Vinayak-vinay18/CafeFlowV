import { Link } from 'react-router-dom';
import { MdCoffee, MdHome } from 'react-icons/md';

const NotFound = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-orange-light px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-orange-gradient flex items-center justify-center text-white shadow-soft mb-5">
        <MdCoffee size={32} />
      </div>
      <h1 className="text-5xl font-bold text-gray-800">404</h1>
      <p className="text-gray-500 mt-2 mb-6">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary flex items-center gap-2">
        <MdHome size={18} /> Back to Dashboard
      </Link>
    </div>
  );
};

export default NotFound;
