import bezierSketch from "./higherDegreeSketch.js";

window.onload = function() {
    new p5((s) => bezierSketch(s), 'sketchContainer');
};
