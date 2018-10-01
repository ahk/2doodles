import P from 'paper';
import Draw from './draw'

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
    appendage: PartList;
    body: PartList;

    constructor() {
        const sc = Draw.viewCenter();
        const radius = Draw.ptPixels();

        this.head = <PartList>[];
        this.head.push({
            point: new P.Point(sc.x, sc.y - 2.0*radius),
            defaultPoint: new P.Point(sc.x, sc.y - 2.0*radius),
            radius: radius * 2.0,
            color: '#333333',
        });

        this.eye = <PartList>[]
        this.eye.push({
            point: new P.Point(sc.x + radius/2.5, sc.y - 2.5*radius),
            defaultPoint: new P.Point(sc.x + radius/2.5, sc.y - 2.5*radius),
            radius: radius / 6.0,
            color: '#FFFFFF',
        });
        this.eye.push({
            point: new P.Point(sc.x - radius/2.5, sc.y - 2.5*radius),
            defaultPoint: new P.Point(sc.x - radius/2.5, sc.y - 2.5*radius),
            radius: radius / 6.0,
            color: '#FFFFFF',
        });

        this.appendage = <PartList>[]
        // arms
        this.appendage.push({
            point: new P.Point(sc.x + 3.0*radius, sc.y - 0.7*radius),
            defaultPoint: new P.Point(sc.x + 3.0*radius, sc.y - 0.7*radius),
            radius: radius,
            color: '#DDDDDD',
        });
        this.appendage.push({
            point: new P.Point(sc.x - 3.0*radius, sc.y - 0.7*radius),
            defaultPoint: new P.Point(sc.x - 3.0*radius, sc.y - 0.7*radius),
            radius: radius,
            color: '#DDDDDD',
        });
        // legs
        this.appendage.push({
            point: new P.Point(sc.x + radius, sc.y + radius),
            defaultPoint: new P.Point(sc.x + radius, sc.y + 2.0*radius),
            radius: radius * 1.5,
            color: '#AAAAAA',
        });
        this.appendage.push({
            point: new P.Point(sc.x - radius, sc.y + radius),
            defaultPoint: new P.Point(sc.x - radius, sc.y + 2.0*radius),
            radius: radius * 1.5,
            color: '#AAAAAA',
        });

        this.body = <PartList>[];
        this.body.push({
            point: sc,
            defaultPoint: sc,
            radius: radius * 3.0,
            color: '#000000',
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
        this.appendage.forEach(circRender);
    }
}

