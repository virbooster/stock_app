export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (page: number) => void }) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex gap-2 mt-4 items-center justify-center">
      <button 
        disabled={currentPage === 1} 
        onClick={() => onPageChange(currentPage - 1)}
        className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
      >
        Anterior
      </button>
      <span className="text-sm text-gray-700">{currentPage} de {totalPages}</span>
      <button 
        disabled={currentPage === totalPages} 
        onClick={() => onPageChange(currentPage + 1)}
        className="px-3 py-1 bg-gray-200 rounded text-sm disabled:opacity-50"
      >
        Siguiente
      </button>
    </div>
  );
}
