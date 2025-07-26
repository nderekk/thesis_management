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

async function createTopic() {
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

function getTopicAssignment() {
    return `
        <div class="content-header">
            <h1>Ανάθεση Θέματος</h1>
            <p>Επιλέξτε φοιτητή για να του αναθέσετε διαθέσιμο θέμα.</p>
        </div>
        <div class="card">
            <p>Η λειτουργικότητα ανάθεσης δεν έχει υλοποιηθεί ακόμα.</p>
        </div>
    `;
}

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

function getStatistics() {
    const userTheses = theses.filter(t => 
        t.supervisorId === currentUser.id || 
        t.committeeMembers.includes(currentUser.id)
    );
    
    const supervisedTheses = userTheses.filter(t => t.supervisorId === currentUser.id);
    const committeeTheses = userTheses.filter(t => t.committeeMembers.includes(currentUser.id));
    
    // Calculate statistics for supervised theses
    const avgCompletionTimeSupervised = calculateAverageCompletionTime(supervisedTheses);
    const avgGradeSupervised = calculateAverageGrade(supervisedTheses);
    const totalSupervised = supervisedTheses.length;
    
    // Calculate statistics for committee member theses
    const avgCompletionTimeCommittee = calculateAverageCompletionTime(committeeTheses);
    const avgGradeCommittee = calculateAverageGrade(committeeTheses);
    const totalCommittee = committeeTheses.length;
    
    // Calculate overall statistics
    const avgCompletionTimeOverall = calculateAverageCompletionTime(userTheses);
    const avgGradeOverall = calculateAverageGrade(userTheses);
    const totalOverall = userTheses.length;
    
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
                    <div class="stats-number">${stats.supervisorAvg}</div>
                    <div class="stats-label">Επιβλεπόμενες ΔΕ</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.committeeAvg}</div>
                    <div class="stats-label">Μέλος Τριμελούς</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.totalAvg}</div>
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
                    <div class="stats-number">${stats.supervisorGrade}</div>
                    <div class="stats-label">Επιβλεπόμενες ΔΕ</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.committeeGrade}</div>
                    <div class="stats-label">Μέλος Τριμελούς</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${stats.totalGrade}</div>
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
                            <td>${stats.supervisorAvg}</td>
                            <td>${stats.committeeAvg}</td>
                            <td>${stats.totalAvg}</td>
                        </tr>
                        <tr>
                            <td><strong>Μέσος βαθμός</strong></td>
                            <td>${stats.supervisorGrade}</td>
                            <td>${stats.committeeGrade}</td>
                            <td>${stats.totalGrade}</td>
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

function getThesesManagement() {
    const userTheses = theses.filter(t => 
        t.supervisorId === currentUser.id || 
        t.committeeMembers.includes(currentUser.id)
    );
    
    return `
        <div class="content-header">
            <h1>Διαχείριση Διπλωματικών</h1>
            <p>Διαχείριση διπλωματικών ανάλογα με την κατάστασή τους</p>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Φίλτρα</h3>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="statusFilter">Κατάσταση:</label>
                    <select id="statusFilter" onchange="filterManageTheses()">
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
                    <select id="roleFilter" onchange="filterManageTheses()">
                        <option value="">Όλοι</option>
                        <option value="supervisor">Επιβλέπων</option>
                        <option value="committee">Μέλος Τριμελούς</option>
                    </select>
                </div>
            </div>
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
                        ${userTheses.map(thesis => `
                            <tr>
                                <td>${thesis.title}</td>
                                <td>${getUserName(thesis.studentId)}</td>
                                <td><span class="status-badge status-${thesis.status}">${getStatusText(thesis.status)}</span></td>
                                <td>${thesis.supervisorId === currentUser.id ? 'Επιβλέπων' : 'Μέλος Τριμελούς'}</td>
                                <td>${formatDate(thesis.assignedDate)}</td>
                                <td>
                                    <button class="btn btn-secondary" onclick="viewThesisDetails(${thesis.id})">Προβολή</button>
                                    <button class="btn btn-primary" onclick="manageThesis(${thesis.id})">Διαχείριση</button>
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
function manageThesis(thesisId) {
    const thesis = theses.find(t => t.id === thesisId);
    if (!thesis) return;
    
    const isSupervisor = thesis.supervisorId === currentUser.id;
    const isCommitteeMember = thesis.committeeMembers.includes(currentUser.id);
    
    let modalContent = `
        <div class="modal-header">
            <h2>Διαχείριση Διπλωματικής</h2>
            <button class="modal-close" onclick="closeModal()">&times;</button>
        </div>
        <div class="modal-body">
            <h3>${thesis.title}</h3>
            <p><strong>Φοιτητής:</strong> ${getUserName(thesis.studentId)}</p>
            <p><strong>Κατάσταση:</strong> <span class="status-badge status-${thesis.status}">${getStatusText(thesis.status)}</span></p>
            <p><strong>Ρόλος:</strong> ${isSupervisor ? 'Επιβλέπων' : 'Μέλος Τριμελούς'}</p>
            <hr>
    `;
    
    // Actions based on status
    switch(thesis.status) {
        case 'pending':
            modalContent += getPendingThesisActions(thesis, isSupervisor);
            break;
        case 'active':
            modalContent += getActiveThesisActions(thesis, isSupervisor);
            break;
        case 'review':
            modalContent += getReviewThesisActions(thesis, isSupervisor, isCommitteeMember);
            break;
        case 'completed':
            modalContent += getCompletedThesisActions(thesis, isSupervisor, isCommitteeMember);
            break;
        case 'cancelled':
            modalContent += getCancelledThesisActions(thesis);
            break;
    }
    
    modalContent += `
        </div>
    `;
    
    showModal(modalContent);
}

// Actions for pending thesis
function getPendingThesisActions(thesis, isSupervisor) {
    let content = `
        <h4>Ενέργειες για Διπλωματική Υπό Ανάθεση</h4>
        
        <div class="card">
            <div class="card-header">
                <h5>Προσκλημένοι Διδάσκοντες</h5>
            </div>
            <div class="invited-members">
    `;
    
    if (thesis.invitedProfessors && thesis.invitedProfessors.length > 0) {
        thesis.invitedProfessors.forEach(invitation => {
            const professor = users.find(u => u.id === invitation.professorId);
            content += `
                <div class="invited-member">
                    <span>${professor ? professor.name : 'Άγνωστος'}</span>
                    <span class="status-badge status-${invitation.status}">${getInvitationStatusText(invitation.status)}</span>
                </div>
            `;
        });
    } else {
        content += '<p>Δεν υπάρχουν προσκλήσεις</p>';
    }
    
    content += `
            </div>
        </div>
    `;
    
    if (isSupervisor) {
        content += `
            <div class="card">
                <div class="card-header">
                    <h5>Ενέργειες Επιβλέποντος</h5>
                </div>
                <button class="btn btn-danger" onclick="cancelThesisAssignment(${thesis.id})">
                    Ακύρωση Ανάθεσης Θέματος
                </button>
            </div>
        `;
    }
    
    return content;
}

// Actions for active thesis
function getActiveThesisActions(thesis, isSupervisor) {
    let content = `
        <h4>Ενέργειες για Ενεργή Διπλωματική</h4>
        
        <div class="card">
            <div class="card-header">
                <h5>Σημειώσεις</h5>
            </div>
            <form id="noteForm" onsubmit="addNote(${thesis.id}, event)">
                <div class="form-group">
                    <label for="noteText">Νέα Σημείωση (μέχρι 300 χαρακτήρες):</label>
                    <textarea id="noteText" maxlength="300" rows="3" required></textarea>
                    <small>Χαρακτήρες: <span id="charCount">0</span>/300</small>
                </div>
                <button type="submit" class="btn btn-primary">Προσθήκη Σημείωσης</button>
            </form>
            
            <div class="notes-list">
                <h6>Σημειώσεις σας:</h6>
                ${thesis.notes ? thesis.notes.filter(note => note.professorId === currentUser.id).map(note => `
                    <div class="note">
                        <p>${note.text}</p>
                        <small>${formatDate(note.date)}</small>
                    </div>
                `).join('') : '<p>Δεν υπάρχουν σημειώσεις</p>'}
            </div>
        </div>
    `;
    
    if (isSupervisor) {
        const assignedDate = new Date(thesis.assignedDate);
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
                <button class="btn btn-warning" onclick="showCancelThesisForm(${thesis.id})">
                    Ακύρωση Διπλωματικής (μετά από 2 έτη)
                </button>
            `;
        } else {
            content += `<p class="alert alert-info">Η ακύρωση είναι διαθέσιμη μετά από 2 έτη από την ανάθεση</p>`;
        }
        
        content += `
                <button class="btn btn-success" onclick="changeStatusToReview(${thesis.id})">
                    Αλλαγή σε "Υπό Εξέταση"
                </button>
            </div>
        `;
    }
    
    return content;
}

// Actions for review thesis
function getReviewThesisActions(thesis, isSupervisor, isCommitteeMember) {
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
    
    if (isSupervisor) {
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
                
                <button class="btn btn-success" onclick="enableGrading(${thesis.id})">
                    Ενεργοποίηση Βαθμολόγησης
                </button>
            </div>
        `;
    }
    
    if (isSupervisor || isCommitteeMember) {
        content += `
            <div class="card">
                <div class="card-header">
                    <h5>Βαθμολόγηση</h5>
                </div>
                ${thesis.gradingEnabled ? `
                    <form id="gradeForm" onsubmit="submitGrade(${thesis.id}, event)">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contentGrade">Περιεχόμενο:</label>
                                <input type="number" id="contentGrade" min="0" max="10" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label for="methodologyGrade">Μεθοδολογία:</label>
                                <input type="number" id="methodologyGrade" min="0" max="10" step="0.1" required>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="presentationGrade">Παρουσίαση:</label>
                                <input type="number" id="presentationGrade" min="0" max="10" step="0.1" required>
                            </div>
                            <div class="form-group">
                                <label for="originalityGrade">Πρωτοτυπία:</label>
                                <input type="number" id="originalityGrade" min="0" max="10" step="0.1" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="gradeComments">Σχόλια:</label>
                            <textarea id="gradeComments" rows="3"></textarea>
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
function getCompletedThesisActions(thesis, isSupervisor, isCommitteeMember) {
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
function getCancelledThesisActions(thesis) {
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

function addNote(thesisId, event) {
    event.preventDefault();
    const noteText = document.getElementById('noteText').value;
    const thesis = theses.find(t => t.id === thesisId);
    
    if (thesis && noteText.trim()) {
        if (!thesis.notes) thesis.notes = [];
        thesis.notes.push({
            professorId: currentUser.id,
            text: noteText,
            date: new Date().toISOString()
        });
        
        document.getElementById('noteText').value = '';
        closeModal();
        manageThesis(thesisId);
    }
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

function cancelThesisWithDetails(thesisId, event) {
    event.preventDefault();
    const assemblyNumber = document.getElementById('assemblyNumber').value;
    const assemblyYear = document.getElementById('assemblyYear').value;
    
    const thesis = theses.find(t => t.id === thesisId);
    if (thesis) {
        thesis.status = 'cancelled';
        thesis.cancellationReason = `Ακυρώθηκε από Διδάσκοντα - Γενική Συνέλευση ${assemblyNumber}/${assemblyYear}`;
        closeModal();
        loadContent('manageTheses');
    }
}

function changeStatusToReview(thesisId) {
    const thesis = theses.find(t => t.id === thesisId);
    if (thesis) {
        thesis.status = 'review';
        closeModal();
        loadContent('manageTheses');
    }
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

function enableGrading(thesisId) {
    const thesis = theses.find(t => t.id === thesisId);
    if (thesis) {
        thesis.gradingEnabled = true;
        closeModal();
        manageThesis(thesisId);
    }
}

function submitGrade(thesisId, event) {
    event.preventDefault();
    const contentGrade = parseFloat(document.getElementById('contentGrade').value);
    const methodologyGrade = parseFloat(document.getElementById('methodologyGrade').value);
    const presentationGrade = parseFloat(document.getElementById('presentationGrade').value);
    const originalityGrade = parseFloat(document.getElementById('originalityGrade').value);
    const comments = document.getElementById('gradeComments').value;
    
    const averageGrade = (contentGrade + methodologyGrade + presentationGrade + originalityGrade) / 4;
    
    const thesis = theses.find(t => t.id === thesisId);
    if (thesis) {
        if (!thesis.grades) thesis.grades = [];
        
        // Check if professor already graded
        const existingGradeIndex = thesis.grades.findIndex(g => g.professorId === currentUser.id);
        if (existingGradeIndex >= 0) {
            thesis.grades[existingGradeIndex] = {
                professorId: currentUser.id,
                grade: averageGrade,
                criteria: {
                    content: contentGrade,
                    methodology: methodologyGrade,
                    presentation: presentationGrade,
                    originality: originalityGrade
                },
                comments: comments,
                date: new Date().toISOString()
            };
        } else {
            thesis.grades.push({
                professorId: currentUser.id,
                grade: averageGrade,
                criteria: {
                    content: contentGrade,
                    methodology: methodologyGrade,
                    presentation: presentationGrade,
                    originality: originalityGrade
                },
                comments: comments,
                date: new Date().toISOString()
            });
        }
        
        closeModal();
        manageThesis(thesisId);
    }
}

function copyAnnouncement() {
    // This would copy the announcement text to clipboard
    alert('Η ανακοίνωση αντιγράφηκε στο clipboard!');
}

function getInvitationsList() {
    return `
        <div class="content-header">
            <h1>Προσκλήσεις Τριμελούς Επιτροπής</h1>
        </div>
        <div class="card">
            <p>Η λειτουργία προβολής και αποδοχής/απόρριψης προσκλήσεων δεν είναι ακόμα διαθέσιμη.</p>
        </div>
    `;
}