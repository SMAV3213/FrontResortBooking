import React from 'react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import s from './footer.module.scss'

const Footer: React.FC = () => {
    return (
        <footer className={clsx(s['br-footer'])}>
            <div className={clsx('br-container', s['br-footer-inner'])}>
                <div className={clsx(s['br-copy'])}>
                    © {new Date().getFullYear()} Baikal Breeze — Все права защищены
                </div>
                <div className={clsx(s['br-footer-links'])}>
                    <Link to="/privacy">Политика конфиденциальности</Link>
                    <Link to="/terms">Условия использования</Link>
                </div>
            </div>
        </footer>
    )
}

export default Footer