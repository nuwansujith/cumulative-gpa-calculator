document.addEventListener('DOMContentLoaded', () => {
    const courses = [];

    const GRADE_POINTS = {
        'A': 4.0,
        'A-': 3.7,
        'B+': 3.3,
        'B': 3.0,
        'B-': 2.7,
        'C+': 2.3,
        'C': 2.0,
        'C-': 1.7,
        'D+': 1.3,
        'D': 1.0,
        'F': 0.0
    };

    // DOM Elements
    const courseNameInput = document.getElementById('course-name');
    const creditHoursInput = document.getElementById('credit-hours');
    const gradeSelect = document.getElementById('grade');
    const addCourseBtn = document.getElementById('add-course-btn');
    const coursesDisplayDiv = document.getElementById('courses-display');

    const calculateCgpaBtn = document.getElementById('calculate-cgpa-btn');
    const cgpaResultDiv = document.getElementById('cgpa-result');
    const generateReportBtn = document.getElementById('generate-report-btn');

    function addCourse() {
        const courseName = courseNameInput.value.trim();
        const creditHours = creditHoursInput.value; // Keep as string for parseFloat check later
        const selectedGradeOption = gradeSelect.options[gradeSelect.selectedIndex];
        // The value of the option in HTML is the numeric point, but the text is the letter grade.
        // As per instructions, we store the letter grade.
        const selectedGradeLetter = selectedGradeOption.text; 
        const selectedGradeValue = selectedGradeOption.value; // This is the numeric value from the <option value="">

        // Validation
        if (!courseName) {
            alert('Please enter a course name.');
            return;
        }
        if (isNaN(parseFloat(creditHours)) || parseFloat(creditHours) <= 0) {
            alert('Please enter valid positive credit hours.');
            return;
        }
        if (!selectedGradeValue) { // Check if a grade is selected
            alert('Please select a grade.');
            return;
        }

        const course = {
            name: courseName,
            credits: parseFloat(creditHours),
            grade: selectedGradeLetter // Storing the letter grade as requested
        };

        courses.push(course);
        renderCourses();
        clearInputFields();
    }

    function renderCourses() {
        coursesDisplayDiv.innerHTML = ''; // Clear previous content

        if (courses.length === 0) {
            coursesDisplayDiv.innerHTML = '<p>No courses added yet.</p>';
            return;
        }

        const ul = document.createElement('ul');
        courses.forEach(course => {
            const li = document.createElement('li');
            li.textContent = `Course: ${course.name}, Credits: ${course.credits}, Grade: ${course.grade}`;
            ul.appendChild(li);
        });
        coursesDisplayDiv.appendChild(ul);
    }

    function clearInputFields() {
        courseNameInput.value = '';
        creditHoursInput.value = '';
        gradeSelect.selectedIndex = 0; // Reset to the first option (A)
    }

    function calculateCGPA() {
        let totalPoints = 0;
        let totalCredits = 0;

        if (courses.length === 0) {
            cgpaResultDiv.textContent = 'No courses added. Please add courses first.';
            return;
        }

        courses.forEach(course => {
            // Get the numeric grade point from GRADE_POINTS using the stored letter grade
            const numericGradePoint = GRADE_POINTS[course.grade]; 
            if (numericGradePoint !== undefined) { // Check if the grade exists in our map
                totalPoints += course.credits * numericGradePoint;
                totalCredits += course.credits;
            } else {
                // This case should ideally not happen if grades are selected from the dropdown
                console.warn(`Unknown grade ${course.grade} for course ${course.name}`);
            }
        });

        if (totalCredits === 0) {
            cgpaResultDiv.textContent = 'Total credits are zero. Cannot calculate CGPA.';
            return;
        }

        const cgpa = totalPoints / totalCredits;
        cgpaResultDiv.textContent = `Your CGPA is: ${cgpa.toFixed(2)}`;
    }

    // Event Listeners
    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', addCourse);
    } else {
        console.error("Add course button not found");
    }

    if (calculateCgpaBtn) {
        calculateCgpaBtn.addEventListener('click', calculateCGPA);
    } else {
        console.error("Calculate CGPA button not found");
    }
    
    // Initial render for courses display area
    renderCourses();

    function generateReport() {
        const cgpaText = cgpaResultDiv.textContent || "";

        if (courses.length === 0) {
            alert('Please add courses first before generating a report.');
            return;
        }
        // Check if CGPA has been calculated (i.e., cgpaText is not the initial message or empty)
        if (!cgpaText.toLowerCase().includes('your cgpa is:')) {
             alert('Please calculate CGPA first before generating a report.');
            return;
        }

        let reportString = "GPA Report\n";
        reportString += "====================\n";
        const now = new Date();
        reportString += "Generated on: " + now.toLocaleString() + "\n\n";

        reportString += "Courses Taken:\n";
        courses.forEach(course => {
            reportString += `- ${course.name}, Credits: ${course.credits}, Grade: ${course.grade}\n`;
        });
        reportString += "\n";

        reportString += cgpaText + "\n"; // This includes "Your CGPA is: X.XX"

        const blob = new Blob([reportString], { type: 'text/plain;charset=utf-8' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'gpa_report.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    // Event Listener for Generate Report Button
    if (generateReportBtn) {
        generateReportBtn.addEventListener('click', generateReport);
    } else {
        console.error("Generate Report button not found");
    }
});
