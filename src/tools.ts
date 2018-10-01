import P from 'paper';
import {BodyPart} from './doodle';

type GenFunc = (point: P.Point) => BodyPart;

export class Tool {
    readonly genFunc: GenFunc;

    constructor(genFunc: GenFunc) {
        this.genFunc = genFunc;
    };

    makePart(point: P.Point) {
        return this.genFunc(point);
    };
}

// FIXME: this is probably goofy and we shouldn't do this
// but I wanted to try it out. Fake named parameters through 
// interface destructuring is the idea.
interface ToolGroupArgs {
    head: GenFunc,
    appendage: GenFunc,
    eye: GenFunc,
    body: GenFunc
}
export class ToolGroup {
    readonly head: Tool;
    readonly appendage: Tool;
    readonly eye: Tool;
    readonly body: Tool;

    constructor({head, appendage, eye, body}: ToolGroupArgs) {
        this.head = new Tool(head);
        this.appendage = new Tool(appendage);
        this.eye = new Tool(eye);
        this.body = new Tool(body);
    };
};

