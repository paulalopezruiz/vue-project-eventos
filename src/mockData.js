let categories = [
  { codigo: 'CAT01', nombre: 'Formación', descripcion: 'Talleres y actividades formativas' },
  { codigo: 'CAT02', nombre: 'Jornadas', descripcion: 'Jornadas internas y charlas' },
];

let users = [
  { dni: '12345678A', nombre: 'Ana', apellidos: 'García López', email: 'ana@example.com', telefono: '600000001', tipo_usuario: 'ALUMNO' },
  { dni: '87654321B', nombre: 'Luis', apellidos: 'Pérez Martín', email: 'luis@example.com', telefono: '600000002', tipo_usuario: 'PROFESOR' },
];

let events = [
  { id: 1, codigo: 'EVT001', titulo: 'Taller de Django', descripcion: 'Introducción a Django para backend.', fecha: '2026-05-20', hora_inicio: '10:00', hora_fin: '12:00', ubicacion: 'Aula 101', aforo_maximo: 2, estado: 'ABIERTO', categoria_codigo: 'CAT01' },
  { id: 2, codigo: 'EVT002', titulo: 'Charla de Vue', descripcion: 'Frontend moderno con Vue 3.', fecha: '2026-05-25', hora_inicio: '16:00', hora_fin: '18:00', ubicacion: 'Aula 202', aforo_maximo: 20, estado: 'ABIERTO', categoria_codigo: 'CAT01' },
];

let inscriptions = [
  { codigo: 'INS001', fecha_inscripcion: '2026-05-10', estado: 'CONFIRMADA', usuario_dni: '12345678A', evento_id: 1, asistencia_confirmada: false },
  { codigo: 'INS002', fecha_inscripcion: '2026-05-11', estado: 'CONFIRMADA', usuario_dni: '87654321B', evento_id: 1, asistencia_confirmada: true },
];

// GETTERS
export function getCategories() { return categories; }
export function getUsers() { return users; }
export function getEvents() { return events; }
export function getInscriptions() { return inscriptions; }

// EVENTS CRUD
export function createEvent(data) {
  const newId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;
  const nuevo = { ...data, id: newId };
  events.push(nuevo);
  return nuevo;
}

export function updateEvent(id, data) {
  const idx = events.findIndex(e => e.id === id);
  if (idx !== -1) {
    events[idx] = { ...events[idx], ...data };
    return events[idx];
  }
  return null;
}

export function deleteEvent(id) {
  events = events.filter(e => e.id !== id);
}

// USERS CRUD
export function createUser(data) {
  if (users.some(u => u.dni === data.dni)) {
    throw new Error('Ya existe un usuario con ese DNI');
  }
  users.push({ ...data });
}

export function updateUser(dni, data) {
  const idx = users.findIndex(u => u.dni === dni);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...data };
    return users[idx];
  }
  return null;
}

export function deleteUser(dni) {
  users = users.filter(u => u.dni !== dni);
}

// INSCRIPTIONS CRUD + lógica de negocio
export function createInscription({ usuario_dni, evento_id }) {
  const evento = events.find(e => e.id === evento_id);
  if (!evento) throw new Error('Evento no encontrado');

  // Validar duplicado
  const yaInscrito = inscriptions.some(
    ins => ins.usuario_dni === usuario_dni && ins.evento_id === evento_id && ins.estado !== 'CANCELADA'
  );
  if (yaInscrito) {
    throw new Error('El usuario ya está inscrito en este evento');
  }

  // Control de aforo
  const confirmadas = inscriptions.filter(
    ins => ins.evento_id === evento_id && ins.estado === 'CONFIRMADA'
  ).length;

  let estado = 'CONFIRMADA';
  if (confirmadas >= evento.aforo_maximo) {
    estado = 'ESPERA';
  }

  const newCode = `INS${(inscriptions.length + 1).toString().padStart(3, '0')}`;
  const nueva = {
    codigo: newCode,
    fecha_inscripcion: new Date().toISOString().slice(0, 10),
    estado,
    usuario_dni,
    evento_id,
    asistencia_confirmada: false,
  };
  inscriptions.push(nueva);
  return nueva;
}

export function cancelInscription(codigo) {
  const ins = inscriptions.find(i => i.codigo === codigo);
  if (ins) {
    ins.estado = 'CANCELADA';
  }
}

export function toggleAttendance(codigo) {
  const ins = inscriptions.find(i => i.codigo === codigo);
  if (ins) {
    ins.asistencia_confirmada = !ins.asistencia_confirmada;
  }
}
