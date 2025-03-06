import History from "../molecules/History";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
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