export default function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 ">
      <div
        className="bg-white p-6 rounded-2xl shadow-lg 
                   relative overflow-y-auto classe-surgir"
      >
        {/* Botão de fechar */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-black cursor-pointer text-xl"
        >
          ✕
        </button>
        <div className="mt-5">
          {children}
        </div>
      </div>
    </div>
  );
}
