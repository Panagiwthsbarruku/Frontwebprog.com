document.getElementById('contact-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Αποτρέπει την προεπιλεγμένη υποβολή της φόρμας
    const serviceID = "service_g3pdvpo";
    const templateID = "template_km513sh";

    // Στείλτε το email
    emailjs.sendForm(serviceID, templateID, this)
        .then(() => {
            alert('Το μήνυμα στάλθηκε με επιτυχία!');
        }, (error) => {
            alert('Αποτυχία αποστολής του μηνύματος... ' + JSON.stringify(error));
        });
});
