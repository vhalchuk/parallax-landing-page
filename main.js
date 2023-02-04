import './style.css';

function main() {
    initSlider();
    initEmailForm();
    initFadeUpAnimations();
}

main();

function initSlider() {
    const slideBtns = document.querySelectorAll('[data-slideBtn]');
    const slideContainer = document.querySelector('[data-slideContainer]');
    const slides = [...document.querySelectorAll('[data-slide]')];
    const slideImages = document.querySelectorAll('[data-slide] img');

    let currentIndex = 0;
    let isMoving = 0;

    slideBtns.forEach((btn) =>
        btn.addEventListener('click', (e) => {
            if (isMoving) return;

            isMoving = true;

            e.currentTarget.id === 'prev' ? currentIndex-- : currentIndex++;

            slideContainer.dispatchEvent(new Event('sliderMove'));
        })
    );
    slideContainer.addEventListener('sliderMove', () => {
        slideContainer.style.transform = `translateX(-${
            currentIndex * slides[0].clientWidth
        }px)`;
        removeDisabledAttribute(slideBtns);

        currentIndex === 0 && addDisabledAttribute([slideBtns[0]]);
    });
    slideContainer.addEventListener('transitionend', () => (isMoving = false));

    // disable image drag events
    slideImages.forEach((img) => (img.ondragstart = () => false));

    // intersection observer for slider
    const slideObserver = new IntersectionObserver(
        (slide) => {
            if (slide[0].isIntersecting) {
                addDisabledAttribute([slideBtns[1]]);
            }
        },
        {
            threshold: 0.75,
        }
    );
    slideObserver.observe(slides.at(-1));
}

function initEmailForm() {
    const contactForm = document.querySelector('#contact-form');
    const contactBtn = document.querySelector('#contact-btn');
    const contactInput = document.querySelector('#email');

    function fakePostEmail(email) {
        console.info(email);
        return new Promise((resolve) => setTimeout(resolve, 2000));
    }

    const contactBtnViews = {
        pending: `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class='animate-spin' fill="currentColor" viewBox="0 0 256 256"><rect width="256" height="256" fill="none"></rect><line x1="128" y1="32" x2="128" y2="64" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="224" y1="128" x2="192" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="195.9" y1="195.9" x2="173.3" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="128" y1="224" x2="128" y2="192" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="195.9" x2="82.7" y2="173.3" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="32" y1="128" x2="64" y2="128" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line><line x1="60.1" y1="60.1" x2="82.7" y2="82.7" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="24"></line></svg>
            <span class="uppercase tracking-wide animate-pulse">
                Sending...
            </span>`,
        success: `
            <span class="uppercase tracking-wide">
                Thank you!
            </span>
            <span class="uppercase tracking-wide">
                ✌️
            </span>`,
    };

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        addDisabledAttribute([contactForm, contactBtn]);
        contactBtn.innerHTML = contactBtnViews.pending;
        const userEmail = contactInput.value;
        contactInput.style.display = 'none';
        await fakePostEmail(userEmail);
        contactBtn.innerHTML = contactBtnViews.success;
    });
}

function initFadeUpAnimations() {
    function fadeUpObserverCallback(entries) {
        entries.forEach((entry) => {
            const element = entry.target;
            if (entry.isIntersecting) {
                element.classList.add('faded');
                fadeUpObserver.unobserve(element);
                element.addEventListener(
                    'transitionend',
                    () => {
                        element.classList.remove('fade-up', 'faded');
                    },
                    { once: true }
                );
            }
        });
    }

    const fadeUpObserverOptions = {
        threshold: 0.6,
    };

    const fadeUpObserver = new IntersectionObserver(
        fadeUpObserverCallback,
        fadeUpObserverOptions
    );

    document.querySelectorAll('.fade-up').forEach((element) => {
        fadeUpObserver.observe(element);
    });
}

function removeDisabledAttribute(els) {
    els.forEach((el) => el.removeAttribute('disabled'));
}

function addDisabledAttribute(els) {
    els.forEach((el) => el.setAttribute('disabled', 'true'));
}
