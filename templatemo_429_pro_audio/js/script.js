class VideoSlider {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 5;
        this.isPlaying = false;
        this.autoplayInterval = null;
        this.autoplayDelay = 5000; // 5 segundos

        this.videoTrack = document.getElementById('videoTrack');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.indicators = document.querySelectorAll('.indicator');
        this.videos = document.querySelectorAll('video');

        this.init();
    }

    init() {
        this.bindEvents();
        this.updateSlider();
        this.startAutoplay();
    }

    bindEvents() {
        // Navegación con botones
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Play/Pause global
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => this.goToSlide(index));
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.prevSlide();
            if (e.key === 'ArrowRight') this.nextSlide();
            if (e.key === ' ') {
                e.preventDefault();
                this.togglePlayPause();
            }
        });

        // Pausa autoplay cuando el mouse está sobre el slider
        this.videoTrack.addEventListener('mouseenter', () => this.pauseAutoplay());
        this.videoTrack.addEventListener('mouseleave', () => this.startAutoplay());

        // Control individual de videos
        this.videos.forEach((video, index) => {
            video.addEventListener('click', () => {
                if (index === this.currentSlide) {
                    if (video.paused) {
                        video.play();
                        this.isPlaying = true;
                        this.updatePlayPauseButton();
                    } else {
                        video.pause();
                        this.isPlaying = false;
                        this.updatePlayPauseButton();
                    }
                }
            });

            video.addEventListener('ended', () => {
                this.nextSlide();
            });
        });

        // Touch/swipe support para móviles
        let startX = 0;
        let endX = 0;

        this.videoTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        });

        this.videoTrack.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            const diff = startX - endX;
            
            if (Math.abs(diff) > 50) { // Mínimo swipe de 50px
                if (diff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
        });
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }

    prevSlide() {
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
    }

    updateSlider() {
        // Mover el track
        const translateX = -this.currentSlide * 20; // 20% por slide
        this.videoTrack.style.transform = `translateX(${translateX}%)`;

        // Actualizar indicadores
        this.indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSlide);
        });

        // Pausar todos los videos excepto el actual
        this.videos.forEach((video, index) => {
            if (index !== this.currentSlide) {
                video.pause();
                video.currentTime = 0;
            }
        });

        // Si está reproduciendo, reproducir el video actual
        if (this.isPlaying) {
            this.videos[this.currentSlide].play();
        }

        this.updatePlayPauseButton();
    }

    togglePlayPause() {
        const currentVideo = this.videos[this.currentSlide];
        
        if (this.isPlaying) {
            currentVideo.pause();
            this.pauseAutoplay();
        } else {
            currentVideo.play();
            this.startAutoplay();
        }
        
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseButton();
    }

    updatePlayPauseButton() {
        this.playPauseBtn.classList.toggle('playing', this.isPlaying);
    }

    startAutoplay() {
        this.pauseAutoplay(); // Limpiar interval anterior
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, this.autoplayDelay);
    }

    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
}

// Inicializar el slider cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    new VideoSlider();
});

// Animación de entrada suave
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});