import ArticleList from "../molecules/ArticleList";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
const Article = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <ArticleList />
                </HomeTemplate>
            </HomeShell>
    )
}

export default Article;