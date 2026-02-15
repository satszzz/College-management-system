import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Breadcrumb from '../common/Breadcrumb';
import './Layout.css';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="layout">
            <Header onMenuToggle={toggleSidebar} />
            <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />
            <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={closeSidebar}></div>
            <main className="main-content">
                <div className="content-wrapper">
                    <Breadcrumb />
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
