// src/components/shell/HomeShell.tsx
import React, { useState } from 'react';
import HomeNavbar from '../organisms/HomeNavbar';
import { useAuth } from '../hooks/AuthContext';
import FloatingChat from '../organisms/FloatingChat';
import MobileBottomNavForHome from '../organisms/MobileBottomNavForHome';

type AppShellProps = {
    children: React.ReactNode;
}

const HomeShell = (props: AppShellProps) => {
    const [expanded] = useState(false);
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
                        <FloatingChat />
                        <MobileBottomNavForHome />
                    </div>
                )}
            </div>
        </main>
    );
};

export default HomeShell;
