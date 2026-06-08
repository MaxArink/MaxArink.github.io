document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

window.addEventListener('scroll', () => {
    const btn = document.getElementById("back-to-top-btn");
    if (window.scrollY > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Image modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const clickableImages = document.querySelectorAll('.clickable-image');
    const modalImage = document.getElementById('modalImage');
    const projectModal = document.getElementById('projectModal');
    const modalTitle = document.getElementById('projectModalLabel');
    const modalProjectImage = document.getElementById('projectModalImage');
    const modalDescription = document.getElementById('projectModalDescription');
    const modalYear = document.getElementById('projectModalYear');
    const modalRole = document.getElementById('projectModalRole');
    const modalTools = document.getElementById('projectModalTools');
    const modalExtra = document.getElementById('projectModalExtra');
    const modalLink = document.getElementById('projectModalLink');
    const modalCarousel = document.getElementById('projectModalCarousel');
    const modalCarouselInner = document.getElementById('projectModalCarouselInner');
    const modalIndicators = document.getElementById('projectModalIndicators');
    const bootstrapModal = projectModal ? new bootstrap.Modal(projectModal) : null;
    let bootstrapCarousel = null;

    function renderCarousel(images, title) {
        if (!modalCarousel || !modalCarouselInner || !modalIndicators) {
            return;
        }

        const safeImages = images.filter(function(image) {
            return image && image.trim();
        });
        const carouselImages = safeImages.length > 0 ? safeImages : [''];

        modalCarouselInner.innerHTML = '';
        modalIndicators.innerHTML = '';

        carouselImages.forEach(function(image, index) {
            const activeClass = index === 0 ? ' active' : '';
            const isVideo = /\.(mp4|webm|ogg)$/i.test(image);
            const indicator = document.createElement('button');
            indicator.type = 'button';
            indicator.setAttribute('data-bs-target', '#projectModalCarousel');
            indicator.setAttribute('data-bs-slide-to', String(index));
            indicator.setAttribute('aria-label', `Slide ${index + 1}`);
            if (index === 0) {
                indicator.classList.add('active');
                indicator.setAttribute('aria-current', 'true');
            }
            modalIndicators.appendChild(indicator);

            const item = document.createElement('div');
            item.className = `carousel-item${activeClass}`;

            if (image) {
                item.innerHTML = isVideo
                    ? `<video class="d-block w-100 project-carousel-video" controls preload="metadata" playsinline>
                        <source src="${image}" type="video/mp4">
                        Je browser ondersteunt deze video niet.
                    </video>`
                    : `<img src="${image}" class="d-block w-100" alt="${title} - afbeelding ${index + 1}">`;
            } else {
                item.innerHTML = `<div class="d-flex align-items-center justify-content-center w-100 bg-light text-muted" style="height:420px;">Geen afbeelding beschikbaar</div>`;
            }

            modalCarouselInner.appendChild(item);
        });

        const hasMultipleSlides = carouselImages.length > 1;
        modalIndicators.classList.toggle('d-none', !hasMultipleSlides);
        modalCarousel.querySelector('.carousel-control-prev').classList.toggle('d-none', !hasMultipleSlides);
        modalCarousel.querySelector('.carousel-control-next').classList.toggle('d-none', !hasMultipleSlides);

        if (bootstrapCarousel) {
            bootstrapCarousel.dispose();
        }
        bootstrapCarousel = new bootstrap.Carousel(modalCarousel, {
            interval: false,
            ride: false,
            wrap: true
        });

        modalCarousel.addEventListener('slid.bs.carousel', function() {
            modalCarousel.querySelectorAll('video').forEach(function(video) {
                video.pause();
            });
        }, { once: true });
    }

    function fillProjectModal(source) {
        if (!source || !projectModal) {
            return;
        }

        const title = source.getAttribute('data-title') || 'Project details';
        const description = source.getAttribute('data-description') || '';
        const year = source.getAttribute('data-year') || '-';
        const role = source.getAttribute('data-role') || '-';
        const tools = source.getAttribute('data-tools') || '-';
        const extra = source.getAttribute('data-extra') || '-';
        const link = source.getAttribute('data-link') || '#';
        const images = (source.getAttribute('data-images') || source.getAttribute('data-image') || '')
            .split('|')
            .map(function(image) { return image.trim(); });

        modalTitle.textContent = title;
        renderCarousel(images, title);
        modalDescription.textContent = description;
        modalYear.textContent = year;
        modalRole.textContent = role;
        modalTools.textContent = tools;
        modalExtra.textContent = extra;
        modalLink.href = link;
        modalLink.textContent = link === '#' ? 'Geen download beschikbaar' : 'Download / Bekijk';
        modalLink.classList.toggle('disabled', link === '#');
        modalLink.setAttribute('aria-disabled', link === '#');
    }

    function openProjectModal(source) {
        fillProjectModal(source);
        bootstrapModal.show();
    }
    
    clickableImages.forEach(function(img) {
        img.addEventListener('click', function() {
            modalImage.src = this.src;
            modalImage.alt = this.alt;
        });
    });

    document.querySelectorAll('.project-card').forEach(function(card) {
        card.addEventListener('click', function(event) {
            if (event.target.closest('button, a')) {
                return;
            }

            openProjectModal(card);
        });

        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openProjectModal(card);
            }
        });
    });

    if (projectModal) {
        projectModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            if (!button) {
                return;
            }
            fillProjectModal(button);
        });
    }
});
