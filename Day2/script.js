document.addEventListener('DOMContentLoaded', () => {
    // --- Menu Toggle Functionality (παραμένει ως έχει) ---
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const body = document.body;

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // body.classList.toggle('menu-open');
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    // body.classList.remove('menu-open');
                }
            });
        });
    }
    const listenButton = document.querySelector('.listen-button');
    const radioStreamUrl = 'http://stream.radiojar.com/t0x7dyqmsuhvv'; 
    let audioPlayer = null; 
    if (listenButton) {
        listenButton.addEventListener('click', () => {
            if (audioPlayer && !audioPlayer.paused) {
                audioPlayer.pause();
                audioPlayer = null; 
                listenButton.innerHTML = '<i class="fas fa-play"></i> ΑΚΟΥΣΤΕ';
                listenButton.classList.remove('playing');
                console.log("Ραδιοφωνικός σταθμός σταμάτησε.");
            } else {
                audioPlayer = new Audio(radioStreamUrl);
                audioPlayer.volume = 0.8;
                audioPlayer.play()
                    .then(() => {
                        console.log("Ραδιοφωνικός σταθμός ξεκίνησε.");
                        listenButton.innerHTML = '<i class="fas fa-pause"></i> ΠΑΥΣΗ';
                        listenButton.classList.add('playing');
                    })
                    .catch(error => {
                        console.error('Σφάλμα στην αναπαραγωγή του ραδιοφωνικού σταθμού:', error);
                        alert('Αδυναμία φόρτωσης του ραδιοφωνικού σταθμού. Παρακαλώ δοκιμάστε ξανά αργότερα.');
                        listenButton.innerHTML = '<i class="fas fa-play"></i> ΑΚΟΥΣΤΕ';
                        listenButton.classList.remove('playing');
                    });
            }
        });

        if (audioPlayer) {
            audioPlayer.addEventListener('error', (e) => {
                console.error('Σφάλμα αναπαραγωγής ήχου:', e);
                alert('Παρουσιάστηκε σφάλμα στην αναπαραγωγή του ραδιοφωνικού σταθμού.');
                listenButton.innerHTML = '<i class="fas fa-play"></i> ΑΚΟΥΣΤΕ';
                listenButton.classList.remove('playing');
                audioPlayer = null;
            });
        }
    }
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');

    function addChatMessage(username, message, isSelf = false) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        if (isSelf) {
            messageElement.classList.add('self-message');
        }
        messageElement.innerHTML = `<strong>${username}:</strong> ${message}`;
        chatMessagesContainer.appendChild(messageElement);
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }

    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = chatInput.value.trim();
        if (message) {
            console.log("Sending message:", message);
            addChatMessage("Εσύ", message, true);
            chatInput.value = '';
        }
    });

    setTimeout(() => addChatMessage("Μουσικόφιλος", "Πολύ ωραία μουσική, μπράβο σας!"), 2000);
    setTimeout(() => addChatMessage("LiveFan", "Τι υπέροχη ατμόσφαιρα!"), 4000);
    setTimeout(() => addChatMessage("DJ_Groove", "Παίξτε κάτι πιο upbeat μετά!"), 6000);
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    // ... (Your existing menu toggle, radio player, chat code) ...

    // --- Share Stream Button Functionality ---
    const shareStreamButton = document.getElementById('share-stream-button');

    if (shareStreamButton) {
        shareStreamButton.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior

            const pageUrl = window.location.href; // Gets the URL of your current page
            const pageTitle = "Live Music Stream - " + document.title; // Customize title for sharing

            // Check if the Web Share API is available (modern browsers on mobile/desktop)
            if (navigator.share) {
                navigator.share({
                        title: pageTitle,
                        url: pageUrl,
                    })
                    .then(() => console.log('Web Share API successful'))
                    .catch((error) => console.error('Web Share API failed:', error));
            } else {
                const fallbackMessage = `Μοιραστείτε αυτό το live stream! Αντιγράψτε τον σύνδεσμο: \n\n${pageUrl}`;
                
                navigator.clipboard.writeText(pageUrl).then(() => {
                    alert('Ο σύνδεσμος αντιγράφηκε στο πρόχειρο!\n\n' + fallbackMessage);
                }).catch(() => {
                    // If clipboard API fails (e.g., not secure context, or permission denied)
                    prompt('Αντιγράψτε αυτόν τον σύνδεσμο για να μοιραστείτε:', pageUrl);
                });
            }
        });
    }

    // ... (Rest of your existing script.js code) ...
});