import TransactionDetail from "../components/molecules/TransactionDetail";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
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