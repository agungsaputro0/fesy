import BacaArtikel from "../molecules/BacaArtikel";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
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