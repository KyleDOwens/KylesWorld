(async function () {
    // Load the Excel shell
    let shellHTML = await fetch("/base.html").then(r => r.text());

    document.open();
    document.write(shellHTML);
    document.close();

    // Load page-specific content
    let contentHTML = await fetch(window.PAGE_URL).then(r => r.text());
    document.getElementById("sheet-overlay").innerHTML = contentHTML;

    // Load the page-specific CSS file
    let pageName = window.PAGE_URL.slice(window.PAGE_URL.indexOf("/") + 1, window.PAGE_URL.indexOf("-"));
    let styleLink = document.querySelector("link");
    let pageStyleLink = document.createElement("link");
    pageStyleLink.rel = "stylesheet";
    pageStyleLink.href = `css/${pageName}.css`;
    styleLink.parentElement.appendChild(pageStyleLink);
})();