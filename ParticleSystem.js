/* ===============================================================================================================================================
   ParticleSystem.js

   Description
   This collection of scripts reproduces the p5.js examples with Adobe Illustrator's ExtendScript.
   However, since it is not interesting just to reproduce them, some of them are modified.

   p5.js
   https://p5js.org/examples/simulate-particle-system.html

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

    var title = 'Particle System';
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
    var acceleration = {
        x: 0.0,
        y: 0.1
    };
    var velocity = {
        min: { x: -18, y: -8 },
        max: { x: 18, y: 16 }
    };
    var position = {
        x: artboard.center.x,
        y: artboard.height / 4
    };
    var diameter = 14;

    var frame = 1500;
    var step = 10;

    var system = ParticleSystem(acceleration, velocity, position);

    for (var i = 0; i < frame; i += step) {
        var color = setRGBColor(255);
        addParticle(system);
        run(aw, system.particles, diameter, color);
    }


    app.executeMenuCommand('fitin');
}


/**
 * A simple Particle object.
 * @param {{ x: number, y: number }} acceleration acceleration of particle.
 * @param {{ min: { x: number, y: number }, max: { x: number, y: number }}} velocity velocity of particle.
 * @param {{ x: number, y: number }} position position of particle.
 * @returns {{ acceleration: { x: number, y: number }, velocity: { x: number, y: number }, position: { x: number, y: number }, lifespan: number }}
 */
function Particle(acceleration, velocity, position) {
    return {
        acceleration: vector(acceleration.x, acceleration.y),
        velocity: vector(map(Math.random(), 0, 1, velocity.min.x, velocity.max.x), map(Math.random(), 0, 1, velocity.min.y, velocity.max.y)),
        position: vector(position.x, position.y),
        lifespan: 100
    };
}


/**
 * Function to update position.
 * @param {Particle} particle Particle.
 */
function update(particle) {
    particle.velocity = add(particle.velocity, particle.acceleration);
    particle.position = add(particle.position, particle.velocity);
    particle.lifespan -= 2;
}


/**
 * Function to display.
 * @param {string} layer Layer name.
 * @param {Particle} particle Particle.
 * @param {number} size a particle diameter.
 * @param {Color} color a particle color.
 */
function display(layer, particle, size, color) {
    createEllipse(
        layer,
        particle.position.x,
        particle.position.y * -1,
        size,
        size,
        color
    );
}


/**
 * @param {Particle} particle Particle.
 * @returns {boolean}
 */
function isDead(particle) {
    return particle.lifespan < 0;
}


/**
 * @param {{ x: number, y: number }} acceleration acceleration of particle.
 * @param {{ min: { x: number, y: number }, max: { x: number, y: number }}} velocity velocity of particle.
 * @param {{ x: number, y: number }} position position of particle.
 * @returns {{ acceleration: { x: number, y: number }, velocity: { x: number, y: number }, position: { x: number, y: number }, particles: Particle[] }}
 */
function ParticleSystem(acceleration, velocity, position) {
    return {
        acceleration: acceleration,
        velocity: velocity,
        position: position,
        particles: []
    };
}


/**
 * @param {ParticleSystem} system ParticleSystem.
 */
function addParticle(system) {
    system.particles.push(
        Particle(system.acceleration, system.velocity, system.position)
    );
}


/**
 * @param {string} layer Layer name.
 * @param {Particle[]} particles Particles.
 * @param {number} size a particle diameter.
 * @param {Color} color a particle color.
 */
function run(layer, particles, size, color) {
    for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        var s = map(i, 0, particles.length, 1, size);

        update(p);
        display(layer, p, (size + 1) - s, color);

        if (color.red > 4) color.red -= Math.random() * 5;
        if (color.green > 4) color.green -= Math.random() * 5;

        if (isDead(p)) {
            particles.splice(i, 1);
        }
    }
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


/**
 * Creates a new vector object.
 * @param {number} x x component of the vector.
 * @param {number} y y component of the vector.
 * @returns {{x: number, y: number}} the vector object.
 */
function vector(x, y) {
    return {
        x: x,
        y: y
    };
}


/**
 * Gets a copy of the vector object.
 * @param {{x: number, y: number}} v
 * @returns {{x: number, y: number}} the copy of the vector object.
 */
function clone(v) {
    return {
        x: v.x,
        y: v.y
    };
}


/**
 * Adds one vector to another.
 * @param {{x: number, y: number}} a a vector object to add.
 * @param {{x: number, y: number}} b a vector object to add.
 * @returns {{x: number, y: number}} the vector object.
 */
function add(a, b) {
    var v = clone(a);
    v.x += b.x;
    v.y += b.y;
    return v;
}
