// SERVICIO DE CLIENTES - API/BASE DE DATOS
// Se definen todas las operaciones CRUD a utilizar.
// minetras no tenga bd o api se usa localStorage como mock,
// se maneja la opcion de dejar listo para usar con fetch a tu API.

const API_URL = 'http://localhost:3000/api/clientes' // constante de la api real o la bd si se usara en la prueba

// Simula un delay de red (opcional, para testing)
const simulateDelay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))


// OPCIÓN 1: LocalStorage (mock - actual)


const getClientesFromLocalStorage = () => {
  const data = localStorage.getItem('clientes')
  return data ? JSON.parse(data) : []
}

const saveClientesToLocalStorage = (clientes) => {
  localStorage.setItem('clientes', JSON.stringify(clientes))
}


// CRUD OPERATIONS


/**
 * GET ALL - Obtener todos los clientes
 */
export const obtenerClientes = async () => {
  try {
    await simulateDelay(200)

    // OPCIÓN 1: LocalStorage (actual)
    return getClientesFromLocalStorage()

    // OPCIÓN 2: API REST
    /*
    const response = await fetch(API_URL)
    if (!response.ok) throw new Error('Error al obtener clientes')
    return await response.json()
    */
  } catch (error) {
    console.error('Error en obtenerClientes:', error)
    throw error
  }
}

/**
 * GET ONE - Obtener un cliente por ID
 */
export const obtenerClientePorId = async (id) => {
  try {
    await simulateDelay(100)

    // OPCIÓN 1: LocalStorage
    const clientes = getClientesFromLocalStorage()
    return clientes.find(c => c.id === id)

    // OPCIÓN 2: API REST
    /*
    const response = await fetch(`${API_URL}/${id}`)
    if (!response.ok) throw new Error('Cliente no encontrado')
    return await response.json()
    */
  } catch (error) {
    console.error('Error en obtenerClientePorId:', error)
    throw error
  }
}

/**
 * CREATE - Crear nuevo cliente
 */
export const crearCliente = async (clienteData) => {
  try {
    await simulateDelay(300)

    // OPCIÓN 1: LocalStorage
    const clientes = getClientesFromLocalStorage()
    const nuevoCliente = {
      id: Date.now().toString(), // ID simple para el mock
      ...clienteData,
      fechaCreacion: new Date().toISOString()
    }
    clientes.push(nuevoCliente)
    saveClientesToLocalStorage(clientes)
    return nuevoCliente

    // OPCIÓN 2: API REST
    /*
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData)
    })
    if (!response.ok) throw new Error('Error al crear cliente')
    return await response.json()
    */
  } catch (error) {
    console.error('Error en crearCliente:', error)
    throw error
  }
}

/**
 * UPDATE - Actualizar cliente existente
 */
export const actualizarCliente = async (id, clienteData) => {
  try {
    await simulateDelay(300)

    // OPCIÓN 1: LocalStorage
    const clientes = getClientesFromLocalStorage()
    const index = clientes.findIndex(c => c.id === id)
    if (index === -1) throw new Error('Cliente no encontrado')

    clientes[index] = {
      ...clientes[index],
      ...clienteData,
      fechaActualizacion: new Date().toISOString()
    }
    saveClientesToLocalStorage(clientes)
    return clientes[index]

    // OPCIÓN 2: API REST
    /*
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(clienteData)
    })
    if (!response.ok) throw new Error('Error al actualizar cliente')
    return await response.json()
    */
  } catch (error) {
    console.error('Error en actualizarCliente:', error)
    throw error
  }
}

/**
 * DELETE - Eliminar cliente
 */
export const eliminarCliente = async (id) => {
  try {
    await simulateDelay(200)

    // OPCIÓN 1: LocalStorage
    const clientes = getClientesFromLocalStorage()
    const clientesFiltrados = clientes.filter(c => c.id !== id)
    saveClientesToLocalStorage(clientesFiltrados)
    return { success: true, id }

    // OPCIÓN 2: API REST
    /*
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('Error al eliminar cliente')
    return await response.json()
    */
  } catch (error) {
    console.error('Error en eliminarCliente:', error)
    throw error
  }
}


// FUNCIONES AUXILIARES (opcional)


/**
 * Búsqueda de clientes por nombre
 */
export const buscarClientes = async (termino) => {
  try {
    const clientes = await obtenerClientes()
    const terminoLower = termino.toLowerCase()
    return clientes.filter(c =>
      c.nombre.toLowerCase().includes(terminoLower) ||
      c.apellido.toLowerCase().includes(terminoLower) ||
      c.correo.toLowerCase().includes(terminoLower)
    )
  } catch (error) {
    console.error('Error en buscarClientes:', error)
    throw error
  }
}
