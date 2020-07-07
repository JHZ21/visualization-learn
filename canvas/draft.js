{
  backspace: function () {
    let lastActiveLine,
      activeIndex,
      t, w;
    this.context.save()

    if (this.activeLine.caret === 0) {
      if (! this.activeLineIsTopLine()) {
        this.erase(this.context, this.drawingSurface)
        this.moveUpOneLine()
        this.draw()
      }
    } else {
      this.context.fillStyle = fillStylySelect.value
      this.context.strokeStyle = strokeStyleSelect.value;
      this.erase(this.context, this.drawingSurface)
      this.activeLine.removeCharacterBeforeCaret()

      t = this.activeLine.text.slice(0, this.activeLine.caret)
      w = this.context.measure(t).width

      this.move

    }
  }
}