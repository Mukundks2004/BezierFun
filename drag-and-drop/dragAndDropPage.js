import bezierSketch from "./dragAndDropSketch.js";

window.onload = function() {
    new p5((s) => bezierSketch(s), 'sketchContainer');
};
