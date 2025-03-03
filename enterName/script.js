// Select the submit button
const submitBtn = document.getElementById('#submit-btn');

// Add an event listener to the submit button
submitBtn.addEventListener('click', function(event) {
    event.preventDefault();
    // Add your form submission logic here
    console.log('Submit button clicked');
});