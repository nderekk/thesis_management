function getSecretaryThesesView() {
    const visibleTheses = theses; // Σε επόμενο βήμα μπορεί να φιλτραριστούν
    return `
        <div class="content-header">
            <h1>Προβολή Διπλωματικών</h1>
            <p>Προβάλετε όλες τις ενεργές διπλωματικές</p>
        </div>
        <div class="card">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Τίτλος</th>
                            <th>Φοιτητής</th>
                            <th>Επιβλέπων</th>
                            <th>Κατάσταση</th>
                            <th>Ημερομηνία Ανάθεσης</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${visibleTheses.map(t => `
                            <tr>
                                <td>${t.title}</td>
                                <td>${getUserName(t.studentId)}</td>
                                <td>${getUserName(t.supervisorId)}</td>
                                <td>${getStatusText(t.status)}</td>
                                <td>${formatDate(t.assignedDate)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function getDataImport() {
    return `
        <div class="content-header">
            <h1>Εισαγωγή Δεδομένων</h1>
            <p>Εισάγετε δεδομένα φοιτητών και διδασκόντων</p>
        </div>
        <div class="card">
            <form id="importForm">
                <div class="form-group">
                    <label for="dataFile">Επιλέξτε αρχείο JSON:</label>
                    <input type="file" id="dataFile" accept="application/json" required>
                </div>
                <button type="submit" class="btn btn-primary">Εισαγωγή</button>
            </form>
        </div>
    `;
}

document.addEventListener('submit', function(e) {
    if (e.target.id === 'importForm') {
        e.preventDefault();
        const fileInput = document.getElementById('dataFile');
        if (fileInput.files.length === 0) return alert('Παρακαλώ επιλέξτε αρχείο.');
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(evt) {
            try {
                const data = JSON.parse(evt.target.result);
                if (data.users) users = data.users;
                if (data.topics) topics = data.topics;
                if (data.theses) theses = data.theses;
                alert('Τα δεδομένα εισήχθησαν επιτυχώς.');
            } catch (err) {
                alert('Σφάλμα κατά την εισαγωγή: μη έγκυρο αρχείο JSON.');
            }
        };
        reader.readAsText(file);
    }
});

async function getSecretaryThesesManagement() {
    const response = await fetch("http://localhost:5001/api/secretary/theses", {
        credentials: 'include'
    });
    const theses = await response.json();
    // Επιστρέφει το UI με φίλτρα και αναζήτηση
    return `
        <div class="content-header">
            <h1>Διαχείριση Διπλωματικών</h1>
            <p>Διαχειριστείτε τις διπλωματικές εργασίες των φοιτητών</p>
        </div>
        <div class="card">
            <div class="form-row mb-20">
                <div class="form-group">
                    <label for="statusFilter">Κατάσταση:</label>
                    <select id="statusFilter" onchange="filterSecretaryTheses()">
                        <option value="">Όλες</option>
                        <option value="Pending">Υπό Ανάθεση</option>
                        <option value="Active">Ενεργή</option>
                        <option value="Review">Υπό Εξέταση</option>
                        <option value="Completed">Περατωμένη</option>
                        <option value="Cancelled">Ακυρωμένη</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="studentSearch">Αναζήτηση Φοιτητή:</label>
                    <input type="text" id="studentSearch" placeholder="Όνομα ή ΑΜ" oninput="filterSecretaryTheses()">
                </div>
            </div>
            <div class="table-container">
                <table id="secretaryThesesTable">
                    <thead>
                        <tr>
                            <th>Τίτλος</th>
                            <th>Φοιτητής</th>
                            <th>ΑΜ</th>
                            <th>Επιβλέπων</th>
                            <th>Κατάσταση</th>
                            <th>Ημερομηνία Ανάθεσης</th>
                            <th>Ενέργειες</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${theses.map(t => `
                            <tr data-status="${t.status}" data-student="${t.studentName.toLowerCase()}" data-am="${t.studentId}">
                                <td>${t.title}</td>
                                <td>${t.studentName}</td>
                                <td>${t.studentId}</td>
                                <td>${t.supervisorName}</td>
                                <td><span class="status-badge status-${t.status}">${getStatusText(t.status)}</span></td>
                                <td>${formatDate(t.assignedDate)}</td>
                                <td>
                                    <button class="btn btn-primary" onclick="manageSecretaryThesis(${t.id})">Διαχείριση</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
        <script>window._secretaryTheses = ${JSON.stringify(theses)};</script>
    `;
}

// Φίλτρο και αναζήτηση για τη διαχείριση διπλωματικών γραμματείας
function filterSecretaryTheses() {
    const status = document.getElementById('statusFilter').value;
    const search = document.getElementById('studentSearch').value.trim().toLowerCase();
    const rows = document.querySelectorAll('#secretaryThesesTable tbody tr');
    rows.forEach(row => {
        const rowStatus = row.getAttribute('data-status');
        const rowStudent = row.getAttribute('data-student');
        const rowAm = row.getAttribute('data-am');
        const matchesStatus = !status || rowStatus === status;
        const matchesSearch = !search || rowStudent.includes(search) || rowAm.includes(search);
        row.style.display = (matchesStatus && matchesSearch) ? '' : 'none';
    });
}

// Modal διαχείρισης διπλωματικής για γραμματεία
function manageSecretaryThesis(thesisId) {
    const thesis = theses.find(t => t.id === thesisId);
    if (!thesis) return;
    let modalContent = `
        <div class="modal-header">
            <h2>Διαχείριση Διπλωματικής</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <h3>${thesis.title}</h3>
            <p><strong>Φοιτητής:</strong> ${getUserName(thesis.studentId)}</p>
            <p><strong>Κατάσταση:</strong> <span class="status-badge status-${thesis.status}">${getStatusText(thesis.status)}</span></p>
            <hr>
    `;
    // Ενέργειες ανάλογα με την κατάσταση
    if (thesis.status === 'active') {
        modalContent += `
            <div class="card">
                <div class="card-header"><h5>Καταχώρηση ΑΠ ΓΣ Ανάθεσης</h5></div>
                <form id="apForm" onsubmit="saveApGs(${thesis.id}, event)">
                    <div class="form-group">
                        <label for="apNumber">Αριθμός Πρακτικού:</label>
                        <input type="number" id="apNumber" value="${thesis.apNumber || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="apYear">Έτος:</label>
                        <input type="number" id="apYear" value="${thesis.apYear || ''}" min="2020" max="2030" required>
                    </div>
                    <button type="submit" class="btn btn-success">Αποθήκευση</button>
                </form>
            </div>
            <div class="card mt-20">
                <div class="card-header"><h5>Ακύρωση Ανάθεσης</h5></div>
                <form id="cancelForm" onsubmit="cancelSecretaryThesis(${thesis.id}, event)">
                    <div class="form-group">
                        <label for="cancelApNumber">Αριθμός ΓΣ Ακύρωσης:</label>
                        <input type="number" id="cancelApNumber" required>
                    </div>
                    <div class="form-group">
                        <label for="cancelApYear">Έτος ΓΣ Ακύρωσης:</label>
                        <input type="number" id="cancelApYear" min="2020" max="2030" required>
                    </div>
                    <div class="form-group">
                        <label for="cancelReason">Λόγος Ακύρωσης:</label>
                        <input type="text" id="cancelReason" placeholder="π.χ. κατόπιν αίτησης Φοιτητή/τριας" required>
                    </div>
                    <button type="submit" class="btn btn-danger">Ακύρωση Ανάθεσης</button>
                </form>
            </div>
        `;
    } else if (thesis.status === 'review') {
        // Έλεγχος αν υπάρχει βαθμός και σύνδεσμος Νημερτή
        const hasGrade = !!thesis.grade;
        const hasNimertis = !!thesis.nimertisLink;
        if (hasGrade && hasNimertis) {
            modalContent += `
                <div class="card">
                    <div class="card-header"><h5>Ολοκλήρωση Διπλωματικής</h5></div>
                    <p>Έχει καταχωρηθεί βαθμός και σύνδεσμος Νημερτή.</p>
                    <button class="btn btn-success" onclick="completeSecretaryThesis(${thesis.id})">Μεταφορά σε "Περατωμένη"</button>
                </div>
            `;
        } else {
            modalContent += `<p class="alert alert-info">Απαιτείται να έχει καταχωρηθεί βαθμός και σύνδεσμος Νημερτή από τον φοιτητή/τρια.</p>`;
        }
    } else if (thesis.status === 'completed') {
        modalContent += `<p>Η διπλωματική έχει ολοκληρωθεί.</p>`;
    } else if (thesis.status === 'cancelled') {
        modalContent += `<p>Η διπλωματική έχει ακυρωθεί.</p>`;
        if (thesis.cancellationReason) {
            modalContent += `<div class="card"><div class="card-header"><h5>Λόγος Ακύρωσης</h5></div><p>${thesis.cancellationReason}</p></div>`;
        }
    }
    modalContent += `</div>`;
    showModal(modalContent);
}

// Αποθήκευση ΑΠ ΓΣ ανάθεσης
function saveApGs(thesisId, event) {
    event.preventDefault();
    const apNumber = document.getElementById('apNumber').value;
    const apYear = document.getElementById('apYear').value;
    const thesis = theses.find(t => t.id === thesisId);
    if (thesis) {
        thesis.apNumber = apNumber;
        thesis.apYear = apYear;
        closeModal();
        loadContent('secretaryManageTheses');
    }
}

// Ακύρωση ανάθεσης από γραμματεία
function cancelSecretaryThesis(thesisId, event) {
    event.preventDefault();
    const cancelApNumber = document.getElementById('cancelApNumber').value;
    const cancelApYear = document.getElementById('cancelApYear').value;
    const cancelReason = document.getElementById('cancelReason').value;
    const thesis = theses.find(t => t.id === thesisId);
    if (thesis) {
        thesis.status = 'cancelled';
        thesis.cancellationReason = `Ακυρώθηκε από Γραμματεία - ΓΣ ${cancelApNumber}/${cancelApYear}: ${cancelReason}`;
        closeModal();
        loadContent('secretaryManageTheses');
    }
}

// Ολοκλήρωση διπλωματικής ("Περατωμένη") από γραμματεία
function completeSecretaryThesis(thesisId) {
    const thesis = theses.find(t => t.id === thesisId);
    if (thesis) {
        thesis.status = 'completed';
        closeModal();
        loadContent('secretaryManageTheses');
    }
}