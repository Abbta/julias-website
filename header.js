const headerTransitionStart = 10;

window.onscroll = function ()
{
    const headerBorder = document.getElementById("header-border-visible");
    const authorName = document.getElementById("author-name");
    const headerContainer = document.getElementById("header-container");
    const pagesButtons = document.getElementById("pages-buttons")
    if (window.scrollY >= headerTransitionStart) {
        headerBorder.classList.remove("header-border-before");
        headerBorder.classList.add("header-border-after");
        authorName.classList.remove("author-name-before");
        authorName.classList.add("author-name-after");
        headerContainer.classList.remove("header-container-before");
        headerContainer.classList.add("header-container-after");
        pagesButtons.classList.remove("pages-buttons-before");
        pagesButtons.classList.add("pages-buttons-after");
    }
    else if (headerBorder.classList.contains("header-border-after")) {
        headerBorder.classList.add("header-border-before");
        headerBorder.classList.remove("header-border-after");
        authorName.classList.add("author-name-before");
        authorName.classList.remove("author-name-after");
        headerContainer.classList.add("header-container-before");
        headerContainer.classList.remove("header-container-after");
        pagesButtons.classList.add("pages-buttons-before");
        pagesButtons.classList.remove("pages-buttons-after");
    }
}

document.getElementById("hamburger-icon").onclick = function ()
{
    const menu = document.getElementById("pages-buttons");
    if (this.classList.contains("clicked"))
    {
        this.classList.remove("clicked");
        menu.style.top = "-200px";
    }
    else
    {
        this.classList.add("clicked");
        menu.style.top = "50px";
    }
}