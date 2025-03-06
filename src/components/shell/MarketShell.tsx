// src/components/shell/HomeShell.tsx
import React, { useState } from 'react';
import MarketPlaceNavbar from '../organisms/MarketPlaceNavbar';
import Sidebar from '../organisms/Sidebar';
import { useAuth } from '../hooks/AuthContext';
import Footer from '../organisms/Footer';

type AppShellProps = {
    children: React.ReactNode;
}

const MarketShell = (props: AppShellProps) => {
    const [expanded, setExpanded] = useState(false);
    const { loading } = useAuth();

    return (
        <main>
            <div className="flex flex-col bg-[url('/assets/img/bg-default-us.jpg')] bg-no-repeat bg-center bg-cover bg-fixed w-full min-h-screen overflow-y-auto">
                <MarketPlaceNavbar />
    
                {/* Menambahkan kondisi loading */}
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <p>Loading...</p> {/* Atau bisa menggunakan komponen spinner */}
                    </div>
                ) : (
                    <div className="flex flex-1">
                        <div 
                            className={`sidebar ${expanded ? 'sidebar-expanded' : ''} bg-transparent shadow-md h-full`}
                            onMouseEnter={() => setExpanded(true)}
                            onMouseLeave={() => setExpanded(false)}
                        >
                            <Sidebar onFilterChange={(filters) => console.log(filters)} />
                        </div>

                        {/* Menambahkan class dinamis untuk konten */}
                        <div className={`flex-1 p-6 overflow-y-hidden transition-all duration-300 ${expanded ? 'content-expanded' : 'content-collapsed'}`}>
                            {props.children}
                        </div>
                    </div>
                )}
            </div>
             <Footer />
        </main>
    );
};

export default MarketShell;
