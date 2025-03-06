import Payment from "../molecules/Payment";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
const PaymentPage = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <Payment />
                </HomeTemplate>
            </HomeShell>
    )
}

export default PaymentPage;