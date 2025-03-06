import OrderHistory from "../molecules/OrderHistory";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
const History = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <OrderHistory />
                </HomeTemplate>
            </HomeShell>
    )
}

export default History;