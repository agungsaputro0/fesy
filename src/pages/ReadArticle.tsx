import BacaArtikel from "../components/molecules/BacaArtikel";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
const ReadArticle = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <BacaArtikel />
                </HomeTemplate>
            </HomeShell>
    )
}

export default ReadArticle;