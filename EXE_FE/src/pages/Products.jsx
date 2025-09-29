import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
// import { getProducts } from "../api/products";
import { useUi } from "../context/UiContext";
import { products } from "../data/products"; // ensure products.js is included in the build
export default function Products() {
  const { notify } = useUi();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   let ignore = false;
  //   setLoading(true);
  //   getProducts()
  //     .then((data) => {
  //       if (!ignore) setItems(Array.isArray(data) ? data : data?.items || []);
  //     })
  //     .catch((err) => notify(`Lỗi tải sản phẩm: ${err.message}`))
  //     .finally(() => setLoading(false));
  //   return () => {
  //     ignore = true;
  //   };
  // }, []);
  return (
    // <section className="products" id="products">
    //   <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
    //   {loading ? (
    //     <p style={{ textAlign: "center" }}>Đang tải sản phẩm...</p>
    //   ) : (
    //     <div className="products-grid" id="productsGrid">
    //       {products.map((p) => (
    //         <ProductCard key={p.id} product={p} />
    //       ))}
    //     </div>
    //   )}
    // </section>
    <section className="products" id="products">
      <h2 className="section-title">Sản Phẩm Nổi Bật</h2>
      <div className="products-grid" id="productsGrid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
