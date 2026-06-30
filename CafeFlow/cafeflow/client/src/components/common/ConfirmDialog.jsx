import Modal from './Modal';
import { MdWarningAmber } from 'react-icons/md';

const ConfirmDialog = ({ open, onClose, onConfirm, title = 'Are you sure?', message, loading }) => {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-sm">
      <div className="flex flex-col items-center text-center gap-3">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center">
          <MdWarningAmber size={28} />
        </div>
        <p className="text-sm text-gray-500">{message}</p>
        <div className="flex gap-3 w-full mt-2">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
