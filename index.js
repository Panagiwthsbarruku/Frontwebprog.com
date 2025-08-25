const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("show");
  menuToggle.classList.toggle("open");
});

// Κλείσιμο μενού όταν πατιέται link
const navLinks = document.querySelectorAll("nav a");
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
    menuToggle.classList.remove("open");
  });
});
     // --- Typing Effect for Hero Section ---
            const dynamicTextElement = document.getElementById('dynamic-text');
            const phrases = ["περισσότερα", "τι κάνω", "τι μπορώ να προσφέρω"];
            let phraseIndex = 0;
            let charIndex = 0;
            let isDeleting = false;
            const typingSpeed = 100; // ms per character
            const deletingSpeed = 50; // ms per character
            const pauseBeforeDelete = 1500; // ms
            const pauseBeforeType = 500; // ms

            function typeEffect() {
                if (!dynamicTextElement) return;

                const currentPhrase = phrases[phraseIndex];
                if (isDeleting) {
                    dynamicTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                    charIndex--;
                } else {
                    dynamicTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                    charIndex++;
                }

                let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

                if (!isDeleting && charIndex === currentPhrase.length) {
                    currentSpeed = pauseBeforeDelete;
                    isDeleting = true;
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    currentSpeed = pauseBeforeType;
                }

                setTimeout(typeEffect, currentSpeed);
            }
             // --- Typing Effect for Learn Coding Section ---
            const dynamicTextLearnElement = document.getElementById('dynamic-text-learn');
            const learnPhrases = ["προγραμματισμό στα ελληνικά", "βήμα προς βήμα", "με παραδείγματα"];
            let learnPhraseIndex = 0;
            let learnCharIndex = 0;
            let learnIsDeleting = false;
            const learnTypingSpeed = 80;
            const learnDeletingSpeed = 40;
            const learnPauseBeforeDelete = 1200;
            const learnPauseBeforeType = 400;

            function typeEffectLearn() {
                if (!dynamicTextLearnElement) return;

                const currentLearnPhrase = learnPhrases[learnPhraseIndex];
                if (learnIsDeleting) {
                    dynamicTextLearnElement.textContent = currentLearnPhrase.substring(0, learnCharIndex - 1);
                    learnCharIndex--;
                } else {
                    dynamicTextLearnElement.textContent = currentLearnPhrase.substring(0, learnCharIndex + 1);
                    learnCharIndex++;
                }

                let currentLearnSpeed = learnIsDeleting ? learnDeletingSpeed : learnTypingSpeed;

                if (!learnIsDeleting && learnCharIndex === currentLearnPhrase.length) {
                    currentLearnSpeed = learnPauseBeforeDelete;
                    learnIsDeleting = true;
                } else if (learnIsDeleting && learnCharIndex === 0) {
                    learnIsDeleting = false;
                    learnPhraseIndex = (learnPhraseIndex + 1) % learnPhrases.length;
                    currentLearnSpeed = learnPauseBeforeType;
                }

                setTimeout(typeEffectLearn, currentLearnSpeed);
            }
            typeEffect(); // For the hero section
            typeEffectLearn(); // For the learn coding section
//message//
             function selectPackage(pkg) {
    let textarea = document.getElementById("message");

    // Αν θες να αντικαθίσταται το κείμενο:
    textarea.value += "\nΠακέτο: " + pkg;
  }
