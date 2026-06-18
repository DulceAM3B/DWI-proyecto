import React, { useState, useEffect } from 'react';
import { API_URL } from '../lib/api';

export default function DashboardSupervisor() {
  const [lotes, setLotes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarLotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/lotes/estado`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setLotes(data);
    } catch (e) {
      console.error("Error al cargar lotes:", e);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarLotes();
    const intervalo = setInterval(cargarLotes, 5000);
    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="container">
      <header className="header">
        <h1>Dashboard de Supervisión</h1>
        <button className="btn-reporte">Generar Reporte de Nómina</button>
      </header>

      {cargando ? (
        <p style={{ color: '#64748b' }}>Cargando lotes...</p>
      ) : lotes.length === 0 ? (
        <p style={{ color: '#64748b' }}>No hay lotes activos.</p>
      ) : (
        <main className="grid">
          {lotes.map((lote) => {
            const limiteCritico = lote.limite_cercano || lote.porcentaje > 90;

            return (
              <div key={lote.id} className={`lote-card ${limiteCritico ? 'border-alert' : ''}`}>
                <div className="lote-header">
                  <h3>{lote.codigo_lote}</h3>
                  {limiteCritico && <span className="badge-alert">Límite Cercano</span>}
                </div>

                <div className="progress-info">
                  <p>Progreso: <strong>{lote.piezas_acumuladas} / {lote.total_piezas_requeridas}</strong> piezas</p>
                  <p>Disponibles: {lote.piezas_disponibles}</p>
                  <p>Estado: {lote.estado}</p>
                </div>

                <div className="progress-bar-container">
                  <div
                    className={`progress-bar ${limiteCritico ? 'bg-danger' : 'bg-success'}`}
                    style={{ width: `${Math.min(lote.porcentaje, 100)}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </main>
      )}

      <style jsx>{`
        .container { padding: 2rem; background: #f4f6f9; min-height: 100vh; font-family: sans-serif; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        h1 { color: #1e293b; font-size: 1.8rem; }
        .btn-reporte { background: #0f172a; color: white; padding: 0.6rem 1.2rem; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
        .lote-card { background: white; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .border-alert { border-left: 5px solid #ef4444; }
        .lote-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        h3 { color: #334155; margin: 0; }
        .badge-alert { background: #fee2e2; color: #b91c1c; padding: 0.2rem 0.6rem; border-radius: 20px; font-size: 0.8rem; font-weight: bold; }
        .progress-info { color: #64748b; font-size: 0.95rem; margin-bottom: 1rem; }
        .progress-info p { margin: 0.3rem 0; }
        .progress-bar-container { width: 100%; background: #e2e8f0; height: 10px; border-radius: 10px; overflow: hidden; }
        .progress-bar { height: 100%; transition: width 0.5s ease-in-out; }
        .bg-success { background: #10b981; }
        .bg-danger { background: #ef4444; }
      `}</style>
    </div>
  );
}
