import { useEffect, useState } from 'react'
import api from '../services/auth.service'
import './Dashboard.css'

interface Stats {
  totalSales: number
  totalBookings: number
  activeTours: number
  totalCustomers: number
  monthlyGrowth: number
  bookingGrowth: number
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats')
      setStats(response.data.data)
    } catch (error) {
      console.error('Error al cargar estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="dashboard-loading">Cargando...</div>
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Dashboard</h1>
      
      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Ventas Totales</h3>
            <p className="stat-value">${stats.totalSales.toLocaleString()}</p>
          </div>
          
          <div className="stat-card">
            <h3>Reservas</h3>
            <p className="stat-value">{stats.totalBookings}</p>
          </div>
          
          <div className="stat-card">
            <h3>Tours Activos</h3>
            <p className="stat-value">{stats.activeTours}</p>
          </div>
          
          <div className="stat-card">
            <h3>Clientes</h3>
            <p className="stat-value">{stats.totalCustomers}</p>
          </div>
        </div>
      )}

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Bienvenido al Backoffice de Turismo</h2>
          <p>
            Este es el panel de control principal. Desde aquí puedes gestionar
            todos los aspectos de tu plataforma de turismo.
          </p>
          <p>
            Utiliza el menú lateral para navegar entre los diferentes módulos:
          </p>
          <ul>
            <li><strong>Destinos:</strong> Gestiona los destinos turísticos</li>
            <li><strong>Tours:</strong> Crea y administra paquetes turísticos</li>
            <li><strong>Reservas:</strong> Gestiona las reservas de clientes</li>
            <li><strong>Clientes:</strong> Administra la base de datos de clientes</li>
            <li><strong>Reportes:</strong> Visualiza estadísticas y reportes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

