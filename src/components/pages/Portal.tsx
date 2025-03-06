import Homeshell from "../shell/HomeShell";
import { Helmet } from "react-helmet";
import { AreaChartOutlined } from "@ant-design/icons";
const appName = import.meta.env.VITE_APP_NAME; 
const Portal = () => {
    return (
            <Homeshell>
                <div className="h-screen">
                <Helmet>
                    <title>{appName}</title>
                </Helmet>
                <div className="flex justify-center h-screen items-center">
                    <div className="w-full pl-10 pr-10">
                        <center>
                            <h1 className="text-4xl  text-white"><AreaChartOutlined /> | Pre - Dashboard</h1>
                        </center>
                    </div>
                </div>
                </div>
            </Homeshell>
    )
}

export default Portal;