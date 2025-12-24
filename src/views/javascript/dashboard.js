document.addEventListener("DOMContentLoaded", () => {

    /* ======================================================
        UTILS
    ====================================================== */
    const $ = (selector, scope = document) => scope.querySelector(selector);
    const $$ = (selector, scope = document) => scope.querySelectorAll(selector);


    /* ======================================================
        SCROLL REVEAL
    ====================================================== */

    const initScrollReveal = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");

                    if (entry.target.querySelector(".metric-number")) {
                        animateSingleCounter(entry.target.querySelector(".metric-number"));
                    }
                    if (entry.target.querySelector(".progress-bar")) {
                        animateSingleBar(entry.target.querySelector(".progress-bar"));
                    }

                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        $$(".scroll-reveal").forEach(el => observer.observe(el));
    };


    /* ======================================================
        METRIC COUNTERS
    ====================================================== */
    const animateCounters = () => {
        $$(".metric-number").forEach(counter => {
            const target = Number(counter.textContent);
            let current = 0;

            counter.textContent = current;

            const step = Math.max(1, Math.floor(target / 40));

            const tick = () => {
                current += step;
                counter.textContent = current;

                if (current < target) {
                    requestAnimationFrame(tick);
                } else {
                    counter.textContent = target;
                }
            };

            tick();
        });
    };


    /* ======================================================
        PROGRESS BARS
    ====================================================== */
    const animateProgressBars = () => {
        $$(".progress-bar").forEach(bar => {
            const targetWidth = bar.style.width;

            bar.style.width = "0%";

            requestAnimationFrame(() => {
                bar.style.transition = "width 1.2s ease";
                bar.style.width = targetWidth;
            });
        });
    };


    /* ======================================================
        ACTIVITY FEED
    ====================================================== */
    const animateActivityFeed = () => {
        $$(".activity-card").forEach((card, index) => {
            card.style.opacity = "0";
            card.style.transform = "translateY(20px)";

            setTimeout(() => {
                card.style.transition = "all 0.6s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
            }, index * 120);
        });
    };


    /* ======================================================
        INIT
    ====================================================== */
    const initDashboard = () => {
        initScrollReveal();
        animateCounters();
        animateProgressBars();
        animateActivityFeed();
    };

    initDashboard();

});
