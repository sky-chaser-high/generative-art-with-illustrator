/* ===============================================================================================================================================
   Array2D.js

   Description
   This collection of scripts reproduces the p5.js examples with Adobe Illustrator's ExtendScript.
   However, since it is not interesting just to reproduce them, some of them are modified.

   p5.js
   https://p5js.org/examples/arrays-array-2d.html

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

var seed = noiseSeed(Math.random());

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

    var title = 'Array 2D';
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
    var distances = [];
    var maxDistance = dist(artboard.center.x, artboard.center.y, artboard.width, artboard.height);
    var diameter = 5;
    var spacer = diameter * 4;
    var noiseScale = 0.03;

    for (var x = 0; x < artboard.width; x++) {
        distances[x] = [];
        for (var y = 0; y < artboard.height; y++) {
            var distance = dist(artboard.center.x, artboard.center.y, x, y);
            distances[x][y] = (distance / maxDistance) * 512;
        }
    }

    for (var x = 0; x < artboard.width; x += spacer) {
        for (var y = 0; y < artboard.height; y += spacer) {
            var r = Math.abs(noise(y * noiseScale, artboard.width * noiseScale) * distances[x][y]);
            var g = Math.abs(noise(x * noiseScale, artboard.width * noiseScale) * distances[x][y]);
            var b = Math.abs(noise(artboard.height * noiseScale, artboard.width * noiseScale) * distances[x][y]);
            if (r > 255) r = 255;
            if (g > 255) g = 255;
            if (b > 255) b = 255;
            var color = setRGBColor(r, g, b);
            createEllipse(aw, x + spacer / 2, (y + spacer / 2) * -1, diameter, diameter, color);
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
 * Calculates the distance between two points, in either two dimensions.
 * @param {number} x1 The x-coordinate of the first point.
 * @param {number} y1 The y-coordinate of the first point.
 * @param {number} x2 The x-coordinate of the second point.
 * @param {number} y2 The y-coordinate of the second point.
 * @returns {number} Distance between the two points.
 */
function dist(x1, y1, x2, y2) {
    var x = x2 - x1;
    var y = y2 - y1;
    return Math.sqrt(x * x + y * y);
}


/**
 * Returns the Perlin noise value at specified coordinates.
 * @param {number} x x-coordinate in noise space.
 * @param {number} y y-coordinate in noise space.
 * @returns {number} Perlin noise value (between 0 and 1) at specified coordinates.
 */
function noise(x, y) {
    var X = Math.floor(x);
    var Y = Math.floor(y);

    x = x - X;
    y = y - Y;

    X = X & 255;
    Y = Y & 255;

    var n00 = dot(seed.grad[X + seed.perm[Y]], x, y);
    var n01 = dot(seed.grad[X + seed.perm[Y + 1]], x, y - 1);
    var n10 = dot(seed.grad[X + 1 + seed.perm[Y]], x - 1, y);
    var n11 = dot(seed.grad[X + 1 + seed.perm[Y + 1]], x - 1, y - 1);

    var u = fade(x);

    return lerp(
        lerp(n00, n10, u),
        lerp(n01, n11, u),
        fade(y)
    );
}


/**
 * fractional Brownian motion, fBm.
 * @param {number} x x-coordinate in noise space.
 * @param {number} y y-coordinate in noise space.
 * @param {number} octaves
 * @param {number} falloff
 * @returns {number}
 */
function fbm(x, y, octaves, falloff) {
    var sum = 0.0;
    var freq = 1.0;
    var amp = 1.0;
    var max = 0.0;
    for (var o = 0; o < octaves; o++) {
        sum += noise(x * freq, y * freq) * amp;
        max += amp;
        amp *= falloff;
        freq *= 2.0;
    }
    return sum / max;
}


/**
 * Sets the seed value for noise().
 * @param {number} s The seed value.
 * @returns {object}
 */
function noiseSeed(s) {
    var seed = {
        perm: [], // new Array(512),
        grad: []  // new Array(512)
    };

    var p = [
        151, 160, 137, 91, 90, 15, 131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30,
        69, 142, 8, 99, 37, 240, 21, 10, 23, 190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62,
        94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33, 88, 237, 149, 56, 87, 174, 20, 125, 136,
        171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166, 77, 146, 158, 231, 83, 111, 229, 122,
        60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244, 102, 143, 54, 65, 25, 63, 161,
        1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196, 135, 130, 116, 188, 159, 86,
        164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123, 5, 202, 38, 147, 118, 126,
        255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42, 223, 183, 170, 213,
        119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9, 129, 22, 39, 253,
        19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228, 251, 34, 242, 193,
        238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107, 49, 192, 214, 31,
        181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254, 138, 236, 205, 93,
        222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
    ];

    var g = [
        { x: 1, y: 1 }, { x: -1, y: 1 },
        { x: 1, y: -1 }, { x: -1, y: -1 },
        { x: 1, y: 0 }, { x: -1, y: 0 },
        { x: 0, y: 1 }, { x: 0, y: -1 }
    ];

    if (s > 0 && s < 1) {
        s *= 65536;
    }

    s = Math.floor(s);
    if (s < 256) {
        s |= s << 8;
    }

    for (var i = 0; i < 256; i++) {
        var v;
        if (i & 1) {
            v = p[i] ^ (s & 255);
        }
        else {
            v = p[i] ^ ((s >> 8) & 255);
        }

        seed.perm[i] = seed.perm[i + 256] = v;
        seed.grad[i] = seed.grad[i + 256] = g[v % 8];
    }

    return seed;
}


/**
 * Dot product.
 * @param {vector} g { x: number, y: number }
 * @param {number} x x-coordinate in noise space.
 * @param {number} y y-coordinate in noise space.
 * @returns {number} Dot product value.
 */
function dot(g, x, y) {
    return g.x * x + g.y * y;
}


/**
 * Linear interpolate the vector to another vector
 * @param {number} a
 * @param {number} b
 * @param {number} t The amount of interpolation.
 * @returns {number} Lerped value.
 */
function lerp(a, b, t) {
    return (1 - t) * a + t * b;
}


/**
 * fade function.
 * @param {number} t
 * @returns {number} Lerped value.
 */
function fade(t) {
    return t * t * t * (t * (t * 6 - 15) + 10);
}
