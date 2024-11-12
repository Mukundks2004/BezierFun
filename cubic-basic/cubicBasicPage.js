import bezierSketch from "./cubicBasicSketch.js";

window.onload = function() {
    new p5((s) => bezierSketch(s), 'sketchContainer');
};
