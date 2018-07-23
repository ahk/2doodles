import * as P from "paper";

interface BodyPart {
    point: P.Point;
    path: P.Path;
};
type PartList = [BodyPart];

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
}

class Doodle {
    head: PartList;
    eye: PartList;
    appendage: PartList;
    body: PartList;

    constructor() {
        this.head = <PartList>[];
        this.eye = <PartList>[];
        this.appendage = <PartList>[];
        this.body = <PartList>[];
    }

    radius(): number {
        const s = P.view.viewSize;
        return Math.min(s.width, s.height) / 20;
    }

    tick(deltaS: number) {
        this.appendage.forEach((part) => {
            const amp = this.radius() * deltaS * 2;
            const displace = new P.Point(
                amp * Draw.unsignedRandom(),
                amp * Draw.unsignedRandom()
            );

            part.point.x += displace.x;
            part.point.y += displace.y;
        })
    }

    render() {
        // initialize or update path data
        this.appendage.forEach((part) => {
            if (part.path === null) {
                part.path = Draw.drawCircle(part.point, this.radius())
            }
            else {
                part.path.position = part.point;
            }
        });
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
    }

    onClick(event: P.ToolEvent) {
        this.doodle.appendage.push({
            point: event.point,
            path: null
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
