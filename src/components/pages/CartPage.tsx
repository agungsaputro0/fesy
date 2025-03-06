import Cart from "../molecules/Cart";
import HomeTemplate from "../templates/HomeTemplate";
import HomeShell from "../shell/HomeShell";
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