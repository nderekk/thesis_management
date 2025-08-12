let editingTopicId = null;

async function getTopicsManagement() {
    const response = await fetch("http://localhost:5001/api/professor/topics", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      }
    });
    const thesisTopics = await response.json();
    if (!response.ok) {
        alert(thesisTopics.message);
        throw new Error(`Error: ${thesisTopics.message}`);
    }
    console.log(thesisTopics);
    
    return `
        <div class="content-header">
            <h1>Θέματα Διπλωματικών</h1>
            <p>Δημιουργήστε και διαχειριστείτε θέματα διπλωματικών</p>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Δημιουργία Νέου Θέματος</h3>
            </div>
            
            <form id="newTopicForm">
                <div class="form-group">
                    <label for="topicTitle">Τίτλος Θέματος:</label>
                    <input type="text" id="topicTitle" required>
                </div>
                
                <div class="form-group">
                    <label for="topicDescription">Περιγραφή:</label>
                    <textarea id="topicDescription" rows="4" required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="topicFile">Αρχείο PDF (προαιρετικό):</label>
                    <input type="file" id="topicFile" accept=".pdf">
                </div>
                
                <button type="submit" class="btn btn-primary">Δημιουργία Θέματος</button>
            </form>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Τα Θέματά μου</h3>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Τίτλος</th>
                            <th>Κατάσταση</th>
                            <th>Ημερομηνία Δημιουργίας</th>
                            <th>Ενέργειες</th>
                        </tr>
                    </thead>
                    <tbody>
${thesisTopics.data.map(topic => `
    <tr>
        <td>${topic.title}</td>
        <td><span class="status-badge status-${topic.status}">${getStatusText(topic.status)}</span></td>
        <td>${formatDate(topic.createdDate)}</td>
        <td>
            <button class="btn btn-secondary" onclick="editTopic(${topic.id})">Επεξεργασία</button>
            <button class="btn btn-danger" onclick="deleteTopic(${topic.id})">Διαγραφή</button>
        </td>
    </tr>
    ${editingTopicId === topic.id ? `
    <tr class="edit-form-row">
        <td colspan="4">
            <form id="editTopicForm-${topic.id}" onsubmit="submitEditTopic(event, ${topic.id})">
                <div class="form-group">
                    <label>Τίτλος:</label>
                    <input type="text" id="editTitle-${topic.id}" value="${topic.title}" required>
                </div>
                <div class="form-group">
                    <label>Περιγραφή:</label>
                    <textarea id="editDescription-${topic.id}" required>${topic.description}</textarea>
                </div>
                <div class="form-group">
                    <label>Αρχείο PDF (προαιρετικό):</label>
                    <input type="file" id="editFile-${topic.id}" value="${topic.original_file_name}" accept=".pdf">
                    <span id="fileLabel" class="file-label">Έχετε ήδη ανεβάσει: "${topic.original_file_name}"</span>
                </div>
                <button type="submit" class="btn btn-primary">Αποθήκευση</button>
                <button type="button" class="btn btn-secondary" onclick="cancelEdit()">Άκυρο</button>
            </form>
        </td>
    </tr>` : ''}
`).join('')}
</tbody>
                </table>
            </div>
        </div>
    `;
}

async function handleCreateTopic() {
  const topicFile = document.getElementById('topicFile').files[0];
  const topicTitle = document.getElementById('topicTitle').value;
  const topicDescription = document.getElementById('topicDescription').value;

  const formData = new FormData();
  (topicFile) ? formData.append('file', topicFile) : {};
  formData.append('title', topicTitle);
  formData.append('description', topicDescription);

  const response = await fetch("http://localhost:5001/api/professor/topic", {
      method: 'POST',
      credentials: 'include',
      body: formData
    });
    const ans = await response.json();
    if (!response.ok) {
        alert(ans.message);
        throw new Error(`Error: ${ans.message}`);
    }
    // alert("Topic Created");

    loadContent("topics");
}

function editTopic(id) {
  editingTopicId = id;
  loadContent("topics");
}

function cancelEdit() {
  editingTopicId = null;
  loadContent("topics");
}

// thelei allagh sto ui touto
async function submitEditTopic(e, id) {
  e.preventDefault();
  const topicFile = document.getElementById(`editFile-${id}`).files[0];
  const topicTitle = document.getElementById(`editTitle-${id}`).value;
  const topicDescription = document.getElementById(`editDescription-${id}`).value;

  const formData = new FormData();
  (topicFile) ? formData.append('file', topicFile) : {};
  formData.append('title', topicTitle);
  formData.append('description', topicDescription);
  formData.append('id', id);

  const response = await fetch("http://localhost:5001/api/professor/topic", {
      method: 'PUT',
      credentials: 'include',
      body: formData
    });
    const ans = await response.json();
    if (!response.ok) {
        alert(ans.message);
        throw new Error(`Error: ${ans.message}`);
    }

    cancelEdit();
}

async function deleteTopic(id) {
  const response = await fetch("http://localhost:5001/api/professor/topic", {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      },
      body: JSON.stringify({
        id: id
      })
    });
    const ans = await response.json();
    if (!response.ok) {
        alert(ans.message);
        throw new Error(`Error: ${ans.message}`);
    }

    loadContent("topics");
}

let selectedStudent = null;
let selectedTopic = null;

function getTopicAssignment() {
    return `
        <div class="content-header">
            <h1>Ανάθεση Θέματος</h1>
            <p>Επιλέξτε φοιτητή για να του αναθέσετε διαθέσιμο θέμα.</p>
        </div>
        <div class="card">
            <div class="form-group">
                <label for="studentSearchInput">Αναζήτηση Φοιτητή (ΑΜ ή Ονοματεπώνυμο):</label>
                <input type="text" id="studentSearchInput" placeholder="ΑΜ ή Ονοματεπώνυμο">
                <button class="btn btn-primary" onclick="searchStudentUI()">Αναζήτηση</button>
            </div>
            <div id="studentSearchResults" class="placeholder"></div>
        </div>
        <div class="card">
            <div class="card-header"><h3 class="card-title">Διαθέσιμα Θέματα</h3></div>
            <div id="availableTopics" class="placeholder"></div>
        </div>
        <div class="card">
            <div class="card-header"><h3 class="card-title">Προσωρινές Αναθέσεις</h3></div>
            <div id="tempAssignments" class="placeholder"></div>
        </div>
    `;
}

async function searchStudentUI() {
    const query = document.getElementById('studentSearchInput').value.trim();
    if (!query) return;
    const res = await fetch(`http://localhost:5001/api/professor/searchStudent?query=${encodeURIComponent(query)}`, {
        credentials: 'include'
    });
    const students = await res.json();
    if (!Array.isArray(students)) return;
    const resultsDiv = document.getElementById('studentSearchResults');
    resultsDiv.innerHTML = students.length === 0 ? '<p>Δεν βρέθηκαν φοιτητές.</p>' :
        `<ul>${students.map(s => `<li>
            <button class="btn btn-link" onclick="selectStudent(${s.am}, '${s.first_name}', '${s.last_name}')">
                ${s.am} - ${s.first_name} ${s.last_name} (${s.email})
            </button>
        </li>`).join('')}</ul>`;
}

function selectStudent(am, firstName, lastName) {
    selectedStudent = { am, firstName, lastName };
    document.getElementById('studentSearchResults').innerHTML = `<p>Επιλεγμένος φοιτητής: <strong>${am} - ${firstName} ${lastName}</strong></p>`;
    loadAvailableTopics();
}

async function loadAvailableTopics() {
    const res = await fetch('http://localhost:5001/api/professor/topics', { credentials: 'include' });
    const data = await res.json();
    if (!data.data) return;
    const available = data.data.filter(t => t.status === 'unassigned');
    const div = document.getElementById('availableTopics');
    if (!selectedStudent) {
        div.innerHTML = '<p>Επιλέξτε φοιτητή για να δείτε τα διαθέσιμα θέματα.</p>';
        return;
    }
    div.innerHTML = available.length === 0 ? '<p>Δεν υπάρχουν διαθέσιμα θέματα.</p>' :
        `<ul>${available.map(t => `<li>
            <button class="btn btn-link" onclick="selectTopic(${t.id}, '${t.title.replace(/'/g, "\\'")}')">
                ${t.title}
            </button>
        </li>`).join('')}</ul>`;
}

function selectTopic(id, title) {
    selectedTopic = { id, title };
    const div = document.getElementById('availableTopics');
    div.innerHTML = `<p>Επιλεγμένο θέμα: <strong>${title}</strong></p>
        <button class="btn btn-primary" onclick="assignTopicToStudentUI()">Ανάθεση Θέματος</button>`;
}

async function assignTopicToStudentUI() {
    if (!selectedStudent || !selectedTopic) return;
    const res = await fetch('http://localhost:5001/api/professor/assignTopic', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topicId: selectedTopic.id, studentAm: selectedStudent.am })
    });
    const data = await res.json();
    if (!res.ok) {
        alert(data.message || 'Σφάλμα ανάθεσης.');
        return;
    }
    alert('Το θέμα ανατέθηκε προσωρινά!');
    selectedStudent = null;
    selectedTopic = null;
    document.getElementById('studentSearchResults').innerHTML = '';
    loadAvailableTopics();
    loadTempAssignments();
}

async function loadTempAssignments() {
    // Fetch all topics and show those with status temp_assigned
    const res = await fetch('http://localhost:5001/api/professor/topics', { credentials: 'include' });
    const data = await res.json();
    if (!data.data) return;
    const temp = data.data.filter(t => t.status === 'temp_assigned');
    const div = document.getElementById('tempAssignments');
    if (temp.length === 0) {
        div.innerHTML = '<p>Δεν υπάρχουν προσωρινές αναθέσεις.</p>';
        return;
    }
    div.innerHTML = `<ul>${temp.map(t => `<li>
        <span>${t.title} - ${t.original_file_name ? `Αρχείο: ${t.original_file_name}` : ''} (Φοιτητής ΑΜ: ${t.student_am})</span>
        <button class="btn btn-danger" onclick="cancelTempAssignment(${t.id})">Ακύρωση</button>
    </li>`).join('')}</ul>`;
}

async function cancelTempAssignment(topicId) {
    // For now, just revert topic to unassigned and remove student_am
    const res = await fetch('http://localhost:5001/api/professor/topic', {
        method: 'PUT',
        credentials: 'include',
        body: (() => { const fd = new FormData(); fd.append('id', topicId); fd.append('topic_status', 'unassigned'); fd.append('student_am', ''); return fd; })()
    });
    if (!res.ok) {
        const data = await res.json();
        alert(data.message || 'Σφάλμα ακύρωσης.');
        return;
    }
    alert('Η προσωρινή ανάθεση ακυρώθηκε.');
    loadTempAssignments();
    loadAvailableTopics();
}

// Patch: When loading the assignment page, also load temp assignments
const origGetTopicAssignment = getTopicAssignment;
getTopicAssignment = function() {
    setTimeout(() => { loadTempAssignments(); }, 100);
    return origGetTopicAssignment();
};

async function getThesesList() {
    const response = await fetch("http://localhost:5001/api/professor/thesesList", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      }
    });
    const thesesList = await response.json();
    if (!response.ok) {
        alert(thesesList.message);
        throw new Error(`Error: ${thesesList.message}`);
    }
    console.log(thesesList);
    
    return `
        <div class="content-header">
            <h1>Λίστα Διπλωματικών</h1>
            <p>Διπλωματικές στις οποίες συμμετέχετε</p>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Φίλτρα</h3>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="statusFilter">Κατάσταση:</label>
                    <select id="statusFilter" onchange="filterTheses()">
                        <option value="">Όλες</option>
                        <option value="pending">Υπό Ανάθεση</option>
                        <option value="active">Ενεργή</option>
                        <option value="review">Υπό Εξέταση</option>
                        <option value="completed">Περατωμένη</option>
                        <option value="cancelled">Ακυρωμένη</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="roleFilter">Ρόλος:</label>
                    <select id="roleFilter" onchange="filterTheses()">
                        <option value="">Όλοι</option>
                        <option value="supervisor">Επιβλέπων</option>
                        <option value="committee">Μέλος Τριμελούς</option>
                    </select>
                </div>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Διπλωματικές</h3>
                <div class="card-actions">
                    <button class="btn btn-secondary" onclick="exportTheses('csv')">Εξαγωγή CSV</button>
                    <button class="btn btn-secondary" onclick="exportTheses('json')">Εξαγωγή JSON</button>
                </div>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Τίτλος</th>
                            <th>Φοιτητής</th>
                            <th>Κατάσταση</th>
                            <th>Ρόλος</th>
                            <th>Ημερομηνία Ανάθεσης</th>
                            <th>Ενέργειες</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${thesesList.map(thesis => `
                            <tr>
                                <td>${thesis.thesis_title}</td>
                                <td>${thesis.student_name}</td>
                                <td>${thesis.thesis_status}</span></td>
                                <td>${thesis.professor_role}</td>
                                <td>${thesis.thesis_ass_date}</td>
                                <td>
                                    <button class="btn btn-secondary" onclick="viewThesisDetails(${thesis.thesis_id})">Προβολή</button>
                                    <button class="btn btn-primary" onclick="manageThesis(${thesis.thesis_id})">Διαχείριση</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function filterTheses() {
  const statusFilter = document.getElementById('statusFilter').value.toLowerCase();
  const roleFilter = document.getElementById('roleFilter').value.toLowerCase();

  const tableRows = document.querySelectorAll('tbody tr');

  tableRows.forEach(row => {
    const statusCell = row.children[2].textContent.toLowerCase().trim();
    const roleCell = row.children[3].textContent.toLowerCase().trim();

    const matchesStatus = !statusFilter || statusCell === statusFilter;
    const matchesRole = !roleFilter || (
      roleFilter === 'committee'
        ? roleCell.includes('committee')
        : roleCell === roleFilter
    );

    if (matchesStatus && matchesRole) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });
}

function exportTheses(type){
    const tableRows = document.querySelectorAll('tbody tr');
    const exportedData = [];

    tableRows.forEach(row => {
        if(row.style.display === 'none') return ; //So it can skip the hidden (by filtering) rows.

        const cells = row.querySelectorAll('td');

    const rowData = {
      title: cells[0].textContent.trim(),
      student: cells[1].textContent.trim(),
      status: cells[2].textContent.trim(),
      role: cells[3].textContent.trim(),
      assignementDate: cells[4].textContent.trim()
    };

        exportedData.push(rowData);
    });


   if (type === 'json') {
    const jsonString = JSON.stringify(exportedData, null, 2);
    downloadFile(jsonString, 'theses.json', 'application/json');
  } else if (type === 'csv') {
        const csvRows = [
            ['Τίτλος', 'Φοιτητής', 'Κατάσταση', 'Ρόλος', 'Ημερομηνία Ανάθεσης'],
            ...exportedData.map(item => [
            item.title ?? '',
            item.student ?? '',
            item.status ?? '',
            item.role ?? '',
            item.assignementDate ?? ''
            ])
        ];

        const csvContent = csvRows.map(row =>
            row.map(cell => `"${(cell ?? '').toString().replace(/"/g, '""')}"`).join(',')
        ).join('\n');

    downloadFile(csvContent, 'theses.csv', 'text/csv');
  }
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

async function getStatistics() {
    const response = await fetch("http://localhost:5001/api/professor/stats", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      }
    });
    const stats = await response.json();
    if (!response.ok) {
        alert(stats.message);
        throw new Error(`Error: ${stats.message}`);
    }
    console.log(stats);
    
    return `
        <div class="content-header">
            <h1>Στατιστικά</h1>
            <p>Στατιστικά στοιχεία των διπλωματικών σας</p>
        </div>
        
        <!-- Μέσος χρόνος περάτωσης -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Μέσος Χρόνος Περάτωσης (μήνες)</h3>
            </div>
            <div class="card">
                <div id="statusChart">
                    <canvas id="AvgTimeChartCanvas"></canvas>
                </div>
            </div>
            <div class="grid grid-3">
                <div class="stats-card">
                    <div class="stats-number">${stats.supervisorAvg.toFixed(1)}</div>
                    <div class="stats-label">Επιβλεπόμενες ΔΕ</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.committeeAvg.toFixed(1)}</div>
                    <div class="stats-label">Μέλος Τριμελούς</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.totalAvg.toFixed(1)}</div>
                    <div class="stats-label">Συνολικά</div>
                </div>
            </div>   
        </div>
        
        <!-- Μέσος βαθμός -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Μέσος Βαθμός</h3>
            </div>
            <div class="card">
                <div id="gradeChart">
                    <canvas id="gradeChartCanvas"></canvas>
                </div>
            </div>
            <div class="grid grid-3">
                <div class="stats-card">
                    <div class="stats-number">${stats.supervisorGrade.toFixed(1)}</div>
                    <div class="stats-label">Επιβλεπόμενες ΔΕ</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.committeeGrade.toFixed(1)}</div>
                    <div class="stats-label">Μέλος Τριμελούς</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.totalGrade.toFixed(1)}</div>
                    <div class="stats-label">Συνολικά</div>
                </div>
            </div>   
        </div>
        
        <!-- Συνολικό πλήθος -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Συνολικό Πλήθος Διπλωματικών</h3>
            </div>
            <div class="card">
                <div id="countChart">
                    <canvas id="countChartCanvas"></canvas>
                </div>
            </div>
            <div class="grid grid-3">
                <div class="stats-card">
                    <div class="stats-number">${stats.supervisorCount}</div>
                    <div class="stats-label">Επιβλεπόμενες ΔΕ</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.committeeCount}</div>
                    <div class="stats-label">Μέλος Τριμελούς</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.totalCount}</div>
                    <div class="stats-label">Συνολικά</div>
                </div>
            </div>
        </div>

         <!-- Λεπτομερή στατιστικά -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Λεπτομερή Στατιστικά</h3>
            </div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Κατηγορία</th>
                            <th>Επιβλεπόμενες ΔΕ</th>
                            <th>Μέλος Τριμελούς</th>
                            <th>Συνολικά</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Μέσος χρόνος περάτωσης (μήνες)</strong></td>
                            <td>${stats.supervisorAvg.toFixed(2)}</td>
                            <td>${stats.committeeAvg.toFixed(2)}</td>
                            <td>${stats.totalAvg.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><strong>Μέσος βαθμός</strong></td>
                            <td>${stats.supervisorGrade.toFixed(2)}</td>
                            <td>${stats.committeeGrade.toFixed(2)}</td>
                            <td>${stats.totalGrade.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td><strong>Συνολικό πλήθος</strong></td>
                            <td>${stats.supervisorCount}</td>
                            <td>${stats.committeeCount}</td>
                            <td>${stats.totalCount}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

function renderTimeGraph(data) {
  const ctx = document.getElementById('AvgTimeChartCanvas').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'Ρόλος Καθηγητή',
        data: Object.values(data),
        backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Μέσος Χρόνος Περάτωσης (μήνες)'
        }
      }
    }
  });
}

function renderGradeChart(data) {
  const ctx = document.getElementById('gradeChartCanvas').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'Ρόλος Καθηγητή',
        data: Object.values(data),
        backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 10,
          ticks: {
            stepSize: 1
          }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Κατανομή Βαθμών'
        }
      }
    }
  });
}

function renderCountChart(data) {
  const ctx = document.getElementById('countChartCanvas').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: Object.keys(data),
      datasets: [{
        label: 'Ρόλος Καθηγητή',
        data: Object.values(data),
        backgroundColor: ['#36a2eb', '#ffcd56', '#ff6384'],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
        },
        title: {
          display: true,
          text: 'Πλήθος Διπλωματικών'
        }
      }
    }
  });
}

async function renderGraphs(){
  const response = await fetch("http://localhost:5001/api/professor/stats", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      }
    });
    const stats = await response.json();
    if (!response.ok) {
        alert(stats.message);
        throw new Error(`Error: ${stats.message}`);
    }
    console.log(stats);
  
  //render graphs with fetched data
  renderTimeGraph({
    Supervisor: stats.supervisorAvg/30,
    Committee: stats.committeeAvg/30,
    Total: stats.totalAvg/30
  });

  renderGradeChart({
    Supervisor: stats.supervisorGrade,
    Committee: stats.committeeGrade,
    Total: stats.totalGrade
  });

  renderCountChart({
    Supervisor: stats.supervisorCount,
    Committee: stats.committeeCount,
    Total: stats.totalCount
  });
}

// Helper function to generate status distribution chart
function generateStatusChart(theses) {
    const statusCounts = {};
    theses.forEach(thesis => {
        statusCounts[thesis.status] = (statusCounts[thesis.status] || 0) + 1;
    });
    
    const statusLabels = {
        Pending: 'Υπό Ανάθεση',
        Active: 'Ενεργή',
        Review: 'Υπό Εξέταση',
        Completed: 'Περατωμένη',
        Cancelled: 'Ακυρωμένη'
    };
    
    let chartHTML = '<div class="chart-container">';
    Object.entries(statusCounts).forEach(([status, count]) => {
        const label = statusLabels[status] || status;
        chartHTML += `
            <div class="chart-bar">
                <div class="chart-label">${label}</div>
                <div class="chart-value">${count}</div>
            </div>
        `;
    });
    chartHTML += '</div>';
    
    return chartHTML;
}

// Helper function to generate grade distribution chart
function generateGradeChart(theses) {
    const gradedTheses = theses.filter(t => t.grade);
    if (gradedTheses.length === 0) {
        return '<p class="no-data">Δεν υπάρχουν βαθμολογημένες διπλωματικές</p>';
    }
    
    const gradeRanges = {
        '9.0-10.0': 0,
        '8.0-8.9': 0,
        '7.0-7.9': 0,
        '6.0-6.9': 0,
        '5.0-5.9': 0
    };
    
    gradedTheses.forEach(thesis => {
        const grade = thesis.grade;
        if (grade >= 9.0) gradeRanges['9.0-10.0']++;
        else if (grade >= 8.0) gradeRanges['8.0-8.9']++;
        else if (grade >= 7.0) gradeRanges['7.0-7.9']++;
        else if (grade >= 6.0) gradeRanges['6.0-6.9']++;
        else if (grade >= 5.0) gradeRanges['5.0-5.9']++;
    });
    
    let chartHTML = '<div class="chart-container">';
    Object.entries(gradeRanges).forEach(([range, count]) => {
        if (count > 0) {
            chartHTML += `
                <div class="chart-bar">
                    <div class="chart-label">${range}</div>
                    <div class="chart-value">${count}</div>
                </div>
            `;
        }
    });
    chartHTML += '</div>';
    
    return chartHTML;
}

async function getThesesManagement() {
    const response = await fetch("http://localhost:5001/api/professor/thesesList", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      }
    });
    const thesesList = await response.json();
    if (!response.ok) {
        alert(thesesList.message);
        throw new Error(`Error: ${thesesList.message}`);
    }
    
    return `
        <div class="content-header">
            <h1>Διαχείριση Διπλωματικών</h1>
            <p>Διαχείριση διπλωματικών ανάλογα με την κατάστασή τους</p>
        </div>
        
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Διπλωματικές για Διαχείριση</h3>
            </div>
            
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Τίτλος</th>
                            <th>Φοιτητής</th>
                            <th>Κατάσταση</th>
                            <th>Ρόλος</th>
                            <th>Ημερομηνία Ανάθεσης</th>
                            <th>Ενέργειες</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${thesesList.map(thesis => `
                            <tr>
                                <td>${thesis.thesis_title}</td>
                                <td>${thesis.student_name}</td>
                                <td><span class="status-badge status-${thesis.thesis_status}">${getStatusText(thesis.thesis_status)}</span></td>
                                <td>${thesis.professor_role}</td>
                                <td>${formatDate(thesis.thesis_ass_date)}</td>
                                <td>
                                    <button class="btn btn-secondary" onclick='viewThesisDetails(${JSON.stringify(thesis)})'>Προβολή</button>
                                    <button class="btn btn-primary" onclick='manageThesis(${JSON.stringify(thesis)})'>Διαχείριση</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

// Function to manage individual thesis based on status
async function manageThesis(thesis) {
    
    let modalContent = `
        <div class="modal-header">
            <h2>Διαχείριση Διπλωματικής</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <h3>${thesis.thesis_title}</h3>
            <p><strong>Φοιτητής:</strong> ${thesis.student_name}</p>
            <p><strong>Κατάσταση:</strong> <span class="status-badge status-${thesis.thesis_status}">${getStatusText(thesis.thesis_status)}</span></p>
            <p><strong>Ρόλος:</strong>${thesis.professor_role}</p>
            <hr>
    `;

    console.log(thesis.thesis_status.toLowerCase());
    
    // Actions based on status
    switch(thesis.thesis_status.toLowerCase()) {
        case 'pending':
            modalContent +=  await getPendingThesisActions(thesis);
            break;
        case 'active':
            modalContent += await getActiveThesisActions(thesis);
            break;
        case 'review':
            modalContent += await getReviewThesisActions(thesis);
            break;
        case 'completed':
            modalContent += await getCompletedThesisActions(thesis);
            break;
        case 'cancelled':
            modalContent += await getCancelledThesisActions(thesis);
            break;
    }
    
    modalContent += `
        </div>
    `;
    
    showModal(modalContent);    
}

// Actions for pending thesis
 async function getPendingThesisActions(thesis) {
    const response = await fetch("http://localhost:5001/api/professor/committeeRequests", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      }
    });
    const committeeRequests = await response.json();
    if (!response.ok) {
        alert(committeeRequests.message);
        throw new Error(`Error: ${committeeRequests.message}`);
    }

    const invitations = committeeRequests.filter(inv => inv.thesis_id === thesis.thesis_id) || [];

    let content = `
        <h4>Ενέργειες για Διπλωματική Υπό Ανάθεση</h4>
        
        <div class="card">
            <div class="card-header">
                <h5>Προσκλημένοι Διδάσκοντες</h5>
            </div>
            <div class="invited-members">
    `;
    
    if (invitations && invitations.length > 0) {
        content += `
            <div class="invited-member header">
                <span><strong>Όνομα Καθηγητή</strong></span>
                <span><strong>Ημ/νία Πρόσκλησης</strong></span>
                <span><strong>Ημ/νία Απάντησης</strong></span>
                <span><strong>Κατάσταση</strong></span>
            </div>
        `;

        invitations.forEach(invitation => {
            
            content += `
                <div class="invited-member">
                    <span>${invitation.professor_name}</span>
                    <span>${invitation.invite_date}</span>
                    <span>${invitation.answer_date ? invitation.answer_date : '-'}</span>
                    <span class="status-badge status-${invitation.answer}">
                        ${getInvitationStatusText(invitation.answer)}
                    </span>
                </div>
            `;
        });
    } else {
        content += '<p>Δεν υπάρχουν προσκλήσεις</p>';
    }

    
    if (thesis.professor_role === "Supervisor") {
        content += `
            <div class="card">
                <div class="card-header">
                    <h5>Ενέργειες Επιβλέποντος</h5>
                </div>
                <button class="btn btn-danger" onclick="cancelThesisAssignment(${thesis.thesis_id})">
                    Ακύρωση Ανάθεσης Θέματος
                </button>
            </div>
        `;
    }
    
    return content;
}


async function getActiveThesisActions(thesis) {

    const response = await fetch("http://localhost:5001/api/professor/thesisNotes", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      }
    });
    const notes = await response.json();
    if (!response.ok) {
        alert(notes.message);
        throw new Error(`Error: ${notes.message}`);
    }

    console.log(notes);

    let content = `
        <h4>Ενέργειες για Ενεργή Διπλωματική</h4>
        
        <div class="card">
            <div class="card-header">
                <h5>Σημειώσεις</h5>
            </div>
            <form id="noteForm" onsubmit="addNote(${thesis.thesis_id}, event)">
                <div class="form-group">
                    <label for="noteText">Νέα Σημείωση (μέχρι 300 χαρακτήρες):</label>
                    <textarea id="noteText" maxlength="300" rows="3" required></textarea>
                    <small>Χαρακτήρες: <span id="charCount">0</span>/300</small>
                </div>
                <button type="submit" class="btn btn-primary">Προσθήκη Σημείωσης</button>
            </form>
            
            <div class="notes-list">
                <h3>Σημειώσεις σας:</h3>
                ${notes ? notes.map(note => `
                    <div class="note">
                        <p>${note.comments}</p>
                        <small>${formatDate(note.comment_date)}</small>
                    </div>
                `).join('') : '<p>Δεν υπάρχουν σημειώσεις</p>'}
            </div>
        </div>
    `;
    
    if (thesis.professor_role === "Supervisor") {
        const assignedDate = new Date(thesis.thesis_ass_date);
        const twoYearsAgo = new Date();
        twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
        
        content += `
            <div class="card">
                <div class="card-header">
                    <h5>Ενέργειες Επιβλέποντος</h5>
                </div>
        `;
        
        if (assignedDate < twoYearsAgo) {
            content += `
                <button class="btn btn-warning" onclick="showCancelThesisForm(${thesis.thesis_id})">
                    Ακύρωση Διπλωματικής
                </button>
            `;
        } else {
            content += `<p class="alert alert-info">Η ακύρωση είναι διαθέσιμη μετά από 2 έτη από την ανάθεση</p>`;
        }
        
        content += `
                <button class="btn btn-success" onclick="changeStatusToReview(${thesis.thesis_id})">
                    Αλλαγή σε "Υπό Εξέταση"
                </button>
            </div>
        `;
    }
    
    return content;
}

// Actions for review thesis
async function getReviewThesisActions(thesis) {
    let content = `
        <h4>Ενέργειες για Διπλωματική Υπό Εξέταση</h4>
        
        <div class="card">
            <div class="card-header">
                <h5>Πρόχειρο Διπλωματικής</h5>
            </div>
            ${thesis.draftText ? `
                <div class="thesis-draft">
                    <p><strong>Πρόχειρο από τον φοιτητή:</strong></p>
                    <div class="draft-content">${thesis.draftText}</div>
                </div>
            ` : '<p>Δεν έχει αναρτηθεί πρόχειρο ακόμα</p>'}
        </div>
    `;
    
    if (thesis.professor_role === "Supervisor") {
        content += `
            <div class="card">
                <div class="card-header">
                    <h5>Ενέργειες Επιβλέποντος</h5>
                </div>
                ${thesis.presentationDetails ? `
                    <button class="btn btn-primary" onclick="generateAnnouncement(${thesis.id})">
                        Δημιουργία Ανακοίνωσης Παρουσίασης
                    </button>
                ` : '<p class="alert alert-warning">Η ανακοίνωση είναι διαθέσιμη μόνο μετά τη συμπλήρωση των λεπτομερειών παρουσίασης</p>'}
                
                ${!thesis.enableGrading ? `
                <button class="btn btn-success" onclick="enableGrading(${thesis.thesis_id})">
                    Ενεργοποίηση Βαθμολόγησης
                </button>
                ` : '<p class="alert alert-info">Η βαθμολόγηση έχει ενεργοποιηθεί από τον επιβλέποντα</p>'}
            </div>
        `;
    }
    
    if (thesis.professor_role === "Supervisor" || thesis.professor_role === "Committee Member") {
        content += `
            <div class="card">
                <div class="card-header">
                    <h5>Βαθμολόγηση</h5>
                </div>
                ${thesis.enableGrading ? `
                    <form id="gradeForm" onsubmit="submitGrade(${thesis.thesis_id}, event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contentGrade">Ποιότητα Δ.Ε.</label>
                                <input type="number" id="contentGrade" min="0" max="10" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label for="methodologyGrade">Χρονικό Διάστημα Εκπόνησης</label>
                                <input type="number" id="methodologyGrade" min="0" max="10" step="0.1" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="presentationGrade">Πληρότητα Κειμένου</label>
                                <input type="number" id="presentationGrade" min="0" max="10" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label for="originalityGrade">Συνολική Εικόνα Παρουσίασης</label>
                                <input type="number" id="originalityGrade" min="0" max="10" step="0.1" required>
                            </div>
                        </div>
                        <button type="submit" class="btn btn-primary">Υποβολή Βαθμού</button>
                    </form>
                    
                    <div class="grades-summary">
                        <h6>Βαθμοί Τριμελούς:</h6>
                        ${thesis.grades ? thesis.grades.map(grade => {
                            const professor = users.find(u => u.id === grade.professorId);
                            return `
                                <div class="grade-item">
                                    <span>${professor ? professor.name : 'Άγνωστος'}: ${grade.grade.toFixed(1)}</span>
                                </div>
                            `;
                        }).join('') : '<p>Δεν υπάρχουν βαθμοί ακόμα</p>'}
                    </div>
                ` : '<p class="alert alert-info">Η βαθμολόγηση θα ενεργοποιηθεί από τον επιβλέποντα</p>'}
            </div>
        `;
    }
    
    return content;
}

// Actions for completed thesis
async function getCompletedThesisActions(thesis, isSupervisor, isCommitteeMember) {
    return `
        <h4>Διπλωματική Περατωμένη</h4>
        <p>Η διπλωματική έχει ολοκληρωθεί με επιτυχία.</p>
        
        <div class="card">
            <div class="card-header">
                <h5>Τελικός Βαθμός</h5>
            </div>
            <div class="final-grade">
                <h3>${thesis.grade ? thesis.grade.toFixed(1) : 'Δεν έχει βαθμολογηθεί'}</h3>
            </div>
        </div>
    `;
}

// Actions for cancelled thesis
async function getCancelledThesisActions(thesis) {
    return `
        <h4>Διπλωματική Ακυρωμένη</h4>
        <p>Η διπλωματική έχει ακυρωθεί.</p>
        ${thesis.cancellationReason ? `
            <div class="card">
                <div class="card-header">
                    <h5>Λόγος Ακύρωσης</h5>
                </div>
                <p>${thesis.cancellationReason}</p>
            </div>
        ` : ''}
    `;
}

// Helper function to get invitation status text
function getInvitationStatusText(status) {
    const statuses = {
        pending: 'Εκκρεμεί',
        accepted: 'Αποδεκτή',
        rejected: 'Απορριφθείσα'
    };
    return statuses[status] || status;
}

// Helper function to filter manage theses
function filterManageTheses() {
    // This function would implement filtering logic
    console.log('Filtering manage theses...');
}

// Action functions for thesis management
function cancelThesisAssignment(thesisId) {
    if (confirm('Είστε σίγουροι ότι θέλετε να ακυρώσετε την ανάθεση αυτής της διπλωματικής;')) {
        const thesis = theses.find(t => t.id === thesisId);
        if (thesis) {
            thesis.status = 'cancelled';
            thesis.cancellationReason = 'Ακυρώθηκε από τον επιβλέποντα';
            closeModal();
            loadContent('manageTheses');
        }
    }
}

async function addNote(thesisID, event) {
    event.preventDefault();
    const newNotes = document.getElementById('noteText').value;
    
    const response = await fetch("http://localhost:5001/api/professor/thesisNotes", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      },
      body: JSON.stringify({ thesisID , newNotes })
    });

    const result = await response.json();

    if (!response.ok) {
        alert(`Error: ${result.message}`);
        return;
    }
        
    document.getElementById('noteText').value = '';
    alert('Η προσθήκη νέας σημείωσης ήταν επιτυχής!');
    closeModal();
    loadContent('manageTheses');
    
}

function showCancelThesisForm(thesisId) {
    const modalContent = `
        <div class="modal-header">
            <h2>Ακύρωση Διπλωματικής</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <form id="cancelThesisForm" onsubmit="cancelThesisWithDetails(${thesisId}, event)">
                <div class="form-group">
                    <label for="assemblyNumber">Αριθμός Γενικής Συνέλευσης:</label>
                    <input type="number" id="assemblyNumber" required>
                </div>
                <div class="form-group">
                    <label for="assemblyYear">Έτος Γενικής Συνέλευσης:</label>
                    <input type="number" id="assemblyYear" min="2020" max="2030" required>
                </div>
                <button type="submit" class="btn btn-danger">Ακύρωση Διπλωματικής</button>
            </form>
        </div>
    `;
    showModal(modalContent);
}

async function cancelThesisWithDetails(thesisID, event) {
    event.preventDefault();
    const assemblyNumber = document.getElementById('assemblyNumber').value;
    const assemblyYear = document.getElementById('assemblyYear').value;
    
    const response = await fetch("http://localhost:5001/api/professor/cancelThesis", {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      },
      body: JSON.stringify({ thesisID , assemblyNumber, assemblyYear})
    });

    const result = await response.json();

    if (!response.ok) {
        alert(`Error: ${result.message}`);
        return;
    }

    alert('Η παρούσα διπλωματική μόλις ακυρώθηκε!');
    closeModal();
    loadContent('manageTheses');
}

async function changeStatusToReview(thesisID) {
   const response = await fetch("http://localhost:5001/api/professor/updateToReview", {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      },
      body: JSON.stringify({ thesisID })
    });

    const result = await response.json();

    if (!response.ok) {
        alert(`Error: ${result.message}`);
        return;
    }

    alert('Αλλαγή Κατάστασης Επιτυχής : "Ενεργή" -> "Υπό Εξέταση"');
    closeModal();
    loadContent('manageTheses');
}

function generateAnnouncement(thesisId) {
    const thesis = theses.find(t => t.id === thesisId);
    if (thesis && thesis.presentationDetails) {
        const announcement = `
            ΑΝΑΚΟΙΝΩΣΗ ΠΑΡΟΥΣΙΑΣΗΣ ΔΙΠΛΩΜΑΤΙΚΗΣ ΕΡΓΑΣΙΑΣ
            
            Τίτλος: ${thesis.title}
            Φοιτητής: ${getUserName(thesis.studentId)}
            Ημερομηνία: ${formatDate(thesis.presentationDetails.date)}
            Ώρα: ${thesis.presentationDetails.time}
            Τύπος: ${thesis.presentationDetails.type === 'online' ? 'Διαδικτυακά' : 'Προσωπικά'}
            ${thesis.presentationDetails.type === 'online' ? 
                `Σύνδεσμος: ${thesis.presentationDetails.link}` : 
                `Αίθουσα: ${thesis.presentationDetails.room}`
            }
        `;
        
        const modalContent = `
            <div class="modal-header">
                <h2>Ανακοίνωση Παρουσίασης</h2>
                <button class="modal-close" onclick="closeModal()">&times;</button>
            </div>
            <div class="modal-body">
                <pre style="white-space: pre-wrap; font-family: inherit;">${announcement}</pre>
                <button class="btn btn-primary" onclick="copyAnnouncement()">Αντιγραφή</button>
            </div>
        `;
        showModal(modalContent);
    }
}

async function enableGrading(thesisID) {
     const response = await fetch("http://localhost:5001/api/professor/enableGrading", {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      },
      body: JSON.stringify({ thesisID })
    });

    const result = await response.json();

    if (!response.ok) {
        alert(`Error: ${result.message}`);
        return;
    }

    alert('Η βαθμολόγηση μόλις ενεργοποιήθηκε!');
    closeModal();
    loadContent('manageTheses');
}

async function submitGrade(thesisID, event) {
    event.preventDefault();
    const grade1 = parseFloat(document.getElementById('contentGrade').value);
    const grade2 = parseFloat(document.getElementById('methodologyGrade').value);
    const grade3 = parseFloat(document.getElementById('presentationGrade').value);
    const grade4 = parseFloat(document.getElementById('originalityGrade').value);
    
    const response = await fetch("http://localhost:5001/api/professor/postGrade", {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      },
      body: JSON.stringify({ thesisID , grade1, grade2, grade3, grade4})
    });

    const result = await response.json();

    if (!response.ok) {
        alert(`Error: ${result.message}`);
        return;
    }
    
    alert('Η καταχώρηση βαθμού ήταν επιτυχής!');
    closeModal();
    manageThesis(thesisID);
}

function copyAnnouncement() {
    // This would copy the announcement text to clipboard
    alert('Η ανακοίνωση αντιγράφηκε στο clipboard!');
}

async function getInvitationsList() {
    const response = await fetch("http://localhost:5001/api/professor/invitations", {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    });
    const invitations = await response.json();
    if (!response.ok) {
        alert(invitations.message);
        throw new Error(`Error: ${invitations.message}`);
    }

    const rowsHTML = invitations.filter(i => i.answer === 'pending').map(inv => `
        <tr>
            <td>${inv.title}</td>   
            <td>${inv.student_name}</td>
            <td>${inv.supervisor}</td>
            <td>${formatDate(inv.invite_date)}</td>
            <td>
                <button class="btn btn-primary" onclick="respondToInvitation(${inv.id}, true)">Αποδοχή</button>
                <button class="btn btn-danger" onclick="respondToInvitation(${inv.id}, false)">Απόρριψη</button>
            </td>
        </tr>
    `).join('');

  return `
    <div class="content-header">
        <h1>Προσκλήσεις Τριμελούς Επιτροπής</h1>
        <p>Δείτε και απαντήστε στις προσκλήσεις που έχετε λάβει για συμμετοχή σε τριμελείς επιτροπές.</p>
    </div>
    
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Ενεργές Προσκλήσεις</h3>
        </div>
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Θέμα Διπλωματικής</th>
                        <th>Φοιτητής</th>
                        <th>Επιβλέπων</th>
                        <th>Ημερομηνία Πρόσκλησης</th>
                        <th>Ενέργειες</th>
                    </tr>
                </thead>
                <tbody id="invitationsTableBody">
                    ${rowsHTML}
                </tbody>
            </table>
        </div>
    </div>
  `;
}

async function respondToInvitation(invitationId, accepted) {
  const response = await fetch(`http://localhost:5001/api/professor/invitations/respond`, {
    method: 'PUT',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      invitationId: invitationId,
      response: accepted ? 'accepted' : 'declined'
    })
  });

  const result = await response.json();
  if (response.ok) {
    alert(result.message || 'Η απάντηση καταχωρήθηκε.');
    loadContent("invitations"); // Refresh list
  } else {
    alert(result.message || 'Σφάλμα κατά την απάντηση.');
  }
}

