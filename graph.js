const yValues = [
    -0.02, 0.045, -0.004, -0.01, -0.03, -0.02, -0.06, -0.03, -0.003, -0.01, 0, -0.02, -0.07, -0.02, -0.04, -0.04, -0.03, -0.04, -0.085, -0.014, -0.011, 0.03, -0.05, 0, -0.02
]
const backgroundYValues = [0.1, 0.05, 0, -0.05, -0.1, -0.15, -0.2];
const circleColour = "#8f2018";
const circleRadius = 5;
const horisLength = 0.6;
const dataMargin = 0.05;
const yDistance = 0.35;
const yMin = -0.13;
const graphPaddingX = 50;
const yAxisMarkerWidth = 15;
const yAxisTextPadding = 17;
const yAxisLetterWidth = 4;
const yAxisText = "Coefficient estimate";
const xAxisMarkerHeight = yAxisMarkerWidth;
const xAxisTextPadding = yAxisTextPadding;
const xAxisLetterWidth = 7;
const xAxisDisplayIndices = [2, 6, 10, 14, 18, 22];
const xAxisDisplayFirst = 24;
const xAxisDisplayValuePerIndex = -2;
const xAxisText = "Age at parent's layoff";
const graphTitle = "High School Graduate by age 19";
const graphTitleLetterWidth = 11;
const backgroundBoxColour = "#cdcdcd55";
var svgElementsContainer = new Array;
const animationDelay = 0;
const animationDuration = 0;
const maxFrames = 0.001;

var g_graphState = 0;

var g_file = null;
var g_data = new Array;
var graphStateArray;

document.body.onload = function ()
{
    getCsvData();
}

function onLoad()
{
    const svg = document.getElementById("graph");
    const top = document.getElementById("graph-top");
    const left = document.getElementById("graph-left");
    const bot = document.getElementById("graph-bot");
    console.log(g_file);
    formatData(g_file, g_data);
    console.log(g_data);
    initBackground(svg);
    initTop(top);
    initLeft(left);
    initBot(bot, svg);
    initSvgElements(svg, g_data);
    addToGraph(document.getElementById("graph"), g_graphState, g_data);
    g_graphState++;

    graphScroll = function () {
        const svg = document.getElementById("graph");
        const graphHolder = document.getElementById("graph-placeholder");
        const graph_overlay_texts = document.getElementsByClassName("graph-overlay-text");
        if (graph_overlay_texts[g_graphState - 1].offsetTop < graphHolder.offsetTop - svg.scrollHeight / 2) {
            //if text to transition between current and next state is above marker 
            addToGraph(svg, g_graphState, g_data);
            g_graphState++;
        }

    }
}

function getCsvData()
{
    let url = window.location.href;
    let urlArray = url.split("/");   //https://juliatanndal.com/
    urlArray = urlArray.slice(0, 3); //https: , , juliatanndal.com
    url = urlArray.join("/") + "/graph_data.csv"
    let request = new XMLHttpRequest;
    request.open("GET", url);
    request.responseType = "text";
    request.onload = function ()
    {
        g_file = request.response;
        onLoad();
    }
    request.send();
}

const dataStartIndex = 1; 
const dataYValueIndex = 1;
const dataTopValueIndex = 2;
const dataBotValueIndex = 3;
function formatData(file, data)
{
    file = file.split("#");
    for (let i = file.length - 1; i >= dataStartIndex; i--)
    {
        file[i] = file[i].split(",");
        data.push(new Object);
        data[file.length - 1 - i].yValue = parseFloat(file[i][dataYValueIndex]);
        data[file.length - 1 - i].topValue = parseFloat(file[i][dataTopValueIndex]);
        data[file.length - 1 - i].botValue = parseFloat(file[i][dataBotValueIndex]);
    }
    graphStateArray = [
        [11, data.length - 1],
        [0, 10]
    ]
}

function yScale(elem, yValue) {
    var scalar = elem.scrollHeight / yDistance;
    return (-yValue - yMin) * scalar;
}

function xScale(element, xValue, withPadding = true) {
    let padding = withPadding ? graphPaddingX : 0;
    var scalar = (element.clientWidth - padding) / yValues.length;
    return Math.abs(xValue) * scalar + padding / 2;
}

function addToGraph(svg, graphState, data) {
    if (graphState < 2) {
        for (let i = graphStateArray[graphState][0]; i <= graphStateArray[graphState][1]; i++)
        {
            if (animationDelay > 0)
            {
                setTimeout(animateCircleIn, animationDelay * i, svgElementsContainer[i].circle);
                setTimeout(animateVerticalIn, animationDelay * i, svgElementsContainer[i].vertical, svg, data[i]);
                setTimeout(animateHorisontalIn, animationDelay * i + animationDuration, svgElementsContainer[i].horisontalTop, svgElementsContainer[i].horisontalBot, svg, i, i == 0 ? true : false);
            }
            else
            {
                animateCircleIn(svgElementsContainer[i].circle);
                animateVerticalIn(svgElementsContainer[i].vertical, svg, data[i]);
                animateHorisontalIn(svgElementsContainer[i].horisontalTop, svgElementsContainer[i].horisontalBot, svg, i, i == 0 ? true : false);
            }
        }
        if (graphState == 1)
        {
            svgElementsContainer[0].rect.setAttributeNS(null, "fill", backgroundBoxColour);
        }
    }
}

function initSvgElements(svg, data)
{
    svgElementsContainer.push(new Object);
    svgElementsContainer[0].rect = addBackgroundRect(svg, graphStateArray[1][1]);
    svgElementsContainer[0].dashed = addDashedLine(svg, 19);
    for (var i = 0; i < data.length; i++) {
        svgElementsContainer.push(new Object);
        var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        circle.setAttributeNS(null, "cx", xScale(svg, i));
        circle.setAttributeNS(null, "cy", yScale(svg, data[i].yValue));
        circle.setAttributeNS(null, "r", 0);
        circle.setAttributeNS(null, "fill", circleColour);
        svgElementsContainer[i].circle = circle;
        svg.appendChild(circle);

        svgElementsContainer[i].vertical = addLine(svg, xScale(svg, i), xScale(svg, i), yScale(svg, data[i].yValue), yScale(svg, data[i].yValue), circleColour, "2");
        svgElementsContainer[i].horisontalTop = addLine(svg, xScale(svg, i), xScale(svg, i), yScale(svg, data[i].topValue), yScale(svg, data[i].topValue), circleColour, "2");
        svgElementsContainer[i].horisontalBot = addLine(svg, xScale(svg, i), xScale(svg, i), yScale(svg, data[i].botValue), yScale(svg, data[i].botValue), circleColour, "2");
    }
}

function initBackground(svg) {
    addLine(svg, xScale(svg, 0, false), xScale(svg, yValues.length, false), yScale(svg, 0), yScale(svg, 0), "rgb(0,0,0)", "2");
    for (var i = 0; i < backgroundYValues.length; i++) {
        if (backgroundYValues[i] != 0) {
            addLine(svg, xScale(svg, 0, false), xScale(svg, yValues.length, false), yScale(svg, backgroundYValues[i]), yScale(svg, backgroundYValues[i]), "rgb(150, 150, 150)", "1");
        }
    }
}

function initTop(svg)
{
    addText(svg, (svg.clientWidth - graphTitleLetterWidth * graphTitle.length) / 2, svg.scrollHeight / 2, false, graphTitle).classList.add("graphTitle");
}

function initLeft(svg) {
    addLine(svg, svg.clientWidth, svg.clientWidth, 0, svg.scrollHeight, "rgb(0,0,0)", "2");
    addText(svg, svg.clientWidth - (yAxisMarkerWidth + yAxisTextPadding * 2 + yAxisLetterWidth), svg.scrollHeight / 2, "-90", yAxisText).classList.add("yAxisText");
    for (let i = 0; i < backgroundYValues.length; i++) {
        addLine(svg, svg.clientWidth - yAxisMarkerWidth, svg.clientWidth, yScale(svg, backgroundYValues[i]), yScale(svg, backgroundYValues[i]), "rgb(0,0,0)", "2");
        var text = addText(svg, svg.clientWidth - yAxisMarkerWidth - yAxisTextPadding, yScale(svg, backgroundYValues[i]), "-90", backgroundYValues[i].toString());
        text.classList.add("yAxisMarker");
    }
}

function initBot(bot, svg) {
    const marginLeft = bot.clientWidth - svg.clientWidth;
    addLine(bot, marginLeft, bot.clientWidth, 0, 0, "rgb(0,0,0)", "2");
    addText(
        bot,
        marginLeft + svg.clientWidth / 2 - xAxisText.length * xAxisLetterWidth / 2,
        xAxisMarkerHeight + xAxisTextPadding * 2 + xAxisLetterWidth,
        false,
        xAxisText
    ).classList.add("xAxisText");
    for (let i = 0; i < xAxisDisplayIndices.length; i++) {
        addLine(bot, xScale(svg, xAxisDisplayIndices[i], false) + marginLeft, xScale(svg, xAxisDisplayIndices[i], false) + marginLeft, 0, xAxisMarkerHeight, "rgb(0,0,0)", "2");
        var text = addText(bot, xScale(svg, xAxisDisplayIndices[i], false) + marginLeft - ((xAxisDisplayFirst + i * xAxisDisplayValuePerIndex).toString().length * xAxisLetterWidth / 2), xAxisMarkerHeight + xAxisTextPadding, false, xAxisDisplayFirst + i * xAxisDisplayValuePerIndex);
        text.classList.add("xAxisMarker");
    }
}

function animateCircleIn(circle) {
    let time = Date.now();
    var oStop = 1000;
    if (animationDuration > 0)
    {
        window.requestAnimationFrame(circleAnimation);
    }
    else
    {
        circleAnimation();
    }
    function circleAnimation()
    {
        let waitTo = time + (animationDuration / circleRadius);
        circle.setAttributeNS(null, "r", parseInt(circle.getAttributeNS(null, "r")) + 1);
        while (time < waitTo)
        {
            time = Date.now();
        }
        oStop--;
        if ((parseInt(circle.getAttributeNS(null, "r")) < circleRadius) && (oStop > 0))
        {
            window.requestAnimationFrame(circleAnimation);
        }
    }
}

function animateVerticalIn(vertical, svg, data) {
    let time = Date.now();
    var oStop = 1000;
    window.requestAnimationFrame(verticalAnimation);
    function verticalAnimation() {
        let waitTo;
        let pixelsByFrame;
        if (yScale(svg, data.botValue - data.yValue) < maxFrames) {
            waitTo = time + (animationDuration / yScale(svg, data.botValue - data.yValue)); //assumes yValue is in the middle between top and bot
            pixelsByFrame = 1;
        }
        else {
            waitTo = time + (animationDuration / maxFrames)
            pixelsByFrame = yScale(svg, data.botValue - data.yValue) / maxFrames;
        }
        vertical.setAttributeNS(null, "y1", parseInt(vertical.getAttributeNS(null, "y1")) - pixelsByFrame);
        vertical.setAttributeNS(null, "y2", parseInt(vertical.getAttributeNS(null, "y2")) + pixelsByFrame);
        while ((time < waitTo)) {
            time = Date.now();
        }
        oStop--;
        if ((parseInt(vertical.getAttributeNS(null, "y1")) > yScale(svg, data.botValue)) && (oStop > 0)) {
            window.requestAnimationFrame(verticalAnimation);
        }
        else {
            vertical.setAttributeNS(null, "y1", yScale(svg, data.botValue));
            vertical.setAttributeNS(null, "y2", yScale(svg, data.topValue));
        }
    }
}

function animateHorisontalIn(top, bot, svg, center, isFirst = false) {
    let time = Date.now();
    var oStop = 1000;
    window.requestAnimationFrame(horisontalAnimation);
    function horisontalAnimation() {
        let waitTo = time + (animationDuration / (xScale(svg, horisLength / 2)));
        top.setAttributeNS(null, "x1", parseInt(top.getAttributeNS(null, "x1")) - 1);
        top.setAttributeNS(null, "x2", parseInt(top.getAttributeNS(null, "x2")) + 1);
        bot.setAttributeNS(null, "x1", parseInt(bot.getAttributeNS(null, "x1")) - 1);
        bot.setAttributeNS(null, "x2", parseInt(bot.getAttributeNS(null, "x2")) + 1);
        while ((time < waitTo) && (stop > 0)) {
            time = Date.now();
        }
        oStop--;
        if ((top.getAttributeNS(null, "x1") >
            (isFirst ?
                graphPaddingX / 2 - xScale(svg, (center - horisLength / 2), false) :
                xScale(svg, (center - horisLength / 2), true)))
            && (oStop > 0)) {
            window.requestAnimationFrame(horisontalAnimation);
        }
    }
}

function addLine(svg, x1, x2, y1, y2, colour, width) {
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttributeNS(null, "x1", x1);
    line.setAttributeNS(null, "x2", x2);
    line.setAttributeNS(null, "y1", y1);
    line.setAttributeNS(null, "y2", y2);
    line.setAttributeNS(null, "style", "stroke:" + colour + ";stroke-width:" + width);
    svg.appendChild(line);
    return line;
}

function addText(svg, x, y, rotate = "0", textString) {
    var text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttributeNS(null, "x", x);
    text.setAttributeNS(null, "y", y);
    text.innerHTML = textString;
    if (rotate) {
        text.setAttributeNS(null, "transform", "rotate(" + rotate + "," + (x + textString.length * yAxisLetterWidth).toString() + "," + y + ")");
        if (parseInt(rotate) < 0)
        {
            text.setAttributeNS(null, "y", y - textString.length * yAxisLetterWidth);
        }
        else
        {
            text.setAttributeNS(null, "y", y + textString.length * yAxisLetterWidth);
        }
    }
    svg.appendChild(text);
    return text;
}

function addBackgroundRect(svg, index)
{
    var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttributeNS(null, "x", 0);
    rect.setAttributeNS(null, "y", 0);
    rect.setAttributeNS(null, "width", xScale(svg, index, true));
    rect.setAttributeNS(null, "height", svg.scrollHeight);
    rect.setAttributeNS(null, "fill", backgroundBoxColour.substring(0, 7) + "00");
    svg.appendChild(rect);
    return rect;
}

function addDashedLine(svg, index)
{
    var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttributeNS(null, "x1", xScale(svg, index, true));
    line.setAttributeNS(null, "x2", xScale(svg, index, true));
    line.setAttributeNS(null, "y1", 0);
    line.setAttributeNS(null, "y2", svg.scrollHeight);
    line.setAttributeNS(null, "stroke", "#000000");
    line.setAttributeNS(null, "stroke-dasharray", "5,5");
    svg.appendChild(line);
    return line;
}