function getTopicsManagement() {
    const userTopics = topics.filter(t => t.creatorId === currentUser.id);
    
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
                        ${userTopics.map(topic => `
                            <tr>
                                <td>${topic.title}</td>
                                <td><span class="status-badge status-${topic.status}">${getStatusText(topic.status)}</span></td>
                                <td>${formatDate(topic.createdDate)}</td>
                                <td>
                                    <button class="btn btn-secondary" onclick="editTopic(${topic.id})">Επεξεργασία</button>
                                    <button class="btn btn-danger" onclick="deleteTopic(${topic.id})">Διαγραφή</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `;
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

function getThesesList() {
    const userTheses = theses.filter(t => 
        t.supervisorId === currentUser.id || 
        t.committeeMembers.includes(currentUser.id)
    );
    
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
            <div class="grid grid-3">
                <div class="stats-card">
                    <div class="stats-number">${avgCompletionTimeSupervised}</div>
                    <div class="stats-label">Επιβλεπόμενες ΔΕ</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${avgCompletionTimeCommittee}</div>
                    <div class="stats-label">Μέλος Τριμελούς</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${avgCompletionTimeOverall}</div>
                    <div class="stats-label">Συνολικά</div>
                </div>
            </div>
        </div>
        
        <!-- Μέσος βαθμός -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Μέσος Βαθμός</h3>
            </div>
            <div class="grid grid-3">
                <div class="stats-card">
                    <div class="stats-number">${avgGradeSupervised.toFixed(1)}</div>
                    <div class="stats-label">Επιβλεπόμενες ΔΕ</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${avgGradeCommittee.toFixed(1)}</div>
                    <div class="stats-label">Μέλος Τριμελούς</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${avgGradeOverall.toFixed(1)}</div>
                    <div class="stats-label">Συνολικά</div>
                </div>
            </div>
        </div>
        
        <!-- Συνολικό πλήθος -->
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">Συνολικό Πλήθος Διπλωματικών</h3>
            </div>
            <div class="grid grid-3">
                <div class="stats-card">
                    <div class="stats-number">${totalSupervised}</div>
                    <div class="stats-label">Επιβλεπόμενες ΔΕ</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${totalCommittee}</div>
                    <div class="stats-label">Μέλος Τριμελούς</div>
                </div>
                <div class="stats-card">
                    <div class="stats-number">${totalOverall}</div>
                    <div class="stats-label">Συνολικά</div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-2">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Κατανομή Καταστάσεων</h3>
                </div>
                <div id="statusChart">
                    ${generateStatusChart(userTheses)}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Κατανομή Βαθμών</h3>
                </div>
                <div id="gradeChart">
                    ${generateGradeChart(userTheses)}
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
                            <td>${avgCompletionTimeSupervised}</td>
                            <td>${avgCompletionTimeCommittee}</td>
                            <td>${avgCompletionTimeOverall}</td>
                        </tr>
                        <tr>
                            <td><strong>Μέσος βαθμός</strong></td>
                            <td>${avgGradeSupervised.toFixed(1)}</td>
                            <td>${avgGradeCommittee.toFixed(1)}</td>
                            <td>${avgGradeOverall.toFixed(1)}</td>
                        </tr>
                        <tr>
                            <td><strong>Συνολικό πλήθος</strong></td>
                            <td>${totalSupervised}</td>
                            <td>${totalCommittee}</td>
                            <td>${totalOverall}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    `;
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
