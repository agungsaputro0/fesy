import ProductDetail from "../components/molecules/ProductDetail";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
const ProductDetailPage = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <ProductDetail />
                </HomeTemplate>
            </HomeShell>
    )
}

export default ProductDetailPage;