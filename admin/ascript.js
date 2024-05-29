function showForm(action) {
    // Hide all forms
    var forms = document.querySelectorAll('.form-container form');
    forms.forEach(function (form) {
        form.style.display = 'none';
    });

    // Show the selected form
    var formId = 'form_' + action;
    var selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }


    // Show buttons for student and advisor
    var studentButton = document.createElement('button');
    studentButton.textContent = 'Student';
    studentButton.setAttribute('id', 'sb');
    studentButton.onclick = function () {
        showStudentForm(action);
        studentButton.style.backgroundColor = 'var(--bgg)'; // Change background color to green
        advisorButton.style.backgroundColor = '';
    };
    var advisorButton = document.createElement('button');
    advisorButton.textContent = 'Advisor';
    advisorButton.setAttribute('id', 'ab');
    advisorButton.onclick = function () {
        studentButton.style.backgroundColor = ''; // Change background color to green
        advisorButton.style.backgroundColor = 'var(--bgg)';
        showAdvisorForm(action);
    };
    var buttonContainer = document.getElementById('buttonContainer');
    buttonContainer.innerHTML = ''; // Clear previous buttons
    buttonContainer.appendChild(studentButton);
    buttonContainer.appendChild(advisorButton);
}

function showStudentForm(action) {
    var form = document.getElementById('form_' + action + '_student');
    form.style.display = 'block';
    var advisorForm = document.getElementById('form_' + action + '_advisor');
    advisorForm.style.display = 'none';
}

function showAdvisorForm(action) {
    var form = document.getElementById('form_' + action + '_advisor');
    form.style.display = 'block';
    var studentForm = document.getElementById('form_' + action + '_student');
    studentForm.style.display = 'none';
}