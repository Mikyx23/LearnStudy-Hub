document.addEventListener("DOMContentLoaded", () => {

    /* =========================
        CONFIGURACIÓN GLOBAL
    ========================== */
    const appConfig = {
        appNameHTML: `LearnStudy<span class="brand-highlight">Hub</span>`,
        appNameRaw: "LearnStudyHub",
        user: {
            name: "Estudiante",
            initials: "ES",
            profileUrl: "/api/perfil"
        },
        menuItems: [
            { name: "Dashboard", icon: "layout-dashboard", href: "/api/dashboard" },
            { name: "Malla Curricular", icon: "book-open", href: "/api/malla" },
            { name: "Mis Cursos", icon: "library", href: "/api/cursos" },
            { name: "Agenda", icon: "calendar-days", href: "/api/agenda" },
            { name: "Calificaciones", icon: "bar-chart-3", href: "/api/calificaciones" },
            { name: "Pomodoro", icon: "timer", href: "/api/pomodoro" },
            { name: "Horario", icon: "clock", href: "/api/horario" }
        ],
        footer: {
            socials: [
                { name: "Facebook", icon: "facebook", href: "#" },    // Cambiado de 'fab fa-facebook-f'
                { name: "Instagram", icon: "instagram", href: "#" }, // Cambiado de 'fab fa-instagram'
                { name: "X", icon: "twitter", href: "#" }            // Cambiado de 'fab fa-x-twitter'
            ],
            links: [
                { name: "Política de Privacidad", href: "/privacidad" },
                { name: "Términos y Condiciones", href: "/terminos" }
            ]
        }
    };

    const currentPath = window.location.pathname;

    /* =========================
        SIDEBAR
    ========================== */
    const sidebar = document.createElement("nav");
    sidebar.className = "app-sidebar";

    sidebar.innerHTML = `
        <div>
            <div class="sidebar-header">
                <span class="brand-logo sidebar-mode"> 
                </span>
            </div>

            <nav class="sidebar-menu">
                ${appConfig.menuItems.map(item => {
        const isActive = currentPath.startsWith(item.href);
        return `
                        <a href="${item.href}" class="nav-item-app ${isActive ? "active" : ""}">
                            <i data-lucide="${item.icon}" class="menu-icon"></i>
                            <span class="nav-text">${item.name}</span>
                        </a>
                    `;
    }).join("")}
            </nav>
        </div>

        <a href="/logout" class="nav-item-app logout-btn">
            <i data-lucide="log-out" class="menu-icon"></i>
            <span class="nav-text">Cerrar Sesión</span>
        </a>
    `;

    document.body.prepend(sidebar);

    /* =========================
        HEADER
    ========================== */
    const header = document.createElement("header");
    header.className = "app-header";

    header.innerHTML = `
        <div class="header-brand-container">
            <a href="/api/dashboard" class="brand-logo header-mode">
                ${appConfig.appNameHTML}
            </a>
        </div>

        <a href="${appConfig.user.profileUrl}" class="user-profile-link">
            <div class="user-profile">
                <div class="user-info">
                    <small>Bienvenido,</small>
                    <strong>${appConfig.user.name}</strong>
                </div>
                <div class="user-avatar">
                    ${appConfig.user.initials}
                </div>
            </div>
        </a>
    `;

    sidebar.after(header);

    /* =========================
        FOOTER
    ========================== */
    const footerElement = document.createElement("footer");
    footerElement.className = "app-footer";

    footerElement.innerHTML = `
        <div class="footer-container">
            <div class="footer-socials">
                ${appConfig.footer.socials.map(s => `
                    <a href="${s.href}" target="_blank" rel="noopener noreferrer" aria-label="${s.name}">
                        <i data-lucide="${s.icon}"></i>
                    </a>
                `).join("")}
            </div>

            <div class="footer-links">
                ${appConfig.footer.links.map(l => `
                    <a href="${l.href}">${l.name}</a>
                `).join(" | ")}
            </div>

            <div class="footer-copy">
                © <span id="year"></span> ${appConfig.appNameRaw}. Todos los derechos reservados.
            </div>
        </div>
    `;

    document.body.append(footerElement);

    // Actualizar el año
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    document.body.classList.add("app-layout");

    /* =========================
        LUCIDE ICONS (RE-RENDER)
    ========================== */
    if (window.lucide) {
        window.lucide.createIcons();
    } else {
        console.warn("Lucide no se encontró. Revisa que el script CDN esté en el HTML.");
    }
});