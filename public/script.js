// // Function to fetch and display all data
// function fetchDataAndDisplay() {
//     fetch('/data')
//     .then(response => response.json())
//     .then(data => {
//         // Clear existing content
//         document.getElementById('data').innerHTML = '';
//         // Append each data entry to the page
//         data.forEach(entry => {
//             const entryElement = document.createElement('div');
//             entryElement.innerHTML = `<b>First Name:</b> ${entry.firstName}<br><b>Last Name:</b>  ${entry.lastName}<br><b>Contact:</b>  ${entry.mobileNo}<br><b>E-mail: </b> ${entry.email}<br><b>Address: </b> ${entry.street},${entry.city},${entry.state},${entry.country}<br><b>Login ID:</b>  ${entry.loginId}<br><b>Password: </b> ${entry.password}`;
//             document.getElementById('data').appendChild(entryElement);
//         });
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
// }

// // Add event listener only when the DOM content is loaded
// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('myForm').addEventListener('submit', function(event) {
//         event.preventDefault();
//         var formData = new FormData(this);
//         var jsonData = {};
//         formData.forEach(function(value, key) {
//             jsonData[key] = value;
//         });
//         fetch('/submit', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(jsonData),
//         })
//         .then(response => response.json()) // Parse response as JSON
//         .then(data => {
//             document.getElementById('notification').style.display="block";
//             document.getElementById('notification').innerText = 'Data submitted successfully!';
//             fetchDataAndDisplay();
//             setTimeout(function() {
//                 document.getElementById('notification').style.display = 'none';
//             }, 2000);
//         })
//         .catch(error => {
//             console.error('Error:', error);
//             document.getElementById('notification').style.display="block";
//             document.getElementById('notification').innerText = 'Something went wrong!';
//             setTimeout(function() {
//                 document.getElementById('notification').style.display = 'none';
//             }, 2000);
//         });
//     });

//     // Fetch and display all data initially
//     fetchDataAndDisplay();
// });


// function toggleContent() {
//     var content = document.getElementById("data");
//     var button = document.getElementById("toggleButton");
  
//     if (content.style.display === "none" || content.style.display === "") {
//         content.style.display = "block";
//         button.textContent = "Hide All";
//     } else {
//         content.style.display = "none";
//         button.textContent = "Show All";
//     }
// }


document.addEventListener('DOMContentLoaded', function() {
    const socket = io();

    const liveUsersList = document.getElementById('liveUsersList');

    // Function to display live users
    function displayLiveUsers(users) {
        liveUsersList.innerHTML = '';
        users.forEach(user => {
            const listItem = document.createElement('li');
            listItem.innerText = `Name: ${user.name}, Email: ${user.email}, Socket ID: ${user.socketId}`;
            listItem.addEventListener('click', () => {
                fetchUserInfo(user.email, user.socketId);
            });
            liveUsersList.appendChild(listItem);
        });
    }

    // Function to fetch user info via web service
    function fetchUserInfo(email, socketId) {
        // Call your web service here and display the info in a popup
        // Example:
        console.log(`Fetching info for user with email: ${email} and socket ID: ${socketId}`);
        // Replace this with your actual web service call
        // fetch(`/userinfo?email=${email}&socketId=${socketId}`)
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data);
        //         // Show data in a popup
        //     })
        //     .catch(error => console.error('Error fetching user info:', error));
    }

    // Listen for live user updates
    socket.on('joinedUser', function(users) {
        displayLiveUsers(users);
    });

    socket.on('leftUser', function(users) {
        displayLiveUsers(users);
    });

    // Fetch and display live users initially
    socket.emit('joinRoom', { name: 'User', email: 'user@example.com' }); // For demo purpose, you can replace name and email with actual values
});
