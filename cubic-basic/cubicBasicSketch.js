const SAMPLE_BEZIER_POINTS = [
    {x: 0, y: 0}, 
    {x: 0.1, y: 0.4}, 
    {x: 0.6, y: 0.3},
    {x: 1, y: 1}
];

const SIZE = 300;
const CIRCLE_SIZE = 12;
const MARGIN = 20;
const CIRCLE_COLOUR = 'yellow';
const START_COLOUR = 'red';
const END_COLOUR = 'maroon';
const POINT_SPEED = 0.008;

const bezierSketch = (s) => {
    let progress = 0.4;
    let moving = false;
    let direction = "";
    let firstControlX;
    let firstControlY;
    let secondControlX;
    let secondControlY;
    let checkBox;

    s.setup = () => {
        s.createCanvas(SIZE + 2 * MARGIN, SIZE + 2 * MARGIN);

        let f_button = s.createButton('Forwards!');
        let b_button = s.createButton('Backwards!');
        
        checkBox = s.createCheckbox();
        
        f_button.mousePressed(() => {
            if (direction !== "forwards") {
                moving = true;
                direction = "forwards";
            }
        });
        b_button.mousePressed(() => {
            if (direction !== "backwards") {
                moving = true;
                direction = "backwards";
            }
        });
        
        firstControlX = s.createSlider(0, 1, 0.25, 0);
        firstControlY = s.createSlider(0, 1, 0.25, 0);
        secondControlX = s.createSlider(0, 1, 0.75, 0);
        secondControlY = s.createSlider(0, 1, 0.75, 0);
        
        let offset = SIZE + 2 * MARGIN;
        checkBox.position(10, offset + 100);
        f_button.position(10, offset + 130);
        b_button.position(90, offset + 130);
        firstControlX.position(10, offset + 170);
        firstControlY.position(180, offset + 170);
        secondControlX.position(10, offset + 210);
        secondControlY.position(180, offset + 210);
    }
    
    s.draw = () => {
        //Draw bg
        s.background(220);

        //Draw boundary
        s.strokeWeight(3);
        s.fill(190);
        s.stroke('black');
        s.square(MARGIN, MARGIN, SIZE);

        //Get total bezier info
        let scaledPoints = [
            {x: 0, y: 0},
            {x: firstControlX.value() * SIZE, y: firstControlY.value() * SIZE},
            {x: secondControlX.value() * SIZE, y: secondControlY.value() * SIZE},
            {x: SIZE, y: SIZE}
        ];

        //Draw first bezier
        s.stroke(START_COLOUR);
        s.noFill();
        let dividedBezier = deCasteljauSubdivide(...scaledPoints, progress)
        let translatedDividedBezier = dividedBezier.map(point => ({
            x: point.x + MARGIN, y: point.y + MARGIN
        }));
        bezierFromPointList(translatedDividedBezier, s);

        //Draw second bezier
        s.stroke(END_COLOUR);
        let reversedPoints = [...scaledPoints].reverse();
        dividedBezier = deCasteljauSubdivide(...reversedPoints, (1 - progress))
        translatedDividedBezier = dividedBezier.map(point => ({
            x: point.x + MARGIN, y: point.y + MARGIN
        }));
        bezierFromPointList(translatedDividedBezier, s);
        
        //Draw circle
        s.fill(CIRCLE_COLOUR);
        s.noStroke();
        let travellingPointX = (1 - progress) ** 3 * scaledPoints[0].x + 3 * (1 - progress) ** 2 * progress * scaledPoints[1].x + 3 * (1 - progress) * progress ** 2 * scaledPoints[2].x + progress ** 3 * scaledPoints[3].x;
        let travellingPointY = (1 - progress) ** 3 * scaledPoints[0].y + 3 * (1 - progress) ** 2 * progress * scaledPoints[1].y + 3 * (1 - progress) * progress ** 2 * scaledPoints[2].y + progress ** 3 * scaledPoints[3].y;
        s.ellipse(MARGIN + travellingPointX, MARGIN + travellingPointY, CIRCLE_SIZE);

        //Draw controls
        if (checkBox.checked()) {
            s.fill(0);
            s.circle(scaledPoints[1].x + MARGIN, scaledPoints[1].y + MARGIN, CIRCLE_SIZE);
            s.circle(scaledPoints[2].x + MARGIN, scaledPoints[2].y + MARGIN, CIRCLE_SIZE);
        }

        if (moving) {
            if (direction === "forwards") {
                progress += POINT_SPEED;
            }
            else if (direction === "backwards") {
                progress -= POINT_SPEED;
            }
            if (progress > 1) {
                moving = false;
            }
            else if (progress < 0) {
                moving = false;
            }
        }
    }

    function bezierFromPointList(pointList, sketch) {
        sketch.bezier(
            pointList[0].x,
            pointList[0].y,
            pointList[1].x,
            pointList[1].y,
            pointList[2].x,
            pointList[2].y,
            pointList[3].x,
            pointList[3].y,
        )
    }

    function linearInterpolate(firstPoint, secondPoint, ratio) {
        return {
            x: (1 - ratio) * firstPoint.x + ratio * secondPoint.x,
            y: (1 - ratio) * firstPoint.y + ratio * secondPoint.y
        };
    }

    function deCasteljauSubdivide(P0, P1, P2, P3, progress) {
        let P0_1 = linearInterpolate(P0, P1, progress);
        let P1_1 = linearInterpolate(P1, P2, progress);
        let P2_1 = linearInterpolate(P2, P3, progress);
        
        let P0_2 = linearInterpolate(P0_1, P1_1, progress);
        let P1_2 = linearInterpolate(P1_1, P2_1, progress);
        
        let P0_3 = linearInterpolate(P0_2, P1_2, progress);

        return [P0, P0_1, P0_2, P0_3];
    }
}

export default bezierSketch;