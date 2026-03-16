import ProductListPage from "../../../components/ProductListPage";

export default function CategoryPage() {
  // The ProductListPage reads filters from the URL; category pages can
  // be wired later to pass slug via searchParams if desired.
  return <ProductListPage />;
}

