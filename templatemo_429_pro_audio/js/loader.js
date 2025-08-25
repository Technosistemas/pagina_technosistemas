class TechnoSystemsLoader {
    constructor() {
        this.loaderContainer = document.getElementById('loaderContainer');
        this.mainPageContent = document.getElementById('mainPageContent');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.loadingMessage = document.getElementById('loadingMessage');
        this.skipBtn = document.getElementById('skipBtn');
        this.video = document.getElementById('loaderVideo');

        this.progress = 0;
        this.isLoading = true;
        this.loadingMessages = [
            'Iniciando TECHNOSISTEMAS...',
            'Cargando servicios digitales...',
            'Conectando plataformas...',
            'Optimizando experiencia...',
            'Preparando contenido...',
            'Verificando sistemas...',
            'Cargando recursos...',
            'Finalizando configuración...',
            '¡Bienvenido a TECHNOSISTEMAS!'
        ];
        
        this.init();
    }

    init() {
        // Añadir clase loading al body
        document.body.classList.add('loading');
        
        this.bindEvents();
        this.startLoading();
        this.handleVideoLoad();
    }

    bindEvents() {
        // Botón skip
        this.skipBtn.addEventListener('click', () => this.skipLoader());

        // Detectar cuando el video esté listo
        this.video.addEventListener('loadeddata', () => {
            console.log('Video del loader cargado correctamente');
        });

        // Manejar errores de video
        this.video.addEventListener('error', () => {
            console.warn('Error cargando video principal, usando fallback');
            // El fallback está en el HTML como segunda source
        });

        // Prevenir right-click en el video
        this.video.addEventListener('contextmenu', (e) => e.preventDefault());

        // Asegurar que el video se reproduzca
        this.video.addEventListener('canplay', () => {
            this.video.play().catch(e => {
                console.log('Autoplay prevented:', e);
                // Intentar reproducir sin sonido
                this.video.muted = true;
                this.video.play().catch(err => console.log('Video fallback failed:', err));
            });
        });

        // Manejar tecla Escape para saltar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isLoading) {
                this.skipLoader();
            }
        });
    }

    handleVideoLoad() {
        // Si el video no carga en 3 segundos, continuar de todos modos
        setTimeout(() => {
            if (this.video.readyState < 2) {
                console.log('Video tardando en cargar, continuando...');
            }
        }, 3000);
    }

    startLoading() {
        // Simular carga progresiva realista
        const loadingInterval = setInterval(() => {
            if (this.progress < 100 && this.isLoading) {
                // Incremento variable que simula carga real de recursos
                let increment;
                if (this.progress < 20) {
                    increment = Math.random() * 5 + 3; // Inicio rápido
                } else if (this.progress < 70) {
                    increment = Math.random() * 4 + 2; // Velocidad media
                } else {
                    increment = Math.random() * 2 + 1; // Final más lento
                }
                
                this.progress += increment;
                
                if (this.progress > 100) {
                    this.progress = 100;
                }

                this.updateProgress(Math.floor(this.progress));

                // Cambiar mensaje según el progreso
                const messageIndex = Math.min(
                    Math.floor((this.progress / 100) * this.loadingMessages.length),
                    this.loadingMessages.length - 1
                );
                this.updateMessage(this.loadingMessages[messageIndex]);

                // Completar carga
                if (this.progress >= 100) {
                    clearInterval(loadingInterval);
                    setTimeout(() => {
                        this.completeLoading();
                    }, 1200); // Esperar un poco más en el 100%
                }
            }
        }, 150); // Actualizar cada 150ms para suavidad

        // Garantizar que termine en máximo 8 segundos
        setTimeout(() => {
            if (this.isLoading) {
                clearInterval(loadingInterval);
                this.progress = 100;
                this.updateProgress(100);
                this.updateMessage(this.loadingMessages[this.loadingMessages.length - 1]);
                setTimeout(() => {
                    this.completeLoading();
                }, 500);
            }
        }, 8000);
    }

    updateProgress(percentage) {
        this.progressFill.style.width = percentage + '%';
        this.progressText.textContent = percentage + '%';
        
        // Efecto adicional de pulso al llegar al 100%
        if (percentage === 100) {
            this.progressFill.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.8)';
        }
    }

    updateMessage(message) {
        // Animación suave al cambiar mensaje
        this.loadingMessage.style.opacity = '0';
        setTimeout(() => {
            this.loadingMessage.textContent = message;
            this.loadingMessage.style.opacity = '1';
        }, 250);
    }

    completeLoading() {
        if (!this.isLoading) return;
        
        this.isLoading = false;
        this.updateProgress(100);
        
        // Ocultar loader y mostrar contenido de la página
        setTimeout(() => {
            this.hideLoader();
        }, 800);
    }

    hideLoader() {
        // Fade out del loader
        this.loaderContainer.classList.add('fade-out');
        
        // Remover clase loading del body y permitir scroll
        document.body.classList.remove('loading');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            this.loaderContainer.style.display = 'none';
            
            // Mostrar contenido principal de la página
            this.mainPageContent.classList.add('show');
            
            // Inicializar funcionalidades de la página principal si las hay
            this.initMainPageFeatures();
            
        }, 800);
    }

    skipLoader() {
        if (this.isLoading) {
            this.progress = 100;
            this.updateProgress(100);
            this.updateMessage('¡Carga completada!');
            setTimeout(() => {
                this.completeLoading();
            }, 300);
        }
    }

    initMainPageFeatures() {
        // Aquí puedes añadir inicializaciones específicas para tu página principal
        console.log('TECHNOSISTEMAS cargado completamente');
        
        // Ejemplo: animar elementos cuando aparezcan
        const elementsToAnimate = document.querySelectorAll('.templatemo-section');
        elementsToAnimate.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, 300);
        });

        // Reiniciar video principal si existe
        const mainVideo = document.querySelector('#home video');
        if (mainVideo) {
            mainVideo.load(); // Recargar el video principal
        }
    }

    // Método público para reiniciar el loader (útil para testing)
    restart() {
        this.loaderContainer.style.display = 'flex';
        this.loaderContainer.classList.remove('fade-out');
        this.mainPageContent.classList.remove('show');
        
        document.body.classList.add('loading');
        document.body.style.overflow = 'hidden';
        
        this.progress = 0;
        this.isLoading = true;
        this.updateProgress(0);
        this.updateMessage(this.loadingMessages[0]);
        
        // Reiniciar video del loader
        this.video.currentTime = 0;
        this.video.play().catch(e => console.log('Autoplay prevented on restart:', e));
        
        this.startLoading();
    }
}

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Crear instancia global del loader
    window.technoLoader = new TechnoSystemsLoader();
});

// Manejar visibilidad de la página (pausar video cuando no está visible)
document.addEventListener('visibilitychange', () => {
    const video = document.getElementById('loaderVideo');
    if (video && window.technoLoader && window.technoLoader.isLoading) {
        if (document.hidden) {
            video.pause();
        } else {
            video.play().catch(e => console.log('Autoplay prevented on visibility change:', e));
        }
    }
});

// Optimizaciones para móviles
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    document.addEventListener('DOMContentLoaded', () => {
        const video = document.getElementById('loaderVideo');
        if (video) {
            // Ajustes para móviles
            video.style.filter = 'brightness(0.3) contrast(1.1)';
            video.preload = 'auto';
        }
    });
}

// Función global para mostrar el loader (útil para development/testing)
function showTechnoLoader() {
    if (window.technoLoader) {
        window.technoLoader.restart();
    }
}

// Prevenir que el usuario vea contenido antes del loader
window.addEventListener('load', () => {
    // Asegurar que el contenido principal esté oculto inicialmente
    const mainContent = document.getElementById('mainPageContent');
    if (mainContent && !mainContent.classList.contains('show')) {
        mainContent.style.display = 'none';
    }
});

// Manejar errores globales relacionados con el loader
window.addEventListener('error', (e) => {
    if (e.target && e.target.id === 'loaderVideo') {
        console.warn('Error en video del loader, continuando con fallback');
    }
});