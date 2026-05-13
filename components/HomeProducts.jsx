import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = ({ limit = 8 }) => {

  const { products, productsLoading } = useAppContext()
  const list = products.slice(0, limit);

  return (
    <div className="w-full">
      <div className="min-h-[250px] w-full">
        {productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 rounded-sm"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16 w-full">
            {list.length ? list.map((product, index) => <ProductCard key={product._id || index} product={product} />) : (
              <p className="text-sm text-center text-black/50 font-body italic col-span-full py-20">A new collection is being prepared.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeProducts;
