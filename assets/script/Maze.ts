import Block, { BlockData, BlockType } from "./Block";

const {ccclass, property} = cc._decorator;

const MAZE_CONFIG = {
  SIZE: 51 // 迷宫的宽高必须是奇数
}

@ccclass
export default class Maze extends cc.Component {

    @property(cc.Prefab)
    blockPrefab: cc.Prefab = null
    blockNodeArr: Block[][] = []
    blockDataArr: BlockData[][] = []
    dirs: number[][] = [[0, 1], [-1, 0], [0, -1], [1, 0]]
    count: number = 0

    stack: number[][] = []
    queue: number[][] = []

    onLoad () {
      this.initBlock()
      // 设置出口
      this.setBlock(0, 1, BlockType.Road)
      // 设置入口
      this.setBlock(MAZE_CONFIG.SIZE - 1, MAZE_CONFIG.SIZE - 2, BlockType.Road)
      // this.deepWalk(1, 1)
      // this.stackWalk()
      this.rangeWalk()

      window.vm = this
    }

    initBlock() {
      for(let i = 0; i < MAZE_CONFIG.SIZE; i++) {
        this.blockNodeArr[i] = []
        this.blockDataArr[i] = []
        for(let j = 0; j < MAZE_CONFIG.SIZE; j++) {
          let data = new BlockData()
          data.i = i
          data.j = j
          data.type = i % 2 === 0 || j % 2 === 0 ? BlockType.Wall : BlockType.Road
          this.blockDataArr[i][j] = data

          let ts = cc.instantiate(this.blockPrefab).getComponent(Block)
          this.node.addChild(ts.node)
          ts.node.x = (i - Math.floor(MAZE_CONFIG.SIZE / 2)) * this.blockPrefab.data.width
          ts.node.y = (j - Math.floor(MAZE_CONFIG.SIZE / 2)) * this.blockPrefab.data.height
          ts.data = data
          ts.maze = this
          ts.updateState()
          this.blockNodeArr[i][j] = ts
        }
      }
    }

    deepWalk(x: number, y: number) { // 深度优先递归，会先一条路走到底
      if (!this.isInArea(x, y)) return
      let data = this.blockDataArr[x][y]
      if (data.isVisited) return
      data.isVisited = true

      // 四周遍历
      this.dirs.sort(() => Math.random() - 0.5).forEach(dir => {
        let i = x + dir[0] * 2
        let j = y + dir[1] * 2
        if (this.isInArea(i, j) && !this.blockDataArr[i][j].isVisited) {
          this.setBlock(x + dir[0], y + dir[1], BlockType.Road)
          this.deepWalk(i, j)
        }
      })
    }

    setBlock(x: number, y: number, type: BlockType){
      this.scheduleOnce(() => {
        if (!this.isInArea(x, y)) return
        let ts = this.blockNodeArr[x][y]
        ts.setBlockType(type)
        ts.updateState()
      }, 0.01 * (this.count++))
    }

    stackWalk() { // 也会一条路走到底，只不过和深度优先顺序相反
      this.stack.push([1, 1])
      this.blockDataArr[1][1].isVisited = true
      while(this.stack.length) {
        let nowPos = this.stack.sort(() => Math.random() - 0.5).pop()
        let [x, y] = nowPos
        this.dirs.forEach(dir => {
          let i = x + dir[0] * 2
          let j = y + dir[1] * 2
          if (this.isInArea(i, j) && !this.blockDataArr[i][j].isVisited) {
            this.setBlock(x + dir[0], y + dir[1], BlockType.Road)
            this.stack.push([i, j])
            this.blockDataArr[i][j].isVisited = true
          }
        })
      }
    }

    rangeWalk() { // 广度优先，其实和上面的栈模式递归一样的道理，只不过从栈的取出顺序相反
      this.queue.push([1, 1])
      this.blockDataArr[1][1].isVisited = true
      // this.openMist(1, 1)
      while(this.queue.length) {
        let nowPos = this.queue.sort(() => Math.random() - 0.5).shift()
        let [x, y] = nowPos
        this.dirs.forEach(dir => {
          let i = x + dir[0] * 2
          let j = y + dir[1] * 2
          if (this.isInArea(i, j) && !this.blockDataArr[i][j].isVisited) {
            this.setBlock(x + dir[0], y + dir[1], BlockType.Road)
            this.queue.push([i, j])
            this.blockDataArr[i][j].isVisited = true
          }
        })
      }
    }

    openMist(x: number, y: number) {
      for (let i = x - 1; i <= x + 1; i++) {
        for (let j = y - 1; j <= y + 1; j++) {
          if (this.isInArea(i, j)) {
            this.blockDataArr[i][j].isInMist = false
            this.blockNodeArr[i][j].updateState()
          }
        }
      }
    }

    isInArea(x: number, y: number) {
      return x >= 0 && y >=0 && x < MAZE_CONFIG.SIZE && y < MAZE_CONFIG.SIZE
    }

    // update (dt) {}
}
