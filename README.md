Για το παρών project έγινε χρήση Node.js/Express. Επομένως,
προτείνουμε τα παρακάτω για την ορθή εκτέλεση του:
1. Εγκατάσταση Node - npm: Εάν δεν είναι ήδη εγκατεστημένα, μπορείτε να τα
κατεβάσετε από τις επίσημες ιστοσελίδες τους.
2. Εγκατάσταση Dependencies: Αφού έχετε κάνει unzip και έχετε το project
folder, σε ένα terminal μέσα σε εκείνο, τρέξτε npm install για την εγκατάσταση
των κατάλληλων dependencies.
3. DB Export: Πηγαίντε στον φάκελο server και τρέξτε την παρακάτω εντολή για
την εφαρμογή του φακέλου final db.sql στο project:
mysql -u root -p diplomatiki_sys < ../database/final_db.sql
4. Ξεκινήστε τον server: Μπορείτε να ξεκινήσετε τον server με την εντολή npm
run dev.
5. Πρόσβαση στην ιστοσελίδα: Γράφοντας
http://localhost:5001/index.html
σε οποιονδήποτε browser, έχετε πλέον πρόσβαση στην ιστοσελίδα μας.
• Τέλος, μπορείτε να δείτε την πρόοδο (ή και να κάνετε clone) του project στο Git
Repository του:
https://github.com/nderekk/thesis_management.git
