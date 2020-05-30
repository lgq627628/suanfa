const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    ctx: cc.Graphics = null
    SIZE: number = 200
    tt: number = 0
    circle: Circle = null
    redPointNum: number = 0
    allPointNum: number = 0

    start() {
      this.ctx = this.node.getComponent(cc.Graphics)
      this.circle = new Circle(this.node.x, this.node.y, 200)

      this.drawCircle(this.circle.x, this.circle.y, 200)
    }

    drawCircle(x, y, r) {
      this.ctx.circle(x, y, r)
      this.ctx.stroke()
    }

    drawPoint(x, y, r, color) {
      this.ctx.fillColor = color
      this.ctx.circle(x, y, r)
      this.ctx.fill()
    }

    random(min: number, max: number): number {
      return Math.floor(Math.random() * Math.abs(max - min + 1)) + min
    }

    update (dt) {
      if (this.allPointNum > 5000) {
        console.log('π', 4 * this.redPointNum / this.allPointNum)
        return
      }
      this.tt += dt
      if (this.tt > 3) {
        let x = this.random(-this.SIZE, this.SIZE)
        let y = this.random(-this.SIZE, this.SIZE)
        let p = new Point(x, y)
        let color
        if (this.circle.isInCircle(p)) {
          color = new cc.Color(255, 0, 0)
          this.redPointNum++
        } else {
          color = new cc.Color(0, 255, 0)
        }
        this.allPointNum++
        this.drawPoint(x, y, 4, color)
        this.tt = 0
      }

    }
}

class Point {
  x: number
  y: number
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

class Circle {
  x: number
  y: number
  r: number
  constructor(x, y, r) {
    this.x = x
    this.y = y
    this.r = r
  }
  isInCircle(ponit: Point): boolean {
    let dx = Math.abs(this.x - ponit.x)
    let dy = Math.abs(this.y - ponit.y)
    return Math.pow(dx, 2) + Math.pow(dy, 2) <= Math.pow(this.r, 2)
  }
}
