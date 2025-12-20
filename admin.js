function getUsers() {
  return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

let currentUser = null;

function searchUser() {
  const id = document.getElementById("searchId").value.trim();
  const users = getUsers();
  const user = users.find(u => u.personalId === id);

  if (user) {
    currentUser = user;
    document.getElementById("uName").textContent = user.name;
    document.getElementById("uSurname").textContent = user.surname;
    document.getElementById("uPhone").textContent = user.phone;
    document.getElementById("uBalance").textContent = user.balance.toFixed(2);
    document.getElementById("userInfo").style.display = "block";
  } else {
    alert("მომხმარებელი ვერ მოიძებნა");
    document.getElementById("userInfo").style.display = "none";
    currentUser = null;
  }
}

function addUserBalance() {
  if (!currentUser) return;

  const amount = parseFloat(document.getElementById("addBalance").value);
  if (isNaN(amount) || amount <= 0) return alert("არასწორი თანხა");

  const users = getUsers();
  const index = users.findIndex(u => u.personalId === currentUser.personalId);

  users[index].balance += amount;
  saveUsers(users);
  searchUser(); // განახლება
  alert("ბალანსი წარმატებით დაემატა");
}

function changePassword() {
  if (!currentUser) return;

  const newPass = document.getElementById("newPass").value.trim();
  if (newPass.length < 4) return alert("პაროლი ძალიან მოკლეა");

  const users = getUsers();
  const index = users.findIndex(u => u.personalId === currentUser.personalId);

  users[index].password = newPass;
  saveUsers(users);
  alert("პაროლი წარმატებით შეიცვალა");
}
