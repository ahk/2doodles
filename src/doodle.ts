import P, { Tool } from 'paper';
import Draw from './draw'
import {ToolGroup} from './tools'

export type BodyPart = {
    point: P.Point;
    defaultPoint: P.Point;
    radius: number;
    color: string;
    path?: P.Path;
};
export type PartList = BodyPart[];

export class Doodle {
    head: PartList;
    eye: PartList;
    arm: PartList;
    body: PartList;

    constructor() {
        const tools = ToolGroup.defaultTools();
        const sc = Draw.viewCenter();
        const radius = this.radius();

        // head
        this.head = <PartList>[];
        this.head.push(tools.head.makePart(
            new P.Point(sc.x, sc.y - 2.0*radius)
        ));

        // eyes
        this.eye = <PartList>[]
        this.eye.push(tools.eye.makePart(
            new P.Point(sc.x + radius/2.5, sc.y - 2.5*radius)
        ));
        this.eye.push(tools.eye.makePart(
            new P.Point(sc.x - radius/2.5, sc.y - 2.5*radius)
        ));

        // arms
        this.arm = <PartList>[]
        this.arm.push(tools.arm.makePart(
            new P.Point(sc.x + 3.0*radius, sc.y - 0.7*radius),
        ));
        this.arm.push(tools.arm.makePart(
            new P.Point(sc.x - 3.0*radius, sc.y - 0.7*radius),
        ));

        // legs
        this.arm.push(tools.arm.makePart(
            new P.Point(sc.x + radius, sc.y + 2.0*radius),
            '#AAAAAA',
        ));
        this.arm.push(tools.arm.makePart(
            new P.Point(sc.x - radius, sc.y + radius),
            '#AAAAAA',
        ));

        // body
        this.body = <PartList>[];
        this.body.push(tools.body.makePart(
            sc
        ));
    }

    radius(): number {
        return Draw.ptPixels();
    }

    tick(deltaS: number) {
        this.head.forEach((part) => {});
        this.eye.forEach((part) => {});
        this.body.forEach((part) => {});

        this.arm.forEach((part) => {
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
            part.path.fillColor = part.color;
        }
        else {
            part.path = Draw.drawCircle(part.point, part.radius, part.color);
        }
    }

    render() {
        // FIXME: Use layers for grouping these
        // initialize or update path data
        const circRender = this.renderCirclePart.bind(this)
        this.body.forEach(circRender);
        this.head.forEach(circRender);
        this.eye.forEach(circRender);
        this.arm.forEach(circRender);
    }
}

