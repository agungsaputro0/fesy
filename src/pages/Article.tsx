import ArticleList from "../components/molecules/ArticleList";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
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