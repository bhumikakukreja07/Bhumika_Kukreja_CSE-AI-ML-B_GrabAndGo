// Function to dynamically create popup HTML structure
function setupPopupAnimation(triggerId, contentId) {
    const triggerElement = document.getElementById(triggerId);
    const contentElement = document.getElementById(contentId);

    if (!triggerElement || !contentElement) {
        console.error('Trigger or content element not found');
        return;
    }

    // Create popup container
    const popup = document.createElement('div');
    popup.id = 'popup';
    popup.className = 'popup';
    popup.style.display = 'none';

    // Create close button
    const closeButton = document.createElement('button');
    closeButton.id = 'close-button';
    closeButton.className = 'close-btn';
    closeButton.textContent = 'X';

    // Create popup content container
    const popupContent = document.createElement('div');
    popupContent.id = 'popup-content';
    popupContent.className = 'popup-content';

    // Append close button and content container to popup
    popup.appendChild(closeButton);
    popup.appendChild(popupContent);

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';
    overlay.style.display = 'none';

    // Append popup and overlay to the body
    document.body.appendChild(overlay);
    document.body.appendChild(popup);

    // Click event for the trigger element
    triggerElement.addEventListener('click', () => {
        // Set the popup content to the inner HTML of the content element
        popupContent.innerHTML = contentElement.innerHTML;

        // Show the overlay and popup
        overlay.style.display = 'block';
        popup.style.display = 'block';

        // Reset styles before animation
        gsap.set(popup, { y: -window.innerHeight, opacity: 0 });
        gsap.set(overlay, { opacity: 0 });

        // Animate the overlay to fade in
        gsap.to(overlay, { opacity: 1, duration: 0.5 });

        // Animate the popup from the top to the center
        gsap.to(popup, {
            y: (window.innerHeight / 2) - (popup.offsetHeight / 2),
            opacity: 1,
            duration: 1,
            ease: 'power3.out'
        });
    });

    // Click event for the overlay to close the popup
    overlay.addEventListener('click', closePopup);

    // Click event for the close button inside the popup
    closeButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent the click event from propagating to the overlay
        closePopup();
    });

    // Function to close the popup
    function closePopup() {
        // Animate the popup back to the top
        gsap.to(popup, {
            y: -window.innerHeight,
            opacity: 0,
            duration: 0.7,
            ease: 'power3.in',
            onComplete: () => {
                popup.style.display = 'none';
            }
        });

        // Animate the overlay to fade out
        gsap.to(overlay, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                overlay.style.display = 'none';
            }
        });
    }
}

export { setupPopupAnimation };