import MarketShell from "../components/shell/MarketShell";
import ProductList from "../components/molecules/ProductList";
import HomeTemplate from "../components/templates/HomeTemplate";
const Marketplace = () => {
    return (
            <MarketShell>
                <HomeTemplate>
                        <ProductList />
                </HomeTemplate>
            </MarketShell>
    )
}

export default Marketplace;