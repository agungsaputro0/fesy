import React from "react";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import MobileBottomNav from "../organisms/MobileBottomNav";


type AppShellProps = {
   children: React.ReactNode;
}

const AppShell = (props: AppShellProps) => {
    const { children } = props;
    return (
        <main className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow bg-white bg-no-repeat bg-center bg-cover bg-fixed">
                {children}
            </div>
            <Footer />
            <MobileBottomNav />
        </main>
    )
}

export default AppShell;