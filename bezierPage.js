import bezierSketch from "./bezierSketch.js";

window.onload = function() {
    new p5((s) => bezierSketch(s), 'sketchContainer');
};
