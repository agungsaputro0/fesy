import LoginForm from "../components/molecules/LoginForm";
import LoginTemplate from "../components/templates/LoginTemplate";
import AuthShell from "../components/shell/AuthShell";

const LoginPage = () => {
    return (
        <AuthShell>
            <LoginTemplate>
                <LoginForm />
            </LoginTemplate>
        </AuthShell>
    )
}

export default LoginPage;