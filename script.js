
if (typeof AOS !== 'undefined') {
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true,
        offset: 120
    });
}

// Bildergalerie Funktionalität
document.addEventListener('DOMContentLoaded', function () {
    const prevButton = document.querySelector('.gallery .prev');
    const nextButton = document.querySelector('.gallery .next');
    const galleryWrapper = document.querySelector('.gallery .gallery-wrapper');
    const gallerySlides = document.querySelectorAll('.gallery .gallery-image');
    const galleryDotsContainer = document.querySelector('.gallery .gallery-dots');
    
    let currentIndex = 0;
    let autoScrollInterval = null;
    
    // Funktion zum Aktualisieren der Galerie
    function updateGallery() {
        if (galleryWrapper) {
            galleryWrapper.style.transform = `translateX(-${currentIndex * 100}%)`;
            
            // Aktiviere die aktuelle Slide-Caption
            gallerySlides.forEach((slide, index) => {
                if (index === currentIndex) {
                    // Animation neu starten: Klasse entfernen, reflow erzwingen, Klasse hinzufügen
                    slide.classList.remove('active');
                    void slide.offsetWidth; // Reflow erzwingen
                    slide.classList.add('active');
                } else {
                    slide.classList.remove('active');
                }
            });
            
            // Update der Dots (Punkte für die Navigation)
            updateDots();
        }
    }
    
    // Funktion zum Erstellen der Dots (maximal 4 sichtbar)
    function createDots() {
        if (!galleryDotsContainer || !gallerySlides.length) return;
        
        galleryDotsContainer.innerHTML = ''; // Dots zurücksetzen
        
        gallerySlides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentIndex = index;
                updateGallery();
                resetAutoScroll();
            });
            galleryDotsContainer.appendChild(dot);
        });
        
        updateDots();
    }
    
    // Funktion zum Aktualisieren der sichtbaren Dots
    function updateDots() {
        if (!galleryDotsContainer) return;
        
        const dots = document.querySelectorAll('.gallery .dot');
        dots.forEach((dot, index) => {
            // Alle Dots deaktivieren
            dot.classList.remove('active');
            
            // Nur den aktuellen Dot aktivieren
            if (index === currentIndex) {
                dot.classList.add('active');
            }
            
            // Anzeigen/Verstecken der Dots (maximal 4 sichtbar)
            if (gallerySlides.length <= 4) {
                // Wenn 4 oder weniger Slides, alle Dots anzeigen
                dot.style.display = 'block';
            } else {
                // Bei mehr als 4 Slides, nur relevant Dots anzeigen
                // Logik: Zeige aktuellen Dot + 1 davor und + 2 danach (oder umgekehrt)
                let startDot = currentIndex - 1;
                let endDot = currentIndex + 2;
                
                // Korrektur wenn am Anfang oder Ende
                if (startDot < 0) {
                    startDot = 0;
                    endDot = 3;
                } else if (endDot > gallerySlides.length - 1) {
                    endDot = gallerySlides.length - 1;
                    startDot = Math.max(0, endDot - 3);
                }
                
                // Dots ein-/ausblenden
                if (index >= startDot && index <= endDot) {
                    dot.style.display = 'block';
                } else {
                    dot.style.display = 'none';
                }
            }
        });
    }
    
    // Funktion für den vorherigen Button mit korrektem Kreislauf
    function showPrevImage() {
        if (!gallerySlides.length) return;
        
        currentIndex = (currentIndex <= 0) ? gallerySlides.length - 1 : currentIndex - 1;
        updateGallery();
        resetAutoScroll();
    }
    
    // Funktion für den nächsten Button mit korrektem Kreislauf
    function showNextImage() {
        if (!gallerySlides.length) return;
        
        currentIndex = (currentIndex >= gallerySlides.length - 1) ? 0 : currentIndex + 1;
        updateGallery();
        resetAutoScroll();
    }
    
    // Auto-Scroll starten
    function startAutoScroll() {
        // Falls bereits ein Intervall existiert, diesen zuerst löschen
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
        }
        
        // 7 Sekunden - passend zum Ken Burns Zoom-Effekt
        autoScrollInterval = setInterval(() => {
            showNextImage();
        }, 7000);
    }
    
    // Auto-Scroll zurücksetzen
    function resetAutoScroll() {
        if (autoScrollInterval) {
            clearInterval(autoScrollInterval);
            autoScrollInterval = null;
        }
        startAutoScroll();
    }
    
    // Tastatur-Navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
    
    // Prüfen, ob alle Elemente existieren
    if (galleryWrapper && gallerySlides.length > 0) {
        // Anfangsslide als aktiv markieren
        gallerySlides[0].classList.add('active');
        
        // Swipe-Unterstützung für mobile Geräte
        let touchStartX = 0;
        let touchEndX = 0;
        
        galleryWrapper.addEventListener('touchstart', e => {
            touchStartX = e.changedTouches[0].screenX;
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        });
        
        galleryWrapper.addEventListener('touchend', e => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoScroll();
        });
        
        function handleSwipe() {
            if (touchEndX < touchStartX - 50) {
                showNextImage();
            }
            if (touchEndX > touchStartX + 50) {
                showPrevImage();
            }
        }
        
        // Event Listener für die Buttons
        if (prevButton) {
            prevButton.addEventListener('click', showPrevImage);
        }
        
        if (nextButton) {
            nextButton.addEventListener('click', showNextImage);
        }
        
        // Auto-Scroll pausieren, wenn der Benutzer mit der Galerie interagiert
        galleryWrapper.addEventListener('mouseenter', () => {
            if (autoScrollInterval) {
                clearInterval(autoScrollInterval);
                autoScrollInterval = null;
            }
        });
        
        // Auto-Scroll fortsetzen, wenn der Benutzer die Galerie verlässt
        galleryWrapper.addEventListener('mouseleave', () => {
            startAutoScroll();
        });
        
        // Initialisierung
        createDots();
        updateGallery();
        
        // Auto-Scroll für die Galerie alle 6 Sekunden
        startAutoScroll();
    } else {
        console.error('Galerie-Elemente nicht gefunden.');
    }
});

// FAQ Content opening via click
document.addEventListener('DOMContentLoaded', () => {
    const faqHeaders = document.querySelectorAll('.FAQ-header');
    faqHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const container = header.parentElement;
            container.classList.toggle('active');
        });
    });
});

// Logo Link
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Logo-Image Link
document.addEventListener('DOMContentLoaded', () => {
    const logoImg = document.querySelector('.logo-img');
    if (logoImg) {
        logoImg.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Warte bis das Dokument geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Navigationsleiste beim Scrollen anpassen
    const navbar = document.querySelector('.navbar');
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Menü ein-/ausblenden bei Klick auf den Hamburger
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }
    
    // Navigation-Links schließen das mobile Menü beim Klick
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
    
    // Sticky Navigation beim Scrollen
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('sticky');
        } else {
            navbar.classList.remove('sticky');
        }
    });
    
    // Smooth Scrolling für Anker-Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const navbarHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Web3Forms Kontaktformular
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eventForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const submitBtn = form.querySelector('.submit-button');
            const buttonText = submitBtn.querySelector('.button-text');
            const buttonLoading = submitBtn.querySelector('.button-loading');
            const formMessage = document.getElementById('form-message');
            
            // Button in Loading-Zustand setzen
            buttonText.style.display = 'none';
            buttonLoading.style.display = 'inline-flex';
            submitBtn.disabled = true;
            formMessage.className = 'form-message';
            formMessage.textContent = '';
            
            try {
                const formData = new FormData(form);
                
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    // Erfolg
                    formMessage.className = 'form-message success';
                    formMessage.textContent = '✓ Vielen Dank! Ihre Anfrage wurde erfolgreich gesendet. Wir melden uns schnellstmöglich bei Ihnen.';
                    form.reset();
                } else {
                    // Fehler von Web3Forms
                    formMessage.className = 'form-message error';
                    formMessage.textContent = '✗ Leider ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt per E-Mail.';
                }
            } catch (error) {
                // Netzwerkfehler
                formMessage.className = 'form-message error';
                formMessage.textContent = '✗ Verbindungsfehler. Bitte prüfen Sie Ihre Internetverbindung und versuchen Sie es erneut.';
            } finally {
                // Button zurücksetzen
                buttonText.style.display = 'inline';
                buttonLoading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    }
});