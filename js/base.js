const BUBBLE_GRAPHIC = `
// <![CDATA[
var colours=new Array("#a6f", "#60f", "#60f", "#a6f", "#ccc"); // colours for top, right, bottom and left borders and background of bubbles
var colours=new Array("#66aaff", "#0066ff", "#0066ff", "#66aaff", "#cce6ff"); // colours for top, right, bottom and left borders and background of bubbles
var bubbles=66; // how many bubbles are moving at any given time
var over_or_under="over"; // set to "over" for bubbles to always be on top, or "under" to allow them to float behind other objects

/****************************
*   JavaScript Bubble Bath  *
*(c)2010-13 mf2fm web-design*
*  http://www.mf2fm.com/rv  *
* DON'T EDIT BELOW THIS BOX *
****************************/

var swide=800;
var shigh=600;
var bubb=new Array();
var bubbx=new Array();
var bubby=new Array();
var bubbs=new Array();
var boddie;
var ie_version=(navigator.appVersion.indexOf("MSIE")!=-1)?parseFloat(navigator.appVersion.split("MSIE")[1]):false;

bubba();

function bubba() { if (document.getElementById) {
  var i, rats, div;
  boddie=document.createElement("div");
  boddie.style.position="fixed";
  boddie.style.top="0px";
  boddie.style.left="0px";
  boddie.style.overflow="visible";
  boddie.style.width="1px";
  boddie.style.height="1px";
  boddie.style.backgroundColor="transparent";
  boddie.style.zIndex="999";
  boddie.classList.add("graphic");
  document.body.appendChild(boddie);
  set_width();
  for (i=0; i<bubbles; i++) {
    rats=createDiv("3px", "3px");

    div=createDiv("auto", "auto");
    rats.appendChild(div);
    div=div.style;
    div.top="1px";
    div.left="0px";
    div.bottom="1px";
    div.right="0px";
    div.borderLeft="1px solid "+colours[3];
    div.borderRight="1px solid "+colours[1];
    
    div=createDiv("auto", "auto");
    rats.appendChild(div);
    div=div.style;
    div.top="0px";
    div.left="1px";
    div.right="1px";
    div.bottom="0px"
    div.borderTop="1px solid "+colours[0];
    div.borderBottom="1px solid "+colours[2];

    div=createDiv("auto", "auto");
    rats.appendChild(div);
    div=div.style;
    div.left="1px";
    div.right="1px";
    div.bottom="1px";
    div.top="1px";
    div.backgroundColor=colours[4];
    if (ie_version && ie_version<10) div.filter="alpha(opacity=50)";
    else div.opacity=0.5;

    boddie.appendChild(rats);
    bubb[i]=rats.style;
    bubb[i].zIndex=(over_or_under=="over")?"99999":"0";
  }
  bubble();
}}

function bubble() {
  var c;
  for (c=0; c<bubbles; c++) if (!bubby[c] && Math.random()<0.333) {
    bubb[c].left=(bubbx[c]=Math.floor(swide/6+Math.random()*swide/1.5)-10)+"px";
    bubb[c].top=(bubby[c]=shigh)+"px";
    bubb[c].width="3px";
    bubb[c].height="3px"
    bubb[c].visibility="visible";
    bubbs[c]=3;
    break;
  }
  for (c=0; c<bubbles; c++) if (bubby[c]) update_bubb(c);
  setTimeout("bubble()", 40);
}

function update_bubb(i) {
  if (bubby[i]) {
    bubby[i]-=bubbs[i]/2+i%2;
    bubbx[i]+=(i%5-2)/5;
    if (bubby[i]>0 && bubbx[i]>0 && bubbx[i]<swide) {
      if (Math.random()<bubbs[i]/shigh*2 && bubbs[i]++<8) {
        bubb[i].width=bubbs[i]+"px";
        bubb[i].height=bubbs[i]+"px";
      }
      bubb[i].top=bubby[i]+"px";
      bubb[i].left=bubbx[i]+"px";
    }
    else {
      bubb[i].visibility="hidden";
      bubby[i]=0;
      return;
    }
  }
}

window.onresize=set_width;
function set_width() {
  var sw_min=999999;
  var sh_min=999999;
  if (document.documentElement && document.documentElement.clientWidth) {
    if (document.documentElement.clientWidth>0) sw_min=document.documentElement.clientWidth;
    if (document.documentElement.clientHeight>0) sh_min=document.documentElement.clientHeight;
  }
  if (typeof(self.innerWidth)=='number' && self.innerWidth) {
    if (self.innerWidth>0 && self.innerWidth<sw_min) sw_min=self.innerWidth;
    if (self.innerHeight>0 && self.innerHeight<sh_min) sh_min=self.innerHeight;
  }
  if (document.body.clientWidth) {
    if (document.body.clientWidth>0 && document.body.clientWidth<sw_min) sw_min=document.body.clientWidth;
    if (document.body.clientHeight>0 && document.body.clientHeight<sh_min) sh_min=document.body.clientHeight;
  }
  if (sw_min==999999 || sh_min==999999) {
    sw_min=800;
    sh_min=600;
  }
  swide=sw_min;
  shigh=sh_min;
}

function createDiv(height, width) {
  var div=document.createElement("div");
  div.style.position="absolute";
  div.style.height=height;
  div.style.width=width;
  div.style.overflow="hidden";
  div.style.backgroundColor="transparent";
  return (div);
}
// ]]>`;

/*-- ================================================ --->
<---                   INITIALIZATION                 --->
<--- ================================================ --*/
//#region INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    initializeSheet();

    shortenTabTitles();
    applyTabZIndex();
    updateTabDisplay();

    handlePageLoad();
    fitSheetToHeight();
});

window.addEventListener("load", () =>
    // resize the excel sheet once all content is loaded (mostly needed for photobook)
    window.dispatchEvent(new Event("resize"))
);


/**
 * Initializes the mock excel sheet by adding in header elements
 */
function initializeSheet() {
    // Add column headers
    let mockHorizontalHeader = document.getElementById("mock-hheader");
    let colHeaders = "ABCDEFGHIJKLMNOPQRSTUVWXYZABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < colHeaders.length; i++) {
        let headerCell = document.createElement("span");
        headerCell.classList.add("horizontal-header");
        headerCell.innerHTML = `${colHeaders[i]}`;
        mockHorizontalHeader.appendChild(headerCell);
    }

    // Add row headers
    let mockVerticalHeader = document.getElementById("mock-vheader");
    for (let i = 0; i <= 2000; i++) {
        let headerCell = document.createElement("span");
        headerCell.classList.add("vertical-header");
        headerCell.id = `_${i}`;
        headerCell.innerHTML = `${i}`;

        if (i >= 100) {
            headerCell.style.fontSize = "8pt";
        }
        if (i >= 1000) {
            headerCell.style.fontSize = "6pt";
        }

        mockVerticalHeader.appendChild(headerCell);
    }
}

/**
 * Alter the height of the sheet overlay to fit all the content upon resize
 */
window.addEventListener("resize", () => {
    fitSheetToHeight();
});
function fitSheetToHeight() {
    let mockGrid = document.getElementById("mock-grid");
    mockGrid.style.height = `auto`;

    let scrollContainer = document.getElementById("sheet-scroll-container");
    let scrollHeight = scrollContainer.scrollHeight;
    let numRows = scrollHeight / 20;

    if (numRows > 35) {
        numRows += 3;
    }

    let rowHeaders = document.querySelectorAll(".vertical-header");
    rowHeaders.forEach((rowHeader, i) => {
        if (i <= numRows) {
            rowHeader.classList.remove("hidden");
        }
        else {
            rowHeader.classList.add("hidden");
        }
    });

    mockGrid.style.height = `${numRows * 20}px`;
}

/**
 * Make scrolling anywhere in the background scroll the main page
 */
/*
int count = 0;
document.addEventListener("wheel", (e) => {
    if (e.target == document.getElementsByTagName("body")[0]) {
        let sign = (e.deltaY > 0) ? 1 : -1;

        // Jank interval to mimic smooth scrolling, since I can't call .scrollTo() with a passive wheel event
        let initialCount = 0;
        let intervalId = setInterval(() => {
            document.getElementById("sheet-scroll-container").scrollTop += sign * document.getElementById("sheet-vertical-scroll-track").scrollHeight * 0.043039*5.75 / 30;
            if (count++ >= initialCount + 30) {
                clearInterval(intervalId);
            }
        }, 2)
    }
}, {passive: true});
*/
//#endregion INITIALIZATION


/*-- ================================================ --->
<---                     SHEET TABS                   --->
<--- ================================================ --*/
//#region SHEET_TABS
let NUM_TABS_SHOWN = 5;

/**
 * Shortens the text within the page tabs if they are too long
 */
function shortenTabTitles() {
    let sheetTabs = document.querySelectorAll(".sheet-tab");
    for (let tab of sheetTabs) {
        // Crude way to limit overflow - limit sheet length to 8 characters (ok since using monospaced font)
        let anchor = tab.querySelector("a");
        if (anchor.innerText.length > 8) {
            anchor.innerText = anchor.innerText.slice(0, 7) + "…";
        }
    }
}
window.addEventListener("resize", () => {
    shortenTabTitles();

    let screenWidth = window.innerWidth;
    if (screenWidth < 360) {
        NUM_TABS_SHOWN = 1;
    }
    else if (screenWidth < 450) {
        NUM_TABS_SHOWN = 2;
    }
    else if (screenWidth < 600) {
        NUM_TABS_SHOWN = 3;
    }
    else if (screenWidth < 800) {
        NUM_TABS_SHOWN = 4;
    }
    else {
        NUM_TABS_SHOWN = 5;
    }

    updateTabDisplay();
});

/**
 * Applies z-index values to the tabs so they appear cascading 
 */
function applyTabZIndex() {
    let sheetTabs = document.querySelectorAll(".sheet-tab");
    sheetTabs.forEach((tab, i) => {
        tab.style.zIndex = sheetTabs.length - i + 1;
    })
}

/**
 * Makes the passed in tab the "active tab" - updates the classes of each tab to match their new state
 * @param {*} activeTab The clicked on tab HTML element
 */
function makeActiveTab(activeTab) {
    // Apply appropraite CSS classes
    let sheetTabs = document.querySelectorAll(".sheet-tab");
    sheetTabs.forEach((tab, i) => {
        tab.classList.remove("active-tab");
        tab.style.zIndex = sheetTabs.length - i + 1;
    })
    activeTab.classList.add("active-tab");
    activeTab.style.zIndex = 10;
}

/**
 * Updates which of the 5 tabs are currently displayed at the bottom of the website
 */
let firstTabDisplayedIndex = null;
function updateTabDisplay() {
    if (firstTabDisplayedIndex == null) {
        firstTabDisplayedIndex = localStorage.getItem("firstTab") ? parseInt(localStorage.getItem("firstTab")) : 0;
    }

    // Update which tabs are shown
    let sheetTabs = document.querySelectorAll(".sheet-tab")

    // get the range on tab indices to show (tries to always show tabs to the right of the first, but will show left if no remain to the right) 
    let leftIndex = (firstTabDisplayedIndex + NUM_TABS_SHOWN > sheetTabs.length) ? firstTabDisplayedIndex - (firstTabDisplayedIndex + NUM_TABS_SHOWN - sheetTabs.length) : firstTabDisplayedIndex;
    let rightIndex = (firstTabDisplayedIndex + NUM_TABS_SHOWN > sheetTabs.length) ? sheetTabs.length : firstTabDisplayedIndex + NUM_TABS_SHOWN;
    sheetTabs.forEach((tab, i) => {
        if (leftIndex <= i && i < rightIndex) {
            tab.classList.remove("hidden");
        }
        else {
            tab.classList.add("hidden");
        }
    });

    // Update tab selection buttons
    if (firstTabDisplayedIndex == 0) {
        document.getElementById("first-sheet-button").disabled = true;
        document.getElementById("previous-sheet-button").disabled = true;
        document.getElementById("next-sheet-button").disabled = false;
        document.getElementById("last-sheet-button").disabled = false;
    }
    else if (firstTabDisplayedIndex == (sheetTabs.length - NUM_TABS_SHOWN)) {
        document.getElementById("first-sheet-button").disabled = false;
        document.getElementById("previous-sheet-button").disabled = false;
        document.getElementById("next-sheet-button").disabled = true;
        document.getElementById("last-sheet-button").disabled = true;
    }
    else {
        document.getElementById("first-sheet-button").disabled = false;
        document.getElementById("previous-sheet-button").disabled = false;
        document.getElementById("next-sheet-button").disabled = false;
        document.getElementById("last-sheet-button").disabled = false;
    }

    // Store the first tab in local storage so it can be loaded when moving to another page
    localStorage.setItem("firstTab", firstTabDisplayedIndex);
}

/**
 * Listeners to handle the tab selection buttons being pressed
 */
document.getElementById("first-sheet-button").addEventListener("click", () => {
    firstTabDisplayedIndex = 0;
    updateTabDisplay();
});
document.getElementById("previous-sheet-button").addEventListener("click", () => {
    firstTabDisplayedIndex = Math.max(0, --firstTabDisplayedIndex);
    updateTabDisplay();
});
document.getElementById("next-sheet-button").addEventListener("click", () => {
    firstTabDisplayedIndex = Math.min(document.querySelectorAll(".sheet-tab").length - NUM_TABS_SHOWN, ++firstTabDisplayedIndex);
    updateTabDisplay();
});
document.getElementById("last-sheet-button").addEventListener("click", () => {
    firstTabDisplayedIndex = document.querySelectorAll(".sheet-tab").length - NUM_TABS_SHOWN;
    updateTabDisplay();
});

/**
 * Get the string of the current page name
 */
function getPageName() {
    let pageName = window.location.pathname.slice(window.location.pathname.lastIndexOf("/") + 1, window.location.pathname.indexOf(".html"));
    if (pageName == "") {
        return "homepage";
    }
    return pageName;
}

/**
 * Gets the html element for the tag associated with the currently loaded page
 */
function getCurrentTab() {
    let pageName = getPageName();
    let pageTab = null;
    document.querySelectorAll(".sheet-tab").forEach(tab => {
        let sheetLink = tab.children[0];
        if (sheetLink.dataset.title == pageName) {
            pageTab = tab;
        }
    });

    return pageTab;
}

/**
 * Gets the index of the tag associated with the currently loaded page
 */
function getCurrentTabIndex() {
    let pageName = getPageName();
    let pageIndex = null;
    document.querySelectorAll(".sheet-tab").forEach((tab, i) => {
        let sheetLink = tab.children[0];
        if (sheetLink.dataset.title == pageName) {
            pageIndex = i;
        }
    });

    return pageIndex;
}

/**
 * Updates the dropdown and sheet tabs on page load
 */
function handlePageLoad() {
    // Get the current page name
    let pageName = getPageName();

    // Update the dropdown item classes
    document.querySelectorAll(".sheet-link").forEach(sheetLink => {
        // Skip the bottom tabs
        if (sheetLink.closest(".sheet-tab") != null) {
            return;
        }

        let dropdownItem = sheetLink.children[0];
        if (dropdownItem.innerHTML == pageName) {
            dropdownItem.classList.add("dropdown-selected");
        }
        else {
            dropdownItem.classList.remove("dropdown-selected");
        }
    });

    // Update active tab
    let pageTab = getCurrentTab();

    if (pageTab != null) {
        makeActiveTab(pageTab);
    }
    else {
        console.log("ERROR: Could not find corresponding tab for loaded page");
        return;
    }

    // Get current range of tabs shown
    let leftIndex = null;
    let rightIndex = null;
    let currentIndex = getCurrentTabIndex();
    document.querySelectorAll(".sheet-tab").forEach((tab, i) => {
        if (!tab.classList.contains("hidden")) {
            rightIndex = i;
            if (leftIndex == null) {
                leftIndex = i;
            }
        }
    });

    // If the current page is NOT shown in the tab range, update the tab range to include it
    if (currentIndex < leftIndex) {
        firstTabDisplayedIndex = currentIndex;
        updateTabDisplay();
    }
    else if (currentIndex > rightIndex) {
        firstTabDisplayedIndex = currentIndex - (NUM_TABS_SHOWN - 1)
        updateTabDisplay();
    }
}
//#endregion SHEET_TABS


/*-- ================================================ --->
<---                     DROPDOWNS                    --->
<--- ================================================ --*/
//#region DROPDOWN
let openDropdown = null;

/**
 * Handles the toggling of the <current sheet> dropdown menu
 */
function toggleDropdown(dropdown) {
    let button = dropdown.querySelector(".square-button");
    let options = dropdown.querySelector(".dropdown-options");

    button.classList.toggle("down-button");
    button.classList.toggle("up-button");
    options.classList.toggle("hidden");

    openDropdown = (openDropdown == null) ? dropdown : null;
}
window.addEventListener("mouseup", function(e) {
    if ((openDropdown != null) && ((e.target.closest(".dropdown") == null) || e.target.closest(".dropdown") != openDropdown)) {
        toggleDropdown(openDropdown);
    }
});
document.querySelectorAll(".dropdown").forEach((dropdown) => {
    dropdown.querySelector(".dropdown-display").addEventListener("click", function() {
        toggleDropdown(dropdown);
    });
});

function updateDropdownDisplay(dropdown, toDisplay) {
    // TODO: replace with select tag? can i customize it for what i want?
    dropdown.querySelector(".dropdown-display").innerHTML = toDisplay;
    dropdown.querySelector(".dropdown-display").innerHTML += `\n<button class="square-button down-button"></button>`;
    dropdown.querySelectorAll(".dropdown-item").forEach(item => {
        if (item.innerText == toDisplay) {
            item.classList.add("dropdown-selected");
        }
        else {
            item.classList.remove("dropdown-selected");
        }
    });
}


let THEMES = {
    "space" : {
        "cursor" : null,
        "graphic" : null,
        "extras" : null
    },
    "underwater" : {
        "cursor" : "../images/cursor_fish.png",
        "graphic" : BUBBLE_GRAPHIC,
        "extras" : null,
    },
}
function updateTheme(postfix) {
    // change background
    document.body.style.backgroundImage = `url("../images/background_${postfix}.gif")`;

    // (optional) update cursor
    document.body.style.cursor = `auto`
    if (THEMES[postfix]["cursor"]) {
        document.body.style.cursor = `url(${THEMES[postfix]["cursor"]}), auto`;
    }

    // remove old graphic(s)
    let oldScript = document.getElementById("graphic-script");
    if (oldScript) {
        oldScript.remove();
        document.querySelectorAll(".graphic").forEach(graphic => graphic.remove());
    }

    // (optional) add graphic
    if (THEMES[postfix]["graphic"]) {
        let newScript = document.createElement('script')
        newScript.id = "graphic-script";
        newScript.textContent = THEMES[postfix]["graphic"];
        document.head.appendChild(newScript);
    }

    // remove old extra content
    document.querySelectorAll(".theme-extra").forEach(extra => extra.style.display = "none");

    // (optional) add extra content
    if (THEMES[postfix]["extras"]) {
        document.getElementById(`${THEMES[postfix]["extras"]}`).style.display = "block";
    }
}

document.getElementById("theme-selector").querySelectorAll(".dropdown-item").forEach((themeOption) => {
    themeOption.addEventListener("click", () => {
        let themeSelector = document.getElementById("theme-selector");
        updateTheme(themeOption.innerHTML);
        toggleDropdown(themeSelector);
        updateDropdownDisplay(themeSelector, themeOption.innerHTML);
    });
});
//#endregion DROPDOWN


/*-- ================================================ --->
<---                   MENU BUTTONS                   --->
<--- ================================================ --*/
document.getElementById("main-title-left").addEventListener("click", () => {
    window.location.href = "/";
});


