// Tutorial 3: DOM Manipulation, Event Handling, Dynamic Updates & Form Validation

document.addEventListener('DOMContentLoaded', () => {

  // 1. SELECT DOM ELEMENTS
  const form = document.getElementById('registrationForm');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const ageInput = document.getElementById('age');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const ageError = document.getElementById('ageError');

  const tableBody = document.getElementById('studentTableBody');
  const emptyRow = document.getElementById('emptyRow');

  // Array to store students in memory
  let students = [];

  // 2. FORM VALIDATION FUNCTION
  function validateForm() {
    let isValid = true;

    // Reset previous errors
    clearErrors();

    // Validate Name (Not empty & at least 2 characters)
    const nameVal = nameInput.value.trim();
    if (nameVal === '') {
      showError(nameInput, nameError, 'Name field cannot be empty.');
      isValid = false;
    } else if (nameVal.length < 2) {
      showError(nameInput, nameError, 'Name must be at least 2 characters long.');
      isValid = false;
    }

    // Validate Email using Regular Expression
    const emailVal = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailVal === '') {
      showError(emailInput, emailError, 'Email field cannot be empty.');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(emailInput, emailError, 'Please enter a valid email address (e.g. john@gmail.com).');
      isValid = false;
    }

    // Validate Age (Number between 16 and 100)
    const ageVal = parseInt(ageInput.value.trim(), 10);
    if (isNaN(ageVal)) {
      showError(ageInput, ageError, 'Age field cannot be empty.');
      isValid = false;
    } else if (ageVal < 16 || ageVal > 100) {
      showError(ageInput, ageError, 'Age must be between 16 and 100.');
      isValid = false;
    }

    return isValid;
  }

  // Helper function to display error messages
  function showError(inputElement, errorElement, message) {
    inputElement.classList.add('input-error');
    errorElement.textContent = message;
  }

  // Helper function to clear all error messages
  function clearErrors() {
    [nameInput, emailInput, ageInput].forEach(input => input.classList.remove('input-error'));
    [nameError, emailError, ageError].forEach(err => err.textContent = '');
  }

  // 3. EVENT HANDLING: Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default page refresh on submit

    if (validateForm()) {
      // Collect valid values
      const newStudent = {
        id: Date.now(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        age: ageInput.value.trim()
      };

      // Push to memory array
      students.push(newStudent);

      // 4. DYNAMIC UPDATES & DOM MANIPULATION
      renderStudentList();

      // Reset form input fields
      form.reset();
      clearErrors();
    }
  });

  // 5. DOM MANIPULATION: Render Students Table
  function renderStudentList() {
    // Clear existing dynamic rows
    tableBody.innerHTML = '';

    if (students.length === 0) {
      tableBody.appendChild(emptyRow);
      return;
    }

    // Iterate through students and append DOM elements
    students.forEach((student) => {
      const row = document.createElement('tr');

      // Name cell
      const nameTd = document.createElement('td');
      nameTd.textContent = student.name;
      row.appendChild(nameTd);

      // Email cell
      const emailTd = document.createElement('td');
      emailTd.textContent = student.email;
      row.appendChild(emailTd);

      // Age cell
      const ageTd = document.createElement('td');
      ageTd.textContent = student.age;
      row.appendChild(ageTd);

      // Delete action button cell
      const actionTd = document.createElement('td');
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.className = 'btn-delete';
      deleteBtn.addEventListener('click', () => deleteStudent(student.id));
      actionTd.appendChild(deleteBtn);
      row.appendChild(actionTd);

      // Append row to table body dynamically without page refresh
      tableBody.appendChild(row);
    });
  }

  // Delete student function demonstrating dynamic removal from DOM
  function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    renderStudentList();
  }

});
