import ProductDetail from "../molecules/ProductDetail";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
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