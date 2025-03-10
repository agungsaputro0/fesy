import Checkout from "../components/molecules/CheckOut";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
const CheckOutPage = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <Checkout />
                </HomeTemplate>
            </HomeShell>
    )
}

export default CheckOutPage;