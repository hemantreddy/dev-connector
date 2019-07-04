import React from 'react'

function Footer() {
    return (
        <footer className = "bg-dark text-white p-4 mt-5 text-center">
            Copyright &copy;{new Date().getFullYear()} DevConnector
        </footer>
    )
}

export default Footer;
