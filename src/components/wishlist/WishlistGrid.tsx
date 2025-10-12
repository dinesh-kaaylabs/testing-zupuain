import WishlistCard from './WishlistCard';
import type { Product } from '../../types/api';
import type { ProductDisplayData } from '../../utils/productUtils';

interface WishlistGridProps {
  products: Product[];
  displayDataMap: Map<string, ProductDisplayData>;
  selectedItems: Set<string>;
  onToggleSelect: (productUid: string) => void;
}

const WishlistGrid = ({
  products,
  displayDataMap,
  selectedItems,
  onToggleSelect,
}: WishlistGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => {
        const displayData = displayDataMap.get(product.product_uid);
        if (!displayData) return null;

        return (
          <WishlistCard
            key={product.product_uid}
            product={product}
            displayData={displayData}
            isSelected={selectedItems.has(product.product_uid)}
            onToggleSelect={onToggleSelect}
          />
        );
      })}
    </div>
  );
};

export default WishlistGrid;

