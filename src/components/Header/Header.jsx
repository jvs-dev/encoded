import React from 'react'
import { Link } from 'react-router-dom'
import './Header.css'

const Header = () => {
    return (
        <header className='header'>
            <img className='header__logo' src="/EncodedName.svg" alt="" />
            <nav className='header__nav'>
                <Link className='header__link'>Eventos</Link>
                <Link className='header__link'>Orçamentos</Link>
                <Link className='header__link'>Resultados</Link>
                <Link className='header__link'>Artigos</Link>
                <Link className='header__link'>Sobre</Link>
            </nav>
            <a className='header__a' href="#">Contate-nos</a>
        </header>
    )
}

export default Header
