// ==================== Caché local ====================
let personajesCache = null;

// ==================== Obtener datos (solo 1 vez) ====================
async function obtenerPersonajes() {
    const badge = document.getElementById("cache-badge");
    if (personajesCache) {
        badge.textContent = "desde caché";
        badge.className = "cached";
        console.log("[CACHÉ] Datos obtenidos desde memoria local.");
        return personajesCache;
    }

    const url = "https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10";
    const res = await fetch(url);
    const data = await res.json();
    personajesCache = data;

    badge.textContent = "cargado desde API";
    badge.className = "";
    console.log("[API] Datos obtenidos del servidor:", personajesCache);

    // Poblar el selector de personajes
    const select = document.getElementById("selector-personaje");
    select.innerHTML = "<option value=''></option>";
    personajesCache.forEach((p, i) => {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = `${p.id}. ${p.name}`;
        select.appendChild(opt);
    });

    return personajesCache;
}

// ==================== 1. Mostrar lista ====================
async function mostrarLista() {
    const personajes = await obtenerPersonajes();
    const ul = document.createElement("ul");
    ul.className = "lista-personajes";
    personajes.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `ID: ${p.id} - Nombre: ${p.name} - Especie: ${p.species}`;
        ul.appendChild(li);
    });
    const div = document.getElementById("salida-lista");
    div.innerHTML = "";
    div.appendChild(ul);
    console.log("Lista mostrada.");
}

// ==================== 2. Agrupar por especie ====================
async function mostrarAgrupacion() {
    const personajes = await obtenerPersonajes();

    // Agrupar con reduce
    const grupos = personajes.reduce((acc, p) => {
        if (!acc[p.species]) acc[p.species] = [];
        acc[p.species].push(p);
        return acc;
    }, {});

    // Ordenar especies alfabéticamente
    const especiesOrdenadas = Object.keys(grupos).sort();

    const div = document.getElementById("salida-agrupacion");
    div.innerHTML = "";

    especiesOrdenadas.forEach(especie => {
        const bloque = document.createElement("div");
        bloque.className = "grupo-especie";
        const h3 = document.createElement("h3");
        h3.textContent = especie;
        const ul = document.createElement("ul");
        grupos[especie].forEach(p => {
            const li = document.createElement("li");
            li.textContent = `${p.name} (ID: ${p.id})`;
            ul.appendChild(li);
        });
        bloque.appendChild(h3);
        bloque.appendChild(ul);
        div.appendChild(bloque);
        console.log(`Especie: ${especie}`, grupos[especie].map(p => p.name));
    });
}

// ==================== 3. Ficha individual ====================
async function mostrarPersonajeRandom() {
    const div = document.getElementById("salida-ficha");
    div.innerHTML = ""; // Limpiamos la pantalla anterior

    try {
        // Obtiene los personajes desde el caché
        const personajes = await obtenerPersonajes();
        
        if (!personajes || personajes.length === 0) {
            console.error("No se encontraron personajes en la caché.");
            return;
        }

        // índice aleatorio
        const indiceRandom = Math.floor(Math.random() * personajes.length);
        const p = personajes[indiceRandom];

        div.innerHTML = `
          <div class="tarjetas">
            <div class="tarjeta">
              <img src="${p.image}" alt="${p.name}">
              <p class="nombre">${p.name}</p>
              <p>ID: ${p.id}</p>
              <p>Especie: ${p.species}</p>
            </div>
          </div>
        `;
        
        console.log("Personaje Random Seleccionado:", p);

    } catch (error) {
        console.error("Error al mostrar el personaje aleatorio:", error);
    }
}