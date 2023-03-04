
class CustomCategory extends Blockly.ToolboxCategory {
    constructor(categoryDef, toolbox, opt_parent) {
        super(categoryDef, toolbox, opt_parent)
    }

    addColourBorder_(colour) {
        this.rowDiv_.style.backgroundColor = colour
    }

    /** @override */
    setSelected(isSelected) {
        if (isSelected) {
            // add classes to change appearance
            this.rowDiv_.classList.add('selected')
        } else {
            this.rowDiv_.style.backgroundColor = this.colour_;
            this.rowDiv_.classList.remove('selected')
        }
        // This is used for accessibility purposes.
        Blockly.utils.aria.setState(/** @type {!Element} */(this.htmlDiv_),
            Blockly.utils.aria.State.SELECTED, isSelected);
    }

    createIconDom_() {
        const i = document.createElement('i')
        i.classList.add('material-icons')
        if (this.cssConfig_.icon !== 'blocklyTreeIcon') {
            i.innerText = this.cssConfig_.icon
        }
        return i
    }

}
Blockly.registry.register(
    Blockly.registry.Type.TOOLBOX_ITEM,
    Blockly.ToolboxCategory.registrationName,
    CustomCategory, true
)