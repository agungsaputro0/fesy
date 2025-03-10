import Cart from "../components/molecules/Cart";
import HomeTemplate from "../components/templates/HomeTemplate";
import HomeShell from "../components/shell/HomeShell";
const CartPage = () => {
    return (
            <HomeShell>
                <HomeTemplate>
                        <Cart />
                </HomeTemplate>
            </HomeShell>
    )
}

export default CartPage;