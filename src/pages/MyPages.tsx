import MyPage from "../components/molecules/MyPage";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
const MyPages = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <MyPage />
                </HomeTemplate>
            </HomeShell>
    )
}

export default MyPages;