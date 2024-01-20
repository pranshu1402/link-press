window.addEventListener("load", (e) => {
  Http.get(`/api/url/user`)
    .then((res) => {
      if (res.status === 200) {
        return res.json();
      } else {
        return Promise.reject("");
      }
    })
    .then((res) => {
      if (res.data && res.totalCount) {
        console.log(res);
        const allLinksContainer = document.getElementById("all-links");
        allLinksContainer.innerHTML = "";
        res.data?.forEach((linkData) => {
          const linkSectionElement = getLinkHtml(linkData);
          if (linkSectionElement) {
            allLinksContainer.appendChild(linkSectionElement);
          }
        });

        const columnHeader = document.getElementById("column-header");
        columnHeader.innerHTML = `My Links (${res.totalCount})`;
      } else {
        const allLinksContainer = document.getElementById("all-links");
        allLinksContainer.innerHTML = "No links found for your account.";
      }
    })
    .catch((err) => {
      alert("Failed to fetch links for current user!");
    });
});

function getLinkHtml(linkData) {
  const linkDivContainer = document.createElement("div");
  linkDivContainer.classList.add("link-container", "p-s", "border-s");

  const clickCountDiv = document.createElement("div");
  clickCountDiv.classList.add("click-count-div");
  clickCountDiv.innerHTML = `Clicks: <span>${linkData.clickCount}</span>`;

  const urlContainer = document.createElement("div");
  urlContainer.classList.add("url-container");

  const longUrlSpan = document.createElement("span");
  longUrlSpan.classList.add("long-url");
  longUrlSpan.innerHTML = `Long url: <span>${linkData.longUrl}</span>`;

  const shortUrlSpan = document.createElement("span");
  shortUrlSpan.classList.add("short-url");
  shortUrlSpan.innerHTML = `Short url: <span>${
    window.location.origin + "/" + linkData.shortUrl
  }</span>`;

  urlContainer.appendChild(longUrlSpan);
  urlContainer.appendChild(shortUrlSpan);

  const rightContainer = document.createElement("div");
  rightContainer.classList.add("right-container");

  const timeStampContainer = document.createElement("div");
  timeStampContainer.classList.add("time-stamp-container");
  timeStampContainer.innerHTML = `Created at: <span>${new Date(
    linkData.createdAt
  ).toDateString()}</span>`;

  const statusContainer = document.createElement("div");
  statusContainer.classList.add("status-container");
  statusContainer.innerHTML = `Status: ${
    linkData.expireBy > new Date() ? "Active" : "Inactive"
  }`;

  urlContainer.appendChild(timeStampContainer);
  rightContainer.appendChild(statusContainer);

  linkDivContainer.appendChild(clickCountDiv);
  linkDivContainer.appendChild(urlContainer);
  linkDivContainer.appendChild(rightContainer);

  return linkDivContainer;
}
