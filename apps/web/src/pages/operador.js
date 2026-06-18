import React, { useState } from 'react';

export default function PanelOperador() {
  const [loteId, setLoteId] = useState('');
  const [piezasNuevas, setPiezasNuevas] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(false);

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(false);

    try {
      // 1. Recuperamos los datos del usuario que inició sesión
      const usuarioString = localStorage.getItem('usuario');
      const token = localStorage.getItem('token');
      
      if (!usuarioString) {
        throw new Error("No hay sesión activa. Por favor, inicia sesión de nuevo.");
      }
      
      const usuario = JSON.parse(usuarioString);

      // 2. Petición POST al Backend real (Puerto 3001)
      const response = await fetch('http://localhost:3001/api/produccion/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Enviamos el token real de Supabase
        },
        body: JSON.stringify({
          lote_id: loteId, 
          usuario_id: usuario.id, // ID real extraído de Supabase
          piezas_nuevas: parseInt(piezasNuevas)
        }),
      });

      const data = await response.json();

      // Validación del Límite de Piezas (El backend rechaza con 400)
      if (response.status === 400) {
        setError(true);
        setMensaje(data.error || 'Error: Límite excedido.');
        return;
      }

      if (!response.ok) throw new Error(data.error || 'Error en el servidor');

      setMensaje(`${piezasNuevas} piezas registradas correctamente en el lote ${loteId}.`);
      setPiezasNuevas(''); 

    } catch (err) {
      setError(true);
      setMensaje(err.message || "Ocurrió un error al intentar comunicar con el servidor.");
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Panel de Operador</h2>
        <p>Registro de producción</p>

        <form onSubmit={manejarRegistro} className="form-group">
          <label>ID Numérico del Lote:</label>
          <input 
            type="number" 
            value={loteId} 
            onChange={(e) => setLoteId(e.target.value)} 
            required 
            placeholder="Ej. 1"
          />

          <label>Número de Piezas Fabricadas:</label>
          <input 
            type="number" 
            min="1"
            value={piezasNuevas} 
            onChange={(e) => setPiezasNuevas(e.target.value)} 
            required 
            placeholder="Ej. 15"
          />

          <button type="submit" className="btn-primary">Registrar Piezas</button>
        </form>

        {mensaje && (
          <div className={`alert ${error ? 'alert-danger' : 'alert-success'}`}>
            {mensaje}
          </div>
        )}
      </div>

      <style jsx>{`
        .container { display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0f172a; font-family: sans-serif; }
        .card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
        h2 { margin-bottom: 0.5rem; color: #1e293b; }
        p { color: #64748b; margin-bottom: 1.5rem; font-size: 0.95rem; }
        .form-group { display: flex; flex-direction: column; gap: 1.2rem; }
        label { font-weight: 600; font-size: 0.85rem; color: #334155; }
        input { padding: 0.8rem; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 1rem; transition: border-color 0.2s; }
        input:focus { outline: none; border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1); }
        .btn-primary { background: #2563eb; color: white; padding: 0.8rem; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; transition: 0.2s; }
        .btn-primary:hover { background: #1d4ed8; }
        .alert { margin-top: 1.5rem; padding: 1rem; border-radius: 6px; font-weight: bold; text-align: center; }
        .alert-danger { background: #fee2e2; color: #b91c1c; border: 1px solid #f87171; }
        .alert-success { background: #dcfce7; color: #15803d; border: 1px solid #4ade80; }
      `}</style>
    </div>
  );
} 