import { RobotJob, RobotState } from '@/types'

export const ROBOT_STATE: Record<RobotState, RobotState> = {
  IDLE: 'IDLE',
  AXE: 'AXE',
  BASKET: 'BASKET',
  BASKET_WATER: 'BASKET_WATER',
  BASKET_WOODS: 'BASKET_WOODS',
} as const

export const ROBOT_JOB: Record<RobotJob, RobotJob> = {
  GET_AXE: 'GET_AXE',
  PUT_AXE: 'PUT_AXE',
  GET_BASKET: 'GET_BASKET',
  PUT_BASKET: 'PUT_BASKET',
  GET_WATER: 'GET_WATER',
  PUT_WATER: 'PUT_WATER',
  GET_WOODS: 'GET_WOODS',
  PUT_WOODS: 'PUT_WOODS',
  CUT_TREE: 'CUT_TREE',
  ADD_TEMP: 'ADD_TEMP',
} as const
