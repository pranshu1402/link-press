// submit url shortener form
document.getElementById('shortener-form').addEventListener(
  'submit',
  event => {
    event.preventDefault();

    const longUrlInput = document.getElementById('link-input');
    const longUrl = longUrlInput?.value;

    if (!longUrl) {
      alert('Please enter a valid url');
      return;
    }

    Http.post('/url/shorten', {
      longUrl: longUrl,
    }).then(res => {
      const shortUrl = res?.data?.shortUrl;
      alert('short url: ' + `${window.location.host}/${shortUrl}`);
    });
  },
  false
);

function redirectToMyLinks() {
  window.location.origin = window.location.host + '/my-links';
}
