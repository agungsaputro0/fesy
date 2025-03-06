import Penukaran from "../molecules/Penukaran";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
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