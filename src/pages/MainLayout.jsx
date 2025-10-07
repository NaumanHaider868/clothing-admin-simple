import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from './Public/Navbar'
import Sidebar from "./Public/Sidebar";
import Footer from "./Public/Components/Footer";

function MainLayout() {

    return (
        <>
            <div className={`main-section h-auto overflow-hidden`}>
                <div className={`w-full`}>
                    <Navbar />
                    <section className="flex h-full">
                        <Sidebar />
                        <div className="w-full h-full">
                            <Outlet />
                        </div>
                    </section>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default MainLayout;
