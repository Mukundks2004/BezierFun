const SIZE = 300;
const CIRCLE_RADIUS = 12;
const MARGIN = 20;
const POINT_COLOUR = '#AA0000';
const LINE_COLOUR = '#DD0000';
const EPIC_POINT_COLOUR = '#DDFF00';
const LINE_WIDTH = 4;

const bezierSketch = (s) => {
    let deleteModeCheckbox;
    let showLinesCheckbox;
    // let justBezierCheckbox;
    let circles = [];
    let currentCircleDragged = null;
    let t = 0;

    s.setup = () => {
        s.createCanvas(SIZE + 2 * MARGIN, SIZE + 2 * MARGIN);

        deleteModeCheckbox = s.createCheckbox();
        showLinesCheckbox = s.createCheckbox();

        let offset = SIZE + 2 * MARGIN;
        deleteModeCheckbox.position(100, offset + 100);
        showLinesCheckbox.position(100, offset + 134);
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
          
        let bezierPoint = getBezierPoint(circles, t);

        //Draw circles
        s.fill(POINT_COLOUR);
        s.stroke(POINT_COLOUR);
        for (var circle of circles) {
            s.ellipse(circle.x, circle.y, CIRCLE_RADIUS, CIRCLE_RADIUS);
        }

        if (bezierPoint !== undefined && circles.length > 1) {
            s.fill(EPIC_POINT_COLOUR);
            s.stroke(EPIC_POINT_COLOUR);
            s.strokeWeight(3);

            s.ellipse(bezierPoint.x, bezierPoint.y, CIRCLE_RADIUS, CIRCLE_RADIUS);
              
            t += 0.005;
            if (t > 1) t = 0;
        }
          
    }

    function getBezierPoint(points, t) {
        let tempPoints = [...points];
        s.stroke(LINE_COLOUR);
        s.strokeWeight(LINE_WIDTH / 2);
        
        while (tempPoints.length > 1)
        {
            let nextPoints = [];
            for (let i = 0; i < tempPoints.length - 1; i++) {
                if (showLinesCheckbox.checked()) {
                    s.line(tempPoints[i].x, tempPoints[i].y, tempPoints[i+1].x, tempPoints[i+1].y);
                }
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