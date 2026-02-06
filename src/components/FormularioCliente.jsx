import { useState, useEffect } from 'react'
import {
  obtenerClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente
} from '../services/clienteService'

export default function FormularioCliente() {
  // Estado para la lista de clientes
  const [clientes, setClientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    direccion: '',
  })
  const [foto, setFoto] = useState(null)

  // Estado para controlar vista y modo de edición
  const [vistaActual, setVistaActual] = useState('lista') // 'lista' o 'formulario'
  const [clienteEditando, setClienteEditando] = useState(null) // null = crear, objeto = editar

  // Cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes()
  }, [])

  // ===========================================
  // FUNCIONES CRUD
  // ===========================================

  const cargarClientes = async () => {
    try {
      setCargando(true)
      setError(null)
      const data = await obtenerClientes()
      setClientes(data)
    } catch (err) {
      setError('Error al cargar los clientes')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const guardarCliente = async (e) => {
    e.preventDefault()
    try {
      setCargando(true)
      const clienteData = { ...formData, foto }

      if (clienteEditando) {
        // UPDATE
        await actualizarCliente(clienteEditando.id, clienteData)
      } else {
        // CREATE
        await crearCliente(clienteData)
      }

      await cargarClientes()
      resetearFormulario()
      setVistaActual('lista')
    } catch (err) {
      setError(clienteEditando ? 'Error al actualizar cliente' : 'Error al crear cliente')
      console.error(err)
    } finally {
      setCargando(false)
    }
  }

  const editarCliente = (cliente) => {
    setFormData({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      correo: cliente.correo,
      telefono: cliente.telefono,
      direccion: cliente.direccion,
    })
    setFoto(cliente.foto || null)
    setClienteEditando(cliente)
    setVistaActual('formulario')
  }

  const confirmarEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        setCargando(true)
        await eliminarCliente(id)
        await cargarClientes()
      } catch (err) {
        setError('Error al eliminar cliente')
        console.error(err)
      } finally {
        setCargando(false)
      }
    }
  }

  // ===========================================
  // FUNCIONES AUXILIARES
  // ===========================================

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFotoChange = (e) => {
    const archivo = e.target.files[0]
    if (archivo) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFoto(reader.result)
      }
      reader.readAsDataURL(archivo)
    }
  }

  const resetearFormulario = () => {
    setFormData({ nombre: '', apellido: '', correo: '', telefono: '', direccion: '' })
    setFoto(null)
    setClienteEditando(null)
  }

  const cancelarEdicion = () => {
    resetearFormulario()
    setVistaActual('lista')
  }

  const nuevoCliente = () => {
    resetearFormulario()
    setVistaActual('formulario')
  }

  // ===========================================
  // RENDERIZADO
  // ===========================================

  if (cargando && clientes.length === 0) {
    return (
      <div className="formulario-container">
        <p className="mensaje-carga">Cargando clientes...</p>
      </div>
    )
  }

  // Vista: LISTA DE CLIENTES
  if (vistaActual === 'lista') {
    return (
      <div className="formulario-container">
        <div className="header-lista">
          <h1>Gestión de Clientes</h1>
          <button className="btn-nuevo" onClick={nuevoCliente}>
            + Nuevo Cliente
          </button>
        </div>

        {error && <p className="mensaje-error">{error}</p>}

        {clientes.length === 0 ? (
          <div className="lista-vacia">
            <p>No hay clientes registrados</p>
            <button className="btn-enviar" onClick={nuevoCliente}>
              Registrar primer cliente
            </button>
          </div>
        ) : (
          <div className="lista-clientes">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="tarjeta-cliente">
                {cliente.foto && (
                  <img
                    src={cliente.foto}
                    alt={`${cliente.nombre} ${cliente.apellido}`}
                    className="foto-cliente"
                  />
                )}
                <div className="info-cliente">
                  <h3>{cliente.nombre} {cliente.apellido}</h3>
                  <p><strong>Correo:</strong> {cliente.correo}</p>
                  <p><strong>Teléfono:</strong> {cliente.telefono}</p>
                  <p><strong>Dirección:</strong> {cliente.direccion}</p>
                </div>
                <div className="acciones-cliente">
                  <button
                    className="btn-editar"
                    onClick={() => editarCliente(cliente)}
                    disabled={cargando}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => confirmarEliminar(cliente.id)}
                    disabled={cargando}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Vista: FORMULARIO (crear o editar)
  return (
    <div className="formulario-container">
      <h1>{clienteEditando ? 'Editar Cliente' : 'Nuevo Cliente'}</h1>

      {error && <p className="mensaje-error">{error}</p>}

      <form onSubmit={guardarCliente} className="formulario">
        <div className="grupo-campo">
          <label htmlFor="nombre">Nombre</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            placeholder="Juan"
            disabled={cargando}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="apellido">Apellido</label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            required
            placeholder="García"
            disabled={cargando}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="correo">Correo electrónico</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={handleChange}
            required
            placeholder="juan@email.com"
            disabled={cargando}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="telefono">Teléfono</label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
            required
            placeholder="+503 0000-0000"
            disabled={cargando}
          />
        </div>

        <div className="grupo-campo">
          <label htmlFor="direccion">Dirección</label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
            placeholder="Calle Principal 123"
            disabled={cargando}
          />
        </div>

        <div className="grupo-campo grupo-foto">
          <label htmlFor="fotografia">Fotografía</label>
          <input
            type="file"
            id="fotografia"
            name="fotografia"
            accept="image/*"
            onChange={handleFotoChange}
            disabled={cargando}
          />
          {foto && (
            <div className="preview-foto">
              <img src={foto} alt="Preview de la fotografía" />
            </div>
          )}
        </div>

        <div className="botones-formulario">
          <button type="submit" className="btn-enviar" disabled={cargando}>
            {cargando ? 'Guardando...' : (clienteEditando ? 'Actualizar' : 'Guardar')}
          </button>
          <button
            type="button"
            className="btn-cancelar"
            onClick={cancelarEdicion}
            disabled={cargando}
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}
