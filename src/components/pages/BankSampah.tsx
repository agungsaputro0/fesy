import HomeShell from "../shell/HomeShell";
import HomeTemplate from "../templates/HomeTemplate";
import BankSampahView from "../molecules/BankSampahView";
const BankSampah = () => {
    return (
        <HomeShell>
            <HomeTemplate>
                <BankSampahView />
            </HomeTemplate>
        </HomeShell>
    )
}

export default BankSampah;