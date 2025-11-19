import { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    }
  }

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <h1 className="logo">Backoffice Turismo</h1>
          <div className="header-actions">
            <span className="user-info">
              {user?.name || user?.email}
            </span>
            <button onClick={handleLogout} className="logout-btn">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>
      <div className="layout-body">
        <nav className="sidebar">
          <ul className="nav-menu">
            <li>
              <a href="/">Dashboard</a>
            </li>
            <li>
              <a href="/destinos">Destinos</a>
            </li>
            <li>
              <a href="/tours">Tours</a>
            </li>
            <li>
              <a href="/reservas">Reservas</a>
            </li>
            <li>
              <a href="/clientes">Clientes</a>
            </li>
            <li>
              <a href="/reportes">Reportes</a>
            </li>
          </ul>
        </nav>
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout

