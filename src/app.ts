import * as P from "paper";

interface BodyPart {
    point: P.Point;
    defaultPoint: P.Point;
    radius: number;
    path?: P.Path;
};
type PartList = BodyPart[];

// hack to work around Paper.js missing event type for its callbacks
interface PaperFrameEvent {
    count: number;
    time: number;
    delta: number;
}

class Draw {
    public static drawCircle(point: P.Point, radius: number): P.Path {
        const path = new P.Path.Circle(point, radius);
        path.fillColor = 'black';

        return path;
    }

    public static unsignedRandom(): number { 
        return (Math.random() * 2) - 1;
    }

    public static viewCenter(): P.Point {
        const cSize = P.view.viewSize;
        // FIXME: not sure why I can't divide the size or point itself with the Paperjs overloads ...
        return (new P.Point(cSize.width/2.0, cSize.height/2.0));
    }

    public static ptPixels(): number {
        const s = P.view.viewSize;
        return Math.min(s.width, s.height) / 20;
    }
}

class Doodle {
    head: PartList;
    eye: PartList;
    appendage: PartList;
    body: PartList;

    constructor() {
        const sc = Draw.viewCenter();
        const radius = Draw.ptPixels();

        this.head = <PartList>[];
        this.head.push({
            point: new P.Point(sc.x, sc.y - 2.0*radius),
            defaultPoint: new P.Point(sc.x, sc.y - 2.0*radius),
            radius: radius * 2.0
        });

        this.eye = <PartList>[]
        this.eye.push({
            point: new P.Point(sc.x + radius/3.0, sc.y - 2.0*radius),
            defaultPoint: new P.Point(sc.x + radius/3.0, sc.y - 2.0*radius),
            radius: radius / 6.0
        });
        this.eye.push({
            point: new P.Point(sc.x - radius/3.0, sc.y - 2.0*radius),
            defaultPoint: new P.Point(sc.x - radius/3.0, sc.y - 2.0*radius),
            radius: radius / 6.0
        });

        this.appendage = <PartList>[]
        // arms
        this.appendage.push({
            point: new P.Point(sc.x + 3.0*radius, sc.y - 0.7*radius),
            defaultPoint: new P.Point(sc.x + 3.0*radius, sc.y - 0.7*radius),
            radius: radius
        });
        this.appendage.push({
            point: new P.Point(sc.x - 3.0*radius, sc.y - 0.7*radius),
            defaultPoint: new P.Point(sc.x - 3.0*radius, sc.y - 0.7*radius),
            radius: radius
        });
        // legs
        this.appendage.push({
            point: new P.Point(sc.x + radius, sc.y + radius),
            defaultPoint: new P.Point(sc.x + radius, sc.y + radius),
            radius: radius * 1.5
        });
        this.appendage.push({
            point: new P.Point(sc.x - radius, sc.y + radius),
            defaultPoint: new P.Point(sc.x - radius, sc.y + radius),
            radius: radius * 1.5
        });

        this.body = <PartList>[];
        this.body.push({
            point: sc,
            defaultPoint: sc,
            radius: radius * 3.0
        });
    }

    radius(): number {
        return Draw.ptPixels();
    }

    tick(deltaS: number) {
        this.head.forEach((part) => {});
        this.eye.forEach((part) => {});
        this.body.forEach((part) => {});

        this.appendage.forEach((part) => {
            const amp = this.radius() * 10 * deltaS * Math.random();
            const displace = new P.Point(
                amp * Draw.unsignedRandom(),
                amp * Draw.unsignedRandom()
            );

            part.point.x = part.defaultPoint.x + displace.x;
            part.point.y = part.defaultPoint.y + displace.y;
        })
    }

    renderCirclePart(part: BodyPart) {
        if (part.path) {
            part.path.position = part.point;
        }
        else {
            part.path = Draw.drawCircle(part.point, part.radius);
        }
    }

    render() {
        // initialize or update path data
        const circRender = this.renderCirclePart.bind(this)
        this.head.forEach(circRender);
        this.eye.forEach(circRender);
        this.body.forEach(circRender);
        this.appendage.forEach(circRender);
    }
}

class App {
    el: HTMLCanvasElement;
    doodle: Doodle;
    lastTimestamp: number;

    constructor(document: Document) {
        this.el = <HTMLCanvasElement>document.getElementById('canvas');

        // setup Paper.js against canvas
        P.setup(this.el);
        // view bindings
        // TODO: resizing is broken, for some reason Paper.js view likes to
        // strictly style the canvas element dims and won't respect updates to viewSize
        P.view.onFrame = this.onAnimationFrame.bind(this);
        // mouse bindings
        const tool = new P.Tool();
        tool.onMouseDown = this.onClick.bind(this);

        this.doodle = new Doodle();
        this.lastTimestamp = 0;

        this.updateFrame();
    }

    onClick(event: P.ToolEvent) {
        this.doodle.appendage.push({
            point: event.point,
            defaultPoint: event.point,
            radius: Draw.ptPixels()
        })

        this.updateFrame();
    }

    onAnimationFrame(event: PaperFrameEvent) {
        this.doodle.tick(event.delta);
        this.doodle.render();
        // FIXME: is this needed if we are using Paper.js onFrame?
        P.view.draw();

        this.updateFrame();
    }

    updateFrame() {
        // FIXME: is this needed if we are using Paper.js onClick/onResize etc?
        // supposedly uses requestAnimationFrame under the hood
        P.view.update();
        P.view.requestUpdate();
    }
}

const app = new App(document);
