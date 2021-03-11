const $ = document.querySelector.bind(document)

// bong roi 
var pictureSrc = "./assets/images/bong bong.png"; //the location of the snowflakes
var pictureWidth = 25; //the width of the snowflakes
var pictureHeight = 25; //the height of the snowflakes
var numFlakes = 12; //the number of snowflakes
var downSpeed = 0.01; //the falling speed of snowflakes (portion of screen per 100 ms)
var lrFlakes = 15; //the speed that the snowflakes should swing from side to side

if (
    typeof numFlakes != "number" ||
    Math.round(numFlakes) != numFlakes ||
    numFlakes < 1
) {
    numFlakes = 12;
}

//draw the snowflakes
for (var x = 0; x < numFlakes; x++) {
    if (document.layers) {
        //releave NS4 bug
        document.write(
            '<layer id="snFlkDiv' +
            x +
            '"><imgsrc="' +
            pictureSrc +
            '" height="' +
            pictureHeight +
            '"width="' +
            pictureWidth +
            '" alt="*" border="0"></layer>'
        );
    } else {
        document.write(
            '<div style="position:absolute; z-index:9999;"id="snFlkDiv' +
            x +
            '"><img src="' +
            pictureSrc +
            '"height="' +
            pictureHeight +
            '" width="' +
            pictureWidth +
            '" alt="*"border="0"></div>'
        );
    }
}

//calculate initial positions (in portions of browser window size)
var xcoords = new Array(),
    ycoords = new Array(),
    snFlkTemp;
for (var x = 0; x < numFlakes; x++) {
    xcoords[x] = (x + 1) / (numFlakes + 1);
    do {
        snFlkTemp = Math.round((numFlakes - 1) * Math.random());
    } while (typeof ycoords[snFlkTemp] == "number");
    ycoords[snFlkTemp] = x / numFlakes;
}

//now animate
function flakeFall() {
    if (!getRefToDivNest("snFlkDiv0")) {
        return;
    }
    var scrWidth = 0,
        scrHeight = 0,
        scrollHeight = 0,
        scrollWidth = 0;
    //find screen settings for all variations. doing this every time allows for resizing and scrolling
    if (typeof window.innerWidth == "number") {
        scrWidth = window.innerWidth;
        scrHeight = window.innerHeight;
    } else {
        if (
            document.documentElement &&
            (document.documentElement.clientWidth ||
                document.documentElement.clientHeight)
        ) {
            scrWidth = document.documentElement.clientWidth;
            scrHeight = document.documentElement.clientHeight;
        } else {
            if (
                document.body &&
                (document.body.clientWidth ||
                    document.body.clientHeight)
            ) {
                scrWidth = document.body.clientWidth;
                scrHeight = document.body.clientHeight;
            }
        }
    }
    if (typeof window.pageYOffset == "number") {
        scrollHeight = pageYOffset;
        scrollWidth = pageXOffset;
    } else {
        if (
            document.body &&
            (document.body.scrollLeft || document.body.scrollTop)
        ) {
            scrollHeight = document.body.scrollTop;
            scrollWidth = document.body.scrollLeft;
        } else {
            if (
                document.documentElement &&
                (document.documentElement.scrollLeft ||
                    document.documentElement.scrollTop)
            ) {
                scrollHeight = document.documentElement.scrollTop;
                scrollWidth = document.documentElement.scrollLeft;
            }
        }
    }
    //move the snowflakes to their new position
    for (var x = 0; x < numFlakes; x++) {
        if (ycoords[x] * scrHeight > scrHeight - pictureHeight) {
            ycoords[x] = 0;
        }
        var divRef = getRefToDivNest("snFlkDiv" + x);
        if (!divRef) {
            return;
        }
        if (divRef.style) {
            divRef = divRef.style;
        }
        var oPix = document.childNodes ? "px" : 0;
        divRef.top =
            Math.round(ycoords[x] * scrHeight) +
            scrollHeight +
            oPix;
        divRef.left =
            Math.round(
                xcoords[x] * scrWidth -
                pictureWidth / 2 +
                (scrWidth / ((numFlakes + 1) * 4)) *
                (Math.sin(lrFlakes * ycoords[x]) -
                    Math.sin(3 * lrFlakes * ycoords[x]))
            ) +
            scrollWidth +
            oPix;
        ycoords[x] += downSpeed;
    }
}

function getRefToDivNest(divName) {
    if (document.layers) {
        return document.layers[divName];
    } //NS4
    if (document[divName]) {
        return document[divName];
    } //NS4 also
    if (document.getElementById) {
        return document.getElementById(divName);
    } //DOM (IE5+, NS6+, Mozilla0.9+, Opera)
    if (document.all) {
        return document.all[divName];
    } //Proprietary DOM - IE4
    return false;
}

window.setInterval("flakeFall();", 100);

// end

// scroll amination text
var scroll = window.requestAnimationFrame ||
    // IE Fallback
    function(callback) { window.setTimeout(callback, 1000 / 60) };
var elementsToShow = document.querySelectorAll('.show-on-scroll');

function loop() {

    Array.prototype.forEach.call(elementsToShow, function(element) {
        if (isElementInViewport(element)) {
            element.classList.add('is-visible');

        } else {
            element.classList.remove('is-visible');
        }
    });

    scroll(loop);
}

loop();

function isElementInViewport(el) {
    // special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }
    var rect = el.getBoundingClientRect();
    return (
        (rect.top <= 0 &&
            rect.bottom >= 0) ||
        (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight)) ||
        (rect.top >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
    );
}

// isSmoothScroll 

var html = document.documentElement;
var body = document.body;

var scroller = {
    target: document.querySelector(".isSmoothScroll"),
    ease: 0.05, // <= scroll speed
    endY: 0,
    y: 0,
    resizeRequest: 1,
    scrollRequest: 0,
};

var requestId = null;

TweenLite.set(scroller.target, {
    rotation: 0.01,
    force3D: true
});

window.addEventListener("load", onLoad);

function onLoad() {
    updateScroller();
    window.focus();
    window.addEventListener("resize", onResize);
    document.addEventListener("scroll", onScroll);
}

function updateScroller() {

    var resized = scroller.resizeRequest > 0;

    if (resized) {
        var height = scroller.target.clientHeight;
        body.style.height = height + "px";
        scroller.resizeRequest = 0;
    }

    var scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

    scroller.endY = scrollY;
    scroller.y += (scrollY - scroller.y) * scroller.ease;

    if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
        scroller.y = scrollY;
        scroller.scrollRequest = 0;
    }

    TweenLite.set(scroller.target, {
        y: -scroller.y
    });

    requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
}

function onScroll() {
    scroller.scrollRequest++;
    if (!requestId) {
        requestId = requestAnimationFrame(updateScroller);
    }
}

function onResize() {
    scroller.resizeRequest++;
    if (!requestId) {
        requestId = requestAnimationFrame(updateScroller);
    }
}
//end

//back to scrollTop

window.onscroll = function() {
    scrollFunction();
};

const button = document.querySelector("#go-top");
const scrolldown = document.querySelector('.scroll-down');

function scrollFunction() {
    if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
    ) {
        button.style.display = "block";
        scrolldown.style.display = "none";
    } else {
        button.style.display = "none";
        scrolldown.style.display = "block";
    }
}

if (button) {
    button.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    });
}
//end