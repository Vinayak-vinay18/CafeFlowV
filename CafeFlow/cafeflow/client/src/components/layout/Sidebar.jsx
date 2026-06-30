import { NavLink } from 'react-router-dom';
import {
  MdDashboard,
  MdRestaurantMenu,
  MdPointOfSale,
  MdPeople,
  MdReceiptLong,
  MdInsights,
  MdSettings,
  MdCoffee,
  MdClose,
} from 'react-icons/md';

const navItems = [
  { to: '/', label: 'Dashboard', icon: MdDashboard, end: true },
  { to: '/billing', label: 'POS Billing', icon: MdPointOfSale },
  { to: '/menu', label: 'Menu', icon: MdRestaurantMenu },
  { to: '/orders', label: 'Orders', icon: MdReceiptLong },
  { to: '/customers', label: 'Customers', icon: MdPeople },
  { to: '/sales', label: 'Sales History', icon: MdInsights },
  { to: '/settings', label: 'Settings', icon: MdSettings },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:static top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-orange-100 dark:border-gray-800
        z-40 transform transition-transform duration-300 flex flex-col
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-orange-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-orange-gradient flex items-center justify-center text-white shadow-soft">
              <MdCoffee size={20} />
            </div>
            <span className="text-lg font-bold text-gray-800 dark:text-white">CafeFlow</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500">
            <MdClose size={22} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? 'bg-orange-gradient text-white shadow-soft'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-gray-800'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-orange-100 dark:border-gray-800">
          <div className="rounded-xl bg-orange-light dark:bg-gray-800 p-3 text-xs text-gray-500 dark:text-gray-400">
            CafeFlow v1.0 — Smart Cafe Billing & Management System
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
