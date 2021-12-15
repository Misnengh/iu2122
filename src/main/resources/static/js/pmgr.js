"use strict"

import * as Pmgr from './pmgrapi.js'

/**
 * Librería de cliente para interaccionar con el servidor de PeliManager (pmgr).
 * Prácticas de IU 2021-22
 *
 * Para las prácticas de IU, pon aquí (o en otros js externos incluidos desde tus .htmls) el código
 * necesario para añadir comportamientos a tus páginas.
 *
 * Recomiendo separar el fichero en 2 partes:
 * - parte "página-independiente": funciones que pueden generar cachos de
 *   contenido a partir del modelo, pero que no tienen referencias directas a la página
 * - parte pequeña, al final, de "pegamento": asocia comportamientos a 
 *   elementos de la página.
 * Esto tiene la ventaja de que, si cambias tu página, sólo deberías tener
 * que cambiar el pegamento.
 *
 * Fuera de las prácticas, lee la licencia: dice lo que puedes hacer con él:
 * lo que quieras siempre y cuando
 * - no digas que eres el autor original.
 * - no me eches la culpa de haberlo escrito mal.
 *
 * @Author manuel.freire@fdi.ucm.es
 */

//
// PARTE 1:
// Código de comportamiento, que sólo se llama desde consola (para probarlo) o desde la parte 2,
// en respuesta a algún evento.
//

/**
 * 
 * @param {string} sel CSS usado para indicar qué fieldset quieres convertir
 * en estrellitas. Se espera que el fieldset tenga este aspecto:
 *      <label title="Atómico - 5 estrellas">
            <input type="radio" name="rating" value="5" />
        </label>

        <label title="Muy buena - 4 estrellas">
            <input type="radio" name="rating" value="4" />
        </label>

        <label title="Pasable - 3 estrellas">
            <input type="radio" name="rating" value="3" />
        </label>

        <label title="Más bien mala - 2 estrellas">
            <input type="radio" name="rating" value="2" />
        </label>

        <label title="Horrible - 1 estrella">
            <input type="radio" name="rating" value="1" />
        </label>
 */
function stars(sel) {
    const changeClassOnEvents = (ss, s) => {
        s.addEventListener("change", e => {
            // find current index
            const idx = e.target.value;
            // set selected for previous & self, remove for next
            ss.querySelectorAll("label").forEach(label => {
                if (label.children[0].value <= idx) {
                    label.classList.add("selected");
                } else {
                    label.classList.remove("selected");
                }
            });
        });
    };
    const activateStars = (ss) => {
        ss.classList.add("rating");
        ss.querySelectorAll("input").forEach(s =>
            changeClassOnEvents(ss, s));
        let parent = ss;
        while (!parent.matches("form")) {
            parent = parent.parentNode;
        }
        parent.addEventListener("reset", () => {
            ss.querySelectorAll("input").forEach(e => e.checked = false);
            ss.querySelectorAll("label").forEach(e => e.classList.remove("selected"));
        });
    }
    document.querySelectorAll(sel).forEach(activateStars);
}

function createMovieItem(movie) {
    const r2s = r => r > 0 ? Pmgr.Util.fill(r, () => "⭐").join("") : "";
    const ratings = movie.ratings.map(id => Pmgr.resolve(id)).map(r =>
        `<span class="badge bg-${r.user == userId ? "primary" : "secondary"}">
        ${Pmgr.resolve(r.user).username}: ${r.labels} ${r2s(r.rating)}
        </span>
        `
    ).join("");

    let movieHtml = `
                     <div class="col-xl-3 col-md-4 col-sm-6 col-xs-12 colPel" id="movieColumn"> 
                        <div class="card w-100 h-100 tarjeta" data-id="${movie.id}">
                            <div class="card-header fondo_azul">
                                <h4 class="mb-0" title="${movie.id}">
                                ${movie.name} <small><i>(${movie.year})</i></small>
                                </h4>
                            </div>
                            <div>
                                <div class="card-body pcard fondo_claro">
                                    <div class="row">
                                        <div class="col-auto">
                                
                                            <button id="close-image" type="button" class="btn btn-outline-light" data-bs-toggle="modal" data-backdrop="false" data-bs-target="#modal${movie.id}">
                                                <div class="contenedorImagen"> 
                                                    <img class="iuthumb imgTarjeta" src="${serverUrl}poster/${movie.imdb}"/>
                                                </div> 
                                            </button>

                                            <!-- Modal -->
                                            <div class="modal modalPrincipal" id="modal${movie.id}" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                            <div class="modal-dialog">
                                                <div class="modal-content">
                                                <div class="modal-header">
                                                    <h4 class="modal-title" id="staticBackdropLabel">${movie.name} <small><i>(${movie.year})</i></small></h4>
                                                </div>
                                                <div class="modal-body">
                                                <div class="col">
                                                
                                               <div class="col-auto divImgModal">
                                                    <img class="iuthumb imgModal" src="${serverUrl}poster/${movie.imdb}"/>
                                                </div>
                                                
                                                <div class="row-12">
                                                    Director: ${movie.director}
                                                </div>  
                                            
                                                <div class="row-12">
                                                    Actores: ${movie.actors} 
                                                </div>
                                                <div class="row-12">
                                                    Duración: ${movie.minutes} min
                                                </div>
                                  
                                                <div class="row-12">
                                                    Valoración: ${ratings}
                                                </div>
                                           
                                                <div class="iucontrol movie">
                                                    <button class="rm" data-bs-toggle="modal" data-id="${movie.id}">🗑️</button>
                                                    <button class="edit" data-bs-toggle="modal" data-id="${movie.id}">✏️</button>
                                                    <button class="rate" data-bs-toggle="modal" data-id="${movie.id}">⭐</button>
                                                </div>
                                            </div>
                                                </div>
                                                <div class="modal-footer">
                                                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                                </div>
                                                </div>
                                            </div>
                                            </div>                                          
                                            
                                        </div>
                                        
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            `
    return movieHtml;
}

function createGroupItem(group) {
    
    let allMembers = group.members.map((id) =>
        `<span class="badge bg-secondary">${Pmgr.resolve(id).username}</span>`
    ).join(" ");
    const waitingForGroup = r => r.status.toLowerCase() == Pmgr.RequestStatus.AWAITING_GROUP;
    let allPending = group.requests.map((id) => Pmgr.resolve(id)).map(r =>
        `<span class="badge bg-${waitingForGroup(r) ? "warning" : "info"}"
            title="Esperando aceptación de ${waitingForGroup(r) ? "grupo" : "usuario"}">
            ${Pmgr.resolve(r.user).username}</span>`

    ).join(" ");

    if (group.members.includes(userId)) {
        console.log("está!!!!");
    }

    console.log(userId);

    return `
    <div class="card">
    <div class="card-header fondo_azul">
        <h4 class="mb-0" title="${group.id}">
            <b class="pcard">${group.name}</b>
        </h4>
    </div>
    <div class="card-body pcard fondo_claro">
        <div class="row-sm-11">
            <span class="badge bg-primary">${Pmgr.resolve(group.owner).username}</span>
            ${allMembers}
            ${allPending}
        </div>
        <div class="row-sm-1 iucontrol group">
            <button class="rm" data-id="${group.id}">🗑️</button>
            <button class="edit" data-id="${group.id}">✏️</button>
        </div>
    </div>              
    </div>
    </div>
`;
}

function createUserItem(user) {
    let allGroups = user.groups.map((id) =>
        `<span class="badge bg-secondary">${Pmgr.resolve(id).name}</span>`
    ).join(" ");
    const waitingForGroup = r => r.status.toLowerCase() == Pmgr.RequestStatus.AWAITING_GROUP;
    let allPending = user.requests.map((id) => Pmgr.resolve(id)).map(r =>
        `<span class="badge bg-${waitingForGroup(r) ? "warning" : "info"}"
            title="Esperando aceptación de ${waitingForGroup(r) ? "grupo" : "usuario"}">
            ${Pmgr.resolve(r.group).name}</span>`
    ).join(" ");

    return `
    <div class="card">
    <div class="card-header fondo_azul">
        <h4 class="mb-0" title="${user.id}">
            <b class="pcard">${user.username}</b>
        </h4>
    </div>
    <div class="card-body pcard fondo_claro">
        <div class="row-sm-11">
            ${allGroups}
            ${allPending}
        <div>
        <div class="row-sm-1 iucontrol user">
            <button class="rm" data-id="${user.id}">🗑️</button>
            <button class="edit" data-id="${user.id}">✏️</button>
        </div>        
    </div>
    </div>
`;
}

/**
 * Usa valores de un formulario para añadir una película
 * @param {Element} formulario para con los valores a subir
 */
function nuevaPelicula(formulario) {
    const movie = new Pmgr.Movie(-1,
        formulario.querySelector('input[name="imdb"]').value,
        formulario.querySelector('input[name="name"]').value,
        formulario.querySelector('input[name="director"]').value,
        formulario.querySelector('input[name="actors"]').value,
        formulario.querySelector('input[name="year"]').value,
        formulario.querySelector('input[name="minutes"]').value);
    Pmgr.addMovie(movie).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        update();
    });
}

/**
 * Usa valores de un formulario para modificar una película
 * @param {Element} formulario para con los valores a subir
 */
function modificaPelicula(formulario) {
    const movie = new Pmgr.Movie(
        formulario.querySelector('input[name="id"]').value,
        formulario.querySelector('input[name="imdb"]').value,
        formulario.querySelector('input[name="name"]').value,
        formulario.querySelector('input[name="director"]').value,
        formulario.querySelector('input[name="actors"]').value,
        formulario.querySelector('input[name="year"]').value,
        formulario.querySelector('input[name="minutes"]').value)
    Pmgr.setMovie(movie).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        modalEditMovie.hide(); // oculta el formulario
        update();
    }).catch(e => console.log(e));
}

/**
 * Usa valores de un formulario para añadir un rating
 * @param {Element} formulario para con los valores a subir
 */
function nuevoRating(formulario) {
    const rating = new Pmgr.Rating(-1,
        formulario.querySelector('input[name="user"]').value,
        formulario.querySelector('input[name="movie"]').value,
        formulario.querySelector('input[name="rating"]:checked').value,
        formulario.querySelector('input[name="labels"]').value);
    Pmgr.addRating(rating).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        modalRateMovie.hide(); // oculta el formulario
        update();
    }).catch(e => console.log(e));
}

/**
 * Usa valores de un formulario para modificar un rating
 * @param {Element} formulario para con los valores a subir
 */
function modificaRating(formulario) {
    const rating = new Pmgr.Rating(
        formulario.querySelector('input[name="id"]').value,
        formulario.querySelector('input[name="user"]').value,
        formulario.querySelector('input[name="movie"]').value,
        formulario.querySelector('input[name="rating"]:checked').value,
        formulario.querySelector('input[name="labels"]').value);
    Pmgr.setRating(rating).then(() => {
        formulario.reset() // limpia el formulario si todo OK
        modalRateMovie.hide(); // oculta el formulario
        update();
    }).catch(e => console.log(e));
}

/**
 * Usa valores de un formulario para añadir una película
 * @param {Element} formulario para con los valores a subir
 */
function generaPelicula(formulario) {
    const movie = Pmgr.Util.randomMovie();
    for (let [k, v] of Object.entries(movie)) {
        const input = formulario.querySelector(`input[name="${k}"]`);
        if (input) input.value = v;
    }
}

/**
 * En un div que contenga un campo de texto de búsqueda
 * y un select, rellena el select con el resultado de la
 * funcion actualizaElementos (que debe generar options), y hace que
 * cualquier búsqueda filtre los options visibles.
 */
// let oldHandler = false;
/**
 * Comportamiento de filtrado dinámico para un select-con-busqueda.
 * 
 * Cada vez que se modifica la búsqueda, se refresca el select para mostrar sólo 
 * aquellos elementos que contienen lo que está escrito en la búsqueda
 * 
 * @param {string} div selector que devuelve el div sobre el que operar
 * @param {Function} actualiza el contenido del select correspondiente
 */
/* function activaBusquedaDropdown(div, actualiza) {
    let search = document.querySelector(`${div} input[type=search]`);
    let select = document.querySelector(`${div} select`);

    // vacia el select, lo llena con elementos validos
    actualiza(`${div} select`);

    // manejador
    const handler = () => {
        let w = search.value.trim().toLowerCase();
        let items = document.querySelectorAll(`${div} select>option`);

        // filtrado; poner o.style.display = '' muestra, = 'none' oculta
        items.forEach(o =>
            o.style.display = (o.innerText.toLowerCase().indexOf(w) > -1) ? '' : 'none');

        // muestra un array JS con los seleccionados
        console.log("Seleccionados:", select.value);
    };

    // filtrado dinámico
    if (oldHandler) {
        search.removeEventListener('input', handler);
    }
    oldHandler = search.addEventListener('input', handler);
} */

//
// Función que refresca toda la interfaz. Debería llamarse tras cada operación
// por ejemplo, Pmgr.addGroup({"name": "nuevoGrupo"}).then(update); // <--
//
function update() {
    const appendTo = (sel, html) =>
        document.querySelector(sel).insertAdjacentHTML("beforeend", html);
    const empty = (sel) => {
        const destino = document.querySelector(sel);
        while (destino.firstChild) {
            destino.removeChild(destino.firstChild);
        }
    }
    try {
        // vaciamos los contenedores
        empty("#movies");
        empty("#groups");
        empty("#users");




        // y los volvemos a rellenar con su nuevo contenido
        Pmgr.state.movies.forEach(o => appendTo("#movies", createMovieItem(o)));
        Pmgr.state.groups.forEach(o => appendTo("#groups", createGroupItem(o)));
        Pmgr.state.users.forEach(o => appendTo("#users", createUserItem(o)));

        // y añadimos manejadores para los eventos de los elementos recién creados
        // botones de borrar películas
        document.querySelectorAll(".iucontrol.movie button.rm").forEach(b =>
            b.addEventListener('click', e => {
                const id = e.target.dataset.id; // lee el valor del atributo data-id del boton
                Pmgr.rmMovie(id).then(update);
            }));
        // botones de editar películas
        document.querySelectorAll(".iucontrol.movie button.edit").forEach(b =>
            b.addEventListener('click', e => {
                const id = e.target.dataset.id; // lee el valor del atributo data-id del boton
                const movie = Pmgr.resolve(id);
                const formulario = document.querySelector("#movieEditForm");
                for (let [k, v] of Object.entries(movie)) {
                    // rellenamos el formulario con los valores actuales
                    const input = formulario.querySelector(`input[name="${k}"]`);
                    if (input) input.value = v;
                }
                modalEditMovie.show(); // ya podemos mostrar el formulario
            }));
        // botones de evaluar películas
        document.querySelectorAll(".iucontrol.movie button.rate").forEach(b =>
            b.addEventListener('click', e => {
                const id = e.target.dataset.id; // lee el valor del atributo data-id del boton
                const formulario = document.querySelector("#movieRateForm");
                const prev = Pmgr.state.ratings.find(r => r.movie == id && r.user == userId);
                if (prev) {
                    // viejo: copia valores
                    formulario.querySelector("input[name=id]").value = prev.id;
                    const input = formulario.querySelector(`input[value="${prev.rating}"]`);
                    if (input) {
                        input.checked;
                    }
                    // lanza un envento para que se pinten las estrellitas correctas
                    // see https://stackoverflow.com/a/2856602/15472
                    if ("createEvent" in document) {
                        const evt = document.createEvent("HTMLEvents");
                        evt.initEvent("change", false, true);
                        input.dispatchEvent(evt);
                    } else {
                        input.fireEvent("onchange");
                    }
                    formulario.querySelector("input[name=labels]").value = prev.labels;
                } else {
                    // nuevo
                    formulario.reset();
                    formulario.querySelector("input[name=id]").value = -1;
                }
                formulario.querySelector("input[name=movie]").value = id;
                formulario.querySelector("input[name=user]").value = userId;
                modalRateMovie.show(); // ya podemos mostrar el formulario
            }));
        // botones de borrar grupos
        document.querySelectorAll(".iucontrol.group button.rm").forEach(b =>
            b.addEventListener('click', e => Pmgr.rmGroup(e.target.dataset.id).then(update)));
        // botones de borrar usuarios
        document.querySelectorAll(".iucontrol.user button.rm").forEach(b =>
            b.addEventListener('click', e => Pmgr.rmUser(e.target.dataset.id).then(update)));


    } catch (e) {
        console.log('Error actualizando', e);
    }

    /* para que siempre muestre los últimos elementos disponibles */
/*     activaBusquedaDropdown('#dropdownBuscablePelis',
        (select) => {
            empty(select);
            Pmgr.state.movies.forEach(m =>
                appendTo(select, `<option value="${m.id}">${m.name}</option>`));
        }
    ); */
}

//
// PARTE 2:
// Código de pegamento, ejecutado sólo una vez que la interfaz esté cargada.
//

// modales, para poder abrirlos y cerrarlos desde código JS
const modalEditMovie = new bootstrap.Modal(document.querySelector('#movieEdit'));
const modalRateMovie = new bootstrap.Modal(document.querySelector('#movieRate'));

// si lanzas un servidor en local, usa http://localhost:8080/
const serverUrl = "http://gin.fdi.ucm.es/iu/";

Pmgr.connect(serverUrl + "api/");

// guarda el ID que usaste para hacer login en userId
let userId = -1;
const login = (username, password) => {
    Pmgr.login(username, password)
        .then(d => {
            console.log("login ok!", d);
            update(d);
            userId = Pmgr.state.users.find(u =>
                u.username == username).id;
            
        })
        .catch(e => {
            console.log(e, `error ${e.status} en login (revisa la URL: ${e.url}, y verifica que está vivo)`);
            console.log(`el servidor dice: "${e.text}"`);
        });
}

// -- IMPORTANTE --
login("g8", "q8wbx"); // <-- tu nombre de usuario y password aquí
//   y puedes re-logearte como alguien distinto desde la consola
//   llamando a login() con otro usuario y contraseña

{
    /** 
     * Asocia comportamientos al formulario de añadir películas 
     * en un bloque separado para que las constantes y variables no salgan de aquí, 
     * manteniendo limpio el espacio de nombres del fichero
     */
    const f = document.querySelector("#modalAddMovie form");
    // botón de enviar
    document.querySelector("#buttonAddMovieModal").addEventListener('click', (e) => {
        if (f.checkValidity()) {
            e.preventDefault(); // evita que se haga lo normal cuando no hay errores
            nuevaPelicula(f); // añade la pelicula según los campos previamente validados

            //falta cerrar el modal cuando se guarda la pelicula (al hacer click en Guardar)
            //tampoco salta el mensaje de error al no poner todos los datos ??
        }
    });
    // botón de generar datos (sólo para pruebas)
    document.querySelector("#buttonGenerateMovie").addEventListener('click',
        (e) => generaPelicula(f)); // aquí no hace falta hacer nada raro con el evento
        //boton de cerrar modal de Añadir películas (limpiamos formulario al cerrar)
    document.querySelector("#buttonCloseAddMovie").addEventListener('click', (e) => {
        f.querySelector("input[name=name]").value = "";
        f.querySelector("input[name=imdb]").value = "";
        f.querySelector("input[name=director]").value = "";
        f.querySelector("input[name=actors]").value = "";
        f.querySelector("input[name=year]").value = "";
        f.querySelector("input[name=minutes]").value = "";
    });
} {
    /**
     * formulario para modificar películas
     */
    const f = document.querySelector("#movieEditForm");
    // botón de enviar
    document.querySelector("#movieEdit button.edit").addEventListener('click', e => {
        console.log("enviando formulario!");
        if (f.checkValidity()) {
            modificaPelicula(f); // modifica la pelicula según los campos previamente validados
        } else {
            e.preventDefault();
            f.querySelector("button[type=submit]").click(); // fuerza validacion local
        }
    });
} {
    /**
     * formulario para evaluar películas; usa el mismo modal para añadir y para editar
     */
    const f = document.querySelector("#movieRateForm");
    // botón de enviar
    document.querySelector("#movieRate button.edit").addEventListener('click', e => {
        console.log("enviando formulario!");
        if (f.checkValidity()) {
            if (f.querySelector("input[name=id]").value == -1) {
                nuevoRating(f);
            } else {
                modificaRating(f); // modifica la evaluación según los campos previamente validados
            }
        } else {
            e.preventDefault();
            f.querySelector("button[type=submit]").click(); // fuerza validacion local
        }
    });
    // activa rating con estrellitas
    stars("#movieRateForm .estrellitas");
    stars("#filterSearchForm .estrellitas");
} {
    /**
     * formulario para buscar por filtros.
     */

    const f = document.querySelector("#filterSearchForm");

    document.querySelector("#buttonFilterSearch").addEventListener('click', e => {
        console.log("enviando formulario de busqueda por filtros");
        if (f.checkValidity()) {
            var title = f.querySelector("input[name=name]").value.toLowerCase();

            var imbd = f.querySelector("input[name=imdb]").value.toLowerCase();

            var director = f.querySelector("input[name=director]").value.toLowerCase();

            var actors = f.querySelector("input[name=actors]").value.toLowerCase();

            var year = f.querySelector("input[name=year]").value.toLowerCase();

            var minutes = f.querySelector("input[name=minutes]").value.toLowerCase();

            var estrellas = -2;
            var hayEstrellas = false;
            if (f.querySelector('input[name="rating"]:checked') !== null) {
                hayEstrellas = true;
                estrellas = f.querySelector('input[name="rating"]:checked').value; 
            }

            var tag = f.querySelector("input[name=tag]").value.toLowerCase();

            document.querySelectorAll("#movies div.card").forEach(c => {
                const m = Pmgr.resolve(c.dataset.id);

                const okTitle = m.name.toLowerCase().indexOf(title) >= 0;
                const okImbd = m.imdb.toLowerCase().indexOf(imbd) >= 0;
                const okDirector = m.director.toLowerCase().indexOf(director) >= 0;
                const okActors = m.actors.toLowerCase().indexOf(actors) >= 0;

               

                let okYear = true;
                if (year != "") {
                    okYear = m.year == year;  
                } //al ser un num y no un string tenemos que hacer esto

                let okMinutes = true;
                if (minutes != "") {
                    okMinutes = m.minutes == minutes;
                } //igual para minutos

                let okRating = false; //inicializamos
                if (hayEstrellas) { //si hay alguna estrella seleccionada tenemos que quitar los que no tienen ese rate 
                    m.ratings.forEach(r => {  
                        if (estrellas == Pmgr.resolve(r).rating) { //si la película tiene algun rate igual al seleccionado
                            okRating = true; //no quitamos la pelicula
                        } 
                    })

                } else {
                    okRating = true; //si no hay rating seleccionado se dejan todas
                }

                let okTag = false;
                if (tag != "") {
                    m.ratings.forEach(t => {
                        
                        if (Pmgr.resolve(t).labels.indexOf(tag) >= 0) {
                            okTag = true;
                        }
                    })
                } else {
                    okTag = true;
                }

                
                c.parentNode.style.display = okTitle && okImbd && okDirector && okActors && okYear && okMinutes && okRating && okTag ? '' : 'none';
                //falta cerrar el modal cuando se busca por filtros (al hacer click en Buscar)
           })
        } else {
            e.preventDefault();
            f.querySelector("button[type=submit]").click(); // fuerza validacion local
        }


    });

    document.querySelector("#buttonRestaurar").addEventListener('click', e => {
        f.querySelector("input[name=name]").value = "";
        f.querySelector("input[name=imdb]").value = "";
        f.querySelector("input[name=director]").value = "";
        f.querySelector("input[name=actors]").value = "";
        f.querySelector("input[name=year]").value = "";
        f.querySelector("input[name=minutes]").value = "";
        f.querySelector("button[type=submit]").click();
    }); //restaura los campos de la busqueda por filtros
}

/**
 * búsqueda básica de películas, por título
 */
document.querySelector("#movieSearch").addEventListener("input", e => {
    const v = e.target.value.toLowerCase();
    document.querySelectorAll("#movies div.card").forEach(c => {
        const m = Pmgr.resolve(c.dataset.id);
        // aquí podrías aplicar muchos más criterios
        const ok = m.name.toLowerCase().indexOf(v) >= 0;
        c.parentNode.style.display = ok ? '' : 'none'; //display none en div de columna para que se agrupen.
    });
})


// cosas que exponemos para poder usarlas desde la consola
window.modalEditMovie = modalEditMovie;
window.modalRateMovie = modalRateMovie;
window.update = update;
window.login = login;
window.userId = userId;
window.Pmgr = Pmgr;

// ejecuta Pmgr.populate() en una consola para generar datos de prueba en servidor
// ojo - hace *muchas* llamadas a la API (mira su cabecera para más detalles)
// Pmgr.populate();

