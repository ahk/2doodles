import P from 'paper';
import Draw from './draw';
import {BodyPart} from './doodle';

type ToolFunc = (p: P.Point, c?: string) => BodyPart;

export const enum ToolName {
    Head,
    Arm,
    Eye,
    Body,
};

export class Tool {
    readonly name: ToolName;
    readonly makePart: ToolFunc;

    constructor(name: ToolName, genFunc: ToolFunc) {
        this.name = name;
        this.makePart = genFunc;
    };
}

// FIXME: this is probably goofy and we shouldn't do this
// but I wanted to try it out. Fake named parameters through 
// interface destructuring is the idea.
interface ToolGroupArgs {
    head: ToolFunc,
    arm: ToolFunc,
    eye: ToolFunc,
    body: ToolFunc
}
export class ToolGroup {
    readonly head: Tool;
    readonly arm: Tool;
    readonly eye: Tool;
    readonly body: Tool;

    static defaultTools() {
        const radius = Draw.ptPixels();
        return ToolGroup.fromGenFuncs({
            head: (
                p: P.Point,
                c: string = '#333333'
            ) => { return {
                point: p,
                defaultPoint: p,
                radius: radius * 2.0,
                color: c,
            }},
            arm: (
                p: P.Point,
                c: string = '#DDDDDD'
            ) => { return {
                point: p,
                defaultPoint: p,
                radius: radius,
                color: c,
            }},
            eye: (
                p: P.Point,
                c: string = '#FFFFFF'
            ) => { return {
                point: p,
                defaultPoint: p,
                radius: radius / 6.0,
                color: c,
            }},
            body: (
                p: P.Point,
                c: string = '#000000'
            ) => { return {
                point: p,
                defaultPoint: p,
                radius: radius * 3.0,
                color: c,
            }},
        });
    }

    static fromGenFuncs({head, arm, eye, body}: ToolGroupArgs): ToolGroup {
        const headT = new Tool(ToolName.Head, head);
        const armT = new Tool(ToolName.Arm, arm);
        const eyeT = new Tool(ToolName.Eye, eye);
        const bodyT = new Tool(ToolName.Body, body);

        return new ToolGroup(headT, armT, eyeT, bodyT);
    }

    constructor(head: Tool, arm: Tool, eye: Tool, body: Tool) {
        this.head = head;
        this.arm = arm;
        this.eye = eye;
        this.body = body;
    };
};

