/* ===============================================================================================================================================
   Relativity.js

   Description
   This collection of scripts reproduces the p5.js examples with Adobe Illustrator's ExtendScript.
   However, since it is not interesting just to reproduce them, some of them are modified.

   p5.js
   https://p5js.org/examples/color-relativity.html

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

    var title = 'Relativity';
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
    var colors = [];
    var len = 8;
    for (var i = 0; i < len; i++) {
        var color = setRGBColor(
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        );
        colors.push(color);
    }

    var barWidth = artboard.width / 128;
    var rows = 4;
    for (var i = 0; i < artboard.height; i += artboard.height / rows) {
        drawBand(aw, shuffle(colors), i * -1, barWidth, artboard.height / rows, artboard.width);
    }


    app.executeMenuCommand('fitin');
}


/**
 * Draw the band.
 * @param {string} layer Layer name.
 * @param {Color[]} colorOrder Bar color.
 * @param {number} ypos The y-coordinate of the bar.
 * @param {number} barWidth Bar width.
 * @param {number} barHeight Bar height.
 * @param {number} stageWidth Artboard width.
 */
function drawBand(layer, colorOrder, ypos, barWidth, barHeight, stageWidth) {
    var num = colorOrder.length;
    for (var i = 0; i < stageWidth; i += barWidth * num) {
        for (var j = 0; j < num; j++) {
            createRect(layer, i + j * barWidth, ypos, barWidth, barHeight, colorOrder[j]);
        }
    }
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
 * Shuffle function.
 * @param {Array} array
 * @returns {Array}
 */
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }
    return array;
}
