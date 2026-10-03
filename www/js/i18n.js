// Traducción en vivo: los textos están en español y se sustituyen por el idioma elegido.
// Para añadir otro idioma: crea otra lista igual en I18N y una opción en Ajustes.
const I18N = { en: [
['Tu organizador de viajes','Your trip organizer'],['Entrando…','Entering…'],['Bienvenido a Rumbo','Welcome to Rumbo'],['Planifica cada viaje en un solo lugar. Entra o crea tu cuenta para empezar.','Plan every trip in one place. Log in or create your account to start.'],
['Iniciar sesión','Log in'],['Registrarme','Sign up'],['Nombre de usuario','Username'],['Contraseña','Password'],['Color del marco','Frame color'],['Foto (opcional)','Photo (optional)'],['Crear cuenta','Create account'],['¿Olvidaste tu contraseña?','Forgot your password?'],
['Código de recuperación','Recovery code'],['Guárdalo: es la única forma de recuperar tu contraseña si la olvidas. No se volverá a mostrar.','Save it: it is the only way to recover your password. It will not be shown again.'],['Lo he guardado','I have saved it'],
['Recuperar contraseña','Recover password'],['Nueva contraseña','New password'],['Restablecer contraseña','Reset password'],['Contraseña cambiada','Password changed'],['Generar nuevo código de recuperación','Generate new recovery code'],
['¡Hola de nuevo!','Welcome back!'],['Aquí empieza tu próxima aventura. Crea un viaje o retoma uno que ya tengas.','Your next adventure starts here. Create a trip or pick up an existing one.'],
['Planificar viaje','Plan a trip'],['Almacén de planes','Saved plans'],['Ayuda','Help'],['Importar / Exportar','Import / Export'],['Compartir','Share'],['Notificaciones','Notifications'],['Exportar mis viajes','Export my trips'],['Importar viajes','Import trips'],['Cerrar','Close'],['Ajustes','Settings'],
['General','General'],['Perfil','Profile'],['Cerrar sesión','Log out'],['Guardar cambios','Save changes'],['Volver atrás','Go back'],['Foto','Photo'],['☀️ Cambiar a modo claro','☀️ Switch to light mode'],['🌙 Cambiar a modo oscuro','🌙 Switch to dark mode'],['Cambios guardados','Changes saved'],['Idioma','Language'],
['Nuevo viaje','New trip'],['¿Cómo se llama tu viaje?','What is your trip called?'],['Título del viaje','Trip title'],['Crear viaje','Create trip'],
['País de destino','Destination country'],['Desde','From'],['Hasta','To'],['Avión de ida','Outbound flight'],['Precio €','Price €'],['Vuelo de vuelta','Return flight'],['Avión','Flight'],['Buscar vuelos','Search flights'],['Sitios','Places'],['Hoteles','Hotels'],['Plan','Plan'],
['💶 Presupuesto','💶 Budget'],['🗺️ Mapa','🗺️ Map'],['🎒 Qué llevar','🎒 Packing'],['🌤️ Tiempo','🌤️ Weather'],['💱 Moneda','💱 Currency'],['📄 Documentos','📄 Documents'],
['Sitios de interés','Places of interest'],['Buscar por nombre','Search by name'],['＋ Crear','＋ Create'],['Nombre del sitio','Place name'],['Descripción breve','Short description'],['Lugar (ciudad o dirección)','Location (city or address)'],
['Imagen (se busca sola; si no hay una fiable, súbela tú)','Image (found automatically; upload one if none is reliable)'],['Añadir','Add'],['Cancelar','Cancel'],['Sin resultados.','No results.'],['📍 Ver en Google Maps','📍 View on Google Maps'],
['Nombre del hotel','Hotel name'],['Entrada','Check-in'],['Salida','Check-out'],['Habitaciones','Rooms'],['Personas','People'],['Precio total (€)','Total price (€)'],['Ubicación (dirección o ciudad)','Location (address or city)'],['Buscar en Booking','Search on Booking'],
['Hay menores en el viaje','There are minors on the trip'],['＋ Añadir menor','＋ Add minor'],['Edad del menor','Minor\'s age'],['Todas','All'],['Escribe un nombre','Enter a name'],
['Hora','Time'],['Duración','Duration'],['Actividad','Activity'],['Coste (€)','Cost (€)'],['Sitio u hotel','Place or hotel'],['Ninguno','None'],['Añadir al plan','Add to plan'],['Describe la actividad','Describe the activity'],
['Este destino aún no tiene fechas.','This destination has no dates yet.'],['Pon fechas a tus destinos en el planificador y aquí aparecerá tu agenda día a día.','Set dates for your destinations in the planner and your day-by-day agenda will appear here.'],
['📅 Exportar calendario','📅 Export calendar'],['🖨️ Itinerario PDF','🖨️ PDF itinerary'],['Itinerario','Itinerary'],['Imprimir / Guardar como PDF','Print / Save as PDF'],['Sin actividades','No activities'],['Vuelos','Flights'],
['Presupuesto','Budget'],['Total estimado','Estimated total'],['✈️ Vuelos','✈️ Flights'],['🏨 Hoteles','🏨 Hotels'],['🗓️ Actividades','🗓️ Activities'],['🧾 Otros','🧾 Other'],['Otros gastos','Other expenses'],
['Concepto (comida, transporte…)','Item (food, transport…)'],['Importe €','Amount €'],['Añadir gasto','Add expense'],['Pon concepto e importe','Enter item and amount'],
['Mapa','Map'],['Filtrar por nombre','Filter by name'],['Abrir en Google Maps','Open in Google Maps'],['Qué llevar','Packing'],['Añadir cosa a la lista','Add item to the list'],['Tu lista está vacía.','Your list is empty.'],['Plantillas','Templates'],
['＋ Básica','＋ Basic'],['＋ Playa','＋ Beach'],['＋ Montaña','＋ Mountain'],['＋ Ciudad','＋ City'],['＋ Invierno','＋ Winter'],
['Tiempo previsto','Weather forecast'],['Previsión por destino y fechas (Open-Meteo).','Forecast by destination and dates (Open-Meteo).'],['Cargando…','Loading…'],['Añade fechas a este destino.','Add dates to this destination.'],
['Moneda','Currency'],['Cantidad','Amount'],['De','From'],['A','To'],['⇄ Intercambiar','⇄ Swap'],['Documentos','Documents'],['Subir documento','Upload document'],['Aún no hay documentos.','No documents yet.'],['Documento subido','Document uploaded'],['Elige un archivo','Choose a file'],
['Sube billetes, reservas y otros PDF o imágenes (máx. 10 MB cada uno).','Upload tickets, bookings and other PDFs or images (max. 10 MB each).'],
['1. Elige el plan de viaje','1. Choose the trip plan'],['2. Elige cómo compartirlo','2. Choose how to share it'],['Archivo','File'],['Usuario de la app','App user'],['Descargar archivo','Download file'],['Compartir con otras apps','Share with other apps'],
['Título del mensaje (opcional)','Message title (optional)'],['Enviar','Send'],['Plan enviado','Plan sent'],['Aún no tienes planes que compartir.','You have no plans to share yet.'],
['Crea un archivo del plan y envíalo por WhatsApp, correo u otras apps. Quien lo reciba puede cargarlo con Importar.','Create a plan file and send it via WhatsApp, email or other apps. The recipient can load it with Import.'],
['Elige primero un plan en el paso 1.','Choose a plan in step 1 first.'],['te ha compartido','shared with you'],['Abrir y editar','Open and edit'],['Exportar','Export'],['Anular','Dismiss'],['No tienes notificaciones.','You have no notifications.'],['● Nuevo','● New'],
['Viaje duplicado','Trip duplicated'],['Todavía no tienes viajes. Crea el primero desde el menú.','You have no trips yet. Create the first one from the menu.'],['Archivo vacío','Empty file'],
['Sesión caducada: inicia sesión de nuevo','Session expired: please log in again'],['Usuario o contraseña incorrectos','Wrong username or password'],['Usuario o código incorrectos','Wrong username or code'],['No existe ese usuario','That user does not exist'],
['＋ Nuevo tema','＋ New topic'],['Título del tema','Topic title'],['Crear tema','Create topic'],['Ej.: Souvenirs para traer','E.g. Souvenirs to bring back'],['Sin elementos','No items'],['Pon un título al tema','Give the topic a title'],
['＋ Añadir elemento','＋ Add item'],['Añadir elemento','Add item'],['Nombre del elemento','Item name'],['Descripción','Description'],['Enlace rápido (https://…)','Quick link (https://…)'],['Imagen (opcional)','Image (optional)'],
['Todos','All'],['Pendientes','Pending'],['Hechos','Done'],['Hecho','Done'],['🔗 Abrir enlace','🔗 Open link'],['Enlace no válido','Invalid link'],['Tema no encontrado','Topic not found'],['Compartir archivo','Share file'],['Imagen por enlace (https://…)','Image from link (https://…)'],['Enlace de imagen no válido','Invalid image link'],['No se pudo cargar esa imagen','Could not load that image'],
],};
const RX = { en: [[/^(\d+) días?$/, (m, n) => `${n} day${n > 1 ? 's' : ''}`], [/^(\d+) de (\d+) preparadas$/, '$1 of $2 packed'], [/^(\d+) de (\d+) hechos$/, '$1 of $2 done'], [/^Pendiente: (.*)$/, 'Pending: $1'], [/^Destino (\d+)$/, 'Destination $1'],
  [/^Plan original: (.*)$/, 'Original plan: $1'], [/^Coste total de actividades: (.*)$/, 'Total activity cost: $1'], [/^👶 Menores: (.*) años$/, '👶 Minors: $1 years old'], [/^(\d+) hab\. · (\d+) pers\.$/, '$1 rooms · $2 people']] };
(() => {
  const map = new Map(I18N[A.lang] || []), rx = RX[A.lang] || [];
  const tr = (s) => { if (map.has(s)) return map.get(s); for (const [r, to] of rx) if (r.test(s)) return s.replace(r, to); return s; };
  const walk = (n) => {
    if (n.nodeType === 3) { const v = n.nodeValue, t = v.trim(); if (t) { const r = tr(t); if (r !== t) n.nodeValue = v.replace(t, r); } }
    else if (n.nodeType === 1 && !/^(SCRIPT|STYLE|TEXTAREA)$/.test(n.tagName)) {
      ['placeholder', 'aria-label', 'title'].forEach((a) => { const v = n.getAttribute(a); if (v) { const r = tr(v); if (r !== v) n.setAttribute(a, r); } });
      n.childNodes.forEach(walk);
    }
  };
  document.addEventListener('DOMContentLoaded', () => {
    document.documentElement.lang = A.lang; document.title = tr(document.title); walk(document.body);
    new MutationObserver((ms) => ms.forEach((m) => { m.addedNodes.forEach(walk); if (m.type === 'characterData') walk(m.target); }))
      .observe(document.body, { childList: true, subtree: true, characterData: true });
  });
})();
