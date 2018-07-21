interface Vec2 {
    x: number;
    y: number;
}

type VecList = Vec2[];

class Draw {
    public static clearFrame(ctx: CanvasRenderingContext2D) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }

    public static drawCircle(ctx: CanvasRenderingContext2D,
        vec: Vec2, radius: number
    ) {
        ctx.beginPath();
        ctx.arc(vec.x, vec.y, radius, 0, 2*Math.PI);
        ctx.fill();
    }

    public static unsignedRandom(): number { 
        return (Math.random() * 2) - 1;
    }
}

class Doodle {
    head: VecList = [];
    eye: VecList = [];
    appendage: VecList = [];
    body: VecList = [];
    circleRadius: number;

    constructor() {
    }

    tick(deltaMs: number) {
        this.appendage.forEach((vec) => {
            const displace = this.circleRadius * (deltaMs / 1000.0);
            vec.x += displace * Draw.unsignedRandom();
            vec.y += displace * Draw.unsignedRandom();
        })
    }

    render(ctx) {
        this.appendage.forEach((vec) => {
            Draw.drawCircle(ctx, vec, this.circleRadius)
        });
    }
}

class App {
    el: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    doodle: Doodle;
    lastTimestamp: number;

    constructor(document: Document) {
        this.el = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = this.el.getContext("2d");

        this.el.onclick = this.onClick.bind(this);
        window.addEventListener("resize", this.onResize.bind(this))

        this.doodle = new Doodle();
        this.lastTimestamp = 0;

        this.updateCanvasDimensions();
    }

    // sets coordinate space for canvas
    updateCanvasDimensions() {
        const dim = {
            x: this.el.clientWidth,
            y: this.el.clientHeight,
        }

        this.doodle.circleRadius = Math.min(dim.x, dim.y) / 20;
        this.el.setAttribute('width', dim.x.toString());
        this.el.setAttribute('height', dim.y.toString());
    }

    onClick(event: MouseEvent) {
        const vec = this.coordsDocumentToCanvas({
            x: event.clientX,
            y: event.clientY
        });

        this.doodle.appendage.push(vec)
        this.updateFrame();
    }

    onResize(event: UIEvent) {
        this.updateCanvasDimensions();
        this.updateFrame();
    }

    onAnimationFrame(nowTimestamp: number) {
        if (this.lastTimestamp === 0) { this.lastTimestamp = nowTimestamp; }
        const deltaMs = nowTimestamp - this.lastTimestamp;
        this.lastTimestamp = nowTimestamp

        Draw.clearFrame(this.ctx);
        this.doodle.tick(deltaMs);
        this.doodle.render(this.ctx);

        // ALWAYS RENDER
        this.updateFrame();
    }

    updateFrame() {
        window.requestAnimationFrame(this.onAnimationFrame.bind(this))
    }

    coordsDocumentToCanvas(vec: Vec2): Vec2 {
        return {
            x: vec.x - this.el.offsetLeft,
            y: vec.y - this.el.offsetTop,
        };
    }
}

const app = new App(document);
