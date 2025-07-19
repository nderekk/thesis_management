async function getStudentThesisView() {
    const response = await fetch("http://localhost:5001/api/student/thesis", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      }
    });
    const studentThesis = await response.json();
    if (!response.ok) {
        alert(studentThesis.message);
        throw new Error(`Error: ${studentThesis.message}`);
    }
    console.log(studentThesis);
    if (!studentThesis) {
        return `<div class="content-header">
                    <h1>Προβολή Θέματος</h1>
                    <p>Δεν έχετε αναλάβει ακόμα διπλωματική εργασία.</p>
                </div>`;
    }
    return `
        <div class="content-header">
            <h1>Προβολή Θέματος</h1>
            <p>Λεπτομέρειες της διπλωματικής εργασίας σας</p>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${studentThesis.title}</h3>
                <span class="status-badge status-${studentThesis.status}">${getStatusText(studentThesis.status)}</span>    
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Επιβλέπων:</label>
                    <p>${studentThesis.supervisor}</p>
                </div>
                <div class="form-group">
                    <label>Ημερομηνία Ανάθεσης:</label>
                    <p>${formatDate(studentThesis.assignedDate)}</p>
                </div>
            </div>
            
            <div class="form-group">
                <label>Περιγραφή:</label>
                <p>${studentThesis.description}</p>
            </div>
            
            ${studentThesis.committeeMembers.length > 0 ? `
                <div class="form-group">
                    <label>Μέλη Τριμελούς:</label>
                    <ul>
                        ${studentThesis.committeeMembers.map(member => `<li>${member}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${studentThesis.assignedDate ? `
                <div class="form-group">
                    <label>Χρόνος από την Ανάθεση:</label>
                    <p>${calculateTimeSince(studentThesis.assignedDate)}</p>
                </div>
            ` : ''}
        </div>
    `;
}

function getProfileEditForm() {
    return `
        <div class="content-header">
            <h1>Επεξεργασία Προφίλ</h1>
            <p>Ενημερώστε τα στοιχεία επικοινωνίας σας</p>
        </div>
        
        <div class="form-container">
            <form id="profileForm">
                <div class="form-group">
                    <label for="address">Πλήρης Ταχυδρομική Διεύθυνση:</label>
                    <input type="text" id="address" value="${currentUser.address + 
                      ", " + currentUser.city + 
                      ", " + currentUser.post_code 
                      || ''}" required>
                </div>
                
                <div class="form-group">
                    <label for="email">Email Επικοινωνίας:</label>
                    <input type="email" id="email" value="${currentUser.email || ''}" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="mobile">Κινητό Τηλέφωνο:</label>
                        <input type="tel" id="mobile" value="${currentUser.mobile_number || ''}" required>
                    </div>
                    <div class="form-group">
                        <label for="phone">Σταθερό Τηλέφωνο:</label>
                        <input type="tel" id="phone" value="${currentUser.phone_number || ''}">
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary">Αποθήκευση</button>
            </form>
        </div>
    `;
}

document.addEventListener('submit', async function (e) {
    if (e.target.id === 'profileForm') {
        e.preventDefault();
        currentUser.email = document.getElementById('email').value;
        currentUser.phone_number = document.getElementById('phone').value;
        currentUser.mobile_number = document.getElementById('mobile').value;
        const fullAddress = document.getElementById('address').value;
        currentUser.address = fullAddress.split(', ')[0];
        currentUser.city = fullAddress.split(', ')[1];
        currentUser.post_code = fullAddress.split(', ')[2];
        const response = await fetch("http://localhost:5001/api/student", {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'  // important for JSON data
            },
            body: JSON.stringify({
                "newAddress": currentUser.address,
                "newCity": currentUser.city,
                "newPostCode": currentUser.post_code,
                "newEmail": currentUser.email,
                "newMobile": currentUser.mobile_number, 
                "newPhone": currentUser.phone_number
            })
        });
        const r = await response.json();
        if (!response.ok) {
            alert(r.message);
            throw new Error(`Error: ${r.message}`);
        }
        alert('Τα στοιχεία αποθηκεύτηκαν.');
    }
});

// Additional functions for other pages will be implemented as needed
async function getThesisManagement() {
    console.log("getThesisManagement called");
    console.log("currentUser:", currentUser);
    console.log("theses:", theses);
    console.log("currentUser.am:", currentUser.am);
    
    const response = await fetch("http://localhost:5001/api/student/thesis", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'  // important for JSON data
        },
    });
    const studentThesis = await response.json();
    if (!response.ok) {
        alert(studentThesis.message);
        throw new Error(`Error: ${studentThesis.message}`);
    }
    console.log("studentThesis found:", studentThesis);
    
    if (!studentThesis) {
        console.log("No thesis found for student");
        return `
            <div class="content-header">
                <h1>Διαχείριση Διπλωματικής</h1>
                <p>Δεν έχετε αναλάβει ακόμα διπλωματική εργασία.</p>
            </div>
        `;
    }
    let content = `
        <div class="content-header">
            <h1>Διαχείριση Διπλωματικής</h1>
            <p>Διαχειριστείτε την πρόοδο της διπλωματικής σας</p>
        </div>
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">${studentThesis.title}</h3>
                <span class="status-badge status-${studentThesis.status}">${getStatusText(studentThesis.status)}</span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Επιβλέπων:</label>
                    <p>${studentThesis.supervisor}</p>
                </div>
                <div class="form-group">
                    <label>Ημερομηνία Ανάθεσης:</label>
                    <p>${formatDate(studentThesis.assignedDate)}</p>
                </div>
            </div>
            <div class="form-group">
                <label>Περιγραφή:</label>
                <p>${studentThesis.description}</p>
            </div>
        </div>
    `;
    switch(studentThesis.status.toLowerCase()) {
        case 'pending':
            content += await getPendingThesisContent(studentThesis);
            break;
        case 'active':
            content +=  getActiveThesisContent(studentThesis);
            break;
        case 'review':
            content += getReviewThesisContent(studentThesis);
            break;
        case 'completed':
            content += getCompletedThesisContent(studentThesis);
            break;
        default:
            content += `<div class="card"><p>Η κατάσταση της διπλωματικής σας δεν επιτρέπει επιπλέον ενέργειες.</p></div>`;
    }
    return content;
}

async function  getPendingThesisContent(thesis) {
    const response = await fetch("http://localhost:5001/api/student/professorList", {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'  // important for JSON data
      }
    });
    var professors = await response.json();
    if (!response.ok) {
        alert(studentThesis.message);
        throw new Error(`Error: ${studentThesis.message}`);
    }
    professors = professors.p.filter(p => p.name !== thesis.supervisor);
    console.log(thesis.supervisor);
    const invitedProfessors = thesis.invitedProfessors || [];
    const acceptedInvitations = invitedProfessors.filter(inv => inv.status === 'accepted').length;
    return `
        <div class="card mt-20">
            <div class="card-header">
                <h3 class="card-title">Επιλογή Μελών Τριμελούς Επιτροπής</h3>
                <p>Επιλέξτε δύο διδάσκοντες για τη τριμελή επιτροπή. Όταν αποδεχθούν δύο, η διπλωματική γίνεται "Ενεργή".</p>
            </div>
            <div class="form-group">
                <label>Επιβλέπων (αυτόματος):</label>
                <p><strong>${thesis.supervisor}</strong></p>
            </div>
            <div class="form-group">
                <label>Προσκληθέντες Διδάσκοντες:</label>
                <div class="invited-members">
                    ${invitedProfessors.length === 0 ? '<p>Δεν έχουν σταλεί προσκλήσεις.</p>' : invitedProfessors.map(inv => `
                        <div class="invited-member">
                            <span>${inv.first_name} ${inv.last_name} </span>
                            <!-- <span class="status-badge status-${inv.answer}">${getInvitationStatusText(inv.answer)}</span> -->
                            <span class="status-badge status-pending">${getInvitationStatusText("pending")}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ${acceptedInvitations < 2 ? `
                <form id="inviteProfessorForm">
                    <div class="form-group">
                        <label for="professorSelect">Προσθήκη μέλους:</label>
                        <select id="professorSelect" required>
                            <option value="">Επιλέξτε...</option>
                            ${professors.filter(p => !invitedProfessors.find(inv => inv.am === p.id)).map(prof => 
                                `<option value="${prof.id}">${prof.name}</option>`
                            ).join('')} 
                            ${console.log(professors, invitedProfessors)}
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Αποστολή Πρόσκλησης</button>
                </form>
            ` : `
                <div class="alert alert-success mt-20">
                    <i class="fas fa-check-circle"></i>
                    Η τριμελής επιτροπή έχει συγκροτηθεί επιτυχώς! Η διπλωματική σας θα ενεργοποιηθεί σύντομα.
                </div>
            `}
        </div>
    `;
}

function getActiveThesisContent(thesis) {
    return `
        <div class="card mt-20">
            <div class="card-header">
                <h3 class="card-title">Πρόοδος Διπλωματικής</h3>
                <p>Η διπλωματική σας είναι ενεργή. Όταν είστε έτοιμοι για εξέταση, επικοινωνήστε με τον επιβλέποντα.</p>
            </div>
            <div class="form-group">
                <label>Μέλη Τριμελούς:</label>
                <ul>
                    <li><strong>Επιβλέπων:</strong> ${thesis.supervisor}</li>
                    ${thesis.committeeMembers
                        .slice(1).map(member => `<li><strong>Μέλος:</strong> ${member}</li>`).join('')}
                </ul>
            </div>
            <div class="form-group">
                <label>Χρόνος από την Ανάθεση:</label>
                <p>${calculateTimeSince(thesis.assignedDate)}</p>
            </div>
        </div>
    `;
}

function getReviewThesisContent(thesis) {
    return `
        <div class="card mt-20">
            <div class="card-header">
                <h3 class="card-title">Υποβολή Υλικού Εξέτασης</h3>
                <p>Ανεβάστε το πρόχειρο κείμενο και συνδέσμους προς επιπλέον υλικό (Google Drive, YouTube, κλπ).</p>
            </div>
            <form id="thesisSubmissionForm">
                <div class="form-group">
                    <label for="thesisFile">Πρόχειρο Κείμενο (PDF):</label>
                    <input type="file" id="thesisFile" accept=".pdf" required>
                    <small>Μέγιστο μέγεθος: 10MB</small>
                </div>
                <div class="form-group">
                    <label for="additionalLinks">Σύνδεσμοι Υλικού:</label>
                    <textarea id="additionalLinks" rows="2" placeholder="Ένας σύνδεσμος ανά γραμμή"></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Ανέβασμα Υλικού</button>
            </form>
        </div>
        <div class="card mt-20">
            <div class="card-header">
                <h3 class="card-title">Πληροφορίες Εξέτασης</h3>
                <p>Καταχωρήστε ημερομηνία, ώρα και τρόπο εξέτασης (δια ζώσης ή διαδικτυακά).</p>
            </div>
            <form id="examinationForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="examDate">Ημερομηνία Εξέτασης:</label>
                        <input type="date" id="examDate" required>
                    </div>
                    <div class="form-group">
                        <label for="examTime">Ώρα Εξέτασης:</label>
                        <input type="time" id="examTime" required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="examType">Τρόπος Εξέτασης:</label>
                    <select id="examType" onchange="toggleExamLocation()" required>
                        <option value="">Επιλέξτε...</option>
                        <option value="in-person">Δια Ζώσης</option>
                        <option value="online">Διαδικτυακά</option>
                    </select>
                </div>
                <div id="examLocationGroup" style="display: none;">
                    <div class="form-group" id="roomGroup" style="display: none;">
                        <label for="examRoom">Αίθουσα Εξέτασης:</label>
                        <input type="text" id="examRoom" placeholder="π.χ. Αίθουσα 101">
                    </div>
                    <div class="form-group" id="linkGroup" style="display: none;">
                        <label for="examLink">Σύνδεσμος Σύνδεσης:</label>
                        <input type="url" id="examLink" placeholder="https://...">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Καταχώρηση Πληροφοριών</button>
            </form>
        </div>
        <div class="card mt-20">
            <div class="card-header">
                <h3 class="card-title">Πρακτικό και Νημερτής</h3>
            </div>
            ${thesis.grade ? `
                <div class="form-group">
                    <label>Βαθμός:</label>
                    <p><strong>${thesis.grade}/10</strong></p>
                </div>
                <div class="form-group">
                    <label>Σχόλια Τριμελούς:</label>
                    <div class="committee-comments">
                        ${thesis.committeeComments ? thesis.committeeComments.map(comment => `
                            <div class="comment">
                                <strong>${getUserName(comment.professorId)}:</strong> ${comment.comment}
                            </div>
                        `).join('') : '<p>Δεν υπάρχουν σχόλια.</p>'}
                    </div>
                </div>
                <div class="form-group">
                    <label for="libraryLink">Σύνδεσμος Νημερτής:</label>
                    <input type="url" id="libraryLink" placeholder="https://nemertes.lis.upatras.gr/..." value="${thesis.libraryLink || ''}">
                    <button onclick="saveLibraryLink()" class="btn btn-secondary">Αποθήκευση</button>
                </div>
                <button onclick="viewExaminationReport()" class="btn btn-primary">Προβολή Πρακτικού</button>
            ` : `<p>Μόλις ολοκληρωθεί η αξιολόγηση, εδώ θα εμφανιστεί το πρακτικό και το πεδίο για το σύνδεσμο στο αποθετήριο.</p>`}
        </div>
    `;
}

function getCompletedThesisContent(thesis) {
    return `
        <div class="card mt-20">
            <div class="card-header">
                <h3 class="card-title">Πληροφορίες Διπλωματικής</h3>
            </div>
            <div class="form-group">
                <label>Τελικός Βαθμός:</label>
                <p><strong>${thesis.grade}/10</strong></p>
            </div>
            <div class="form-group">
                <label>Ημερομηνία Ολοκλήρωσης:</label>
                <p>${formatDate(thesis.completedDate)}</p>
            </div>
            ${thesis.libraryLink ? `
                <div class="form-group">
                    <label>Αποθετήριο Βιβλιοθήκης:</label>
                    <p><a href="${thesis.libraryLink}" target="_blank">${thesis.libraryLink}</a></p>
                </div>
            ` : ''}
            <button onclick="viewExaminationReport()" class="btn btn-primary">Προβολή Πρακτικού Εξέτασης</button>
        </div>
    `;
}

function getInvitationStatusText(status) {
    const statuses = {
        'pending': 'Αναμονή Απάντησης',
        'accepted': 'Αποδεκτή',
        'declined': 'Απορριφθείσα'
    };
    return statuses[status] || status;
}

function toggleExamLocation() {
    const examType = document.getElementById('examType').value;
    const examLocationGroup = document.getElementById('examLocationGroup');
    const roomGroup = document.getElementById('roomGroup');
    const linkGroup = document.getElementById('linkGroup');
    
    if (examType === 'in-person') {
        examLocationGroup.style.display = 'block';
        roomGroup.style.display = 'block';
        linkGroup.style.display = 'none';
    } else if (examType === 'online') {
        examLocationGroup.style.display = 'block';
        roomGroup.style.display = 'none';
        linkGroup.style.display = 'block';
    } else {
        examLocationGroup.style.display = 'none';
    }
}

function saveLibraryLink() {
    const libraryLink = document.getElementById('libraryLink').value;
    const studentThesis = theses.find(t => t.studentId === currentUser.id);
    
    if (studentThesis) {
        studentThesis.libraryLink = libraryLink;
        alert('Ο σύνδεσμος αποθηκεύτηκε επιτυχώς!');
    }
}

function viewExaminationReport() {
    const studentThesis = theses.find(t => t.studentId === currentUser.id);
    
    if (!studentThesis) return;
    
    const reportContent = `
        <div class="examination-report">
            <h2>Πρακτικό Εξέτασης Διπλωματικής Εργασίας</h2>
            
            <div class="report-section">
                <h3>Στοιχεία Διπλωματικής</h3>
                <p><strong>Τίτλος:</strong> ${studentThesis.title}</p>
                <p><strong>Φοιτητής:</strong> ${currentUser.name}</p>
                <p><strong>Αριθμός Μητρώου:</strong> ${currentUser.am}</p>
            </div>
            
            <div class="report-section">
                <h3>Τριμελής Επιτροπή</h3>
                <p><strong>Επιβλέπων:</strong> ${getUserName(studentThesis.supervisorId)}</p>
                <ul>
                    ${studentThesis.committeeMembers.map(memberId => 
                        `<li><strong>Μέλος:</strong> ${getUserName(memberId)}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="report-section">
                <h3>Αποτελέσματα Εξέτασης</h3>
                <p><strong>Βαθμός:</strong> ${studentThesis.grade}/10</p>
                <p><strong>Ημερομηνία Εξέτασης:</strong> ${formatDate(studentThesis.examDate)}</p>
                <p><strong>Τύπος Εξέτασης:</strong> ${studentThesis.examType === 'in-person' ? 'Δια Ζώσης' : 'Διαδικτυακά'}</p>
            </div>
            
            ${studentThesis.committeeComments ? `
                <div class="report-section">
                    <h3>Σχόλια Τριμελούς</h3>
                    ${studentThesis.committeeComments.map(comment => `
                        <div class="comment">
                            <strong>${getUserName(comment.professorId)}:</strong> ${comment.comment}
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="report-footer">
                <p>Ημερομηνία δημιουργίας: ${new Date().toLocaleDateString('el-GR')}</p>
            </div>
        </div>
    `;
    
    showModal(reportContent);
}

async function handleInviteProfessor() {
    const professorId = parseInt(document.getElementById('professorSelect').value);

    const response = await fetch("http://localhost:5001/api/student/inviteProfessor", {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'  // important for JSON data
            },
            body: JSON.stringify({
                "prof_am": professorId,
            })
        });
        const r = await response.json();
        if (!response.ok) {
            alert(r.message);
            throw new Error(`Error: ${r.message}`);
        }
        alert('Η πρόσκληση στάλθηκε.');
    
    if (!professorId ) {
        alert('Παρακαλώ επιλέξτε έναν διδάσκοντα.');
        return;
    }
    
    // Refresh the content
    loadContent('manageThesis');
}

function handleThesisSubmission() {
    const thesisFile = document.getElementById('thesisFile').files[0];
    const additionalLinks = document.getElementById('additionalLinks').value;
    const studentThesis = theses.find(t => t.studentId === currentUser.id);
    
    if (!thesisFile) {
        alert('Παρακαλώ επιλέξτε ένα αρχείο PDF.');
        return;
    }
    
    // Check file size (10MB limit)
    if (thesisFile.size > 10 * 1024 * 1024) {
        alert('Το αρχείο είναι πολύ μεγάλο. Το μέγιστο μέγεθος είναι 10MB.');
        return;
    }
    
    // Check file type
    if (thesisFile.type !== 'application/pdf') {
        alert('Παρακαλώ επιλέξτε ένα αρχείο PDF.');
        return;
    }
    
    // Update thesis with submission data
    studentThesis.thesisFile = {
        name: thesisFile.name,
        size: thesisFile.size,
        uploadedDate: new Date().toISOString()
    };
    
    if (additionalLinks.trim()) {
        studentThesis.additionalLinks = additionalLinks.split('\n').filter(link => link.trim());
    }
    
    alert('Το υλικό ανέβηκε επιτυχώς!');
    
    // Refresh the content
    loadContent('manageThesis');
}

function handleExaminationForm() {
    const examDate = document.getElementById('examDate').value;
    const examTime = document.getElementById('examTime').value;
    const examType = document.getElementById('examType').value;
    const examRoom = document.getElementById('examRoom').value;
    const examLink = document.getElementById('examLink').value;
    const studentThesis = theses.find(t => t.studentId === currentUser.id);
    
    if (!examDate || !examTime || !examType) {
        alert('Παρακαλώ συμπληρώστε όλα τα υποχρεωτικά πεδία.');
        return;
    }
    
    if (examType === 'in-person' && !examRoom) {
        alert('Παρακαλώ συμπληρώστε την αίθουσα εξέτασης.');
        return;
    }
    
    if (examType === 'online' && !examLink) {
        alert('Παρακαλώ συμπληρώστε τον σύνδεσμο σύνδεσης.');
        return;
    }
    
    // Update thesis with examination data
    studentThesis.examDate = examDate;
    studentThesis.examTime = examTime;
    studentThesis.examType = examType;
    studentThesis.examRoom = examRoom;
    studentThesis.examLink = examLink;
    
    alert('Οι πληροφορίες εξέτασης καταχωρήθηκαν επιτυχώς!');
    
    // Refresh the content
    loadContent('manageThesis');
}