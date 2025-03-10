import SellerPage from "../components/molecules/SellerPage";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
const Seller = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <SellerPage />
                </HomeTemplate>
            </HomeShell>
    )
}

export default Seller;