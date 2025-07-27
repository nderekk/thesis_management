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
                    <tbody>
                        ${activeTheses.map(t => `
                            <tr class="clickable-row" data-id="${t.id}">
                                <td>${t.title}</td>
                                <td>${t.student_name}</td>
                                <td>${t.supervisor_name}</td>
                                <td>${t.status}</td>
                                <td>${t.assignment_date}</td>
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