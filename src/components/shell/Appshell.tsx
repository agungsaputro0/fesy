import React from "react";
import Navbar from "../organisms/Navbar";
import Footer from "../organisms/Footer";
import PopularSection from "../organisms/PopularSection";
import OurCommitment from "../molecules/OurCommitment";
import OurAchievements from "../molecules/Achievements";
import TabSection from "../organisms/TabSection";

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
                <PopularSection />
                <TabSection />
                <OurCommitment />
                <OurAchievements />
            </div>
            <Footer />
        </main>
    )
}

export default AppShell;