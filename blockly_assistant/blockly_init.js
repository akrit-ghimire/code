const blocklyArea = document.getElementById('workspace');
const blocklyDiv = document.getElementById('blocklyWorkspace');
const options = {
    toolbox: document.getElementById('toolbox-categories'),
    collapse: false,
    renderer: 'Zelos',
    theme: Blockly.Theme.defineTheme('themeName', custom_zelos_theme),
    comments: true,
    maxBlocks: Infinity,
    trashcan: true,
    horizontalLayout: true,
    toolboxPosition: 'end',
    scrollbars: true,
    sounds: true,
    zoom: {
        controls: true,
        wheel: true,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
    }
};
const workspace = Blockly.inject(blocklyDiv, options);

// resize the workspace
const onresize = () => {
    // Compute the absolute coordinates and dimensions of blocklyArea.
    let element = blocklyArea;
    let x = 0;
    let y = 0;
    do {
        x += element.offsetLeft;
        y += element.offsetTop;
        element = element.offsetParent;
    } while (element);
    // Position blocklyDiv over blocklyArea.
    blocklyDiv.style.left = x + 'px';
    blocklyDiv.style.top = y + 'px';
    blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
    blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
    Blockly.svgResize(workspace);
};
window.addEventListener('resize', onresize, false);