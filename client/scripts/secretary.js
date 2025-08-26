async function getSecretaryThesesView() {
    const response = await fetch("http://localhost:5001/api/secretary/theses/active", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'  // important for JSON data
        }
        });
        const activeTheses = await response.json();
        if (!response.ok) {
            alert(activeTheses.message);
            throw new Error(`Error: ${activeTheses.message}`);
    }
    console.log(activeTheses);
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
                    <tbody id="thesisTableBody">
                        ${activeTheses.map(t => `
                            <tr class="clickable-row" data-id="${t.id}" on-click>
                                <td>${t.title}</td>
                                <td>${t.student_name}</td>
                                <td>${t.supervisor_name}</td>
                                <td>${t.status}</td>
                                <td>${t.assignment_date}</td>
                            </tr>
                            <tr class="thesis-details-row" id="details-${t.id}" style="display: none;">
                                <td colspan="5" id="details-content-${t.id}">
                                    <em>Φόρτωση Λεπτομερειών...</em>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

async function attachEventListener(){ 
    document.querySelectorAll('.clickable-row').forEach(row => {
        row.addEventListener('click', async () => {
            const thesisId = row.dataset.id;
            const detailsRow = document.getElementById(`details-${thesisId}`);
            const detailContent = document.getElementById(`details-content-${thesisId}`);

            // Collapse others (optional)
            document.querySelectorAll('.thesis-details-row').forEach(r => {
                if (r.id !== `details-${thesisId}`) r.style.display = 'none';
            });

            try { const response = await fetch(`http://localhost:5001/api/student/thesis?id=${thesisId}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'  // important for JSON data
                }
            });
            const studentThesis = await response.json();
            console.log(studentThesis);
            if (!response.ok) {
                alert(studentThesis.message);
                throw new Error(`Error: ${studentThesis.message}`);
            }

            detailContent.innerHTML = `
                <div class="thesis-details">
                    <strong>Θέμα:</strong> ${studentThesis.title}<br>
                    <strong>Περιγραφή:</strong> ${studentThesis.description || '—'}<br>
                    <strong>Κατάσταση:</strong> ${getStatusText(studentThesis.status)}<br>
                    <strong>Επιτροπή:</strong><br>
                    <div class="inner">
                        <div class="inner">
                            <ul>
                                ${studentThesis.committeeMembers.map(member => `<li>${member}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                    <strong>Χρόνος από ανάθεση:</strong> ${calculateTimeSince(studentThesis.assignedDate)}
                </div>
                `;
                detailContent.dataset.loaded = "true";
            } catch (err) {
                detailContent.innerHTML = `<span style="color:red">Αποτυχία φόρτωσης.</span>`;
                console.error(err);
            }

            // Toggle current
            detailsRow.style.display = detailsRow.style.display === 'none' ? 'table-row' : 'none';
        });
    });
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

async function handleImportData() {
        const fileInput = document.getElementById('dataFile');
        if (fileInput.files.length === 0) {
            alert('Παρακαλώ επιλέξτε αρχείο.');
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);
        console.log("HEREEEE");
        try {
            const response = await fetch("http://localhost:5001/api/secretary/import-data", {
                method: 'POST',
                credentials: 'include',
                body: formData
            });

            const r = await response.json();
            if (!response.ok)
                throw new Error(`${r.message}`);

            alert(r.success);
        } catch (error) {
            alert(error);
            console.error('Upload failed:', error);
        }
    }

async function getSecretaryThesesManagement() {
    try {
        const response = await fetch("http://localhost:5001/api/secretary/theses", {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Σφάλμα κατά την ανάκτηση των διπλωματικών');
        }
        
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
                                <th>Αριθμός Μητρώου</th>
                                <th>Επιβλέπων</th>
                                <th>Κατάσταση</th>
                                <th>Ημερομηνία Ανάθεσης</th>
                                <th>Αριθμός Πρωτοκόλλου Γενικής Συνέλευσης</th>
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
                                    <td><span class="status-badge status-${t.status.toLowerCase()}">${getStatusText(t.status)}</span></td>
                                    <td>${formatDate(t.assignedDate)}</td>
                                    <td>${t.apNumber || '-'}</td>
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
    } catch (error) {
        console.error('Error:', error);
        return `
            <div class="content-header">
                <h1>Διαχείριση Διπλωματικών</h1>
                <p>Διαχειριστείτε τις διπλωματικές εργασίες των φοιτητών</p>
            </div>
            <div class="alert alert-danger">
                <p>Σφάλμα κατά την ανάκτηση των διπλωματικών: ${error.message}</p>
                <button class="btn btn-primary" onclick="loadContent('secretaryManageTheses')">Επανάληψη</button>
            </div>
        `;
    }
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
        const matchesSearch = !search || 
            rowStudent.includes(search) || 
            rowAm.toString().includes(search);
        
        row.style.display = (matchesStatus && matchesSearch) ? '' : 'none';
    });
}

// Modal διαχείρισης διπλωματικής για γραμματεία
async function manageSecretaryThesis(thesisId) {
    try {
        const response = await fetch(`http://localhost:5001/api/secretary/theses/${thesisId}`, {
            credentials: 'include'
        });
        
        if (!response.ok) {
            throw new Error('Σφάλμα κατά την ανάκτηση των στοιχείων της διπλωματικής');
        }
        
        const thesis = await response.json();
        
        let modalContent = `
            <div class="modal-header">
                <h2>Διαχείριση Διπλωματικής</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="thesis-info-header">
                    <div class="thesis-info-left">
                        <h3>${thesis.title}</h3>
                        <p><strong>Φοιτητής:</strong> ${thesis.studentName}</p>
                    </div>
                    <div class="thesis-info-right">
                        <p><strong>Κατάσταση:</strong></p>
                        <span class="status-badge status-${thesis.status.toLowerCase()}">${getStatusText(thesis.status)}</span>
                    </div>
                </div>
                <div class="thesis-info-separator">
                    <hr>
                </div>
        `;
        
        // Ενέργειες ανάλογα με την κατάσταση
        if (thesis.status === 'Active') {
            modalContent += `
                <div class="card">
                    <div class="card-header"><h5>Καταχώρηση Αριθμού Πρωτοκόλλου Γενικής Συνέλευσης Ανάθεσης</h5></div>
                    <form id="apForm" onsubmit="saveApGs(${thesis.id}, event)">
                        <div class="form-group">
                            <label for="apNumber">Αριθμός Πρωτοκόλλου:</label>
                            <input type="number" id="apNumber" value="${thesis.apNumber || ''}" required>
                        </div>
                        <button type="submit" class="btn btn-success">Αποθήκευση</button>
                    </form>
                </div>
                <div class="card mt-20">
                    <div class="card-header"><h5>Ακύρωση Ανάθεσης</h5></div>
                    <form id="cancelForm" onsubmit="cancelSecretaryThesis(${thesis.id}, event)">
                        <div class="form-group">
                            <label for="cancelApNumber">Αριθμός Ακύρωσης Γενικής Συνέλευσης:</label>
                            <input type="number" id="cancelApNumber" required>
                        </div>
                        <div class="form-group">
                            <label for="cancelApYear">Έτος Ακύρωσης Γενικής ΣυνέλευσηςΣ:</label>
                            <input type="number" id="cancelApYear" min="2020" max="2030" required>
                        </div>
                        <div class="form-group">
                            <label for="cancelReason">Λόγος Ακύρωσης:</label>
                            <input type="text" id="cancelReason" placeholder="π.χ. κατόπιν αίτησης Φοιτητή/τριας" value="κατόπιν αίτησης Φοιτητή/τριας" required>
                        </div>
                        <button type="submit" class="btn btn-danger">Ακύρωση Ανάθεσης</button>
                    </form>
                </div>
            `;
        } else if (thesis.status === 'Review') {
            // Έλεγχος αν υπάρχει βαθμός και σύνδεσμος Νημερτή
            if (thesis.hasGrade && thesis.nemertisLink) {
                modalContent += `
                    <div class="card">
                        <div class="card-header"><h5>Ολοκλήρωση Διπλωματικής</h5></div>
                        <p>Έχει καταχωρηθεί βαθμός (${thesis.finalGrade}) και σύνδεσμος Νημερτή.</p>
                        <button class="btn btn-success" onclick="completeSecretaryThesis(${thesis.id})">Μεταφορά σε "Περατωμένη"</button>
                    </div>
                `;
            } else {
                modalContent += `
                    <div class="alert alert-info">
                        <p><strong>Απαιτείται:</strong></p>
                        <ul>
                            <li>${!thesis.hasGrade ? '❌' : '✅'} Καταχώρηση βαθμού από τον επιβλέποντα</li>
                            <li>${!thesis.nemertisLink ? '❌' : '✅'} Σύνδεσμος προς το Νημερτή από τον φοιτητή/τρια</li>
                        </ul>
                    </div>
                `;
            }
        } else if (thesis.status === 'Completed') {
            modalContent += `
                <div class="alert alert-success">
                    <p>Η διπλωματική έχει ολοκληρωθεί.</p>
                    <p><strong>Ημερομηνία ολοκλήρωσης:</strong> ${formatDate(thesis.completionDate)}</p>
                </div>
            `;
        } else if (thesis.status === 'Cancelled') {
            modalContent += `
                <div class="alert alert-warning">
                    <p>Η διπλωματική έχει ακυρωθεί.</p>
                    ${thesis.cancellation ? `
                        <div class="card">
                            <div class="card-header"><h5>Λόγος Ακύρωσης</h5></div>
                            <p><strong>Γενική Συνέλευση:</strong> ${thesis.cancellation.assemblyNumber}/${thesis.cancellation.assemblyYear}</p>
                            <p><strong>Τύπος:</strong> ${thesis.cancellation.reason === 'By Secretary' ? 'Από Γραμματεία' : 'Από Καθηγητή'}</p>
                            <p><strong>Λόγος:</strong> ${thesis.cancellation.reasonText || 'Δεν έχει καθοριστεί'}</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }
        
        modalContent += `</div>`;
        showModal(modalContent);
        
    } catch (error) {
        console.error('Error:', error);
        alert('Σφάλμα κατά την ανάκτηση των στοιχείων της διπλωματικής: ' + error.message);
    }
}

// Αποθήκευση ΑΠ ΓΣ ανάθεσης
async function saveApGs(thesisId, event) {
    event.preventDefault();
    const apNumber = document.getElementById('apNumber').value;
    
    try {
        const response = await fetch(`http://localhost:5001/api/secretary/theses/${thesisId}/ap`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ apNumber: parseInt(apNumber) })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Σφάλμα κατά την ενημέρωση');
        }
        
        const result = await response.json();
        alert(result.message);
        closeModal();
        loadContent('secretaryManageTheses');
        
    } catch (error) {
        console.error('Error:', error);
        alert('Σφάλμα κατά την αποθήκευση: ' + error.message);
    }
}

// Ακύρωση ανάθεσης από γραμματεία
async function cancelSecretaryThesis(thesisId, event) {
    event.preventDefault();
    const cancelApNumber = document.getElementById('cancelApNumber').value;
    const cancelApYear = document.getElementById('cancelApYear').value;
    const cancelReason = document.getElementById('cancelReason').value;
    
    try {
        const response = await fetch(`http://localhost:5001/api/secretary/theses/${thesisId}/cancel`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ 
                assemblyNumber: parseInt(cancelApNumber),
                assemblyYear: cancelApYear,
                reason: cancelReason
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Σφάλμα κατά την ακύρωση');
        }
        
        const result = await response.json();
        alert(result.message);
        closeModal();
        loadContent('secretaryManageTheses');
        
    } catch (error) {
        console.error('Error:', error);
        alert('Σφάλμα κατά την ακύρωση: ' + error.message);
    }
}

// Ολοκλήρωση διπλωματικής ("Περατωμένη") από γραμματεία
async function completeSecretaryThesis(thesisId) {
    try {
        const response = await fetch(`http://localhost:5001/api/secretary/theses/${thesisId}/complete`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Σφάλμα κατά την ολοκλήρωση');
        }
        
        const result = await response.json();
        alert(result.message);
        closeModal();
        loadContent('secretaryManageTheses');
        
    } catch (error) {
        console.error('Error:', error);
        alert('Σφάλμα κατά την ολοκλήρωση: ' + error.message);
    }
}