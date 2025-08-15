let pageCount = 1; // Contador de páginas
const linesPerPage = 24; // Número de líneas en la hoja 1
const linesPerPage2 = 26; // Número de líneas en la hoja 1
let selectedImage = null; // Variable para almacenar la imagen seleccionada
let actionHistory = []; // Historial de acciones para deshacer
// Llamar a esta función al cargar la página y al abrir ventanas emergentes
inicializarTooltips();
mostrarFecha();

//Funcion para mostrar la fecha
function mostrarFecha() {
    const fecha = new Date();
    const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    document.getElementById('fecha').textContent = fechaFormateada;
}


// Función para agregar líneas a la hoja 1
function fillSheetWithLines(sheetId) {
    const content = document.getElementById(`content${sheetId}`);
    for (let i = 0; i < linesPerPage; i++) {
        const line = document.createElement("div");
        line.className = "line";
        line.contentEditable = true;
        line.textContent = "_____________";
        //line.style.color = "blue"

        // Evento para manejar la entrada de texto
        line.addEventListener("focus", () => {
            if (line.textContent.trim() === "_____________") {
                line.textContent = ""; // Limpiar la línea al enfocarla
                line.style.color = "black"
            }
        });


        line.addEventListener("blur", () => {
            if (line.textContent.trim() === "") {
                line.textContent = "_____________"; // Restaurar la línea si está vacía
                line.style.color = "white"
            }
        });

        // Detectar cuando el texto alcanza el borde de la línea
        line.addEventListener("input", (e) => {
            checkLineOverflow(e.target, content);
        });

        // Detectar la tecla Enter y mover a la siguiente línea
        line.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                moveToNextLineOnEnter(e.target);
            }
        });

        content.appendChild(line);
    }
}

// Llenar la hoja inicial con líneas
fillSheetWithLines(1);

// Función para agregar líneas a la hoja 2 en adelante
function fillSheetWithLines2(sheetId) {
    const content = document.getElementById(`content${sheetId}`);
    for (let i = 0; i < linesPerPage2; i++) {
        const line = document.createElement("div");
        line.className = "line";
        line.contentEditable = true;
        line.textContent = "_____________";

        // Evento para manejar la entrada de texto
        line.addEventListener("focus", () => {
            if (line.textContent.trim() === "_____________") {
                line.textContent = ""; // Limpiar la línea al enfocarla
                line.style.color = "black"
            }
        });

        line.addEventListener("blur", () => {
            if (line.textContent.trim() === "") {
                line.textContent = "_____________"; // Restaurar la línea si está vacía
                line.style.color = "white"
            }
        });

        // Detectar cuando el texto alcanza el borde de la línea
        line.addEventListener("input", (e) => {
            checkLineOverflow(e.target, content);
        });

        // Detectar la tecla Enter y mover a la siguiente línea
        line.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                moveToNextLineOnEnter(e.target);
            }
        });

        content.appendChild(line);
    }
}

// Función para verificar si el texto ha llegado al final de la línea
function checkLineOverflow(currentLine, content) {
    const parentWidth = currentLine.parentElement.clientWidth; // Ancho del contenedor
    const textWidth = getTextWidth(currentLine.textContent, window.getComputedStyle(currentLine).font); // Ancho del texto

    // Si el ancho del texto es mayor o igual al ancho del contenedor, pasamos a la siguiente línea
    if (textWidth >= parentWidth - 20) { // -10 para margen de seguridad
        const nextLine = currentLine.nextElementSibling;
        if (nextLine && nextLine.classList.contains("line")) {
            nextLine.focus();
            //nextLine.textContent = ""; // Limpiar el texto inicial de la siguiente línea
        }
    }
}

// Función para calcular el ancho del texto en píxeles
function getTextWidth(text, font) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
}

// Función para moverse a la siguiente línea al presionar Enter
function moveToNextLineOnEnter(currentLine) {
    const nextLine = currentLine.nextElementSibling;
    if (nextLine && nextLine.classList.contains("line")) {
        nextLine.focus();
        /*nextLine.textContent = ""; // Limpiar el texto inicial de la siguiente línea*/
    }
}

// Identificar la hoja activa
let activeSheetId = "content1"; // Por defecto, la primera hoja es la activa

// Asignar un evento a cada hoja para detectar clics
function initializeSheetClickEvents() {
    const sheets = document.querySelectorAll(".sheet .content");
    sheets.forEach(sheet => {
        sheet.addEventListener("click", function () {
            activeSheetId = this.id; // Actualizar la hoja activa
        });
    });
}

// Llamar a esta función al cargar la página
initializeSheetClickEvents();

function addSheet() {
    pageCount++; // Incrementa el contador de páginas
    const fecha = new Date();
    const opciones = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    datehoy = fechaFormateada;

    const newSheet = document.createElement("div");
    newSheet.className = "sheet";
    newSheet.id = `sheet${pageCount}`;

    newSheet.innerHTML = `
        <div class="content" id="content${pageCount}">
            <!-- Las líneas se añadirán aquí -->
        </div>
        <div class="footer">
            Hoja ${pageCount}
        </div>
        <div class="footer2">
            <p id="fecha">${datehoy}</p>
        </div>
    `;

    document.querySelector(".sheet-container").appendChild(newSheet);
    fillSheetWithLines2(pageCount); // Llenar automáticamente las líneas

    initializeSheetClickEvents(); // Asegurarse de que la nueva hoja también detecte clics
}


// Función para eliminar la última hoja
function removeLastSheet() {
    if (pageCount > 1) {
        // Mostrar el modal de confirmación
        const modal = document.getElementById("confirmModal");
        const pageNumber = document.getElementById("pageNumber");
        pageNumber.textContent = pageCount; // Mostrar el número de la página a eliminar
        modal.style.display = "flex"; // Hacer visible el modal

        // Función cuando se hace clic en "Sí"
        document.getElementById("confirmYes").onclick = function () {
            const lastSheet = document.getElementById(`sheet${pageCount}`);
            lastSheet.remove();
            pageCount--;
            modal.style.display = "none"; // Ocultar el modal después de eliminar
        };

        // Función cuando se hace clic en "No"
        document.getElementById("confirmNo").onclick = function () {
            modal.style.display = "none"; // Ocultar el modal sin hacer nada
        };
    } else {
        alert("No se puede eliminar la primera hoja.");
    }
}



// Función para cambiar el color del texto seleccionado o del título y autor
function changeTextColor(color) {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor
    const checkbox = document.getElementById('miCheckbox');


    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo


        if (checkbox.checked) {
            span.style.color = color; // Establecer el color del texto seleccionado
            span.style.fontWeight = "bold";
            span.style.fontStyle = "italic";
            span.style.fontSize = 18 + "px";
        } else {
            span.style.color = color; // Establecer el color del texto seleccionado
        }
        range.surroundContents(span); // Rodear el texto seleccionado con el span con el color aplicado
    }
    // Si el título está activo (es el elemento que tiene el foco)
    else if (title === document.activeElement) {
        title.style.color = color; // Establecer el color del texto seleccionado

    }
    // Si el autor está activo (es el elemento que tiene el foco)
    else if (author === document.activeElement) {
        author.style.color = color; // Cambiar el color del autor
    }
}

function changeTextColorNormal(black) {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor

    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo
        span.style.color = black; // Establecer el color del texto seleccionado
        span.style.fontWeight = "normal";
        span.style.fontStyle = "normal";
        span.style.fontSize = 25 + "px";
        range.surroundContents(span); // Rodear el texto seleccionado con el span con el color aplicado
    }

}


function Subrayado() {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor

    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar o quitar el subrayado

        // Verificar si el texto seleccionado ya está subrayado
        const parentNode = selection.anchorNode.parentNode;
        if (parentNode.tagName === "SPAN" && parentNode.style.textDecoration === "underline") {
            // Si ya está subrayado, eliminar el subrayado quitando el span
            const textContent = parentNode.textContent; // Obtener el contenido de texto
            parentNode.replaceWith(document.createTextNode(textContent)); // Reemplazar el span por el texto puro
        } else {
            // Si no está subrayado, aplicarlo
            span.style.textDecoration = "underline"; // Aplicar subrayado
            range.surroundContents(span); // Rodear el texto seleccionado con el span
        }
    }
    // Si el título está activo (es el elemento que tiene el foco)
    else if (title === document.activeElement) {
        title.style.textDecoration = title.style.textDecoration === "underline" ? "none" : "underline";
    }
    // Si el autor está activo (es el elemento que tiene el foco)
    else if (author === document.activeElement) {
        author.style.textDecoration = author.style.textDecoration === "underline" ? "none" : "underline";
    }
}

function Negrita() {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor

    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const parentElement = selection.anchorNode.parentElement; // Obtener el elemento padre del texto seleccionado

        // Si ya está en negrita, quitar el formato
        if (parentElement && parentElement.tagName === "SPAN" && parentElement.style.fontWeight === "bold") {
            parentElement.style.fontWeight = "normal"; // Quitar negrita
        } else {
            const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo
            span.style.fontWeight = "bold"; // Aplicar negrita
            range.surroundContents(span); // Rodear el texto seleccionado con el span
        }
    }
    // Si el título está activo (es el elemento que tiene el foco)
    else if (title === document.activeElement) {
        // Alternar entre negrita y normal para todo el texto del título
        title.style.fontWeight = title.style.fontWeight === "bold" ? "normal" : "bold";
    }
    // Si el autor está activo (es el elemento que tiene el foco)
    else if (author === document.activeElement) {
        // Alternar entre negrita y normal para todo el texto del autor
        author.style.fontWeight = author.style.fontWeight === "bold" ? "normal" : "bold";
    }
}

function Cursiva() {
    const selection = window.getSelection(); // Obtener la selección del texto
    const title = document.getElementById("title"); // Obtener el título
    const author = document.getElementById("author"); // Obtener el autor

    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo

        // Verificar si el texto seleccionado ya está dentro de un elemento cursivo
        const parentNode = range.commonAncestorContainer.parentNode;

        if (parentNode.tagName === "SPAN" && parentNode.style.fontStyle === "italic") {
            // Si ya está en cursiva, quitar el span y devolver el texto a su estado original
            const textContent = parentNode.textContent;
            parentNode.replaceWith(document.createTextNode(textContent));
        } else {
            // Si no está en cursiva, aplicarle el estilo cursivo
            span.style.fontStyle = "italic";
            range.surroundContents(span); // Rodear el texto seleccionado con el span
        }
    }
    // Si el título está activo (es el elemento que tiene el foco)
    else if (title === document.activeElement) {
        // Alternar la cursiva en el título
        title.style.fontStyle = title.style.fontStyle === "italic" ? "normal" : "italic";
    }
    // Si el autor está activo (es el elemento que tiene el foco)
    else if (author === document.activeElement) {
        // Alternar la cursiva en el autor
        author.style.fontStyle = author.style.fontStyle === "italic" ? "normal" : "italic";
    }
}

function aumentarTamanoTexto() {
    const selection = window.getSelection(); // Obtener la selección del texto
    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo
        span.style.fontSize = `25px`;
        range.surroundContents(span); // Rodear el texto seleccionado con el span
    }
}


// Función para disminuir el tamaño del texto seleccionado
function disminuirTamanoTexto() {
    const selection = window.getSelection(); // Obtener la selección del texto
    // Si hay texto seleccionado
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0); // Obtener el rango de la selección
        const span = document.createElement("span"); // Crear un elemento span para aplicar el estilo
        span.style.fontSize = `20px`;
        range.surroundContents(span); // Rodear el texto seleccionado con el span
    }
}


/**Validar Cantidad/ */
function validarCantidad(cantidad, min = 1, max = 15) {
    if (isNaN(cantidad) || cantidad < min || cantidad > max) {
        alert(`Por favor ingresa un número entre ${min} y ${max}`);
        return false; // Indica que la validación falló
    }
    return true; // Indica que la validación pasó
}

function addImageSegma() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Segno.png';
        img.classList.add('image');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);
        
        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addImageCoda() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Coda.png';
        img.classList.add('image');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);
        
        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}


function InicioRepeticion() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Si no es número, usa 1 por defecto

    // Validación básica
    if (!validarCantidad(cantidad)) return; // Detiene la función si falla


    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles
    const imgHeight = 150; // Altura de la imagen (ajusta según necesites)

    // Crear N imágenes
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/InicioRep.png';
        img.classList.add('image_Rep');

        // Posición: derecha con margen y centrado vertical
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - imgHeight) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Guardar en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Selección al hacer clic
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}

function FinRepeticion() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Si no es número, usa 1 por defecto

    // Validación básica
    if (!validarCantidad(cantidad)) return; // Detiene la función si falla

    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles
    const imgHeight = 150; // Altura de la imagen

    // Crear N imágenes
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/FinRep.png';
        img.classList.add('image_Rep');

        // Posición: derecha con margen y centrado vertical
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - imgHeight) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Guardar en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Selección al hacer clic
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}

function addParadaRaya() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Si no es número, usa 1 por defecto

    // Validación básica
    if (!validarCantidad(cantidad)) return; // Detiene la función si falla

    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)
    const imgHeight = 150; // Altura de la imagen

    // Crear N imágenes
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/paradaRaya.png';
        img.classList.add('image_ParadaRaya');

        // Posición: derecha con margen y centrado vertical
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - imgHeight) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Guardar en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Selección al hacer clic
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}

function flechaArriba() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Si no es número, usa 1 por defecto

    // Validación básica
    if (!validarCantidad(cantidad)) return; // Detiene la función si falla

    const content = document.getElementById(activeSheetId); // Usar la hoja activa
    const marginRight = 0.5 * 37.795; // Convertir 0.5 cm a píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/flechaArriba.png';
        img.classList.add('image_flechaArriba');

        // Colocar la imagen en el centro del contenedor alineado a la derecha
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

        content.appendChild(img);
        makeImageDraggable(img);

        // Guardar la acción de agregar imagen en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Agregar evento de clic para seleccionar la imagen
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}


function flechaAbajo() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Si no es número, usa 1 por defecto

    // Validación básica
    if (!validarCantidad(cantidad)) return; // Detiene la función si falla

    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // Convertir 0.5 cm a píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/flechaAbajo.png';
        img.classList.add('image_flechaAbajo');

        // Posición original (todas las imágenes superpuestas)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Guardar en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Evento de clic
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}


function addGuion() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Si no es número, usa 1 por defecto

    // Validación básica
    if (!validarCantidad(cantidad)) return; // Detiene la función si falla

    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // Convertir 0.5 cm a píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/guion.png';
        img.classList.add('image_Guion');

        // Posición original (todas las imágenes superpuestas)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Guardar en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Evento de clic
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}

function addsalida1() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Si no es número, usa 1 por defecto

    // Validación básica
    if (!validarCantidad(cantidad)) return; // Detiene la función si falla

    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // Convertir 0.5 cm a píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/salida1.png';
        img.classList.add('image_salida');

        // Posición original (todas las imágenes superpuestas)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Guardar en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Evento de clic
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}

function addsalida2() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Si no es número, usa 1 por defecto

    // Validación básica
    if (!validarCantidad(cantidad)) return; // Detiene la función si falla

    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // Convertir 0.5 cm a píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/salida2.png';
        img.classList.add('image_salida');

        // Posición original (todas las imágenes superpuestas)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Guardar en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Evento de clic
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}


function addsalida3() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Default to 1 if not a number

    // Basic validation
    if (!validarCantidad(cantidad)) return; // Stop if validation fails

    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // Convert 0.5 cm to pixels (1 cm ≈ 37.795 px)

    // Create N images
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/salida3.png';
        img.classList.add('image_salida');

        // Original position (all images will overlap)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Save to action history
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Click event
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}

function addsalida4() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Default to 1 if invalid number

    // Validate quantity
    if (!validarCantidad(cantidad)) return;

    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm in pixels (1 cm ≈ 37.795 px)

    // Create multiple images
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/salida4.png';
        img.classList.add('image_salida');

        // Position at right with margin, vertically centered
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Add to action history
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Click event for selection
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}

function addsalida5() {
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1; // Default to 1 if invalid input

    // Validate quantity
    if (!validarCantidad(cantidad)) return;

    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm to pixels conversion

    // Create multiple images based on quantity
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/salida5.png';
        img.classList.add('image_salida');

        // Position at right with margin, vertically centered (all images overlap)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        content.appendChild(img);
        makeImageDraggable(img);

        // Track in action history
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Click selection handler
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}


function addRayaLarga() {
    // Obtener el valor de cantidad del input (valor por defecto: 1)
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1;

    // Validar la cantidad (si falla, se detiene la función)
    if (!validarCantidad(cantidad)) return;

    // Obtener el contenedor activo
    const content = document.getElementById(activeSheetId);

    // Convertir 5 cm a píxeles (margen derecho más grande para esta raya larga)
    const marginRight = 5 * 37.795; // 1 cm ≈ 37.795 px

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Crear elemento de imagen
        const img = document.createElement('img');
        img.src = './Imagenes/rayaLarga.png'; // Ruta de la imagen
        img.classList.add('image_rayaLarga'); // Clase CSS específica

        // Posicionamiento:
        // - Alineado a la derecha con margen de 5cm
        // - Centrado verticalmente
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Agregar imagen al contenedor
        content.appendChild(img);

        // Hacer la imagen arrastrable
        makeImageDraggable(img);

        // Registrar en el historial de acciones
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Evento para seleccionar la imagen al hacer clic
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar eventos no deseados
            selectImage(img);
        });
    }

    // Cerrar el modal después de agregar las imágenes
    cerrarVentanaSimbolos();
}


function addVertical() {
    // Obtener el valor del campo de cantidad (valor por defecto: 1)
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1;

    // Validar la cantidad ingresada
    if (!validarCantidad(cantidad)) return;

    // Obtener el contenedor principal (hoja activa)
    const content = document.getElementById(activeSheetId);

    // Convertir 5 cm a píxeles (margen derecho más grande)
    const marginRight = 5 * 37.795; // 1 cm ≈ 37.795 px

    // Crear tantas imágenes como indique la cantidad
    for (let i = 0; i < cantidad; i++) {
        // Crear elemento de imagen
        const img = document.createElement('img');
        img.src = './Imagenes/rayaVertical.png'; // Ruta de la imagen vertical
        img.classList.add('image_rayaVertical'); // Clase CSS específica

        // Posicionamiento:
        // - Alineado a la derecha con margen de 5cm
        // - Centrado verticalmente en el contenedor
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Agregar la imagen al contenedor
        content.appendChild(img);

        // Hacer la imagen arrastrable
        makeImageDraggable(img);

        // Registrar la acción en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Configurar evento de clic para seleccionar
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir eventos no deseados
            selectImage(img);
        });
    }

    // Cerrar la ventana de símbolos al terminar
    cerrarVentanaSimbolos();
}


function addI() {
    // Obtener el valor del input de cantidad (valor por defecto: 1)
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1;

    // Validar la cantidad ingresada
    if (!validarCantidad(cantidad)) return;

    // Obtener el contenedor principal (hoja activa)
    const content = document.getElementById(activeSheetId);

    // Convertir 0.5 cm a píxeles (1 cm ≈ 37.795 px)
    const marginRight = 0.5 * 37.795;

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Crear elemento de imagen
        const img = document.createElement('img');
        img.src = './Imagenes/I.png'; // Ruta de la imagen
        img.classList.add('image_I'); // Clase CSS específica

        // Posicionamiento:
        // - Alineado a la derecha con margen de 0.5cm
        // - Centrado verticalmente
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Agregar la imagen al contenedor
        content.appendChild(img);

        // Hacer la imagen arrastrable
        makeImageDraggable(img);

        // Registrar la acción en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Configurar evento de clic para seleccionar
        img.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevenir eventos no deseados
            selectImage(img);
        });
    }

    // Cerrar la ventana de símbolos al terminar
    cerrarVentanaSimbolos();
}

function addII() {
    // Obtener el valor del campo cantidad (con valor por defecto 1)
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1;

    // Validar la cantidad ingresada
    if (!validarCantidad(cantidad)) return;

    // Obtener el contenedor principal
    const content = document.getElementById(activeSheetId);

    // Convertir 0.5 cm a píxeles (1 cm ≈ 37.795 px)
    const marginRight = 0.5 * 37.795;

    // Crear múltiples imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Crear elemento de imagen
        const img = document.createElement('img');
        img.src = './Imagenes/II.png'; // Ruta de la imagen
        img.classList.add('image_II'); // Clase CSS específica

        // Posicionamiento (igual que en la versión original):
        // - Margen derecho de 0.5 cm
        // - Centrado vertical
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Agregar al DOM
        content.appendChild(img);

        // Hacer arrastrable
        makeImageDraggable(img);

        // Registrar en el historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Evento para selección al hacer clic
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cerrar el modal al finalizar
    cerrarVentanaSimbolos();
}


function addIII() {
    // Obtener y validar la cantidad del input
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración inicial
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles

    // Crear múltiples imágenes según la cantidad
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/III.png';
        img.classList.add('image_III');

        // Posicionamiento idéntico al original
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}

function addIV() {
    // Obtener el valor del input cantidad (valor por defecto 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;

    // Validar la cantidad
    if (!validarCantidad(cantidad)) return;

    // Configuración base
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/IV.png';
        img.classList.add('image_IV');

        // Posicionamiento original (derecha con margen, centrado vertical)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Añadir al DOM y funcionalidades
        content.appendChild(img);
        makeImageDraggable(img);

        // Registrar en historial
        actionHistory.push({
            action: 'add',
            element: img
        });

        // Evento de selección
        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cerrar modal
    cerrarVentanaSimbolos();
}

function addV() {
    // Obtener y validar la cantidad del input
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración base
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles

    // Crear N imágenes según la cantidad
    for (let i = 0; i < cantidad; i++) {
        const img = document.createElement('img');
        img.src = './Imagenes/V.png';
        img.classList.add('image_V');

        // Posicionamiento idéntico al original
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Añadir funcionalidades originales
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    cerrarVentanaSimbolos();
}
//********************************************************************************************************************* */

function addRedonda() {
    // Obtener el valor del input cantidad (valor por defecto 1 si no es número)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;

    // Validar la cantidad usando la función existente
    if (!validarCantidad(cantidad)) return;

    // Obtener el contenedor principal (hoja activa)
    const content = document.getElementById(activeSheetId);

    // Convertir 0.5 cm a píxeles (1 cm ≈ 37.795 px)
    const marginRight = 0.5 * 37.795;

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Crear elemento de imagen (igual que en el original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio1.png';
        img.classList.add('image_Redonda');

        // Posicionamiento (igual que en el original)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales:
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cerrar el modal (igual que en el original)
    cerrarVentanaSimbolos();
}

function addBlanca() {
    // Obtener la cantidad del input (valor por defecto 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;

    // Validar la cantidad
    if (!validarCantidad(cantidad)) return;

    // Configuración original
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles

    // Crear las imágenes según la cantidad
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (igual que original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio2.png';
        img.classList.add('image_Blanca');

        // Posicionamiento original
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (original)
    cerrarVentanaSimbolos();
}

function addNegra() {
    // Obtener la cantidad del input (valor por defecto 1 si no es válido)
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1;

    // Validar la cantidad usando la función existente
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio3.png';
        img.classList.add('image_Negra');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addCorchea() {
    // Obtener y validar la cantidad del input
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración base (sin cambios)
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles

    // Crear N imágenes según la cantidad
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio4.png';
        img.classList.add('image_Corchea');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addSemicorchea() {
    // Obtener el valor del input cantidad (valor por defecto 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;

    // Validar la cantidad usando la función existente
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio5.png';
        img.classList.add('image_Semicorchea');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addFusa() {
    // Obtener y validar la cantidad del input
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración base (sin cambios)
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles

    // Crear N imágenes según la cantidad
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio6.png';
        img.classList.add('image_Fusa');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addSemifusa() {
    // Obtener el valor del input cantidad (valor por defecto 1 si no es válido)
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1;

    // Validar la cantidad usando la función existente
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio7.png';
        img.classList.add('image_SemiFusa');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}


function addSRedonda() {
    // Obtener y validar la cantidad del input
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original (sin cambios)
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles

    // Crear N imágenes según la cantidad
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (igual que original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio8.png';
        img.classList.add('image_SRedonda');

        // Posicionamiento original (sin cambios)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addSBlanca() {
    // Get and validate quantity input (default to 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Original configuration
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5cm in pixels

    // Create N images based on quantity
    for (let i = 0; i < cantidad; i++) {
        // Create image element (same as original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio9.png';
        img.classList.add('image_SBlanca');

        // Original positioning:
        // - Right-aligned with 0.5cm margin
        // - Vertically centered
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Original functionality:
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Close modal (same as original)
    cerrarVentanaSimbolos();
}

function addSNegra() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio10.png';
        img.classList.add('image_SNegra');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addSCorchea() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original (sin cambios)
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio11.png';
        img.classList.add('image_SCorchea');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addSSemicorchea() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio12.png';
        img.classList.add('image_SSemicorchea');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addSFusa() {
    // Get and validate quantity input (default to 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Original configuration
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5cm in pixels (1cm ≈ 37.795px)

    // Create N images based on quantity
    for (let i = 0; i < cantidad; i++) {
        // Create image element (same as original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio13.png';
        img.classList.add('image_SFusa');

        // Original positioning:
        // - Right-aligned with 0.5cm margin
        // - Vertically centered
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Original functionality:
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Close modal (same as original)
    cerrarVentanaSimbolos();
}
function addSSemifusa() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1;

    // Validar la cantidad usando la función existente
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Silencio14.png';
        img.classList.add('image_SSemiFusa');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addPuente() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidadInput = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadInput.value) || 1;

    // Validar la cantidad usando la función existente
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Puente.png';
        img.classList.add('image_Puente');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addFlecha1() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Flecha1.png';
        img.classList.add('image_Flecha1');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addFlecha2() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Flecha2.png';
        img.classList.add('image_Flecha2');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addFlecha3() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Flecha3.png';
        img.classList.add('image_Flecha3');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addPunto() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Punto.png';
        img.classList.add('image_Punto');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addBarrDoble() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/BarraDoble.png';
        img.classList.add('image_BarraDoble');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}


function addPuntoN() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/PuntoNegro.png';
        img.classList.add('image_Punto');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addBarrDobleN() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/BarraDobleNegra.png';
        img.classList.add('image_BarraDoble');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addParada2() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Parada2.png';
        img.classList.add('image_Parada2');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addParada3() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Parada3.png';
        img.classList.add('image_Parada3');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addParada4() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Parada4.png';
        img.classList.add('image_Parada4');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addParada5() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Parada5.png';
        img.classList.add('image_Parada5');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addSilencioC() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/silencioC.png';
        img.classList.add('image_silencio');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addSilencioL() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/silencioL.png';
        img.classList.add('image_silencio');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addLlamada() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/llamada.png';
        img.classList.add('image_Llamada');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}

function addC() {
    const img = document.createElement('img');
    img.src = './Imagenes/C.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas1');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addD() {
    const img = document.createElement('img');
    img.src = './Imagenes/D.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas1');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addE() {
    const img = document.createElement('img');
    img.src = './Imagenes/E.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas2');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addF() {
    const img = document.createElement('img');
    img.src = './Imagenes/F.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas2');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addG() {
    const img = document.createElement('img');
    img.src = './Imagenes/G.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas1');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addA() {
    const img = document.createElement('img');
    img.src = './Imagenes/A.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas1');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addB() {
    const img = document.createElement('img');
    img.src = './Imagenes/B.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas2');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addCm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Cm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addDm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Dm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addEm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Em.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addFm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Fm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addGm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Gm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addAm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Am.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addBm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Bm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addCs() {
    const img = document.createElement('img');
    img.src = './Imagenes/Cs.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addEb() {
    const img = document.createElement('img');
    img.src = './Imagenes/Eb.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas4');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addFs() {
    const img = document.createElement('img');
    img.src = './Imagenes/Fs.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addGs() {
    const img = document.createElement('img');
    img.src = './Imagenes/Gs.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas3');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addBb() {
    const img = document.createElement('img');
    img.src = './Imagenes/Bb.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas4');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addCsm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Csm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas5');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addEbm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Ebm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas5');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addFsm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Fsm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas5');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addGsm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Gsm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas5');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addBbm() {
    const img = document.createElement('img');
    img.src = './Imagenes/Bbm.png'; // URL de ejemplo, cambiar por la ruta de la imagen deseada
    img.classList.add('image_Notas5');

    const content = document.getElementById(activeSheetId); // Usar la hoja activa

    // Colocar la imagen en el centro del contenedor alineado a la derecha
    const marginRight = 0.5 * 37.795; // Convertir 5 cm a píxeles (1 cm ≈ 37.795 px)
    img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`; // Alinear a la derecha con margen
    img.style.top = `${(content.clientHeight - 150) / 2}px`; // Centrado verticalmente

    content.appendChild(img);
    makeImageDraggable(img);

    // Guardar la acción de agregar imagen en el historial
    actionHistory.push({
        action: 'add',
        element: img
    });

    // Agregar evento de clic para seleccionar la imagen
    img.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que se deseleccione al hacer clic en el contenedor
        selectImage(img);
    });
    cerrarVentanaNotas();
}

function addBis() {
    // Obtener y validar la cantidad del input (valor por defecto: 1)
    const cantidad = parseInt(document.getElementById('cantidad').value) || 1;
    if (!validarCantidad(cantidad)) return;

    // Configuración original sin cambios
    const content = document.getElementById(activeSheetId);
    const marginRight = 0.5 * 37.795; // 0.5 cm en píxeles (1 cm ≈ 37.795 px)

    // Crear N imágenes según la cantidad especificada
    for (let i = 0; i < cantidad; i++) {
        // Creación de imagen (idéntico al original)
        const img = document.createElement('img');
        img.src = './Imagenes/Bis.png';
        img.classList.add('image_Bis');

        // Posicionamiento original (sin modificaciones)
        img.style.left = `${content.clientWidth - img.offsetWidth - marginRight}px`;
        img.style.top = `${(content.clientHeight - 150) / 2}px`;

        // Funcionalidades originales (sin cambios)
        content.appendChild(img);
        makeImageDraggable(img);

        actionHistory.push({
            action: 'add',
            element: img
        });

        img.addEventListener('click', (e) => {
            e.stopPropagation();
            selectImage(img);
        });
    }

    // Cierre del modal (igual que original)
    cerrarVentanaSimbolos();
}


//Funcion para hacer la imagen arrastrable
function makeImageDraggable(img) {
    let offsetX = 0, offsetY = 0;

    img.addEventListener('mousedown', (e) => {
        const sheet = img.closest('.sheet'); // Contenedor de la hoja
        const sheetRect = sheet.getBoundingClientRect(); // Límites de la hoja

        offsetX = e.clientX - img.getBoundingClientRect().left;
        offsetY = e.clientY - img.getBoundingClientRect().top;

        function onMouseMove(event) {
            // Ajustar el margen derecho máximo
            const rightMargin = 10; // Por ejemplo, 20px de margen adicional
            const bottomMargin = 30; // Margen inferior, si lo deseas

            // Calcular la posición dentro de los límites
            const newLeft = Math.min(
                Math.max(event.clientX - sheetRect.left - offsetX, 0), // Mínimo 0 (borde izquierdo)
                sheetRect.width - img.offsetWidth - rightMargin // Máximo ancho menos ancho de la imagen menos margen derecho
            );

            const newTop = Math.min(
                Math.max(event.clientY - sheetRect.top - offsetY, 0), // Mínimo 0 (borde superior)
                sheetRect.height - img.offsetHeight - bottomMargin // Máximo altura menos altura de la imagen menos margen inferior
            );

            // Aplicar las posiciones calculadas
            img.style.left = `${newLeft}px`;
            img.style.top = `${newTop}px`;
        }

        function onMouseUp() {
            // Eliminar los eventos cuando se suelta el botón del mouse
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        e.preventDefault(); // Prevenir comportamientos no deseados
    });
}

// Función para seleccionar una imagen
function selectImage(img) {
    if (selectedImage && selectedImage !== img) {
        deselectImage(); // Deseleccionar la imagen previamente seleccionada
    }

    selectedImage = img;
    selectedImage.classList.add('selected');
}


// Escuchar el evento de tecla presionada para eliminar la imagen
document.addEventListener('keydown', (e) => {
    if (e.key === 'Delete' && selectedImage) {
        // Guardar la acción de eliminar imagen en el historial
        actionHistory.push({
            action: 'delete',
            element: selectedImage,
            position: { left: parseInt(selectedImage.style.left), top: parseInt(selectedImage.style.top) }
        });

        selectedImage.remove();
        selectedImage = null;
    }
});

// Función para deseleccionar una imagen
function deselectImage() {
    if (selectedImage) {
        selectedImage.classList.remove('selected'); // Quitar la clase 'selected'
        selectedImage = null; // Restablecer la variable a null
    }
}

//Deseleccionar la imagen al hacer clic fuera de cualquier imagen 
document.addEventListener('click', (event) => {
    if (selectedImage && !event.target.classList.contains('image')) {
        deselectImage(); // Deseleccionar la imagen si el clic fue fuera de una imagen
    }
});

// Función para deshacer la última imagen agregada
function removeLast() {
    if (actionHistory.length === 0) return;

    const lastAction = actionHistory.pop();

    switch (lastAction.action) {
        case 'add':
            // Deshacer agregar imagen
            lastAction.element.remove();
            break;
        case 'move':
            // Deshacer mover imagen
            lastAction.element.style.left = `${lastAction.previousPosition.left}px`;
            lastAction.element.style.top = `${lastAction.previousPosition.top}px`;
            break;
        case 'delete':
            // Deshacer eliminar imagen
            a4Sheet.appendChild(lastAction.element);
            lastAction.element.style.left = `${lastAction.position.left}px`;
            lastAction.element.style.top = `${lastAction.position.top}px`;
            break;
    }
}

/*
function exportAllSheets() {
    const sheets = document.querySelectorAll(".sheet"); // Seleccionar todas las hojas
    const firstTitleInput = document.querySelector("#sheet1 #title"); // Obtener el título de la primera hoja
    let baseFileName = firstTitleInput && firstTitleInput.value.trim() !== ""
        ? firstTitleInput.value.trim() // Usar el título de la primera hoja si no está vacío
        : "hoja"; // Usar "hoja" como nombre base si el título está vacío

    // Limpiar caracteres no válidos para nombres de archivo
    baseFileName = baseFileName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ _-]/g, "");

    sheets.forEach((sheet, index) => {
        const fileName = `${baseFileName}_${index + 1}`; // Agregar el número de página al nombre base

        domtoimage.toJpeg(sheet, { quality: 0.95 }) // Cambiar a JPG con calidad ajustable (0.95 es alta calidad)
            .then(function (dataUrl) {
                const link = document.createElement("a");
                link.download = `${fileName}.jpg`; // Nombre del archivo con extensión .jpg
                link.href = dataUrl;
                link.click();
            })
            .catch(function (error) {
                console.error(`Error al exportar la hoja ${index + 1}:`, error);
                alert(`Hubo un problema al generar la imagen de la hoja ${index + 1}.`);
            });
    });
}
*/
function exportAllSheets() {
    const sheets = document.querySelectorAll(".sheet"); // Seleccionar todas las hojas
    const firstTitleInput = document.querySelector("#sheet1 #title"); // Obtener el título de la primera hoja
    let baseFileName = firstTitleInput && firstTitleInput.value.trim() !== ""
        ? firstTitleInput.value.trim() // Usar el título de la primera hoja si no está vacío
        : "hoja"; // Usar "hoja" como nombre base si el título está vacío

    // Limpiar caracteres no válidos para nombres de archivo
    baseFileName = baseFileName.replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚüÜñÑ _-]/g, "");

    const totalSheets = sheets.length;

    sheets.forEach((sheet, index) => {
        let fileName;

        if (totalSheets === 1) {
            fileName = baseFileName; // Sin número si es la única hoja
        } else {
            fileName = `${baseFileName} ${index + 1}`; // Con número si hay varias hojas
        }

        domtoimage.toJpeg(sheet, { quality: 0.95 }) // Cambiar a JPG con calidad ajustable
            .then(function (dataUrl) {
                const link = document.createElement("a");
                link.download = `${fileName}.jpg`; // Nombre del archivo con extensión .jpg
                link.href = dataUrl;
                link.click();
            })
            .catch(function (error) {
                console.error(`Error al exportar la hoja ${index + 1}:`, error);
                alert(`Hubo un problema al generar la imagen de la hoja ${index + 1}.`);
            });
    });
}



async function exportToPDF() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF(); // Crear un nuevo documento PDF
    const sheets = document.querySelectorAll('.sheet'); // Seleccionar todas las hojas
    const title = document.getElementById('title').value.trim() || 'Documento'; // Obtener el título o usar un nombre por defecto

    for (let i = 0; i < sheets.length; i++) {
        const canvas = await html2canvas(sheets[i]); // Capturar cada hoja como imagen
        const imgData = canvas.toDataURL('image/png'); // Convertir la imagen a formato base64
        const imgWidth = 210; // Ancho en mm para A4
        const imgHeight = (canvas.height * imgWidth) / canvas.width; // Escalar proporcionalmente

        if (i > 0) {
            pdf.addPage(); // Agregar una nueva página para cada hoja adicional
        }

        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight); // Agregar la imagen al PDF
    }

    pdf.save(`${title}.pdf`); // Descargar el PDF con el título de la canción
}

//No permite el zoom

let lastTouchDistance = 0; // variable para detectar zoom

// Bloquear zoom con la rueda del ratón (si se presiona Ctrl)
document.addEventListener('wheel', function (event) {
    if (event.ctrlKey) {
        event.preventDefault(); // Evita el zoom con la rueda del ratón o el trackpad
    }
}, { passive: false });

// Bloquear zoom con el gesto de pellizcar en el trackpad (cuando los dedos se separan)
document.addEventListener('touchstart', function (event) {
    if (event.touches.length === 2) {
        // Guardar la distancia inicial entre los dos dedos
        lastTouchDistance = getTouchDistance(event);
    }
});

document.addEventListener('touchmove', function (event) {
    if (event.touches.length === 2) {
        const currentDistance = getTouchDistance(event);

        // Si la distancia entre los dedos cambia significativamente, se considera un gesto de zoom
        if (Math.abs(currentDistance - lastTouchDistance) > 10) {
            event.preventDefault(); // Bloquear el zoom (cuando los dedos se separan o se acercan)
        }
    }
}, { passive: false });

// Función para calcular la distancia entre dos puntos táctiles
function getTouchDistance(event) {
    const x1 = event.touches[0].pageX;
    const y1 = event.touches[0].pageY;
    const x2 = event.touches[1].pageX;
    const y2 = event.touches[1].pageY;
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); // Distancia euclidiana
}

// Bloquear el zoom con teclas (Ctrl + y Ctrl -)
document.addEventListener('keydown', function (event) {
    if ((event.ctrlKey && event.key === '+') || (event.ctrlKey && event.key === '-')) {
        event.preventDefault(); // Evita el zoom con las teclas Ctrl + y Ctrl -
    }
});


//Impedir que se recarge la pagina accidentalmente o se cierre la pestaña

let canReload = false; // Variable que controla si se puede recargar o cerrar

// Mostrar el modal manualmente
function mostrarModalRecargaOConfirmacion() {
    const modal = document.getElementById("confirmModal1");
    modal.style.display = "flex";

    document.getElementById("confirmSi").onclick = function () {
        canReload = true; // Permitir la recarga o cierre
        modal.style.display = "none"; // Ocultar el modal
        location.reload(); // Recargar la página o cerrar la ventana
    };

    document.getElementById("confirmNou").onclick = function () {
        modal.style.display = "none"; // Ocultar el modal sin hacer nada
    };
}

// Interceptar el evento `beforeunload` para manejar el cierre o recarga
window.addEventListener('beforeunload', function (event) {
    if (!canReload) {
        event.preventDefault();
        mostrarModalRecargaOConfirmacion(); // Mostrar el modal
        return ''; // Algunos navegadores requieren este valor
    }
});

// Interceptar teclas específicas (F5 o Ctrl+R)
window.addEventListener('keydown', function (event) {
    if (event.key === "F5" || (event.ctrlKey && event.key === "r")) {
        event.preventDefault(); // Prevenir recarga inmediata
        mostrarModalRecargaOConfirmacion(); // Mostrar el modal
    }
});

// MODAL DE SIMBOLOS----------------------------------------------------------------------------------

function abrirVentanaSimbolos() {
    const modal = document.getElementById("symbolModal");
    modal.style.display = "flex"; // Mostrar la ventana
    document.body.style.overflow = "hidden"; // Desactivar el scroll del fondo
    inicializarTooltips(); // Asegurarse de inicializar los tooltips
}


function cerrarVentanaSimbolos() {
    const modal = document.getElementById("symbolModal");
    modal.style.display = "none"; // Ocultar la ventana
    document.body.style.overflow = "auto"; // Reactivar el scroll del fondo
}


//cerrar la ventana si se hace clic fuera de ella
window.addEventListener("click", function (event) {
    const modal = document.getElementById("symbolModal");
    if (event.target === modal) {
        cerrarVentanaSimbolos();
    }
});


// MODAL DE NOTAS----------------------------------------------------------------------------------
function abrirVentanaNotas() {
    const modal = document.getElementById("notasModal");
    modal.style.display = "flex"; // Mostrar la ventana
    document.body.style.overflow = "hidden"; // Desactivar el scroll del fondo
}

function cerrarVentanaNotas() {
    const modal = document.getElementById("notasModal");
    modal.style.display = "none"; // Ocultar la ventana
    document.body.style.overflow = "auto"; // Reactivar el scroll del fondo
}


//cerrar la ventana si se hace clic fuera de ella
window.addEventListener("click", function (event) {
    const modal = document.getElementById("notasModal");
    if (event.target === modal) {
        cerrarVentanaNotas();
    }
});

//----------------------------------------------------------------------------------------------------
// Función para inicializar los tooltips
function inicializarTooltips() {
    // Crear el tooltip si no existe
    let tooltip = document.getElementById("tooltip");
    if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.id = "tooltip";
        tooltip.style.position = "fixed";
        tooltip.style.backgroundColor = "rgba(0, 0, 0, 0.90)";
        tooltip.style.color = "white";
        tooltip.style.padding = "5px 10px";
        tooltip.style.borderRadius = "5px";
        tooltip.style.fontSize = "16px";
        tooltip.style.pointerEvents = "none";
        tooltip.style.opacity = "0";
        tooltip.style.transition = "opacity 0.2s ease";
        tooltip.style.zIndex = "10000"; // Asegura que esté sobre todo
        document.body.appendChild(tooltip);
    }

    // Asignar eventos a todos los botones con tooltips
    document.querySelectorAll("button[data-tooltip]").forEach(button => {
        button.addEventListener("mouseenter", (e) => {
            tooltip.textContent = button.getAttribute("data-tooltip");
            tooltip.style.opacity = "1";
            tooltip.style.left = `${e.clientX + 10}px`;
            tooltip.style.top = `${e.clientY + 10}px`;
        });

        button.addEventListener("mousemove", (e) => {
            tooltip.style.left = `${e.clientX + 10}px`;
            tooltip.style.top = `${e.clientY + 10}px`;
        });

        button.addEventListener("mouseleave", () => {
            tooltip.style.opacity = "0";
        });
    });
}

// Llamar a esta función al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    inicializarTooltips();
});

function abrirVentanaSimbolos() {
    const modal = document.getElementById("symbolModal");

    // Resetear el valor del input a 1
    const cantidadInput = document.getElementById('cantidad');
    cantidadInput.value = "1";
    cantidadInput.setAttribute('value', '1');

    // Disparar evento input para asegurar la actualización
    const event = new Event('input', { bubbles: true });
    cantidadInput.dispatchEvent(event);

    // Mostrar el modal
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Desactivar el scroll del fondo

    inicializarTooltips(); // Asegurarse de que los tooltips se actualicen
}

// Función para cerrar la ventana emergente
function cerrarVentanaSimbolos() {
    const modal = document.getElementById("symbolModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Reactivar el scroll del fondo
    inicializarTooltips(); // Reconfigurar los tooltips en toda la página
}

// Función para abrir la ventana emergente
function abrirVentanaNotas() {
    const modal = document.getElementById("notasModal");
    modal.style.display = "flex";
    document.body.style.overflow = "hidden"; // Desactivar el scroll del fondo
    inicializarTooltips(); // Asegurarse de que los tooltips se actualicen
}

// Función para cerrar la ventana emergente
function cerrarVentanaNotas() {
    const modal = document.getElementById("notasModal");
    modal.style.display = "none";
    document.body.style.overflow = "auto"; // Reactivar el scroll del fondo
    inicializarTooltips(); // Reconfigurar los tooltips en toda la página
}


