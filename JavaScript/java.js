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
    if (!btn) {
        return;
    }

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
    const geboorteDatum = new Date(2005, 4, 5);
    const today = new Date();
    let leeftijd = today.getFullYear() - geboorteDatum.getFullYear();

    const maandVerschil = today.getMonth() - geboorteDatum.getMonth();
    if (maandVerschil < 0 || (maandVerschil === 0 && today.getDate() < geboorteDatum.getDate())) {
        leeftijd--;
    }

    const leeftijdElement = document.getElementById('leeftijd') || document.getElementById('leeftijdElement');
    if (leeftijdElement) {
        leeftijdElement.textContent = leeftijd;
    }

    const projectGrid = document.getElementById('projectGrid');
    const projectSortSelect = document.getElementById('projectSort');
    const projectRoleSelect = document.getElementById('projectRole');
    const projectResetButton = document.getElementById('projectReset');
    const projectsShowMoreWrap = document.getElementById('projectsShowMoreWrap');
    const projectsShowMoreBtn = document.getElementById('projectsShowMoreBtn');
    const projectLimit = 6;
    let projectsExpanded = false;

    const projectItems = projectGrid
        ? Array.from(projectGrid.querySelectorAll('.project-item'))
        : [];
    const originalProjectOrder = new Map(projectItems.map(function(item, index) {
        return [item, index];
    }));

    function getProjectCard(item) {
        return item ? item.querySelector('.project-card') : null;
    }

    function getProjectYear(item) {
        const card = getProjectCard(item);
        const year = card ? Number(card.getAttribute('data-year')) : NaN;
        return Number.isFinite(year) ? year : 0;
    }

    function getProjectRole(item) {
        const card = getProjectCard(item);
        return card ? (card.getAttribute('data-role') || '').trim() : '';
    }

    function getProjectRoles(item) {
        const roleStr = getProjectRole(item);
        if (!roleStr) return [];
        return roleStr.split(/\s*(?:&|,|\||\/|and)\s*/i).map(function(r) { return r.trim(); }).filter(Boolean);
    }

    function fillProjectRoleOptions() {
        if (!projectRoleSelect || projectItems.length === 0) {
            return;
        }

        const existingValues = new Set(Array.from(projectRoleSelect.options).map(function(option) {
            return option.value;
        }));
        const roles = Array.from(new Set(projectItems.flatMap(getProjectRoles))).filter(Boolean)
            .sort(function(a, b) {
                return a.localeCompare(b, 'nl');
            });

        roles.forEach(function(role) {
            if (existingValues.has(role)) {
                return;
            }

            const option = document.createElement('option');
            option.value = role;
            option.textContent = role;
            projectRoleSelect.appendChild(option);
        });
    }

    function updateProjectsShowMoreButton(visibleProjectCount) {
        if (!projectsShowMoreWrap || !projectsShowMoreBtn) {
            return;
        }

        const needsToggle = visibleProjectCount > projectLimit;
        projectsShowMoreWrap.classList.toggle('d-none', !needsToggle);
        projectsShowMoreBtn.textContent = projectsExpanded ? 'Toon minder' : 'Toon meer';
        projectsShowMoreBtn.setAttribute('aria-expanded', String(projectsExpanded));
    }

    function applyProjectFilters() {
        if (!projectGrid || projectItems.length === 0) {
            return;
        }

        const sortValue = projectSortSelect ? projectSortSelect.value : 'newest';
        const selectedRole = projectRoleSelect ? projectRoleSelect.value : 'all';

        const filteredItems = projectItems.filter(function(item) {
            if (selectedRole === 'all') {
                return true;
            }

            return getProjectRoles(item).some(function(r) { return r === selectedRole; });
        });

        const sortedItems = filteredItems.slice().sort(function(a, b) {
            const yearDiff = getProjectYear(a) - getProjectYear(b);
            if (yearDiff !== 0) {
                return sortValue === 'oldest' ? yearDiff : -yearDiff;
            }

            return (originalProjectOrder.get(a) || 0) - (originalProjectOrder.get(b) || 0);
        });

        sortedItems.forEach(function(item) {
            projectGrid.appendChild(item);
        });

        projectItems.forEach(function(item) {
            item.classList.add('project-hidden');
        });

        sortedItems.forEach(function(item, index) {
            const shouldShow = projectsExpanded || index < projectLimit;
            item.classList.toggle('project-hidden', !shouldShow);
        });

        updateProjectsShowMoreButton(sortedItems.length);
    }

    if (projectSortSelect) {
        projectSortSelect.addEventListener('change', function() {
            applyProjectFilters();
        });
    }

    if (projectRoleSelect) {
        projectRoleSelect.addEventListener('change', function() {
            applyProjectFilters();
        });
    }

    if (projectResetButton) {
        projectResetButton.addEventListener('click', function() {
            if (projectSortSelect) {
                projectSortSelect.value = 'newest';
            }

            if (projectRoleSelect) {
                projectRoleSelect.value = 'all';
            }

            projectsExpanded = false;
            applyProjectFilters();
        });
    }

    if (projectsShowMoreBtn) {
        projectsShowMoreBtn.addEventListener('click', function() {
            projectsExpanded = !projectsExpanded;
            applyProjectFilters();
        });
    }

    fillProjectRoleOptions();

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
    const modalActions = document.getElementById('projectModalActions');
    const modalBuildLink = document.getElementById('projectModalBuildLink');
    const modalRepoLink = document.getElementById('projectModalRepoLink');
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
        const buildLink = source.getAttribute('data-build') || source.getAttribute('data-link') || '';
        const repoLink = source.getAttribute('data-repo') || '';
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
        if (modalBuildLink) {
            const hasBuildLink = Boolean(buildLink);
            modalBuildLink.href = hasBuildLink ? buildLink : '#';
            modalBuildLink.textContent = hasBuildLink ? 'Download build' : 'Geen build beschikbaar';
            modalBuildLink.classList.toggle('disabled', !hasBuildLink);
            modalBuildLink.setAttribute('aria-disabled', String(!hasBuildLink));
            if (hasBuildLink) {
                modalBuildLink.setAttribute('download', '');
            } else {
                modalBuildLink.removeAttribute('download');
            }
        }

        if (modalRepoLink) {
            const hasRepoLink = Boolean(repoLink);
            modalRepoLink.href = hasRepoLink ? repoLink : '#';
            modalRepoLink.textContent = hasRepoLink ? 'Git repo' : 'Geen repo beschikbaar';
            modalRepoLink.classList.toggle('disabled', !hasRepoLink);
            modalRepoLink.setAttribute('aria-disabled', String(!hasRepoLink));
            modalRepoLink.removeAttribute('download');
        }
    }

    if (modalBuildLink) {
        modalBuildLink.addEventListener('click', function(event) {
            const href = modalBuildLink.getAttribute('href') || '';
            const isAvailable = href && href !== '#';
            if (!isAvailable) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
            const downloadLink = document.createElement('a');
            downloadLink.href = href;
            downloadLink.download = '';
            downloadLink.rel = 'noopener';
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    }

    if (modalRepoLink) {
        modalRepoLink.addEventListener('click', function(event) {
            const href = modalRepoLink.getAttribute('href') || '';
            const isAvailable = href && href !== '#';
            if (!isAvailable) {
                event.preventDefault();
                return;
            }

            event.preventDefault();
            window.open(href, '_blank', 'noopener');
        });
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

    applyProjectFilters();

    if (projectModal) {
        projectModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            if (!button) {
                return;
            }
            fillProjectModal(button);
        });
    }

    document.querySelectorAll('[data-copy-email]').forEach(function(button) {
        button.addEventListener('click', async function() {
            const email = this.getAttribute('data-copy-email');
            if (!email) {
                return;
            }

            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(email);
                } else {
                    const tempInput = document.createElement('textarea');
                    tempInput.value = email;
                    tempInput.setAttribute('readonly', '');
                    tempInput.style.position = 'fixed';
                    tempInput.style.opacity = '0';
                    document.body.appendChild(tempInput);
                    tempInput.select();
                    document.execCommand('copy');
                    document.body.removeChild(tempInput);
                }

                const originalTitle = this.getAttribute('title') || 'Kopieer e-mailadres';
                this.setAttribute('title', 'Gekopieerd naar klembord');

                setTimeout(() => {
                    this.setAttribute('title', originalTitle);
                }, 1500);
            } catch (error) {
                window.prompt('Kopieer dit e-mailadres:', email);
            }
        });
    });
});
