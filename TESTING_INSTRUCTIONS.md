# Testing Instructions for MERN Admin Panel

## 🔐 Login Credentials

**Admin Account:**
- Email: `admin@admin.com`
- Password: `Admin@123`

---

## 🧪 How to Test the Application

### Step 1: Login
1. Open the application URL
2. Use the credentials above to login
3. You will be redirected to the Dashboard

### Step 2: View Dashboard
- See statistics: Total Agents, Total Lists, Total Contacts
- Navigate using the sidebar

### Step 3: Test Agent Management
1. Click on "Agents" in sidebar
2. Click "Add Agent" button
3. Fill in the form:
   - Name: Test Agent
   - Email: test@example.com
   - Mobile: +919876543210
   - Password: Test@123
4. Click "Add Agent"
5. Verify agent appears in the table
6. Test delete functionality (optional)

### Step 4: Test CSV Upload & Distribution
1. Click on "Lists" in sidebar
2. Download the sample CSV file (provided separately)
3. Drag & drop or browse to upload the CSV file
4. Click "Upload & Distribute"
5. Observe automatic distribution among agents
6. Verify contacts are distributed using round-robin algorithm

---

## 📄 Sample CSV Format

Create a CSV file with these columns:

```csv
FirstName,Phone,Notes
John Doe,+919876543210,Important client
Jane Smith,+919876543211,Follow up required
Bob Johnson,+919876543212,New lead
Alice Williams,+919876543213,VIP customer
Charlie Brown,+919876543214,Needs callback
David Miller,+919876543215,Hot lead
Emma Davis,+919876543216,Existing customer
Frank Wilson,+919876543217,Referral
Grace Taylor,+919876543218,Call tomorrow
Henry Anderson,+919876543219,Priority contact
```

**Requirements:**
- Columns: FirstName, Phone, Notes (optional)
- Formats supported: .csv, .xlsx, .xls
- Max file size: 10MB

---

## ✅ Expected Results

### Distribution Logic
With **N contacts** and **M agents**, distribution follows round-robin:
- Contact 1 → Agent 1
- Contact 2 → Agent 2
- Contact 3 → Agent 3
- Contact 4 → Agent 1 (cycles back)
- And so on...

**Example:** 10 contacts, 3 agents = 4 + 3 + 3 distribution

---

## 🎯 Key Features to Verify

- ✅ Secure JWT-based authentication
- ✅ Add, view, and delete agents
- ✅ Upload CSV/Excel files
- ✅ Automatic round-robin distribution
- ✅ Real-time dashboard statistics
- ✅ Form validation (both client & server side)
- ✅ Responsive UI design
- ✅ Cloud database (MongoDB Atlas)
- ✅ Error handling with user-friendly messages

---

## 🔄 Test Scenarios

### Scenario 1: Equal Distribution
- Add 3 agents
- Upload CSV with 9 contacts
- Result: Each agent gets exactly 3 contacts

### Scenario 2: Unequal Distribution
- Add 3 agents
- Upload CSV with 10 contacts
- Result: Distribution is 4 + 3 + 3 (most balanced possible)

### Scenario 3: Single Agent
- Have only 1 agent
- Upload CSV with 10 contacts
- Result: All 10 contacts go to the single agent

### Scenario 4: Re-upload
- Upload a CSV file (contacts distributed)
- Upload another CSV file
- Result: Previous distribution is cleared, new distribution created

---

## 🐛 Edge Cases Handled

1. **No agents exist**: Upload blocked with error message
2. **Invalid file format**: Only CSV/Excel accepted
3. **Missing columns**: Error if FirstName or Phone missing
4. **File too large**: Max 10MB limit enforced
5. **Duplicate emails**: Agents with duplicate emails rejected
6. **Empty file**: Upload blocked with validation error

---

## 📱 Browser Compatibility

Tested on:
- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

---

## 🔗 Additional Information

**Tech Stack:**
- Frontend: React 18, Redux Toolkit, React Router v6
- Backend: Node.js, Express.js, MongoDB Atlas
- Authentication: JWT tokens
- File Processing: Multer, csv-parser, xlsx

**Database:** Hosted on MongoDB Atlas (Cloud)

---

## 📞 Support

For any issues during testing, please contact:
[Your contact information]
