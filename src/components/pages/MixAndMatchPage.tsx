import BackgroundRemover from "../molecules/MixAndMatch";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
const MixAndMatchPage = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <BackgroundRemover />
                </HomeTemplate>
            </HomeShell>
    )
}

export default MixAndMatchPage;