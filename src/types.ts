export type Coords = {
  x: number
  y: number
}

export type AnimationConfig = [string, string, number, number][]

export type Direction = 'UP' | 'RIGHT' | 'DOWN' | 'LEFT'

export type RobotJob =
  | 'GET_WATER'
  | 'PUT_WATER'
  | 'GET_WOODS'
  | 'PUT_WOODS'
  | 'GET_AXE'
  | 'PUT_AXE'
  | 'GET_BASKET'
  | 'PUT_BASKET'
  | 'CUT_TREE'
  | 'ADD_TEMP'

export type GraphNodeData = {
  x: number
  y: number
  blocked: Direction[]
}

export type GraphLinkData = {
  direction: Direction
  blocked: boolean
}

export type RobotState =
  | 'IDLE'
  | 'AXE'
  | 'BASKET'
  | 'BASKET_WATER'
  | 'BASKET_WOODS'

export type EntityType = 'HOUSE' | 'WELL' | 'TREE' | 'WOOD'

export type EntityConfig = {
  width: number
  height: number
  tiles: number[][]
  collide: number[][]
  overlap: number[][]
  action: number[][]
}
