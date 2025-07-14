import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
// No Firestore imports needed for data operations anymore
// import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, query, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// Firebase configuration (still needed for initializeApp, even if Firestore isn't used for data)
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id'; // Still useful for a unique path if you decide to re-enable Firestore later

// Initialize Firebase (Minimal initialization)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Still initialize auth, but we won't actively use it for user state

// --- START CHANGES FOR IN-MEMORY DATA ---

// Define initial, static debt data
// Ορισμός αρχικών, στατικών δεδομένων χρεών
const initialDebts = [
    { id: '1', customerName: 'Παπαδόπουλος Αθανάσιος', initialAmount: 150.00, currentAmount: 150.00, lastPaymentDate: null, createdAt: new Date().toISOString() },
    { id: '2', customerName: 'Βασιλείου Ελένη', initialAmount: 85.50, currentAmount: 50.00, lastPaymentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() }, // 5 days ago
    { id: '3', customerName: 'Γεωργίου Νίκος', initialAmount: 300.00, currentAmount: 300.00, lastPaymentDate: null, createdAt: new Date().toISOString() },
    { id: '4', customerName: 'Δημητρίου Μαρία', initialAmount: 120.00, currentAmount: 0.00, lastPaymentDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() }, // 10 days ago
    { id: '5', customerName: 'Κωνσταντίνου Σοφία', initialAmount: 220.00, currentAmount: 110.00, lastPaymentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), createdAt: new Date().toISOString() } // 2 days ago
];

// This will hold the current state of debts in memory
// Αυτό θα κρατά την τρέχουσα κατάσταση των χρεών στη μνήμη
let debtsInMemory = [];

// Helper function to generate unique IDs for new debts (since we're not using Firestore IDs)
// Βοηθητική συνάρτηση για τη δημιουργία μοναδικών IDs για νέα χρέη (αφού δεν χρησιμοποιούμε IDs του Firestore)
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// UI Elements
const authSection = document.getElementById('authSection'); // This will always be hidden
const debtManagementSection = document.getElementById('debtManagementSection');
const userInfoSection = document.getElementById('userInfoSection');
const currentUserIdSpan = document.getElementById('currentUserId'); // Will display "Demo User"

const addDebtForm = document.getElementById('addDebtForm');
const customerNameInput = document.getElementById('customerName');
const initialAmountInput = document.getElementById('initialAmount');
const debtListDiv = document.getElementById('debtList');
const searchCustomerInput = document.getElementById('searchCustomer');
const loadingMessage = document.getElementById('loadingMessage');
const noResultsMessage = document.getElementById('noResults');
const totalOutstandingAmountSpan = document.getElementById('totalOutstandingAmount');

const messageModal = document.getElementById('messageModal');
const modalMessage = document.getElementById('modalMessage');
const modalButtons = document.getElementById('modalButtons');

// No currentUserId variable needed as we bypass Firebase Auth for data
// let currentUserId = null;
let unsubscribeSnapshot = null; // No snapshot listener needed for in-memory data

// Function to show custom modal messages
function showMessageModal(message, type = 'info', onConfirm = null) {
    modalMessage.innerHTML = message;
    modalButtons.innerHTML = '';
    messageModal.classList.remove('hidden');

    if (type === 'info') {
        const okButton = document.createElement('button');
        okButton.textContent = 'Εντάξει';
        okButton.className = 'px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300';
        okButton.onclick = () => messageModal.classList.add('hidden');
        modalButtons.appendChild(okButton);
    } else if (type === 'confirm') {
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Ακύρωση';
        cancelButton.className = 'px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300';
        cancelButton.onclick = () => messageModal.classList.add('hidden');
        modalButtons.appendChild(cancelButton);

        const confirmButton = document.createElement('button');
        confirmButton.textContent = 'Επιβεβαίωση';
        confirmButton.className = 'px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300';
        confirmButton.onclick = () => {
            messageModal.classList.add('hidden');
            if (onConfirm) onConfirm();
        };
        modalButtons.appendChild(confirmButton);
    }
}

// Function to initialize and display the demo data
// Συνάρτηση για αρχικοποίηση και εμφάνιση των δεδομένων του demo
function initializeDemo() {
    // Reset debtsInMemory to initial data for a fresh start
    debtsInMemory = JSON.parse(JSON.stringify(initialDebts)); // Deep copy to avoid modifying initialDebts directly
    
    currentUserIdSpan.textContent = "Demo User"; // Display something friendly
    authSection.classList.add('hidden'); // Ensure auth section is hidden
    debtManagementSection.classList.remove('hidden'); // Ensure debt management is visible
    userInfoSection.classList.remove('hidden'); // Ensure user info is visible
    
    fetchCustomerDebts(); // Render the initial debts
}

// Call the initialization function when the script loads
initializeDemo();

// Add New Debt Form Submission
addDebtForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const customerName = customerNameInput.value.trim();
    const initialAmount = parseFloat(initialAmountInput.value);

    if (!customerName || isNaN(initialAmount) || initialAmount <= 0) {
        showMessageModal("Παρακαλώ συμπληρώστε έγκυρο όνομα πελάτη και αρχικό ποσό.");
        return;
    }

    // Add to in-memory array
    const newDebt = {
        id: generateUniqueId(), // Generate a unique ID
        customerName: customerName,
        initialAmount: initialAmount,
        currentAmount: initialAmount,
        lastPaymentDate: null,
        createdAt: new Date().toISOString()
    };
    debtsInMemory.push(newDebt);

    showMessageModal("Η οφειλή προστέθηκε επιτυχώς!");
    addDebtForm.reset();
    fetchCustomerDebts(); // Re-render the list with the new debt
});

// Fetch and Display Customer Debts (now from in-memory array)
function fetchCustomerDebts() {
    loadingMessage.classList.remove('hidden');
    debtListDiv.innerHTML = '';

    let totalOutstanding = 0;
    debtsInMemory.forEach(debt => {
        totalOutstanding += debt.currentAmount;
    });

    totalOutstandingAmountSpan.textContent = totalOutstanding.toFixed(2);

    const searchTerm = searchCustomerInput.value.toLowerCase().trim();
    const filteredDebts = debtsInMemory.filter(debt =>
        debt.customerName.toLowerCase().includes(searchTerm)
    );

    filteredDebts.sort((a, b) => a.customerName.localeCompare(b.customerName));

    loadingMessage.classList.add('hidden');
    debtListDiv.innerHTML = '';

    if (filteredDebts.length === 0) {
        noResultsMessage.classList.remove('hidden');
    } else {
        noResultsMessage.classList.add('hidden');
        filteredDebts.forEach(debt => {
            renderDebtItem(debt);
        });
    }
}

// Render a single debt item
function renderDebtItem(debt) {
    const debtItem = document.createElement('div');
    debtItem.className = 'debt-item p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center';
    debtItem.dataset.id = debt.id;

    const lastPaymentDisplay = debt.lastPaymentDate ? new Date(debt.lastPaymentDate).toLocaleDateString('el-GR') : 'Καμία';

    debtItem.innerHTML = `
        <div class="flex-grow mb-2 md:mb-0 w-full md:w-auto">
            <p class="text-lg font-medium text-gray-900 flex items-center">
                <i class="fas fa-user-circle text-blue-500 mr-2"></i>
                <span class="customer-name-display">${debt.customerName}</span>
            </p>
            <p class="text-gray-600">Αρχικό Ποσό: <span class="font-semibold text-green-700">€${debt.initialAmount.toFixed(2)}</span></p>
            <p class="text-gray-600">Τρέχον Ποσό: <span class="font-bold text-red-700 current-amount-display">€${debt.currentAmount.toFixed(2)}</span></p>
            <p class="text-gray-600 text-sm">Τελευταία Πληρωμή: <span class="last-payment-display">${lastPaymentDisplay}</span></p>
        </div>
        <div class="flex space-x-2 mt-3 md:mt-0 w-full md:w-auto justify-end">
            <button class="edit-btn px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300 text-sm">
                <i class="fas fa-edit mr-1"></i>Επεξεργασία
            </button>
            <button class="pay-btn px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300 text-sm">
                <i class="fas fa-money-bill-wave mr-1"></i>Πληρωμή
            </button>
            <button class="delete-btn px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm">
                <i class="fas fa-trash-alt mr-1"></i>Διαγραφή
            </button>
        </div>
    `;

    debtListDiv.appendChild(debtItem);

    // Add event listeners to buttons
    debtItem.querySelector('.edit-btn').addEventListener('click', () => startEditDebt(debt));
    debtItem.querySelector('.pay-btn').addEventListener('click', () => initiatePayment(debt));
    debtItem.querySelector('.delete-btn').addEventListener('click', () => confirmDelete(debt.id));
}

// Search functionality
searchCustomerInput.addEventListener('input', () => {
    fetchCustomerDebts();
});

// Start Edit Debt
function startEditDebt(debt) {
    const debtItem = document.querySelector(`.debt-item[data-id="${debt.id}"]`);
    if (!debtItem) return;

    debtItem.innerHTML = `
        <div class="flex-grow grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
            <input type="text" value="${debt.customerName}" class="p-2 border border-gray-300 rounded-md w-full edit-customer-name" placeholder="Όνομα Πελάτη">
            <input type="number" value="${debt.initialAmount}" class="p-2 border border-gray-300 rounded-md w-full edit-initial-amount" placeholder="Αρχικό Ποσό" min="0.01" step="0.01">
            <div class="flex justify-end space-x-2 mt-2 md:mt-0 md:col-span-2">
                <button class="save-edit-btn px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300">
                    <i class="fas fa-save mr-1"></i>Αποθήκευση
                </button>
                <button class="cancel-edit-btn px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-300">
                    <i class="fas fa-times mr-1"></i>Ακύρωση
                </button>
            </div>
        </div>
    `;

    debtItem.querySelector('.save-edit-btn').addEventListener('click', async () => {
        const newName = debtItem.querySelector('.edit-customer-name').value.trim();
        const newInitialAmount = parseFloat(debtItem.querySelector('.edit-initial-amount').value);

        if (!newName || isNaN(newInitialAmount) || newInitialAmount <= 0) {
            showMessageModal("Παρακαλώ συμπληρώστε έγκυρο όνομα και αρχικό ποσό.");
            return;
        }

        // Update in-memory array
        const index = debtsInMemory.findIndex(d => d.id === debt.id);
        if (index !== -1) {
            let updatedCurrentAmount = debtsInMemory[index].currentAmount;
            if (newInitialAmount !== debtsInMemory[index].initialAmount) {
                // Adjust current amount based on change in initial amount
                updatedCurrentAmount = Math.max(0, debtsInMemory[index].currentAmount + (newInitialAmount - debtsInMemory[index].initialAmount));
            }
            debtsInMemory[index] = { 
                ...debtsInMemory[index], 
                customerName: newName, 
                initialAmount: newInitialAmount,
                currentAmount: updatedCurrentAmount
            };
            showMessageModal("Η οφειλή ενημερώθηκε επιτυχώς!");
            fetchCustomerDebts(); // Re-render the list
        } else {
            showMessageModal("Η οφειλή δεν βρέθηκε.");
        }
    });

    debtItem.querySelector('.cancel-edit-btn').addEventListener('click', () => {
        fetchCustomerDebts(); // Re-render to revert changes
    });
}

// Initiate Payment
function initiatePayment(debt) {
    showMessageModal(
        `Πληρωμή για ${debt.customerName} (Τρέχον: €${debt.currentAmount.toFixed(2)})<br><br>
        <input type="number" id="paymentAmountInput" placeholder="Ποσό Πληρωμής (€)" class="payment-input p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500" min="0.01" step="0.01">`,
        'confirm',
        async () => {
            const paymentAmountInput = document.getElementById('paymentAmountInput');
            const paymentAmount = parseFloat(paymentAmountInput.value);

            if (isNaN(paymentAmount) || paymentAmount <= 0) {
                showMessageModal("Παρακαλώ εισάγετε ένα έγκυρο θετικό ποσό.");
                return;
            }
            if (paymentAmount > debt.currentAmount) {
                showMessageModal("Το ποσό πληρωμής δεν μπορεί να είναι μεγαλύτερο από το τρέχον χρέος.");
                return;
            }

            // Update in-memory array
            const index = debtsInMemory.findIndex(d => d.id === debt.id);
            if (index !== -1) {
                debtsInMemory[index].currentAmount -= paymentAmount;
                debtsInMemory[index].lastPaymentDate = new Date().toISOString();
                showMessageModal(`Πληρωμή €${paymentAmount.toFixed(2)} καταχωρήθηκε για ${debt.customerName}.`);
                fetchCustomerDebts(); // Re-render the list
            } else {
                showMessageModal("Η οφειλή δεν βρέθηκε.");
            }
        }
    );
    const paymentInput = document.getElementById('paymentAmountInput');
    if (paymentInput) {
        paymentInput.classList.add('mt-4', 'mb-2');
    }
}

// Confirm Delete Debt
function confirmDelete(id) {
    showMessageModal("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτήν την οφειλή; Αυτή η ενέργεια δεν αναιρείται.", 'confirm', async () => {
        // Remove from in-memory array
        debtsInMemory = debtsInMemory.filter(debt => debt.id !== id);
        showMessageModal("Η οφειλή διαγράφηκε επιτυχώς!");
        fetchCustomerDebts(); // Re-render the list
    });
}

