const resultadoDiv = document.getElementById('resultado');
const contenedorPrincipal = document.getElementById('contenedor')
const sonidomoneda = new Audio('assets/sonido-de-moneda.wav')
const sonidados = new Audio('assets/sonido-de-dados.mp3')

// Controls from navbar
const languageSelect = document.getElementById('language-select');

// Simple translation dictionary
const i18n = {
    en: {
        appTitle: 'Luck Launcher',
        flipCoin: 'Flip Coin',
        rollDice: 'Roll Dice',
        initialResult: 'Initial result',
        heads: 'Heads',
        tails: 'Tails',
        selected: 'Selected'
    },
    es: {
        appTitle: 'Lanzador de Suerte',
        flipCoin: 'Lanzar Moneda',
        rollDice: 'Lanzar Dado',
        initialResult: 'Resultado inicial',
        heads: 'Cara',
        tails: 'Cruz',
        selected: 'Seleccionado'
    }
};

let currentLang = 'en';

function applyLanguage(lang){
    currentLang = lang;
    // Update button labels
    const btnCoin = document.getElementById('btn-moneda');
    const btnDice = document.getElementById('btn-dado');
    if(btnCoin) btnCoin.textContent = i18n[lang].flipCoin;
    if(btnDice) btnDice.textContent = i18n[lang].rollDice;

    // Update app title/logo
    const logo = document.querySelector('.nav-logo');
    const h1 = document.querySelector('h1');
    if(logo) logo.textContent = i18n[lang].appTitle;
    if(h1) h1.innerHTML = `<img src="assets/logo.png" class="title-logo" alt="Logo"> ${i18n[lang].appTitle}`;

    // Translate current result content if present
    translateResultContent(lang);

}

function translateResultContent(lang){
    if(!resultadoDiv) return;
    let html = resultadoDiv.innerHTML;
    // Replace known words both ways
    if(lang === 'en'){
        html = html.replace(/Cara/g, i18n.en.heads).replace(/Cruz/g, i18n.en.tails).replace(/Resultado inicial/g, i18n.en.initialResult);
    } else {
        html = html.replace(/Heads/g, i18n.es.heads).replace(/Tails/g, i18n.es.tails).replace(/Initial result/g, i18n.es.initialResult);
    }
    resultadoDiv.innerHTML = html;
}


// Generador de fondo animado (estrellas/partículas)
function configurarFondo() {
    const starsContainer = document.getElementById('stars');
    const stars2Container = document.getElementById('stars2');
    const stars3Container = document.getElementById('stars3');

    // Usamos el doble de altura para asegurar que siempre haya estrellas en pantalla
    const altoVentana = 2000; 
    const anchoVentana = window.innerWidth;

    function generarSombras(cantidad) {
        let sombras = [];
        for (let i = 0; i < cantidad; i++) {
            const x = Math.floor(Math.random() * anchoVentana);
            const y = Math.floor(Math.random() * altoVentana);
            sombras.push(`${x}px ${y}px #FFF`);
        }
        return sombras.join(', ');
    }

    starsContainer.style.boxShadow = generarSombras(700);
    stars2Container.style.boxShadow = generarSombras(200);
    stars3Container.style.boxShadow = generarSombras(100);
}
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(configurarFondo, 150);
});
window.addEventListener('DOMContentLoaded', configurarFondo);
// Función auxiliar para animar el cambio
function actualizarContenido(contenidoHTML) {
    // 1. Agregar la clase de terremoto
    resultadoDiv.classList.add('hidden');
    resultadoDiv.classList.add('shake-active');
    
    // 2. Desvanecer
    
    
    setTimeout(() => {
        resultadoDiv.innerHTML = contenidoHTML;
        
        // 3. Quitar el efecto de desvanecimiento
        
        resultadoDiv.classList.remove('hidden');
        // 4. Quitar la clase de terremoto después de que la animación termine (500ms)
        setTimeout(() => {
            resultadoDiv.classList.remove('shake-active');
            
        }, 500);
    }, 500); // Cambiamos el contenido a mitad de la animación
}

// Lanzar moneda al cargar la página
window.onload = () => {
    // Apply initial language
    applyLanguage(currentLang);

    const esCara = Math.random() < 0.5;
    const nombreArchivo = esCara ? 'cara-edit.png' : 'cruz-edit.png';
    resultadoDiv.innerHTML = `
        <h2>${i18n[currentLang].initialResult}: ${esCara ? i18n[currentLang].heads : i18n[currentLang].tails}</h2>
        <img src="assets/${nombreArchivo}" alt="${esCara ? i18n[currentLang].heads : i18n[currentLang].tails}">
    `;
};
function reproducirSonido(audioElement) {
    audioElement.pause();        // Pausamos el audio si ya estaba sonando
    audioElement.currentTime = 0; // Reiniciamos el tiempo al segundo 0
    audioElement.play();          // Reproducimos desde el principio
}

// Modificamos tus botones para usar la nueva función de animación
document.getElementById('btn-moneda').addEventListener('click', () => {
    const isHeads = Math.random() < 0.5;
    sonidomoneda.volume = 0.75;
    reproducirSonido(sonidomoneda);
    const nombreArchivo = isHeads ? 'cara-edit.png' : 'cruz-edit.png';
    actualizarContenido(`
        <h2>${isHeads ? i18n[currentLang].heads : i18n[currentLang].tails}</h2>
        <img src="assets/${nombreArchivo}" alt="${isHeads ? i18n[currentLang].heads : i18n[currentLang].tails}">
    `);
});

document.getElementById('btn-dado').addEventListener('click', () => {
    const numero = Math.floor(Math.random() * 6) + 1;
    const numero2 = Math.floor(Math.random() * 6) + 1;
    sonidados.volume = 0.75;
    reproducirSonido(sonidados);
    const resultado = numero + numero2;
    const nombreArchivo = `${numero}-calabera-edit.png`;
    const nombreArchivo2 = `${numero2}-calabera-edit.png`;
    actualizarContenido(`
        <img src="assets/logo.png" class="result-logo" alt="Logo">
        <img src="assets/${nombreArchivo}" alt="Die ${numero}">
        <img src="assets/${nombreArchivo2}" alt="Die ${numero2}">
        <h2>${resultado}</h2>
    `);
});

// Language selector
if(languageSelect){
    languageSelect.addEventListener('change', (e) => {
        applyLanguage(e.target.value);
    });
}