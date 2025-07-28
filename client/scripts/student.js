async function refreshThesis(hard) {
    if (!currentThesis || hard){
        const response = await fetch("http://localhost:5001/api/student/thesis", {
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
        if (studentThesis !== 'empty'){
          localStorage.setItem('currentThesis', JSON.stringify(studentThesis));
          currentThesis = JSON.parse(localStorage.getItem('currentThesis'));
        }
    }
    console.log("THESIS", (hard) ? "FLUSHED" : "SAME");
}

async function getStudentThesisView() {
    await refreshThesis()
    // console.log(currentThesis);
    if (!currentThesis) {
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
                <h3 class="card-title">${currentThesis.title}</h3>
                <span class="status-badge status-${currentThesis.status}">${getStatusText(currentThesis.status)}</span>    
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label>Επιβλέπων:</label>
                    <p>${currentThesis.supervisor}</p>
                </div>
                <div class="form-group">
                    <label>Ημερομηνία Ανάθεσης:</label>
                    <p>${formatDate(currentThesis.assignedDate)}</p>
                </div>
            </div>
            
            <div class="form-group">
                <label>Περιγραφή:</label>
                <p>${currentThesis.description}</p>
            </div>
            
            ${currentThesis.committeeMembers.length > 0 ? `
                <div class="form-group">
                    <label>Μέλη Τριμελούς:</label>
                    <div class="inner">
                        <div class="inner">
                            <ul>
                                ${currentThesis.committeeMembers.map(member => `<li>${member}</li>`).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
            ` : ''}
            
            ${currentThesis.assignedDate ? `
                <div class="form-group">
                    <label>Χρόνος από την Ανάθεση:</label>
                    <p>${calculateTimeSince(currentThesis.assignedDate)}</p>
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
                    <input type="text" id="address" value="${currentUser.address + ", " + currentUser.city + ", " + currentUser.post_code || ''}" required>
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
                
                <button type="submit" id="saveProfileBtn" class="btn btn-primary" disabled>Αποθήκευση</button>
            </form>
        </div>
    `;
}

// --- Ενεργοποίηση κουμπιού αποθήκευσης μόνο αν αλλάξει κάτι και να είναι ανενεργό στην αρχή ---
function setupProfileFormListeners() {
    const initialAddress = (currentUser.address + ", " + currentUser.city + ", " + currentUser.post_code) || '';
    const initialEmail = currentUser.email || '';
    const initialMobile = currentUser.mobile_number || '';
    const initialPhone = currentUser.phone_number || '';

    function checkProfileChanged() {
        const address = document.getElementById('address').value;
        const email = document.getElementById('email').value;
        const mobile = document.getElementById('mobile').value;
        const phone = document.getElementById('phone').value;
        const changed = address !== initialAddress ||
                        email !== initialEmail ||
                        mobile !== initialMobile ||
                        phone !== initialPhone;
        document.getElementById('saveProfileBtn').disabled = !changed;
    }

    ['address', 'email', 'mobile', 'phone'].forEach(id => {
        document.getElementById(id).addEventListener('input', checkProfileChanged);
    });
    checkProfileChanged(); // Εξασφαλίζει ότι στην αρχή είναι ανενεργό
}

// Κάλεσέ το αμέσως μετά το render της φόρμας
const origLoadContent = window.loadContent;
window.loadContent = async function(pageId, event) {
    await origLoadContent.apply(this, arguments);
    if (pageId === 'editProfile') {
        setTimeout(setupProfileFormListeners, 100); // Μικρή καθυστέρηση για να φορτωθεί το DOM
    }
};


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
    await refreshThesis();
    
    if (!currentThesis) {
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
                <h3 class="card-title">${currentThesis.title}</h3>
                <span class="status-badge status-${currentThesis.status}">${getStatusText(currentThesis.status)}</span>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Επιβλέπων:</label>
                    <p>${currentThesis.supervisor}</p>
                </div>
                <div class="form-group">
                    <label>Ημερομηνία Ανάθεσης:</label>
                    <p>${formatDate(currentThesis.assignedDate)}</p>
                </div>
            </div>
            <div class="form-group">
                <label>Περιγραφή:</label>
                <p>${currentThesis.description}</p>
            </div>
        </div>
    `;
    switch(currentThesis.status.toLowerCase()) {
        case 'pending':
            content += await getPendingThesisContent(currentThesis);
            break;
        case 'active':
            content +=  getActiveThesisContent(currentThesis);
            break;
        case 'review':
            content += await getReviewThesisContent(currentThesis);
            break;
        case 'completed':
            content += getCompletedThesisContent(currentThesis);
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
        alert(professors.message);
        throw new Error(`Error: ${professors.message}`);
    }
    professors = professors.p.filter(p => p.name !== thesis.supervisor);
    console.log(thesis.supervisor);
    const invitedProfessors = thesis.invitedProfessors.filter(inv => inv.answer === 'pending') || [];
    const acceptedProfessors = thesis.invitedProfessors.filter(inv => inv.answer === 'accepted') || [];
    const acceptedInvitations = invitedProfessors.filter(inv => inv.answer === 'accepted').length;
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
                            ${professors.filter(p => ((!invitedProfessors.find(inv => inv.am === p.id)) && (!acceptedProfessors.find(inv => inv.am === p.id)))).map(prof => 
                                `<option value="${prof.id}">${prof.name}</option>`
                            ).join('')} 
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

async function getReviewThesisContent(thesis) {
    const response = await fetch("http://localhost:5001/api/student/exam-date", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'  // important for JSON data
        },
    });
    const examInfo = await response.json();
    if (!response.ok) {
        alert(examInfo.message);
        throw new Error(`Error: ${examInfo.message}`);
    }

    const roomValue = examInfo.presentation_type === 'in-person' ? (examInfo.venue || '') : '';
    const linkValue = examInfo.presentation_type === 'online' ? (examInfo.venue || '') : '';

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
                <button type="submit" class="btn btn-primary">Ανάρτηση Υλικού</button>
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
                        <input type="date" id="examDate" value=${examInfo.date} required>
                    </div>
                    <div class="form-group">
                        <label for="examTime">Ώρα Εξέτασης:</label>
                        <input type="time" id="examTime" value=${examInfo.time} required>
                    </div>
                </div>
                <div class="form-group">
                    <label for="examType">Τρόπος Εξέτασης:</label>
                    <select id="examType" onchange="toggleExamLocation()" required>
                        <option value="" ${!examInfo.presentation_type ? 'selected' : ''}>Επιλέξτε...</option>
                        <option value="in-person" ${examInfo.presentation_type === 'in-person' ? 'selected' : ''}>Δια Ζώσης</option>
                        <option value="online" ${examInfo.presentation_type === 'online' ? 'selected' : ''}>Διαδικτυακά</option>
                    </select>
                </div>

                <div id="examLocationGroup">
                    <div class="form-group" id="roomGroup" style="display:${examInfo.presentation_type === 'in-person' ? 'block' : 'none'};">
                        <label for="examRoom">Αίθουσα Εξέτασης:</label>
                        <input type="text" id="examRoom" value = "${roomValue}" placeholder="π.χ. Αίθουσα 101">
                    </div>
                    <div class="form-group" id="linkGroup" style="display:${examInfo.presentation_type === 'online' ? 'block' : 'none'};">
                        <label for="examLink">Σύνδεσμος Σύνδεσης:</label>
                        <input type="url" id="examLink" value = "${linkValue}" placeholder="https://...">
                    </div>
                </div>
                <button type="submit" class="btn btn-primary">Καταχώρηση Πληροφοριών</button>
            </form>
        </div>
        <script>
        setTimeout(function() {
            toggleExamLocation();
        }, 0);
        </script>
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
                <p>${formatDate(thesis.completionDate)}</p>
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
    const roomGroup = document.getElementById('roomGroup');
    const linkGroup = document.getElementById('linkGroup');

    if (examType === 'in-person') {
        roomGroup.style.display = 'block';
        linkGroup.style.display = 'none';
    } else if (examType === 'online') {
        roomGroup.style.display = 'none';
        linkGroup.style.display = 'block';
    } else {
        roomGroup.style.display = 'none';
        linkGroup.style.display = 'none';
    }
}

function saveLibraryLink() {
    const libraryLink = document.getElementById('libraryLink').value;
    const currentThesis = theses.find(t => t.studentId === currentUser.id);
    
    if (currentThesis) {
        currentThesis.libraryLink = libraryLink;
        alert('Ο σύνδεσμος αποθηκεύτηκε επιτυχώς!');
    }
}

function viewExaminationReport() {    
    if (!currentThesis) return;
    
    const reportContent = `
        <div class="examination-report">
            <h2>Πρακτικό Εξέτασης Διπλωματικής Εργασίας</h2>
            
            <div class="report-section">
                <h3>Στοιχεία Διπλωματικής</h3>
                <p><strong>Τίτλος:</strong> ${currentThesis.title}</p>
                <p><strong>Φοιτητής:</strong> ${currentUser.first_name} ${currentUser.last_name} </p>
                <p><strong>Αριθμός Μητρώου:</strong> ${currentUser.am}</p>
            </div>
            
            <div class="report-section">
                <h3>Τριμελής Επιτροπή</h3>
                <p><strong>Επιβλέπων:</strong> ${currentThesis.supervisor}</p>
                <ul style="list-style-type: none;" >
                    ${currentThesis.committeeMembers.slice(1).map(member => 
                        `<li><strong>Μέλος:</strong> ${member}</li>`
                    ).join('')}
                </ul>
            </div>
            
            <div class="report-section">
                <h3>Αποτελέσματα Εξέτασης</h3>
                <p><strong>Βαθμός:</strong> ${currentThesis.grade}/10</p>
                <p><strong>Ημερομηνία Εξέτασης:</strong> ${formatDate(currentThesis.examDate)}</p>
                <p><strong>Τύπος Εξέτασης:</strong> ${currentThesis.examType === 'in-person' ? 'Δια Ζώσης' : 'Διαδικτυακά'}</p>
            </div>
            
            ${currentThesis.committeeComments ? `
                <div class="report-section">
                    <h3>Σχόλια Τριμελούς</h3>
                    ${currentThesis.committeeComments.map(comment => `
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

        await refreshThesis(true);
    
    if (!professorId ) {
        alert('Παρακαλώ επιλέξτε έναν διδάσκοντα.');
        return;
    }
    
    // Refresh the content
    loadContent('manageThesis');
}

async function handleThesisSubmission() {
    const thesisFile = document.getElementById('thesisFile').files[0];
    const additionalLinks = document.getElementById('additionalLinks').value;
    
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
    
    const formData = new FormData();
    formData.append('file', thesisFile);

    // Update thesis with submission data
    const response = await fetch("http://localhost:5001/api/student/upload-pdf", {
        method: 'POST',
        credentials: 'include',
        body: formData,
    });
    const upload = await response.json();
    if (!response.ok) {
        alert(upload.message);
        throw new Error(`Error: ${upload.message}`);
    }
    
    if (additionalLinks.trim()) {
        currentThesis.additionalLinks = additionalLinks.split('\n').filter(link => link.trim());
    }
    
    alert('Το υλικό ανέβηκε επιτυχώς!');
    
    // Refresh the content
    loadContent('manageThesis');
}

async function handleExaminationForm() {
    const examDate = document.getElementById('examDate').value;
    const examTime = document.getElementById('examTime').value;
    const examType = document.getElementById('examType').value;
    const examRoom = document.getElementById('examRoom').value;
    const examLink = document.getElementById('examLink').value;
    
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
    
    const examVenue = (examRoom) ? examRoom : examLink;
    const date_time = `${examDate}T${examTime}`;
    const response = await fetch("http://localhost:5001/api/student/exam-date", {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'  // important for JSON data
        },
    });
    const examInfo = await response.json();
    if (!response.ok) {
        alert(examInfo.message);
        throw new Error(`Error: ${examInfo.message}`);
    }
    // Update thesis with examination data
    if (examInfo.venue === ""){
        const response = await fetch("http://localhost:5001/api/student/exam-date", {
            method: 'POST',
            credentials: 'include',
            headers: {
                    'Content-Type': 'application/json'  // important for JSON data
            },
            body: JSON.stringify({
                date_time: date_time,
                presentation_type: examType,
                venue: examVenue,
            }),
        });
        const upload = await response.json();
        if (!response.ok) {
            alert(upload.message);
            throw new Error(`Error: ${upload.message}`);
        }
    } else {
        const response = await fetch("http://localhost:5001/api/student/exam-date", {
            method: 'PUT',
            credentials: 'include',
            headers: {
                    'Content-Type': 'application/json'  // important for JSON data
            },
            body: JSON.stringify({
                date: examDate,
                time: examTime,
                presentation_type: examType,
                venue: examVenue,
            }),
        });
        const upload = await response.json();
        if (!response.ok) {
            alert(upload.message);
            throw new Error(`Error: ${upload.message}`);
        }
    }
    
    
    alert('Οι πληροφορίες εξέτασης καταχωρήθηκαν επιτυχώς!');
    
    // Refresh the content
    loadContent('manageThesis');
}