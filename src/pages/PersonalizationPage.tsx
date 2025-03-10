import Personalization from "../components/molecules/Personalization";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
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