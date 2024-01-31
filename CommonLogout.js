// common.js

// Function to check if the user is logged in
function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

// Function to handle logout
function logOut() {
    // Clear user's session or perform logout actions
    localStorage.setItem('loggedIn', 'false');
    
    // Redirect to the login page
    window.location.href = 'login.html'; // Replace 'login.html' with your actual login page URL
}
