import ActivateUserForm from "../molecules/ActivateUserForm";
import LoginTemplate from "../templates/LoginTemplate";
import AuthShell from "../shell/AuthShell";

const ActivateUser = () => {
    return (
        <AuthShell>
            <LoginTemplate>
                <ActivateUserForm />
            </LoginTemplate>
        </AuthShell>
    )
}

export default ActivateUser;