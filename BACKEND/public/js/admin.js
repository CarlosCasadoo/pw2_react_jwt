function readCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; ++i) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0)
      return decodeURIComponent(c.substring(nameEQ.length, c.length));
  }
  return null;
}

function addRowsBasedOnData(data) {
  var table = document.getElementById("myTable");

  data.forEach(function (rowData) {
    var newRow = table.insertRow(table.rows.length);

    var cell1 = newRow.insertCell(0);
    var cell2 = newRow.insertCell(1);
    var cell3 = newRow.insertCell(2);
    var cell4 = newRow.insertCell(3);

    cell1.innerHTML = rowData.username;
    cell2.innerHTML = rowData.roles;
    cell3.innerHTML = rowData.email;
    cell4.innerHTML = rowData.createdAt;
  });
}

axios
  .get("/api/test/user", { headers: { "x-access-token": readCookie("user") } })
  .then((res) => {
    document.getElementById(
      "welcome"
    ).innerHTML = `¡Hola ${res.data.user}!`;
    document.getElementById(
        "adminmail"
      ).innerHTML = `Su correo es: ${res.data.email}`;
  })
  .catch((err) => {
    console.log(err);
  });

axios
  .get("/api/test/admin", { headers: { "x-access-token": readCookie("user") } })
  .then((res) => {
    addRowsBasedOnData(res.data.users);
    document.getElementById(
      "title"
    ).innerHTML = `All registered users (${res.data.quantity})`;
  })
  .catch((err) => {
    console.log(err);
  });
