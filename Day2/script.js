document.addEventListener('DOMContentLoaded', () => {

    // Κώδικας για το μενού (Menu Toggle)
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const menuIcon = menuToggle.querySelector('i');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            if (mainNav.classList.contains('active')) {
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            } else {
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    menuIcon.classList.remove('fa-times');
                    menuIcon.classList.add('fa-bars');
                }
            });
        });
    }

    // Κώδικας για τα κουμπιά "ΑΚΟΥΣΤΕ"
    const listenButtons = document.querySelectorAll('.listen-button');
    const radioStreamUrl = 'https://stream.radiojar.com/t0x7dyqmsuhvv'; // Έγινε αλλαγή από http σε https
    let audioPlayer = null; 

    // Δημιουργούμε μια συνάρτηση που χειρίζεται την αναπαραγωγή
    function togglePlayback(button) {
        if (audioPlayer && !audioPlayer.paused) {
            audioPlayer.pause();
            audioPlayer = null; 
            listenButtons.forEach(btn => {
                btn.innerHTML = '<i class="fa-solid fa-play"></i> ΑΚΟΥΣΤΕ';
                btn.classList.remove('playing');
            });
            console.log("Ραδιοφωνικός σταθμός σταμάτησε.");
        } else {
            audioPlayer = new Audio(radioStreamUrl);
            audioPlayer.volume = 0.8;
            audioPlayer.play()
                .then(() => {
                    console.log("Ραδιοφωνικός σταθμός ξεκίνησε.");
                    listenButtons.forEach(btn => {
                        btn.innerHTML = '<i class="fa-solid fa-pause"></i> ΠΑΥΣΗ';
                        btn.classList.add('playing');
                    });
                })
                .catch(error => {
                    console.error('Σφάλμα στην αναπαραγωγή του ραδιοφωνικού σταθμού:', error);
                    alert('Αδυναμία φόρτωσης του ραδιοφωνικού σταθμού. Παρακαλώ δοκιμάστε ξανά αργότερα.');
                    listenButtons.forEach(btn => {
                        btn.innerHTML = '<i class="fa-solid fa-play"></i> ΑΚΟΥΣΤΕ';
                        btn.classList.remove('playing');
                    });
                });
        }
    }

    // Προσθέτουμε τον event listener σε κάθε κουμπί
    listenButtons.forEach(button => {
        button.addEventListener('click', () => togglePlayback(button));
    });

    // Κώδικας για το smooth scrolling
    document.querySelectorAll('.main-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Κώδικας για το κουμπί Share Stream
    const shareStreamButton = document.getElementById('share-stream-button');

    if (shareStreamButton) {
        shareStreamButton.addEventListener('click', (e) => {
            e.preventDefault();
            const pageUrl = window.location.href;
            const pageTitle = "Live Music Stream - " + document.title;
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
                    prompt('Αντιγράψτε αυτόν τον σύνδεσμο για να μοιραστείτε:', pageUrl);
                });
            }
        });
    }
});
