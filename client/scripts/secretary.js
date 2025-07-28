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

document.addEventListener('submit', async function (e) {
  e.preventDefault();
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
            if (!response.ok) {
                alert(r.message);
                throw new Error(`Error: ${r.message}`);
            }

            alert(r.success);
        } catch (error) {
            console.error('Upload failed:', error);
        }
    }
  );

function getSecretaryThesesManagement() {
    return `
        <div class="content-header">
            <h1>Διαχείριση Διπλωματικών</h1>
            <p>Διαχειριστείτε τις διπλωματικές εργασίες των φοιτητών</p>
        </div>
        <div class="card">
            <p>Η λειτουργικότητα διαχείρισης θα γαμηθεί σε επόμενη φάση.</p>
        </div>
    `;
}