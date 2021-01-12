class MCRfigures 
{
    constructor()
    {
        this.elements = [];
    }

    add(figure)
    {
        this.elements.push(figure);
    }

    draw()
    {
        for (let figure of this.elements)
        {
            figure.draw();
        }
    }
}

class MCRline
{
    constructor(p1, p2)
    {
        this.p1 = p1;
        this.p2 = p2;
    }

    draw()
    {
        line(this.p1.x, this.p1.y, this.p2.x, this.p2.y);
    }
}

class MCRpoint
{
    constructor(p1, symbol = "")
    {
        this.p1 = p1;
        this.symbol = symbol;
    }

    draw()
    {
        text(this.symbol, this.p1.x, this.p1.y);
    }

}

let WHITE = (255, 255, 255);

let LINE = 0;

let MODE = LINE;

let DRAWING = false;
let RESET = false;

let startPoint;
let figures = new MCRfigures();

function setup() {
  createCanvas(windowWidth / 2, windowHeight / 1.05);
  strokeWeight(5);
  stroke(0);
  let clearButton = createButton("clear");
  clearButton.position(0, 0);
  clearButton.mousePressed(() => {
      RESET = true;
  })
}

function draw() {
  background(WHITE);
  figures.draw();

  if (DRAWING)
  {
      line(startPoint.x, startPoint.y, mouseX, mouseY);
  }
}

function mouseClicked() {
    if (RESET)
    {
        DRAWING = false;
        figures = new MCRfigures();
        RESET = false;
        return;
    }

    if (DRAWING)
    {
        figures.add(new MCRline(startPoint, createVector(mouseX, mouseY)));
        console.log(`Added line to figures, count of figures now ${figures.elements.length}`);
        DRAWING = false;
    } else {
        startPoint = createVector(mouseX, mouseY);
        console.log(`Start point at ${startPoint.x}, ${startPoint.y}`);
        DRAWING = true;
    }
}
