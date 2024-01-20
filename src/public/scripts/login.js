// Login user
document.addEventListener(
  'click',
  event => {
    event.preventDefault();
    if (event.target.matches('#login-btn')) {
      var emailInput = document.getElementById('email-input');
      var pwdInput = document.getElementById('pwd-input');
      var data = {
        email: emailInput.value,
        password: pwdInput.value,
      };
      Http.post('/auth/login', data).then(() => {
        window.location.href = '/generate';
      });
    }
  },
  false
);
