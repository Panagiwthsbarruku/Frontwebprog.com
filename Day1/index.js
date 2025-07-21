document.addEventListener('DOMContentLoaded', () => {
    // Επιλέγουμε το κουμπί εναλλαγής χρησιμοποιώντας την κλάση του
    const toggleButton = document.querySelector('.toggle-menu');
    // Επιλέγουμε τη λίστα πλοήγησης χρησιμοποιώντας το ID της
    const navList = document.getElementById('mainNav');
    // Επιλέγουμε το εικονίδιο μέσα στο κουμπί εναλλαγής
    const menuIcon = toggleButton.querySelector('i');

    // Προσθέτουμε event listener για κλικ στο κουμπί εναλλαγής
    toggleButton.addEventListener('click', () => {
        // Εναλλάσσουμε την κλάση 'active' στη λίστα πλοήγησης για να την εμφανίσουμε/κρύψουμε
        navList.classList.toggle('active');

        // Εναλλάσσουμε το εικονίδιο μεταξύ bars (menu κλειστό) και times (menu ανοιχτό)
        menuIcon.classList.toggle('fa-bars');
        menuIcon.classList.toggle('fa-times');

        // Εναλλάσσουμε το χαρακτηριστικό aria-expanded για λόγους προσβασιμότητας
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        toggleButton.setAttribute('aria-expanded', !isExpanded);

        // Προαιρετικό: Προσθέτουμε κλάσεις animation όταν το menu γίνεται ενεργό.
        // Για πιο ομαλές toggle animations, μπορεί να είναι προτιμότερη η χρήση CSS transitions.
        if (navList.classList.contains('active')) {
            navList.classList.add('animate__animated', 'animate__fadeIn');
        } else {
            // Αφαιρούμε τις κλάσες animation όταν κρύβεται για να επιτρέψουμε επαναλαμβανόμενα animations
            navList.classList.remove('animate__animated', 'animate__fadeIn');
        }
    });

    // Προαιρετικό: Κλείνουμε το menu όταν γίνεται κλικ σε ένα link πλοήγησης (ειδικά για κινητά)
    navList.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            // Ελέγχουμε αν το menu είναι ενεργό
            if (navList.classList.contains('active')) {
                // Το κλείνουμε
                navList.classList.remove('active');
                // Επαναφέρουμε το εικονίδιο στις "γραμμές"
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
                // Ενημερώνουμε το aria-expanded
                toggleButton.setAttribute('aria-expanded', 'false');
                // Αφαιρούμε και τις κλάσες animation κατά το κλείσιμο
                navList.classList.remove('animate__animated', 'animate__fadeIn');
            }
        });
    });
});