const SIZE = 300;
const CIRCLE_RADIUS = 12;
const MARGIN = 20;

const bezierSketch = (s) => {
    let circles = [];
    let currentCircleDragged = null;

    s.setup = () => {
        s.createCanvas(SIZE + 2 * MARGIN, SIZE + 2 * MARGIN); 
    }
    
    s.draw = () => {
        s.background(220);

        //Draw boundary
        s.strokeWeight(3);
        s.fill(190);
        s.stroke('black');
        s.square(MARGIN, MARGIN, SIZE);

        //Draw circles
        s.fill(0);
        for (var circle of circles) {
            s.ellipse(circle.x, circle.y, CIRCLE_RADIUS, CIRCLE_RADIUS);
        }

        //Draggable
        if (currentCircleDragged !== null) {
            currentCircleDragged.x = s.mouseX;
            currentCircleDragged.y = s.mouseY;
        }

    }

    s.mousePressed = () => {
        if (s.mouseX < MARGIN || s.mouseY < MARGIN || s.mouseX > MARGIN + SIZE || s.mouseY > MARGIN + SIZE) {
            return;
        }

        s.cursor("grab");

        //Select circle if it already exists
        for (var circle of circles) {
            if (s.dist(circle.x, circle.y, s.mouseX, s.mouseY) <= CIRCLE_RADIUS) {
                currentCircleDragged = circle;
                return
            }
        }

        //Make a new circle and select it
        circles.push({x: s.mouseX, y: s.mouseY});
        currentCircleDragged = circles.slice(-1)[0] ;
    }

    s.mouseReleased = () => {
        if (currentCircleDragged !== null) {
            currentCircleDragged = null;
        }
        s.cursor(s.ARROW);
    }
}

export default bezierSketch;