import TransactionDetail from "../molecules/TransactionDetail";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
const TransactionDetailPage = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <TransactionDetail />
                </HomeTemplate>
            </HomeShell>
    )
}

export default TransactionDetailPage;