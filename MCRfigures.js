class MCRfigures 
{
    MCRfigures()
    {
        this.elements = [];
    }

    add(figure)
    {
        this.elements.push(figure);
    }

    draw()
    {
        for (figure in this.elements)
        {
            figure.draw();
        }
    }
}