function distancePointToLine(point, line) {
    let x1 = line.p1.x;
    let y1 = line.p1.y;
    let x2 = line.p2.x;
    let y2 = line.p2.y;

    if ((x2 - x1) == 0) {
        console.log("Defaulting");
        if (point.y > max(y1, y2) || point.y < min(y1, y2))
        {
            return Infinity;
        }
        return abs(point.x - x1);
    }

    let m = (y2 - y1) / (x2 - x1);
    let b = y1 - (m * x1);

    // Distance from point to continuous line. This does not solve the problem, since we are
    // dealing with line segments. We must now determine the point of intersection to see if
    // it lies on the segment.
    let dist = (abs( (-m * point.x) + (point.y) - b) ) / (sqrt( (m * m) + 1 ));

    console.log(`dist: ${dist}`);

    let angle = line.angle() + 90;

    console.log(`${dist} * cos(${angle} = ${dist * cos(angle)})`);
    console.log(`${dist} * sin(${angle} = ${dist * sin(angle)})`);

    intersection = createVector(point.x + (dist * cos(angle)), point.y + (dist * sin(angle)));

    console.log(`Intersection point: ${floor(intersection.x)}, ${floor(intersection.y)}`);

    // If point does not lie on line, add some random amount to add distance. This will ensure
    // only the closest line segment will be chosen, since it will not trigger this addition
    if (intersection.x < min(x1, x2) || intersection.x > max(x1, x2) || intersection.y < min(y1, y2) || intersection.y > max(y1, y2))
    {
        dist += 100;
    }

    return dist;

}

class MCRfigures {
    constructor() {
        this.elements = [];
    }

    add(figure) {
        this.elements.push(figure);
    }

    draw() {
        for (let figure of this.elements) {
            figure.draw();
        }
    }

    closestLine(p1) {
        let closest;
        let minDistance = Infinity;
        for (let figure of this.elements) {
            if (figure instanceof MCRline) {
                let curDistance = distancePointToLine(p1, figure);
                if (curDistance < minDistance) {
                    minDistance = curDistance;
                    closest = figure;
                }
            }
        }
        return closest;
    }

    closestPoint(p1) {
        console.log("Finding closest point...");
    }
}

class MCRline {
    constructor(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
    }

    draw() {
        line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }

    drawSelected() {
        push();
        strokeWeight(2);
        stroke(255, 0, 0);
        this.draw();
        pop();
    }

    angle() {
        let x = this.p2.x - this.p1.x;
        let y = this.p2.y - this.p1.y;

        return atan(y / x);
    }
}

class MCRpoint {
    constructor(p1, symbol = "") {
        this.p1 = p1;
        this.symbol = symbol;

    }

    draw() {
        text(this.symbol, this.p1.x, this.p1.y);
    }

}

let DEBUG = true;

let WHITE = (255, 255, 255);

let LINE = 0;

let MODE = LINE;

let SELECT = false;

let SELECT_PRESSED = false;
let SELECT_RADIO_PRESSED = false;

let DRAWING = false;
let RESET = false;

let startPoint;
let figures = new MCRfigures();
let selection;

let clearButton;
let selectButton;
let selectionRadio;

function setup() {
    createCanvas(windowWidth / 2, windowHeight / 1.05);
    angleMode(DEGREES);
    stroke(0);
    clearButton = createButton("clear");
    clearButton.position(0, 0);
    clearButton.mousePressed(() => {
        RESET = true;
    })

    selectionRadio = createRadio();
    selectionRadio.mousePressed(() => {
        SELECT_RADIO_PRESSED = true;
    })
    selectionRadio.option("points");
    selectionRadio.option("lines");
    selectionRadio.selected("points");
    selectionRadio.position(80, 30);
    selectionRadio.hide();

    selectButton = createButton(" DRAW ");
    selectButton.position(0, 30);
    selectButton.mousePressed(() => {
        SELECT_PRESSED = true;
    })
}

function draw() {
    background(WHITE);
    figures.draw();
    if (selection != null) {
        selection.drawSelected();
    }

    if (DRAWING) {
        line(startPoint.x, startPoint.y, mouseX, mouseY);
    }

    if (DEBUG) {
        text(`Mouse: ${floor(mouseX)}, ${floor(mouseY)}`, 0, 20);
    }
}

function mouseClicked() {
    if (RESET) {
        DRAWING = false;
        figures = new MCRfigures();
        RESET = false;
        selection = null;
        return;
    }

    if (SELECT_PRESSED) {
        if (SELECT) {
            SELECT = false;
            selectButton.html(" DRAW ");
            selectionRadio.hide();
        } else {
            SELECT = true;
            selectButton.html("SELECT");
            selectionRadio.show();
        }
        SELECT_PRESSED = false;
        return;
    }

    if (SELECT_RADIO_PRESSED) {
        SELECT_RADIO_PRESSED = false;
        return;
    }

    // Main actions
    if (SELECT) {
        if (selectionRadio.value() == "lines") {
            selection = figures.closestLine(createVector(mouseX, mouseY));
        } else {
            figures.closestPoint();
        }
    } else {
        if (DRAWING) {
            let secondPoint = createVector(mouseX, mouseY);
            figures.add(new MCRpoint(startPoint))
            figures.add(new MCRline(startPoint, secondPoint));
            figures.add(new MCRpoint(secondPoint));
            // console.log(`Added line to figures, count of figures now ${figures.elements.length}`);
            DRAWING = false;
        } else {
            startPoint = createVector(mouseX, mouseY);
            // console.log(`Start point at ${startPoint.x}, ${startPoint.y}`);
            DRAWING = true;
        }
    }
}
