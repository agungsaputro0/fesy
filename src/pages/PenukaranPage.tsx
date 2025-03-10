import Penukaran from "../components/molecules/Penukaran";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
const PenukaranPage = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <Penukaran />
                </HomeTemplate>
            </HomeShell>
    )
}

export default PenukaranPage;