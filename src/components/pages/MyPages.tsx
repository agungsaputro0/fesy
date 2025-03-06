import MyPage from "../molecules/MyPage";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
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