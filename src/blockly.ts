import ModernTheme from '@blockly/theme-modern'
import * as Blockly from 'blockly'
import { serialization } from 'blockly'
import { common } from 'blockly/core'
import { javascriptGenerator } from 'blockly/javascript'

import { DIRECTION, ENTITY_TYPE, ROBOT_JOB } from '@/common'
import { sval } from '@/sval'

const blocks = common.createBlockDefinitionsFromJsonArray([
  {
    type: 'main',
    message0: 'main %1',
    args0: [
      {
        type: 'input_statement',
        name: 'HANDLER',
      },
    ],
    colour: 15,
  },
  {
    type: 'robot_turn',
    colour: 50,
    message0: 'turn %1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'DIRECTION',
        options: [
          ['up', DIRECTION.UP],
          ['right', DIRECTION.RIGHT],
          ['down', DIRECTION.DOWN],
          ['left', DIRECTION.LEFT],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: 'robot_move',
    colour: 50,
    message0: 'move %1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'DIRECTION',
        options: [
          ['up', DIRECTION.UP],
          ['right', DIRECTION.RIGHT],
          ['down', DIRECTION.DOWN],
          ['left', DIRECTION.LEFT],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: 'robot_move_to_entity',
    message0: 'move to %1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'ENTITY',
        options: [
          ['house', ENTITY_TYPE.HOUSE],
          ['wood', ENTITY_TYPE.WOOD],
          ['well', ENTITY_TYPE.WELL],
          ['tree', ENTITY_TYPE.TREE],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 15,
  },
  {
    type: 'robot_move_to',
    colour: 50,
    message0: 'move to %1 %2',
    args0: [
      {
        type: 'field_number',
        name: 'X',
        value: 0,
        min: 0,
        max: 140,
        precision: 1,
      },
      {
        type: 'field_number',
        name: 'Y',
        value: 0,
        min: 0,
        max: 160,
        precision: 1,
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
  {
    type: 'robot_work',
    colour: 50,
    message0: 'do job: %1',
    args0: [
      {
        type: 'field_dropdown',
        name: 'TASK',
        options: [
          ['get water', ROBOT_JOB.GET_WATER],
          ['put water', ROBOT_JOB.PUT_WATER],
          ['get woods', ROBOT_JOB.GET_WOODS],
          ['put woods', ROBOT_JOB.PUT_WOODS],
          ['get axe', ROBOT_JOB.GET_AXE],
          ['put axe', ROBOT_JOB.PUT_AXE],
          ['get basket', ROBOT_JOB.GET_BASKET],
          ['put basket', ROBOT_JOB.PUT_BASKET],
          ['cut tree', ROBOT_JOB.CUT_TREE],
          ['add temp', ROBOT_JOB.ADD_TEMP],
        ],
      },
    ],
    previousStatement: null,
    nextStatement: null,
  },
])

common.defineBlocks(blocks)

javascriptGenerator.forBlock['main'] = (block) => {
  return `game.main = function () {\n${javascriptGenerator.statementToCode(block, 'HANDLER')}};\n`
}

javascriptGenerator.forBlock['robot_turn'] = (block) => {
  return `game.robotTurn('${block.getFieldValue('DIRECTION')}');\n`
}

javascriptGenerator.forBlock['robot_move'] = (block) => {
  return `game.robotMove('${block.getFieldValue('DIRECTION')}');\n`
}

javascriptGenerator.forBlock['robot_move_to_entity'] = (block) => {
  return `game.robotMoveToEntity('${block.getFieldValue('ENTITY')}');\n`
}

javascriptGenerator.forBlock['robot_move_to'] = (block) => {
  return `game.robotMoveTo({ x: ${block.getFieldValue('X')}, y: ${block.getFieldValue('Y')} });\n`
}

javascriptGenerator.forBlock['robot_work'] = (block) => {
  return `game.robotWork('${block.getFieldValue('TASK')}');\n`
}

const toolbox: Blockly.BlocklyOptions['toolbox'] = {
  kind: 'categoryToolbox',
  contents: [
    {
      kind: 'category',
      name: 'Robot',
      colour: '50',
      contents: [
        {
          kind: 'block',
          type: 'main',
        },
        {
          kind: 'block',
          type: 'robot_turn',
        },
        {
          kind: 'block',
          type: 'robot_move',
        },
        {
          kind: 'block',
          type: 'robot_move_to_entity',
        },
        {
          kind: 'block',
          type: 'robot_move_to',
        },
        {
          kind: 'block',
          type: 'robot_work',
        },
      ],
    },
    {
      kind: 'sep',
    },
    {
      kind: 'category',
      name: 'Logic',
      categorystyle: 'logic_category',
      contents: [
        {
          kind: 'block',
          type: 'controls_if',
        },
        {
          kind: 'block',
          type: 'controls_if',
          extraState: {
            hasElse: 'true',
          },
        },
        {
          kind: 'block',
          type: 'controls_if',
          extraState: {
            hasElse: 'true',
            elseIfCount: 1,
          },
        },
        {
          kind: 'block',
          type: 'logic_compare',
        },
        {
          kind: 'block',
          type: 'logic_operation',
        },
        {
          kind: 'block',
          type: 'logic_negate',
        },
        {
          kind: 'block',
          type: 'logic_boolean',
        },
        {
          kind: 'block',
          type: 'logic_null',
        },
        {
          kind: 'block',
          type: 'logic_ternary',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Loops',
      categorystyle: 'loop_category',
      contents: [
        {
          kind: 'block',
          type: 'controls_repeat_ext',
          inputs: {
            TIMES: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 10,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'controls_whileUntil',
        },
        {
          kind: 'block',
          type: 'controls_for',
          fields: {
            VAR: 'i',
          },
          inputs: {
            FROM: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 10,
                },
              },
            },
            BY: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'controls_forEach',
        },
        {
          kind: 'block',
          type: 'controls_flow_statements',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Math',
      categorystyle: 'math_category',
      contents: [
        {
          kind: 'block',
          type: 'math_number',
          fields: {
            NUM: 123,
          },
        },
        {
          kind: 'block',
          type: 'math_arithmetic',
          fields: {
            OP: 'ADD',
          },
        },
        {
          kind: 'block',
          type: 'math_single',
          fields: {
            OP: 'ROOT',
          },
        },
        {
          kind: 'block',
          type: 'math_trig',
          fields: {
            OP: 'SIN',
          },
        },
        {
          kind: 'block',
          type: 'math_constant',
          fields: {
            CONSTANT: 'PI',
          },
        },
        {
          kind: 'block',
          type: 'math_number_property',
          extraState: '<mutation divisor_input="false"></mutation>',
          fields: {
            PROPERTY: 'EVEN',
          },
        },
        {
          kind: 'block',
          type: 'math_round',
          fields: {
            OP: 'ROUND',
          },
        },
        {
          kind: 'block',
          type: 'math_on_list',
          extraState: '<mutation op="SUM"></mutation>',
          fields: {
            OP: 'SUM',
          },
        },
        {
          kind: 'block',
          type: 'math_modulo',
        },
        {
          kind: 'block',
          type: 'math_constrain',
          inputs: {
            LOW: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            HIGH: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_random_int',
          inputs: {
            FROM: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 1,
                },
              },
            },
            TO: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 100,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'math_random_float',
        },
        {
          kind: 'block',
          type: 'math_atan2',
        },
      ],
    },
    {
      kind: 'category',
      name: 'Lists',
      categorystyle: 'list_category',
      contents: [
        {
          kind: 'block',
          type: 'lists_create_empty',
        },
        {
          kind: 'block',
          type: 'lists_create_with',
          extraState: {
            itemCount: 3,
          },
        },
        {
          kind: 'block',
          type: 'lists_repeat',
          inputs: {
            NUM: {
              block: {
                type: 'math_number',
                fields: {
                  NUM: 5,
                },
              },
            },
          },
        },
        {
          kind: 'block',
          type: 'lists_length',
        },
        {
          kind: 'block',
          type: 'lists_isEmpty',
        },
        {
          kind: 'block',
          type: 'lists_indexOf',
          fields: {
            END: 'FIRST',
          },
        },
        {
          kind: 'block',
          type: 'lists_getIndex',
          fields: {
            MODE: 'GET',
            WHERE: 'FROM_START',
          },
        },
        {
          kind: 'block',
          type: 'lists_setIndex',
          fields: {
            MODE: 'SET',
            WHERE: 'FROM_START',
          },
        },
      ],
    },
    {
      kind: 'sep',
    },
    {
      kind: 'category',
      name: 'Variables',
      categorystyle: 'variable_category',
      custom: 'VARIABLE',
    },
    {
      kind: 'category',
      name: 'Functions',
      categorystyle: 'procedure_category',
      custom: 'PROCEDURE',
    },
  ],
}

export const blockly = Blockly.inject('blockly', {
  toolbox,
  renderer: 'zelos',
  horizontalLayout: true,
  theme: ModernTheme,
  zoom: {
    controls: true,
    wheel: true,
  },
})

blockly.addChangeListener((event) => {
  localStorage.setItem(
    'blockly',
    JSON.stringify(serialization.workspaces.save(blockly))
  )
})

try {
  serialization.workspaces.load(
    JSON.parse(localStorage.getItem('blockly') || '{}'),
    blockly
  )
} catch {
  //
}

const start = document.getElementById('blockly-start')!
const stop = document.getElementById('blockly-stop')!

start.addEventListener('click', () => {
  start.setAttribute('disabled', 'disabled')
  stop.removeAttribute('disabled')
  const code = javascriptGenerator.workspaceToCode(blockly)
  console.log(code)
  sval.run(code)
  sval.run(`game.start();\n`)
})

stop.addEventListener('click', () => {
  start.removeAttribute('disabled')
  stop.setAttribute('disabled', 'disabled')
  sval.run('game.stop();')
})
