// submit url shortener form
document.getElementById("shortener-form").addEventListener(
  "submit",
  (event) => {
    event.preventDefault();

    const longUrlInput = document.getElementById("link-input");
    const longUrl = longUrlInput?.value;

    if (!longUrl) {
      alert("Please enter a valid url");
      return;
    }

    Http.post("/api/url/shorten", {
      longUrl: longUrl,
    })
      .then((res) => res.json())
      .then((res) => {
        const shortUrl = res?.data?.shortUrl;
        if (shortUrl) {
          const shortenedUrl = document.getElementById("shortened-url");
          if (shortenedUrl) {
            shortenedUrl.style.display = "flex";
            shortenedUrl.innerHTML = `${window.location.host}/${shortUrl}`;
          } else {
            alert("short url: " + `${window.location.host}/${shortUrl}`);
          }
        } else {
          alert(
            "Something went wrong, while shortening url, please try again!"
          );
        }
      });
  },
  false
);

function redirectToMyLinks() {
  window.location.origin = window.location.host + "/my-links";
}
