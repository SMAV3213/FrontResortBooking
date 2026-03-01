import React from 'react'
import clsx from 'clsx'
import s from './Layout.module.scss'
import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import { resetBodyScrollLock } from '../../utils/bodyScrollLock'
import { Outlet, useLocation } from 'react-router-dom'

const Layout: React.FC = () => {
    const loc = useLocation()

    React.useEffect(() => {
        resetBodyScrollLock()
    }, [loc.pathname])
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