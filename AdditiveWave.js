/* ===============================================================================================================================================
   AdditiveWave.js

   Description
   This collection of scripts reproduces the p5.js examples with Adobe Illustrator's ExtendScript.
   However, since it is not interesting just to reproduce them, some of them are modified.

   p5.js
   https://p5js.org/examples/math-additive-wave.html

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

    var title = 'Additive Wave';
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
    var waves = 5;
    var diameter = 8;
    var xspacing = diameter;
    var w = artboard.width + diameter;
    var maxwaves = 6;
    var theta = 0.0;
    var amplitude = [];
    var dx = [];
    var yvalues;

    for (var wave = 0; wave < waves; wave++) {
        for (var i = 0; i < maxwaves; i++) {
            amplitude[i] = map(Math.random(), 0, 1, 10, 30);
            var period = map(Math.random(), 0, 1, 100, 300);
            dx[i] = Math.PI * 2 / period * xspacing;
        }

        yvalues = new Array(Math.floor(w / xspacing));
        for (var i = 0; i < yvalues.length; i++) {
            yvalues[i] = 0;
        }

        for (var j = 0; j < maxwaves; j++) {
            var x = theta;
            for (var i = 0; i < yvalues.length; i++) {
                if (j % 2 == 0) {
                    yvalues[i] += Math.sin(x) * amplitude[j];
                }
                else {
                    yvalues[i] += Math.cos(x) * amplitude[j];
                }
                x += dx[j];
            }
        }

        var color = setRGBColor(
            Math.random() * 255,
            Math.random() * 255,
            Math.random() * 255
        );
        var ypos = artboard.height / (waves + 1);
        for (var x = 0; x < yvalues.length; x++) {
            var y = (ypos + (ypos * wave) + yvalues[x]) * -1;
            createEllipse(aw, x * xspacing, y, diameter, diameter, color);
        }
    }


    app.executeMenuCommand('fitin');
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
