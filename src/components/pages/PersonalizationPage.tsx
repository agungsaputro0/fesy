import Personalization from "../molecules/Personalization";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
const PersonalizationPage = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <Personalization />
                </HomeTemplate>
            </HomeShell>
    )
}

export default PersonalizationPage;