function showForm(formId) {
    // Hide all forms
    var forms = document.querySelectorAll('.hide');
    forms.forEach(function(form) {
        form.style.display = 'none';
    });

    // Show the selected form
    var selectedForm = document.getElementById(formId);
    if (selectedForm) {
        selectedForm.style.display = 'block';
    }
}

function showSection(sectionId) {
    // Hide all sections
    var sections = document.querySelectorAll('.hide');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });

    // Show the selected section
    var selectedSection = document.getElementById(sectionId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}
