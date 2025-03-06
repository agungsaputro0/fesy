import MarketShell from "../shell/MarketShell";
import ProductList from "../molecules/ProductList";
import HomeTemplate from "../templates/HomeTemplate";
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