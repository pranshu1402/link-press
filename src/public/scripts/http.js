var Http = (() => {
  // Setup request for json
  var getOptions = (verb, data) => {
    var options = {
      dataType: "json",
      method: verb,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    if (data) {
      options.body = JSON.stringify(data);
    }
    return options;
  };
  // Set Http methods
  return {
    get: (path) => fetch(path, getOptions("GET")),
    post: (path, data) => fetch(path, getOptions("POST", data)),
    put: (path, data) => fetch(path, getOptions("PUT", data)),
    delete: (path) => fetch(path, getOptions("DELETE")),
  };
})();

function onLogout() {
  Http.get("/api/auth/logout").then((res) => {
    if (res.status === 200) {
      window.location.href = "/";
    } else {
      alert("Failed to logout, please try again!");
    }
  });
}

window.addEventListener('load', () => {
  const logoutButton = document.getElementById("logout-button");
  if (logoutButton)
    logoutButton.addEventListener("click", (e) => onLogout());
});