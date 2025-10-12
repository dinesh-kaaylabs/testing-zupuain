import { CheckSquare, Square, Trash2, ShoppingCart } from 'lucide-react';

interface BulkActionsBarProps {
  selectedCount: number;
  totalItems: number;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  onRemoveSelected: () => void;
  onMoveSelectedToCart: () => void;
}

const BulkActionsBar = ({
  selectedCount,
  totalItems,
  onSelectAll,
  onDeselectAll,
  onRemoveSelected,
  onMoveSelectedToCart,
}: BulkActionsBarProps) => {
  const allSelected = selectedCount === totalItems && totalItems > 0;

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 animate-slide-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Selection Info */}
        <div className="flex items-center gap-4">
          <button
            onClick={allSelected ? onDeselectAll : onSelectAll}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            {allSelected ? (
              <>
                <CheckSquare className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Deselect All
              </>
            ) : (
              <>
                <Square className="h-5 w-5" />
                Select All
              </>
            )}
          </button>

          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
          </span>
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={onMoveSelectedToCart}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="h-4 w-4" />
              Move to Cart
            </button>

            <button
              onClick={onRemoveSelected}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkActionsBar;

