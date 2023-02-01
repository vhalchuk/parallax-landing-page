import './style.css';

// IMAGE SLIDER
const slideBtns = document.querySelectorAll('[data-slideBtn]');
const slideContainer = document.querySelector('[data-slideContainer]');
const slides = [...document.querySelectorAll('[data-slide]')];
let currentIndex = 0;
let isMoving = 0;

// remove/add attribute
function removeDisabledAttribute(els) {
    els.forEach((el) => el.removeAttribute('disabled'));
}

function addDisabledAttribute(el) {
    el.setAttribute('disabled', 'true');
}

// event handlers
function handleSlideBtnClick(e) {
    if (isMoving) return;

    isMoving = true;

    e.currentTarget.id === 'prev' ? currentIndex-- : currentIndex++;

    slideContainer.dispatchEvent(new Event('sliderMove'));
}

// event listeners
slideBtns.forEach((btn) => btn.addEventListener('click', handleSlideBtnClick));
slideContainer.addEventListener('sliderMove', () => {
    slideContainer.style.transform = `translateX(-${
        currentIndex * slides[0].clientWidth
    }px)`;
    removeDisabledAttribute(slideBtns);

    currentIndex === 0 && addDisabledAttribute(slideBtns[0]);
});

// transition end event
slideContainer.addEventListener('transitionend', () => (isMoving = false));

// disable image drag events
document
    .querySelectorAll('[data-slide] img')
    .forEach((img) => (img.ondragstart = () => false));

// intersection observer for slider
const slideObserver = new IntersectionObserver(
    (slide) => {
        if (slide[0].isIntersecting) {
            console.log('slideBtns[1]', slideBtns[1]);
            addDisabledAttribute(slideBtns[1]);
        }
    },
    {
        threshold: 0.75,
    }
);
slideObserver.observe(slides.at(-1));
