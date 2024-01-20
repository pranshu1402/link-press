// Login user
document.addEventListener(
  'click',
  event => {
    event.preventDefault();
    if (event.target.matches('#login-btn')) {
      loginEventHandler();
    } else if (event.target.matches('#register-btn')) {
      registerUserEventHandler();
    }
  },
  false
);

function loginEventHandler() {
  var emailInput = document.getElementById('email-input');
  var pwdInput = document.getElementById('pwd-input');
  var data = {
    email: emailInput.value,
    password: pwdInput.value,
  };
  Http.post('/auth/login', data).then(() => {
    window.location.href = '/files';
  });
}

function registerUserEventHandler() {
  var userName = document.getElementById('new-username-input')?.value;
  var email = document.getElementById('new-email-input')?.value;
  var password = document.getElementById('new-pwd-input')?.value;

  if (!userName || !email || !password) return;

  var data = {
    user: {
      name: userName,
      email,
      password,
      role: Math.floor(Math.random() * 2) - 1,
    },
  };

  Http.post('/user/register', data).then(() => {
    window.location.href = '/files';
  });
}
