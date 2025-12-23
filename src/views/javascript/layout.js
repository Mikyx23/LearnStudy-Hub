document.addEventListener("DOMContentLoaded", () => {
    
    const user = {
        name: "Estudiante",
        initials: "ES"
    };

    const menuItems = [
        { name: "Malla Curricular", icon: "fa-project-diagram", href: "malla.html" },
        { name: "Pomodoro", icon: "fa-clock", href: "pomodoro.html" },
        { name: "Mi Agenda", icon: "fa-calendar-alt", href: "agenda.html" },
        { name: "Notas", icon: "fa-sticky-note", href: "notas.html" }
    ];

    // 1. INYECTAR SIDEBAR
    const sidebar = document.createElement("nav");
    sidebar.className = "app-sidebar";
    
    // marcar "active"
    const currentPath = window.location.pathname.split("/").pop(); 

    let menuHTML = `
        <div>
            <div class="sidebar-logo">
                <i class="fas fa-layer-group text-primary"></i>
                <span class="nav-text ms-2 fw-bold">LearnHub</span>
            </div>
            <div class="d-flex flex-column">
    `;

    menuItems.forEach(item => {
        // Verificar
        const isActive = currentPath === item.href ? "active" : "";
        
        menuHTML += `
            <a href="${item.href}" class="nav-item-app ${isActive}">
                <i class="fas ${item.icon}"></i>
                <span class="nav-text">${item.name}</span>
            </a>
        `;
    });

    menuHTML += `
            </div>
        </div>
        <a href="/api/logout" class="nav-item-app logout-btn">
            <i class="fas fa-sign-out-alt"></i>
            <span class="nav-text">Cerrar Sesión</span>
        </a>
    `;

    sidebar.innerHTML = menuHTML;
    document.body.prepend(sidebar);

    // 2. INYECTAR HEADER SUPERIOR
    const header = document.createElement("header");
    header.className = "app-header";
    header.innerHTML = `
        <div class="header-brand">
            <a href="inicio.html" class="text-decoration-none text-dark fw-bold fs-4">
                LearnStudy<span class="text-primary">Hub</span>
            </a>
        </div>
        
        <div class="user-profile">
            <div class="text-end me-2 d-none d-sm-block">
                <small class="text-muted d-block" style="font-size: 0.75rem;">Bienvenido,</small>
                <span class="fw-bold text-dark" style="font-size: 0.9rem;">${user.name}</span>
            </div>
            <div class="user-avatar shadow-sm">
                ${user.initials}
            </div>
        </div>
    `;
    
    // Insertar header después del sidebar
    sidebar.after(header);

    // 3. INYECTAR FOOTER (Reutilizando estilo existente)
    const footer = document.createElement("footer");
    footer.className = "py-4 mt-5 bg-white text-center text-muted border-top";
    footer.innerHTML = `
        <div class="container">
            <small>© 2025 LearnStudy Hub. Todos los derechos reservados.</small>
        </div>
    `;
    document.body.append(footer);

    // 4. AJUSTAR BODY CLASS
    document.body.classList.add("app-layout");
});