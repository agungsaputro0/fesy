// src/components/shell/HomeShell.tsx
import React, { useState } from 'react';
import HomeNavbar from '../organisms/HomeNavbar';
import Sidebar from '../organisms/Sidebar';
import { useAuth } from '../hooks/AuthContext';

type AppShellProps = {
    children: React.ReactNode;
}

const HomeShell = (props: AppShellProps) => {
    const [expanded, setExpanded] = useState(false);
    const { userName, loading } = useAuth();

    return (
        <main>
            <div className="flex flex-col bg-[url('/assets/img/bg-default-us.jpg')] bg-no-repeat bg-center bg-cover bg-fixed w-full min-h-screen overflow-y-auto">
                <HomeNavbar userName={userName} />
    
                {/* Menambahkan kondisi loading */}
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <p>Loading...</p> {/* Atau bisa menggunakan komponen spinner */}
                    </div>
                ) : (
                    <div className="flex flex-1">
                        
    
                        {/* Menambahkan class dinamis untuk konten */}
                        <div className={`flex-1 overflow-y-auto transition-all duration-300 ${expanded ? 'content-expanded' : 'content-collapsed'}`}>
                            {props.children}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default HomeShell;
