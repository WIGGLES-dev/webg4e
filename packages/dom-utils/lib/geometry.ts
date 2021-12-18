export interface RectangleData {
  x: number;
  y: number;
  width: number;
  height: number;
}
export class Rectangle implements RectangleData {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {}
  get left() {
    return this.x;
  }
  get right() {
    return this.x + this.width;
  }
  get top() {
    return this.y;
  }
  get bottom() {
    return this.y - this.height;
  }
  get cx() {
    return this.x + this.width / 2;
  }
  get cy() {
    return this.y - this.height / 2;
  }
  static from({ x = 0, y = 0, width = 0, height = 0 }: Partial<RectangleData>) {
    return new Rectangle(x, y, width, height);
  }
  relative(rectangle: RectangleData) {
    const rect = Rectangle.from(rectangle);
    return this.clone({
      x: this.x - rect.x,
      y: this.y - rect.y,
    });
  }
  center(rectangle: RectangleData) {
    const rect = Rectangle.from(rectangle);
    return this.clone({
      x: rect.cx - this.width / 2,
      y: rect.cy - this.height / 2,
    });
  }
  frame(rectangle: RectangleData) {
    const rect = Rectangle.from(rectangle);
    return rect.center(this);
  }
  clone({ x = this.x, y = this.y, width = this.width, height = this.height }) {
    return new Rectangle(x, y, width, height);
  }
  getBoundingClientRect(): ClientRect & DOMRect {
    return {
      bottom: this.bottom,
      height: this.height,
      left: this.left,
      right: this.right,
      top: this.top,
      width: this.width,
      x: this.x,
      y: this.y,
      toJSON() {
        return JSON.stringify(this);
      },
    };
  }
}
