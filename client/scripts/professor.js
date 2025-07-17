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
    
    const avgCompletionTime = calculateAverageCompletionTime(userTheses);
    const avgGrade = calculateAverageGrade(userTheses);
    
    return `
        <div class="content-header">
            <h1>Στατιστικά</h1>
            <p>Στατιστικά στοιχεία των διπλωματικών σας</p>
        </div>
        
        <div class="grid grid-3">
            <div class="stats-card">
                <div class="stats-number">${supervisedTheses.length}</div>
                <div class="stats-label">Επιβλεπόμενες ΔΕ</div>
            </div>
            <div class="stats-card">
                <div class="stats-number">${committeeTheses.length}</div>
                <div class="stats-label">Μέλος Τριμελούς</div>
            </div>
            <div class="stats-card">
                <div class="stats-number">${avgCompletionTime}</div>
                <div class="stats-label">Μέσος Χρόνος (μήνες)</div>
            </div>
        </div>
        
        <div class="grid grid-2">
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Μέσος Βαθμός</h3>
                </div>
                <div class="stats-number" style="color: #667eea; text-align: center; font-size: 3rem;">
                    ${avgGrade.toFixed(1)}
                </div>
            </div>
            
            <div class="card">
                <div class="card-header">
                    <h3 class="card-title">Κατανομή Καταστάσεων</h3>
                </div>
                <div id="statusChart">
                    <!-- Chart will be rendered here -->
                </div>
            </div>
        </div>
    `;
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
