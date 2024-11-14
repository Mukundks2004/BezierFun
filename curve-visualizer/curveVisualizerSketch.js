const SIZE = 300;
const CIRCLE_RADIUS = 12;
const MARGIN = 20;
const POINT_COLOUR = '#00AA00';
const LINE_COLOUR = '#00DD00';
const LINE_WIDTH = 4;
const EPIC_POINT_COLOUR = '#DD0000';

const bezierSketch = (s) => {
    let deleteModeCheckbox;
    let invisibleModeCheckbox;
    let circles = [];
    let currentCircleDragged = null;
    let points;

    s.setup = () => {
        
        s.createCanvas(SIZE + 2 * MARGIN, SIZE + 2 * MARGIN);
        deleteModeCheckbox = s.createCheckbox();
        invisibleModeCheckbox = s.createCheckbox();
        let offset = SIZE + 2 * MARGIN;
        deleteModeCheckbox.position(100, offset + 100);
        invisibleModeCheckbox.position(110, offset + 134);

    }
    
    s.draw = () => {
        s.background(220);

        //Draw boundary
        s.strokeWeight(3);
        s.fill(190);
        s.stroke('black');
        s.square(MARGIN, MARGIN, SIZE);

        //Draggable
        if (!deleteModeCheckbox.checked() && currentCircleDragged !== null) {
            if (MARGIN > s.mouseX) {
                currentCircleDragged.x = MARGIN;
            } 
            else if (s.mouseX > MARGIN + SIZE)
            {
                currentCircleDragged.x = MARGIN + SIZE;
            }
            else {
                currentCircleDragged.x = s.mouseX;
            }
            if (MARGIN > s.mouseY) {
                currentCircleDragged.y = MARGIN;
            } 
            else if (s.mouseY > MARGIN + SIZE)
            {
                currentCircleDragged.y = MARGIN + SIZE;
            }
            else {
                currentCircleDragged.y = s.mouseY;
            }
        }
        
        drawBezier(circles);
        if (!invisibleModeCheckbox.checked()) {
            s.strokeWeight(LINE_WIDTH / 2);
            s.stroke(LINE_COLOUR);
            if (circles.length > 2) {
                for (let r = 0; r < circles.length - 1; r++) {
                    s.line(circles[r].x, circles[r].y, circles[r + 1].x, circles[r + 1].y);
                }
            }
        }
        
        //Draw circles
        if (!invisibleModeCheckbox.checked()) {
            s.fill(POINT_COLOUR);
            s.stroke(POINT_COLOUR);
            for (var circle of circles) {
                s.ellipse(circle.x, circle.y, CIRCLE_RADIUS, CIRCLE_RADIUS);
            }
        }
    }

    function drawBezier(points) {
        if (points.length < 2) {
            return;
        }

        s.noFill();
        s.stroke(0);
        s.strokeWeight(LINE_WIDTH);
        s.beginShape();
        
        let n = points.length - 1;
        let step = 0.01;
      
        for (let t = 0; t <= 1; t += step) {
            let tempPoints = [...points];
            
            for (let r = 1; r <= n; r++) {
                for (let i = 0; i <= n - r; i++) {
                    tempPoints[i] = {
                        x: s.lerp(tempPoints[i].x, tempPoints[i + 1].x, t),
                        y: s.lerp(tempPoints[i].y, tempPoints[i + 1].y, t)
                    };
                }
            }
        
            s.vertex(tempPoints[0].x, tempPoints[0].y);
        }
      
        s.endShape();
    }

    s.mousePressed = () => {
        if (s.mouseX < MARGIN || s.mouseY < MARGIN || s.mouseX > MARGIN + SIZE || s.mouseY > MARGIN + SIZE) {
            return;
        }
        
        let isDeleteMode = deleteModeCheckbox.checked();

        if (!isDeleteMode) {
            s.cursor("grab");
        }

        for (let i = 0; i < circles.length; i++) {
            if (s.dist(circles[i].x, circles[i].y, s.mouseX, s.mouseY) <= CIRCLE_RADIUS) {
                if (isDeleteMode) {
                    circles.splice(i, 1);
                    return;
                }
                currentCircleDragged = circles[i];
                return;
            }
        }

        //Make a new circle and select it
        if (!isDeleteMode) {
            circles.push({x: s.mouseX, y: s.mouseY});
            currentCircleDragged = circles.slice(-1)[0] ;
        }
    }

    s.mouseReleased = () => {
        if (currentCircleDragged !== null) {
            currentCircleDragged = null;
        }
        s.cursor(s.ARROW);
    }
}

export default bezierSketch;