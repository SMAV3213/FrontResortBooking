import React from 'react'
import clsx from 'clsx'
import s from './layout.module.scss'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { Outlet } from 'react-router-dom'

const Layout: React.FC = () => {
    return (
        <div className={clsx(s['br-layout'])}>
            <Header />
            <main className={clsx(s['br-main'])}>
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default Layout