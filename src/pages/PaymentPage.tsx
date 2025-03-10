import Payment from "../components/molecules/Payment";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
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