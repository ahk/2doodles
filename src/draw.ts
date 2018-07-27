import P from 'paper';

export class Draw {
    public static drawCircle(point: P.Point, radius: number, color: string): P.Path {
        const path = new P.Path.Circle(point, radius);
        path.fillColor = color;

        return path;
    }

    // -1:1
    public static unsignedRandom(): number { 
        return (Math.random() * 2) - 1;
    }

    // center of the main drawing view
    public static viewCenter(): P.Point {
        const cSize = P.view.viewSize;
        // FIXME: not sure why I can't divide the size or point itself with the Paperjs overloads ...
        return (new P.Point(cSize.width/2.0, cSize.height/2.0));
    }

    // point size in pixels
    public static ptPixels(): number {
        const s = P.view.viewSize;
        return Math.min(s.width, s.height) / 20;
    }
}

export default Draw;