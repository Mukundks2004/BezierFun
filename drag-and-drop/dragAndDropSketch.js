const SIZE = 300;
const CIRCLE_RADIUS = 12;
const MARGIN = 20;
const POINT_COLOUR = '#AA0000';
const LINE_COLOUR = '#777777';

const bezierSketch = (s) => {
    let deleteModeCheckbox;
    let circles = [];
    let currentCircleDragged = null;
    let t = 0;

    s.setup = () => {
        deleteModeCheckbox = s.createCheckbox();

        s.createCanvas(SIZE + 2 * MARGIN, SIZE + 2 * MARGIN);

        let offset = SIZE + 2 * MARGIN;
        deleteModeCheckbox.position(100, offset + 100);

        // points.push(s.createVector(10, 30)); // Point 1
        // points.push(s.createVector(20, 10)); // Point 2
        // points.push(s.createVector(30, 5));  // Point 3
        // points.push(s.createVector(40, 20)); // Point 4
        // points.push(s.createVector(50, 30)); // Point 5
    }
    
    s.draw = () => {
        s.background(220);

        //Draw boundary
        s.strokeWeight(3);
        s.fill(190);
        s.stroke('black');
        s.square(MARGIN, MARGIN, SIZE);

        //Draw lines
        s.stroke(LINE_COLOUR);
        for (let i = 0; i < circles.length - 1; i++) {
            s.line(circles[i].x, circles[i].y, circles[i+1].x, circles[i+1].y);
        }

        //Draw circles
        s.fill(POINT_COLOUR);
        s.stroke(POINT_COLOUR);
        for (var circle of circles) {
            s.ellipse(circle.x, circle.y, CIRCLE_RADIUS, CIRCLE_RADIUS);
        }

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

        

        for (let i = 0; i < circles.length - 1; i++) {
            s.line(circles[i].x, circles[i].y, circles[i + 1].x, circles[i + 1].y);
        }
          
        let bezierPoint = getBezierPoint(circles, t);

        if (bezierPoint !== undefined) {
            s.fill(255, 255, 0);
            s.ellipse(bezierPoint.x, bezierPoint.y, CIRCLE_RADIUS, CIRCLE_RADIUS);
              
            t += 0.005;
            if (t > 1) t = 0;
        }
          
    }

    function getBezierPoint(points, t) {
        let tempPoints = [...points];
        
        while (tempPoints.length > 1)
        {
            let nextPoints = [];
            for (let i = 0; i < tempPoints.length - 1; i++) {
                let x = s.lerp(tempPoints[i].x, tempPoints[i + 1].x, t);
                let y = s.lerp(tempPoints[i].y, tempPoints[i + 1].y, t);
                nextPoints.push(s.createVector(x, y));
            }
            tempPoints = nextPoints;
        }
        
        return tempPoints[0];
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