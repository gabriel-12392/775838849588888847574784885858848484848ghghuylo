// Helper to save user to localStorage
function saveUserToLocalStorage(user) {
  localStorage.setItem(user.phone, JSON.stringify(user));
}

// Helper to get user from localStorage
function getUserFromLocalStorage(phone) {
  return JSON.parse(localStorage.getItem(phone));
}

// Show messages on the page
function showStatus(message, isError = false) {
  const statusEl = document.getElementById("status");
  statusEl.innerText = message;
  statusEl.style.color = isError ? "red" : "green";
}

// რეგისტრაცია
document.querySelector('#registerSection .btn').addEventListener('click', () => {
  const name = document.getElementById("regName").value.trim();
  const surname = document.getElementById("regSurname").value.trim();
  const pid = document.getElementById("regPID").value.trim();
  const phone = document.getElementById("regPhone").value.trim();
  const password = document.getElementById("regPassword").value;

  if (!name || !surname || !pid || !phone || !password) {
    return showStatus("გთხოვ შეავსო ყველა ველი!", true);
  }

  if (getUserFromLocalStorage(phone)) {
    return showStatus("მომხმარებელი უკვე არსებობს!", true);
  }

  const newUser = { name, surname, pid, phone, password };
  saveUserToLocalStorage(newUser);

  localStorage.setItem("loggedInUser", phone); // Save session
  window.location.href = "main.html";
});

// შესვლა
document.querySelector('#loginSection .btn').addEventListener('click', () => {
  const phone = document.getElementById("loginPhone").value.trim();
  const password = document.getElementById("loginPassword").value;
if ( !phone || !password) {
    return showStatus("გთხოვ შეავსო ყველა ველი!", true);
  }
  const user = getUserFromLocalStorage(phone);
  if (!user || user.password !== password) {
    return showStatus("ტელეფონის ნომერი ან პაროლი არასწორია!", true);
  }

  localStorage.setItem("loggedInUser", phone); // Save session
  window.location.href = "main.html";
});

 