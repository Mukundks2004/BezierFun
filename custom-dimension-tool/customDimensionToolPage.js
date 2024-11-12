import bezierSketch from "./customDimensionToolSketch.js";

window.onload = function() {
    new p5((s) => bezierSketch(s), 'sketchContainer');
};
