export default class MCRline
{
    MCRline(p1, p2)
    {
        this.p1 = p1;
        this.p2 = p2;
    }

    draw()
    {
        line(p1.x, p1.y, p2.x, p2.y);
    }
}
