// --- CONFIGURACIÓN DE LA FECHA ---
// IMPORTANTE: Aquí pones la fecha objetivo. 
// Formato: "Month Day, Year Hour:Minute:Second"
// Para Navidad sería: "Dec 25, 2024 00:00:00"
// TRUCO: Si quieres probar si funciona AHORA, pon una fecha pasada.
const targetDate = new Date("Dec 25, 2023 00:00:00").getTime();


// --- VARIABLES DE ESTADO ---
let videosWatchedCount = 0;
const totalVideos = 6;
let phrasesOpenedCount = 0;
const totalPhrases = 4;


// --- 1. LÓGICA DEL CONTADOR ---
const timerInterval = setInterval(function() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    // Cálculos de tiempo
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Mostrar en el HTML
    document.getElementById("days").innerText = days < 10 ? "0" + days : days;
    document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
    document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
    document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;

    // Si la cuenta regresiva termina (llegó la Navidad)
    if (distance < 0) {
        clearInterval(timerInterval);
        document.getElementById("timer").innerHTML = "<h2>¡FELIZ NAVIDAD!</h2>";
        document.getElementById("wait-message").innerText = "¡Es hora de abrir tus sorpresas!";
        
        // Ocultamos la sección del contador y mostramos los videos
        setTimeout(() => {
            document.getElementById("countdown-section").classList.add("hidden");
            unlockSection("video-section");
        }, 2000); // Espera 2 segundos antes de cambiar
    }
}, 1000);


// --- FUNCIONES DE UTILIDAD ---
function unlockSection(id) {
    const section = document.getElementById(id);
    section.classList.remove("hidden");
    section.scrollIntoView({ behavior: 'smooth' }); // Desplaza la pantalla suavemente hacia la nueva sección
}


// --- 2. LÓGICA DE FOTOS (NUEVA) ---

function openImage(cardElement) {
    // 1. Marcar como "visto" y sumar contador (Igual que antes)
    markVideoWatched(cardElement);

    // 2. Obtener la imagen de la tarjeta clickeada
    const imgSource = cardElement.querySelector('img').src;
    
    // 3. Poner esa imagen en el visor grande
    const modal = document.getElementById('fullscreen-modal');
    const modalImg = document.getElementById('modal-img');
    
    modalImg.src = imgSource;
    
    // 4. Mostrar el visor
    modal.classList.remove('hidden');
}

function closeImage() {
    const modal = document.getElementById('fullscreen-modal');
    modal.classList.add('hidden');
}

// Mantenemos la lógica de conteo que ya tenías, 
// pero asegúrate de que se llame igual:
function markVideoWatched(cardElement) {
    // Si ya está visto, no hacemos nada
    if (cardElement.classList.contains('watched')) return;

    // Marcar visualmente
    cardElement.classList.add('watched');
    
    // Aumentar contador
    videosWatchedCount++; // Asegúrate de tener esta variable definida al inicio
    document.getElementById("videos-watched").innerText = videosWatchedCount;

    // Verificar si vio las 5
    if (videosWatchedCount === totalVideos) {
        setTimeout(() => {
            alert("¡Has desbloqueado la sección de mensajes! 💌");
            unlockSection("phrases-section");
        }, 1000); // Esperamos un segundo para no interrumpir la foto
    }
}


// --- 3. LÓGICA DE FRASES ---
function revealPhrase(cardElement) {
    // Si ya está abierto, no hacemos nada
    if (cardElement.classList.contains('open')) return;

    // Abrir sobre (CSS hace la animación)
    cardElement.classList.add('open');

    // Aumentar contador de frases leídas
    phrasesOpenedCount++;

    // Si leyó las 4 frases, mostramos el botón del regalo final
    if (phrasesOpenedCount === totalPhrases) {
        setTimeout(() => {
            document.getElementById("final-btn").classList.remove("hidden");
            document.getElementById("final-btn").scrollIntoView({ behavior: 'smooth' });
        }, 800);
    }
}


// --- 4. LÓGICA DEL REGALO FINAL ---

// Esta función se llama cuando terminas las frases
function showGifts() {
    unlockSection("gift-section");
    // No mostramos el regalo real todavía, solo la caja cerrada
}

// Esta función se llama al hacer CLICK en la caja
function openGift() {
    const box = document.querySelector('.box');
    const instruction = document.querySelector('.instruction-text');
    
    // Si ya está abierta, no hacer nada
    if (box.classList.contains('opened')) return;

    // 1. Animar la caja abriéndose
    box.classList.add('opened');
    instruction.style.display = 'none'; // Ocultar texto de instrucción

    // 2. Lanzar confeti
    createConfetti();

    // 3. Mostrar el Ticket Dorado con un pequeño retraso
    setTimeout(() => {
        const giftContent = document.getElementById("gift-content");
        giftContent.classList.remove("hidden");
        // Forzamos un reflow para que la transición CSS funcione
        void giftContent.offsetWidth; 
        giftContent.classList.add("visible");
    }, 600);
}

// --- EFECTO DE CONFETI ---
function createConfetti() {
    const colors = ['#d4af37', '#b71c1c', '#ffffff', '#2e8b57'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        
        // Posición inicial aleatoria (cerca del centro/regalo)
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        
        // Color aleatorio
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        // Velocidad y rotación aleatoria
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        document.body.appendChild(confetti);
        
        // Eliminar del DOM cuando termine la animación para no saturar memoria
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}
// --- LÓGICA DE MÚSICA Y PANTALLA DE INICIO ---
const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-toggle");
let isPlaying = false;

// Configuramos volumen
music.volume = 0.5;

function toggleMusic() {
    if (isPlaying) {
        music.pause();
        musicBtn.innerText = "🔇";
        isPlaying = false;
    } else {
        music.play();
        musicBtn.innerText = "🎵";
        isPlaying = true;
    }
}

// ESTA FUNCIÓN SE EJECUTA AL DAR CLICK EN "ENTRAR"
function startChristmas() {
    // 1. Reproducir música (Ahora sí el navegador lo permite 100% seguro)
    music.play().then(() => {
        isPlaying = true;
        musicBtn.innerText = "🎵";
    }).catch(error => {
        console.log("Error de audio:", error);
    });

    // 2. Desvanecer la pantalla de bienvenida
    const entryScreen = document.getElementById('entry-screen');
    entryScreen.classList.add('fade-out');

    // 3. Eliminarla del HTML después de la animación para que no estorbe
    setTimeout(() => {
        entryScreen.style.display = 'none';
    }, 800);
}