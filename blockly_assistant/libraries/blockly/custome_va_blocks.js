// Blockly.common.defineBlocksWithJsonArray([

//   {
//     "type": "va_main",
//     "message0": "main function",
//     "nextStatement": null,
//     "colour": 300,
//     "tooltip": "Connect your code under this block.",
//     "helpUrl": ""
//   }
// ]);
// Blockly.JavaScript['va_print'] = ;
// Blockly.JavaScript['va_main'] = (block) => {
//   var code = 'console.log(' + value_message + ');\n'
//   return code;
// };

const custom_blocks = []
const commit_blocks = () => {
  Blockly.common.defineBlocksWithJsonArray(custom_blocks)
}
const create_block = ({ json_format, js_function }) => {
  custom_blocks.push(json_format)
  Blockly.JavaScript[json_format.type] = js_function
  document.getElementById('predefined').insertAdjacentHTML('beforeend', `
    <block type="${json_format.type}"></block>
  `)
}

// Speak/Print to user block
create_block({
  json_format: {
    "type": "va_main",
    "message0": "main function %1 %2",
    "args0": [
      {
        "type": "input_dummy"
      },
      {
        "type": "input_statement",
        "name": "whole_function"
      }
    ],
    "colour": 300,
    "tooltip": "Connect your code under this block.",
    "helpUrl": ""
  },
  js_function: (block) => {
    const whole_code = Blockly.JavaScript.statementToCode(block, 'whole_function');
    // TODO: Assemble JavaScript into code variable.
    var code = `const main = async () => {${whole_code}};main()\n`;
    return code;
  },
})

// Speak/Print to user block
create_block({
  json_format: {
    "type": "va_print",
    "message0": "Tell user %1",
    "args0": [
      {
        "type": "input_value",
        "name": "Message",
        "check": "String"
      }
    ],
    "inputsInline": true,
    "previousStatement": null,
    "nextStatement": null,
    "colour": 300,
    "tooltip": "Connect a text block of what you want the application to say",
    "helpUrl": ""
  },
  js_function: (block) => {
    const value_message = Blockly.JavaScript.valueToCode(block, 'Message', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'await app.controls.print(' + value_message + ');\n'
    return code;
  },
})
create_block({
  json_format: {
    "type": "block_type",
    "message0": "Get input from user",
    "output": "String",
    "colour": 300,
    "tooltip": "This block will text or listen to the user and return what they said",
    "helpUrl": ""
  },
  js_function: (block) => {
    var code = 'await app.controls.get_input()';
    // TODO: Change ORDER_NONE to the correct strength.
    return [code, Blockly.JavaScript.ORDER_NONE];
  }
})

// commit blocks to app
commit_blocks()