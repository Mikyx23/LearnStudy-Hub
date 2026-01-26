document.addEventListener("DOMContentLoaded", () => {

    // 1. NAVBAR SCROLL EFFECT
    const navbar = document.querySelector(".navbar");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    });

    // 2. SMOOTH SCROLL PARA LINKS INTERNOS
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                target.scrollIntoView({ behavior: "smooth", block: "start" });
                // Cerrar menú móvil si está abierto
                const collapse = document.querySelector('.navbar-collapse');
                if (collapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(collapse).hide();
                }
            }
        });
    });

    // 3. EFECTO TYPEWRITER
    const textElement = document.getElementById('typewriter');
    const phrases = [
        "Plataforma intuitiva.",
        "Recursos modernos.",
        "Aprendizaje a tu ritmo."
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            textElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50; // Borrar más rápido
        } else {
            textElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100; // Escribir normal
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pausa al terminar frase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typeSpeed = 500; // Pausa antes de nueva frase
        }

        setTimeout(type, typeSpeed);
    }

    if (textElement) type();

    // 4. ANIMACIONES ON SCROLL (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const bgLogo = document.querySelector('#hero-bg-logo');

    // Animación simple de flotación usando Web Animations API
    bgLogo.animate([
        { transform: 'translate(-50%, -52%) rotate(0deg)' },
        { transform: 'translate(-50%, -48%) rotate(5deg)' },
        { transform: 'translate(-50%, -52%) rotate(0deg)' }
    ], {
        duration: 8000,
        iterations: Infinity,
        easing: 'ease-in-out'
    });

    // Opcional: Reacción ligera al movimiento del mouse
    document.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        bgLogo.style.marginLeft = `${moveX}px`;
        bgLogo.style.marginTop = `${moveY}px`;
    });

    document.querySelectorAll(".scroll-reveal").forEach(el => {
        observer.observe(el);
    });
});