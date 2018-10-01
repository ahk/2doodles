import P from 'paper';
import Draw from './draw';
import {Doodle} from './doodle';
import {Tool, ToolGroup, ToolName} from './tools';

// FIXME: is this the right thing to use to enforce exhaustiveness checks in switch statements?
// http://www.typescriptlang.org/docs/handbook/advanced-types.html
// (exhaustiveness checking)
function assertNever(x: never): never {
    throw new Error("Unexpected object: " + x);
}

// FIXME: hack to work around Paper.js missing event type for its callbacks
interface PaperFrameEvent {
    count: number;
    time: number;
    delta: number;
}
const enum PaperMouseEventButtons {
    Left = 1,
    Right = 2,
    Middle = 4,
}

class App {
    el: HTMLCanvasElement;
    doodle: Doodle;
    lastTimestamp: number;
    currentTool: Tool;
    tools: ToolGroup;

    constructor(document: Document) {
        this.el = <HTMLCanvasElement>document.getElementById('canvas');
        // prevent right click context menu
        this.el.addEventListener('contextmenu', event => event.preventDefault());

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

    getCurrentPartList() {
        const tool = this.currentTool;
        const doodle = this.doodle;

        // FIXME: for some reason compile time exhaustiveness checking
        // requires throwing or returning a never type, which can't happen
        // inline conveniently (without being a return switch statement).
        // Is there a better way to do this?
        switch (tool.name) {
            case ToolName.Head:
                return doodle.head;
            case ToolName.Appendage:
                return doodle.appendage;
            case ToolName.Eye:
                return doodle.eye;
            case ToolName.Body:
                return doodle.body;
            default:
                return assertNever(tool.name);
        }
    }

    // FIXME: this should be typeof P.ToolEvent but it lacks a type signature to access original event button type
    onClick(event: any) {
        const buttons: PaperMouseEventButtons = event.event.buttons;
        switch (buttons) {
            case PaperMouseEventButtons.Left:
                return this.onLeftClick(event);
            case PaperMouseEventButtons.Right:
                return this.onRightClick(event);
            case PaperMouseEventButtons.Middle:
                return this.onMiddleClick(event);
            default:
                return assertNever(buttons);
        }
    }

    onLeftClick(event: P.MouseEvent) {
        event.preventDefault();
        const genPart = this.currentTool.makePart(event.point);
        this.getCurrentPartList().push(genPart);
        this.updateFrame();
    }

    onRightClick(event: P.MouseEvent) {
        event.preventDefault();
        console.log('rclick not implemented')
    }

    onMiddleClick(event: P.MouseEvent) {
        event.preventDefault();
        console.log('mclick not implemented')
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
