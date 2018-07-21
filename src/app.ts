interface Vec2 {
    x: number;
    y: number;
}

class App {
    el: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    circleRadius: number;

    constructor(document: Document) {
        this.el = <HTMLCanvasElement>document.getElementById('canvas');
        this.ctx = this.el.getContext("2d");

        this.updateCanvasDimensions();
        this.el.onclick = this.onClick.bind(this);
        window.addEventListener("resize", this.onResize.bind(this))
    }

    // sets coordinate space for canvas
    updateCanvasDimensions() {
        this.circleRadius = Math.min(
            this.el.clientWidth, this.el.clientHeight
        ) / 20;
        this.el.setAttribute('width', this.el.clientWidth.toString());
        this.el.setAttribute('height', this.el.clientHeight.toString());
    }

    onClick(event: MouseEvent) {
        const vec = this.coordsDocumentToCanvas({
            x: event.clientX,
            y: event.clientY
        });
        this.drawCircle(vec, this.circleRadius);
    }

    onResize(event: UIEvent) {
        this.updateCanvasDimensions();
    }

    coordsDocumentToCanvas(vec: Vec2): Vec2 {
        return {
            x: vec.x - this.el.offsetLeft,
            y: vec.y - this.el.offsetTop,
        };
    }

    drawCircle(vec, radius) {
        const c = this.ctx;
        c.beginPath();
        c.arc(vec.x, vec.y, radius, 0, 2*Math.PI);
        c.fill();
    }
}

const app = new App(document);
