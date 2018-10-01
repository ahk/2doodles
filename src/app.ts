import P from 'paper';
import Draw from './draw';
import {Doodle} from './doodle';
import {Tool, ToolGroup} from './tools';

// FIXME: hack to work around Paper.js missing event type for its callbacks
interface PaperFrameEvent {
    count: number;
    time: number;
    delta: number;
}
class App {
    el: HTMLCanvasElement;
    doodle: Doodle;
    lastTimestamp: number;
    currentTool: Tool;
    tools: ToolGroup;

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

        this.tools = new ToolGroup({
            head: (point: P.Point) => {
                return {
                    point: point,
                    defaultPoint: point,
                    radius: Draw.ptPixels(),
                    color: '#DDDDDD'
                };
            },
            appendage: (point: P.Point) => {
                return {
                    point: point,
                    defaultPoint: point,
                    radius: Draw.ptPixels(),
                    color: '#DDDDDD'
                };
            },
            eye: (point: P.Point) => {
                return {
                    point: point,
                    defaultPoint: point,
                    radius: Draw.ptPixels(),
                    color: '#DDDDDD'
                };
            },
            body: (point: P.Point) => {
                return {
                    point: point,
                    defaultPoint: point,
                    radius: Draw.ptPixels(),
                    color: '#DDDDDD'
                };
            },
        });
        this.currentTool = this.tools.appendage;

        this.updateFrame();
    }

    onClick(event: P.ToolEvent) {
        if (this.currentTool === this.tools.appendage) {
            const genPart = this.currentTool.makePart(event.point);
            this.doodle.appendage.push(genPart);
        }

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
