import P from 'paper';
import {BodyPart} from './doodle';

type GenFunc = (point: P.Point) => BodyPart;

export const enum ToolName {
    Head,
    Appendage,
    Eye,
    Body,
};

export class Tool {
    readonly name: ToolName;
    readonly genFunc: GenFunc;

    constructor(name: ToolName, genFunc: GenFunc) {
        this.name = name;
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
        this.head = new Tool(ToolName.Head, head);
        this.appendage = new Tool(ToolName.Appendage, appendage);
        this.eye = new Tool(ToolName.Eye, eye);
        this.body = new Tool(ToolName.Body, body);
    };
};

