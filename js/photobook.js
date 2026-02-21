document.addEventListener("DOMContentLoaded", () => {
    randomizeMargins();
});

/**
 * Apply a randomized margin to each photo window to make them not perfectly aligned
 */
function randomizeMargins() {
    let photos = document.querySelectorAll(".photo-window");
    photos.forEach(photo => {
        let hmin = -6;
        let hmax = 6;
        let hmargin = Math.floor(Math.random() * (hmax - hmin + 1) + hmin);

        let vmin = 10 - 6;
        let vmax = 10 + 6;
        let vmargin = Math.floor(Math.random() * (vmax - vmin + 1) + vmin);

        photo.style.margin = `${vmargin}px ${hmargin}px`;
    });
}