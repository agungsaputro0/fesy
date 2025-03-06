import Checkout from "../molecules/CheckOut";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
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