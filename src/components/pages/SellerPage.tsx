import SellerPage from "../molecules/SellerPage";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
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