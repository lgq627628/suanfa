import Maze from "./Maze";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Block extends cc.Component {

    data: BlockData = null
    maze: Maze = null

    updateState() {
      if (this.data.isInMist) this.node.color = new cc.Color(0, 0, 0)
      else if (this.data.type === BlockType.Move) this.node.color = new cc.Color(0, 255, 0)
      else if (this.data.type === BlockType.Wall) this.node.color = new cc.Color(0, 0, 125)
      else if (this.data.type === BlockType.Road) this.node.color = new cc.Color(255, 255, 255)
    }

    setBlockType(type: BlockType) {
      this.data.type = type
    }

}


export class BlockData {
  type: BlockType
  i: number
  j: number
  isVisited: Boolean = false
  isInMist: Boolean = false
}

export enum BlockType {
  None,
  Road,
  Wall,
  Move
}
