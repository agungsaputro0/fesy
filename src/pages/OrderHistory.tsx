import History from "../components/molecules/History";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
const OrderHistory = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <History />
                </HomeTemplate>
            </HomeShell>
    )
}

export default OrderHistory;