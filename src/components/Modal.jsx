export default function Modal({ children, onClose }) {
    return (
      <div className="fixed inset-0 h-full w-full bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-5xl relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-black cursor-pointer"
          >
            ✕
          </button>
          {children}
        </div>
      </div>
    );
  }
  