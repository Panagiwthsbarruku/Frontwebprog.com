 const input = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const chatBox = document.getElementById('chatBox');

  const responses = {
    "κακοποίηση": "Αν βιώνεις ή υποψιάζεσαι κακοποίηση, μπορείς να καλέσεις τη Γραμμή SOS 15900 ή να μιλήσεις με έναν εκπρόσωπο.",
    "παιδί": "Η προστασία των παιδιών είναι προτεραιότητα. Αν ανησυχείς για την ασφάλεια ενός παιδιού, κάλεσε το 1056.",
    "γυναίκα": "Οι γυναίκες έχουν δικαίωμα στην ασφάλεια. Βοήθεια υπάρχει στη γραμμή SOS 15900.",
    "εκπρόσωπος": "Σε συνδέω με έναν εκπρόσωπο. <a href='tel:+302111234567'>Κάλεσε τώρα: 211 1234567</a>",
    "βοήθεια": "Πες μου με τι χρειάζεσαι βοήθεια: κακοποίηση, παιδί, γυναίκα, εκπρόσωπος;"
  };

  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSend();
  });

  function handleSend() {
    const message = input.value.trim().toLowerCase();
    if (message) {
      addMessage("Εσύ", message);
      respond(message);
      input.value = '';
    }
  }

  function addMessage(sender, text) {
    const p = document.createElement('p');
    p.innerHTML = `<strong>${sender}:</strong> ${text}`;
    chatBox.insertBefore(p, input);
  }

  function respond(message) {
    let reply = "Συγγνώμη, δεν κατάλαβα. Πες μου με τι χρειάζεσαι βοήθεια (π.χ. κακοποίηση, παιδί, γυναίκα, εκπρόσωπος)";
    for (let key in responses) {
      if (message.includes(key)) {
        reply = responses[key];
        break;
      }
    }
    addMessage("Assistan", reply);
  }