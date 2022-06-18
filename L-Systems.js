/* ===============================================================================================================================================
   L-Systems.js

   Description
   This collection of scripts reproduces the p5.js examples with Adobe Illustrator's ExtendScript.
   However, since it is not interesting just to reproduce them, some of them are modified.

   p5.js
   https://p5js.org/examples/simulate-l-systems.html

   Usage
   run this script from File > Scripts > Other Script...

   Notes
   In rare cases, you may not be able to create it.
   In that case, restart Illustrator and run this script again.

   Requirements
   Illustrator CS6 or higher

   Version
   1.0.0

   Homepage
   github.com/sky-chaser-high/generative-art-with-illustrator

   License
   Released under the MIT license.
   https://opensource.org/licenses/mit-license.php
   =============================================================================================================================================== */

(function () {
    main();
})();


/**
 * main function
 */
function main() {
    var artboard = {
        width: 1920,
        height: 1080,
        center: { x: 0, y: 0 }
    };

    var title = 'L-Systems';
    var aw = 'Artwork';
    var bg = 'Background';

    var mode = DocumentColorSpace.RGB;


    // setup ----------------------------------------------------------------------
    if (app.documents.length == 0) {
        createDocument(title, artboard.width, artboard.height, mode);
    }
    else {
        artboard.width = app.activeDocument.width;
        artboard.height = app.activeDocument.height;
    }

    artboard.center.x = artboard.width / 2;
    artboard.center.y = artboard.height / 2;

    if (!existsLayer(bg)) {
        createLayer(bg);
        createBackground(bg, artboard.width, artboard.height, setRGBColor(26, 32, 38));
    }

    if (!existsLayer(aw)) {
        createLayer(aw);
    }


    // draw ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    var diameter = 30;
    var x = diameter / 2;
    var y = artboard.height - diameter / 2;

    var currentangle = 0;
    var step = 50;
    var angle = 90;

    var str = 'A';
    var loops = 5;

    var rules = [];
    rules[0] = ['A', '-BF+AFA+FB-'];
    rules[1] = ['B', '+AF-BFB-FA+'];

    var whereinstr = 0;

    for (var i = 0; i < loops; i++) {
        str = lindenmayer(str, rules);
    }

    var frame = 4500;

    for (var i = 0; i < frame; i++) {
        var pos = drawIt(str[whereinstr], aw, x, y, diameter, step, angle, currentangle);
        x = pos.x;
        y = pos.y;
        currentangle = pos.angle;
        whereinstr++;
        if (whereinstr > str.length - 1) whereinstr = 0;
    }


    app.executeMenuCommand('fitin');
}


/**
 * Interpret an L-system.
 * @param {string} s start of th string.
 * @param {string[][]} rules array for rules.
 * @returns {string} send out the modified string.
 */
function lindenmayer(s, rules) {
    var outputstr = '';
    for (var i = 0; i < s.length; i++) {
        var ismatch = 0;
        for (var j = 0; j < rules.length; j++) {
            if (s[i] == rules[j][0]) {
                outputstr += rules[j][1];
                ismatch = 1;
                break;
            }
        }
        if (ismatch == 0) outputstr += s[i];
    }
    return outputstr;
}


/**
 * Draws turtle commands.
 * @param {string} k
 * @param {string} layer
 * @param {number} x1
 * @param {number} y1
 * @param {number} d
 * @param {number} step
 * @param {number} angle
 * @param {number} deg
 * @returns {{x: number, y: number, angle: number}}
 */
function drawIt(k, layer, x1, y1, d, step, angle, deg) {
    var color;

    if (k == 'F') {
        color = setRGBColor(100);
        var x2 = x1 + step * Math.cos(deg * Math.PI / 180);
        var y2 = y1 + step * Math.sin(deg * Math.PI / 180);
        var line = createLine(layer, [[x1, y1 * -1], [x2, y2 * -1]], color);
        line.zOrder(ZOrderMethod.SENDTOBACK);
        x1 = x2;
        y1 = y2;
    }
    else if (k == '+') {
        deg += angle;
    }
    else if (k == '-') {
        deg -= angle;
    }

    color = setRGBColor(
        map(Math.random(), 0, 1, 128, 255),
        map(Math.random(), 0, 1, 0, 255),
        map(Math.random(), 0, 1, 50, 255)
    );

    var radius = 0;
    radius += d * Math.random();
    radius += d * Math.random();
    radius += d * Math.random();
    radius = radius / 3;
    createEllipse(layer, x1, y1 * -1, radius, radius, color);
    // createRect(layer, x1 - radius / 2, (y1 - radius / 2) * -1, radius, radius, color);

    return {
        x: x1,
        y: y1,
        angle: deg
    };
}


/**
 * Creates a new pathItem.
 * @param {string} layerName The name of the layer.
 * @param {number[]} points The array of [x, y] coordinate pairs
 * @param {Color} color The color of the PathItem.
 * @returns {PathItem}
 */
function createLine(layerName, points, color) {
    var layer = app.activeDocument.layers.getByName(layerName);
    var line = layer.pathItems.add();
    line.setEntirePath(points);
    line.filled = false;
    line.stroked = true;
    line.strokeColor = color;
    return line;
}


/**
 * Creates a new pathItem in the shape of an ellipse.
 * @param {string} layerName The name of the layer.
 * @param {number} x The x-coordinate of the center of the ellipse.
 * @param {number} y The y-coordinate of the center of the ellipse.
 * @param {number} width The width of the PathItem.
 * @param {number} height The height of the PathItem.
 * @param {Color} color The color of the PathItem.
 * @returns {PathItem}
 */
function createEllipse(layerName, x, y, width, height, color) {
    var layer = app.activeDocument.layers.getByName(layerName);
    var ellipse = layer.pathItems.ellipse(y + height / 2, x - width / 2, width, height);
    ellipse.stroked = false;
    ellipse.filled = true;
    ellipse.fillColor = color;
    return ellipse;
}


/**
 * Creates a new pathItem in the shape of an rectangle.
 * @param {string} layerName The name of the layer.
 * @param {number} x The left position of the path item.
 * @param {number} y The top position of the path item.
 * @param {number} width The width of the PathItem.
 * @param {number} height The height of the PathItem.
 * @param {Color} color The color of the PathItem.
 * @returns {PathItem}
 */
function createRect(layerName, x, y, width, height, color) {
    var layer = app.activeDocument.layers.getByName(layerName);
    var rect = layer.pathItems.rectangle(y, x, width, height);
    rect.stroked = false;
    rect.filled = true;
    rect.fillColor = color;
    return rect;
}


/**
 * Creates a background object in the document.
 * @param {string} layerName The name of the layer.
 * @param {number} width The width of the PathItem.
 * @param {number} height The height of the PathItem.
 * @param {Color} color The color of the PathItem.
 * @returns {PathItem}
 */
function createBackground(layerName, width, height, color) {
    var layer = app.activeDocument.layers.getByName(layerName);
    var bg = layer.pathItems.rectangle(0, 0, width, height);
    bg.stroked = false;
    bg.filled = true;
    bg.fillColor = color;
    return bg;
}


/**
 * Creates a new document.
 * @param {string} title The document title.
 * @param {number} width The width of this document.
 * @param {number} height The height of the document.
 * @param {DocumentColorSpace} mode The color space for the new document.
 * @returns {Document}
 */
function createDocument(title, width, height, mode) {
    var preset = new DocumentPreset();
    preset.title = title;
    preset.width = width;
    preset.height = height;
    preset.colorMode = mode;
    preset.units = RulerUnits.Points;
    var document = app.documents.addDocument(title, preset);
    var artboards = document.artboards;
    artboards[0].artboardRect = [0, 0, width, -height];
    return document;
}


/**
 * Creates a new layer in the document.
 * @param {string} name The name of the layer.
 * @returns {Layer}
 */
function createLayer(name) {
    var layer = app.activeDocument.layers.add();
    layer.name = name;
    layer.zOrder(ZOrderMethod.BRINGTOFRONT);
    return layer;
}


/**
 * Check if the layer exists.
 * @param {string} name The name of the layer.
 * @returns {boolean}
 */
function existsLayer(name) {
    try {
        app.activeDocument.layers.getByName(name);
        return true;
    }
    catch (e) {
        return false;
    }
}


/**
 * Setting a RGB color.
 * @param {number} r The red color value.
 * @param {number} [g] The green color value. Optional.
 * @param {number} [b] The blue color value. Optional.
 * @returns {RGBColor} RGBColor
 */
function setRGBColor(r, g, b) {
    if (g == undefined) g = r;
    if (b == undefined) b = r;
    var color = new RGBColor();
    color.red = r;
    color.green = g;
    color.blue = b;
    return color;
}


/**
 * Re-maps a number from one range to another.
 * @param {number} value The incoming value to be converted.
 * @param {number} start1 Lower bound of the value's current range.
 * @param {number} stop1 Upper bound of the value's current range.
 * @param {number} start2 Lower bound of the value's target range.
 * @param {number} stop2 Upper bound of the value's target range.
 * @returns {number} Remapped number.
 */
function map(value, start1, stop1, start2, stop2) {
    var distance1 = stop1 - start1;
    var value1 = value - start1;
    var ratio = value1 / distance1;
    var distance2 = stop2 - start2;
    var value2 = distance2 * ratio;
    return start2 + value2;
}
