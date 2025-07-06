document.addEventListener('DOMContentLoaded', () => {
            // Hamburger Menu functionality
            const hamburger = document.querySelector('.hamburger-menu');
            const navLinksMobile = document.querySelector('.nav-links-mobile');

            if (hamburger && navLinksMobile) {
                hamburger.addEventListener('click', () => {
                    navLinksMobile.classList.toggle('active');
                });

                navLinksMobile.querySelectorAll('a').forEach(link => {
                    link.addEventListener('click', () => {
                        if (navLinksMobile.classList.contains('active')) {
                            navLinksMobile.classList.remove('active');
                        }
                    });
                });
            }

            // --- Gemini API Functions ---
            async function callGeminiAPI(prompt) {
                let chatHistory = [];
                chatHistory.push({ role: "user", parts: [{ text: prompt }] });
                const payload = { contents: chatHistory };
                const apiKey = ""; // Leave empty, Canvas will provide the API key
                const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

                try {
                    const response = await fetch(apiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error("Gemini API error:", errorData);
                        throw new Error(`Gemini API request failed: ${response.statusText}`);
                    }

                    const result = await response.json();
                    if (result.candidates && result.candidates.length > 0 &&
                        result.candidates[0].content && result.candidates[0].content.parts &&
                        result.candidates[0].content.parts.length > 0) {
                        return result.candidates[0].content.parts[0].text;
                    } else {
                        console.warn("Gemini API response structure unexpected:", result);
                        return "Δεν ήταν δυνατή η δημιουργία περιγραφής. Παρακαλώ δοκιμάστε ξανά.";
                    }
                } catch (error) {
                    console.error("Error calling Gemini API:", error);
                    return "Παρουσιάστηκε σφάλμα κατά την επικοινωνία με το Gemini API.";
                }
            }

            // Handle project description improvement buttons
            document.querySelectorAll('.btn-gemini-project').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const projectItem = event.target.closest('.project-item');
                    const descriptionParagraph = projectItem.querySelector('p');
                    const originalDescription = descriptionParagraph.dataset.originalDescription;
                    const projectName = projectItem.querySelector('h3').textContent;
                    // Assuming the first <a> in btn-container is the GitHub/Live Demo link
                    const projectLink = projectItem.querySelector('.btn-container a') ? projectItem.querySelector('.btn-container a').href : 'N/A';

                    if (!originalDescription) {
                        descriptionParagraph.dataset.originalDescription = descriptionParagraph.textContent;
                    }

                    button.disabled = true;
                    button.textContent = 'Φορτώνει...';

                    const prompt = `Βελτίωσε την παρακάτω περιγραφή έργου για ένα portfolio. Κάνε την πιο ελκυστική και επαγγελματική. Το έργο ονομάζεται "${projectName}" και η αρχική περιγραφή είναι: "${originalDescription}". Αναφέρετε τις τεχνολογίες που αναφέρονται στην αρχική περιγραφή (π.χ., HTML, CSS, JavaScript, React, Tailwind CSS, Node.js, Python, Flask) και τον σκοπό του έργου. Το link του έργου είναι: ${projectLink}.`;

                    const generatedText = await callGeminiAPI(prompt);

                    descriptionParagraph.textContent = generatedText;
                    button.textContent = '✨ Βελτίωση Περιγραφής';
                    button.disabled = false;

                    let resetButton = projectItem.querySelector('.btn-reset-project');
                    if (!resetButton) {
                        resetButton = document.createElement('button');
                        resetButton.className = 'btn-reset-project';
                        resetButton.textContent = 'Επαναφορά';
                        projectItem.querySelector('.btn-container').appendChild(resetButton);

                        resetButton.addEventListener('click', () => {
                            descriptionParagraph.textContent = originalDescription;
                            resetButton.remove();
                        });
                    }
                });
            });

            // Handle "Learn More" buttons for skills
            document.querySelectorAll('.btn-gemini-skill').forEach(button => {
                button.addEventListener('click', async (event) => {
                    const skillItem = event.target.closest('.skill-item');
                    const descriptionParagraph = skillItem.querySelector('p');
                    const originalDescription = descriptionParagraph.dataset.originalDescription;
                    const skillName = skillItem.querySelector('h3').textContent;

                    if (!originalDescription) {
                        descriptionParagraph.dataset.originalDescription = descriptionParagraph.textContent;
                    }

                    button.disabled = true;
                    button.textContent = 'Φορτώνει...';

                    const prompt = `Εξήγησε τη σημασία και την εφαρμογή της δεξιότητας "${skillName}" στον τομέα της ανάπτυξης λογισμικού, με βάση την αρχική περιγραφή: "${originalDescription}". Δώσε μια σύντομη και περιεκτική απάντηση.`;

                    const generatedText = await callGeminiAPI(prompt);

                    descriptionParagraph.textContent = generatedText;
                    button.textContent = '✨ Μάθε Περισσότερα';
                    button.disabled = false;

                    let resetButton = skillItem.querySelector('.btn-reset-skill');
                    if (!resetButton) {
                        resetButton = document.createElement('button');
                        resetButton.className = 'btn-reset-skill';
                        resetButton.textContent = 'Επαναφορά';
                        skillItem.querySelector('div:last-child').appendChild(resetButton); // Append to the div containing the button

                        resetButton.addEventListener('click', () => {
                            descriptionParagraph.textContent = originalDescription;
                            resetButton.remove();
                        });
                    }
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

            // Start typing effects when the page loads
            typeEffect(); // For the hero section
            typeEffectLearn(); // For the learn coding section
        });