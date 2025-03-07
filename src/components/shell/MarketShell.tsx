import React, { useState } from 'react';
import MarketPlaceNavbar from '../organisms/MarketPlaceNavbar';
import Sidebar from '../organisms/Sidebar';
import { useAuth } from '../hooks/AuthContext';
import Footer from '../organisms/Footer';
import MobileBottomNav from '../organisms/MobileBottomNav';
import MobileBottomNavForHome from '../organisms/MobileBottomNavForHome';
import useIsMobile from '../hooks/useMobile';

type AppShellProps = {
    children: React.ReactNode;
};

const MarketShell = (props: AppShellProps) => {
    const [expanded, setExpanded] = useState(false);
    const { loading } = useAuth();
    const isMobile = useIsMobile();
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    
    return (
        <main>
        <div className="flex flex-col bg-[url('/assets/img/bg-default-us.jpg')] bg-no-repeat bg-center bg-cover bg-fixed w-full min-h-screen overflow-y-auto">
        <MarketPlaceNavbar />
        
        {loading ? (
            <div className="flex justify-center items-center h-full">
            <p>Loading...</p>
            </div>
        ) : (
            <div className="flex flex-1">
            {!isMobile && (
                <div
                className={`sidebar transition-all duration-300 ease-in-out ${
                    expanded ? "w-64 opacity-100" : "w-16 opacity-75"
                } bg-transparent shadow-md h-full`}
                onMouseEnter={() => setExpanded(true)}
                onMouseLeave={() => setExpanded(false)}
                >
                <Sidebar onFilterChange={(filters) => console.log(filters)} />
                </div>
            )}
            
            <div className={`${isMobile ? 'pb-6' : 'p-6' } ${expanded ? 'ml-28' : ''} flex-1 overflow-y-hidden transition-all duration-300`}>
            {props.children}
            </div>
            </div>
        )}
        </div>
        <Footer />
        {!currentUser ? (
            <MobileBottomNav />
        ) : (
            <MobileBottomNavForHome />
        )}
        
        </main>
    );
};

export default MarketShell;
