import P from 'paper';
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

type ToolDomName = 'head' | 'arm' | 'eye' | 'body';
function isToolDomName(name: ToolDomName | string | null): name is ToolDomName {
    if (name === 'head') { return true; }
    else if (name === 'arm') { return true; }
    else if (name === 'eye') { return true; }
    else if (name === 'body') { return true; }
    else { return false; }
}

class App {
    canvasEl: HTMLCanvasElement;
    toolSelectEl: HTMLElement;
    doodle: Doodle;
    lastTimestamp: number;
    currentTool: Tool;
    tools: ToolGroup;

    constructor(document: Document) {
        // FIXME: what does this typescript casting actually do?
        // why does this work but not listing the type on the left side?
        const cEl = <HTMLCanvasElement>document.querySelector('#canvas');
        const tsEl = <HTMLElement>document.querySelector('#tools');
        if (!(cEl && tsEl)) {
            throw new Error("Can't find required HTML elements.");
        }
        else {
            this.canvasEl = cEl;
            this.toolSelectEl = tsEl;
        }

        // FIXME: using <any> because NodeListOf<Element> seems to be missing
        // typedefs for iteration
        const toolButtons: HTMLElement[] = <any>this.toolSelectEl.querySelectorAll('.tool');

        // setup Paper.js against canvas
        P.setup(this.canvasEl);
        const paperTool = new P.Tool();
        // view bindings
        // TODO: resizing is broken, for some reason Paper.js view likes to
        // strictly style the canvas element dims and won't respect updates to viewSize
        P.view.onFrame = this.onAnimationFrame.bind(this);

        // mouse bindings
        paperTool.onMouseDown = this.onClick.bind(this);
        toolButtons.forEach((toolEl) => {
            const domName = toolEl.getAttribute('data-tool-name');
            if (isToolDomName(domName)) {
                const toolName = this.getToolNameForDomName(domName);
                toolEl.onmouseup = this.onToolSelect.bind(this, toolName);
            }
            else {
                throw new Error("Couldn't bind tool buttons.");
            }
        })

        // prevent right click context menu
        this.canvasEl.addEventListener('contextmenu', event => event.preventDefault());
        this.toolSelectEl.addEventListener('contextmenu', event => event.preventDefault());

        this.doodle = new Doodle();
        this.lastTimestamp = 0;

        this.tools = ToolGroup.defaultTools();
        this.currentTool = this.tools.arm;

        this.updateFrame();
    }

    getTool(name: ToolName) {
        switch (name) {
            case ToolName.Head:
                return this.tools.head;
            case ToolName.Arm:
                return this.tools.arm;
            case ToolName.Eye:
                return this.tools.eye;
            case ToolName.Body:
                return this.tools.body;
            default:
                return assertNever(name);
        }
    }

    getPartListForTool(tool: Tool) {
        // FIXME: for some reason compile time exhaustiveness checking
        // requires throwing or returning a never type, which can't happen
        // inline conveniently (without being a return switch statement).
        // Is there a better way to do this?
        switch (tool.name) {
            case ToolName.Head:
                return this.doodle.head;
            case ToolName.Arm:
                return this.doodle.arm;
            case ToolName.Eye:
                return this.doodle.eye;
            case ToolName.Body:
                return this.doodle.body;
            default:
                return assertNever(tool.name);
        }
    }

    getToolNameForDomName(name: ToolDomName): ToolName {
        switch (name) {
            case 'head':
                return ToolName.Head;
            case 'arm':
                return ToolName.Arm;
            case 'eye':
                return ToolName.Eye;
            case 'body':
                return ToolName.Body;
            default:
                return assertNever(name);
        }
    }

    getCurrentPartList() {
        return this.getPartListForTool(this.currentTool);
    }

    // FIXME: this should be typeof P.ToolEvent but it lacks a type signature to access original event button type
    onClick(event: any) {
        const buttons: PaperMouseEventButtons = event.event.buttons;
        switch (buttons) {
            case PaperMouseEventButtons.Left:
                return this.onGeneratePart(event);
            case PaperMouseEventButtons.Right:
                return this.onRemovePart(event);
            case PaperMouseEventButtons.Middle:
                return this.onOptionsPart(event);
            default:
                return assertNever(buttons);
        }
    }

    onToolSelect(name: ToolName) {
        this.currentTool = this.getTool(name);
    }

    onGeneratePart(event: P.MouseEvent) {
        event.preventDefault();
        const genPart = this.currentTool.makePart(event.point);
        this.getCurrentPartList().push(genPart);
        this.updateFrame();
    }

    onRemovePart(event: P.MouseEvent) {
        event.preventDefault();
        console.log('remove not implemented')
    }

    onOptionsPart(event: P.MouseEvent) {
        event.preventDefault();
        console.log('options not implemented')
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
