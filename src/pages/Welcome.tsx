import AppShell from "../components/shell/Appshell";
import LandingLayouts from "../components/templates/Landing";
import { Helmet } from "react-helmet";  

const appName = import.meta.env.VITE_APP_NAME;  

const Welcome = () => {
    return (
        <AppShell>
            <div className="min-h-screen">
                <Helmet>
                    <title>{appName}</title>
                </Helmet>
                <LandingLayouts />
            </div>
        </AppShell>
    );
};

export default Welcome;
