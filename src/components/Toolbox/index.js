import React from "react";
import classes from "./index.module.css";
import cx from "classnames";
import { COLORS, FILL_TOOL_TYPES, SIZE_TOOL_TYPES, STROKE_TOOL_TYPES, TOOL_ITEMS } from "../../constant";
import { useContext } from "react";
import boardcontext from "../../store/board-context";
import toolboxContext from "../../store/toolbox-context";

const Toolbox = () => {
  const { activeToolItem } = useContext(boardcontext);
  const { toolboxState, changeStrokeHandler, changeFillHandler ,changeSize} =useContext(toolboxContext);
  const strokeColor = toolboxState[activeToolItem]?.stroke;
  const fillColor = toolboxState[activeToolItem]?.fill;
  const size=toolboxState[activeToolItem]?.size;
  //console.log(strokeColor);
  return (
    <div className={classes.container}>
      {STROKE_TOOL_TYPES.includes(activeToolItem) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>stroke color</div>
          <div className={classes.colorsContainer}>
          <div>
              <input
                className={classes.colorPicker}
                type="color"
                value={strokeColor}
                onChange={(e) => changeStrokeHandler(activeToolItem, e.target.value)}
              ></input>
            </div>
            {Object.keys(COLORS).map((color) => {
              return (
                <div
                  key={color}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: strokeColor === COLORS[color],
                  })}
                  style={{ backgroundColor: COLORS[color] }}
                  onClick={() => {
                    changeStrokeHandler(activeToolItem, COLORS[color]);
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      )}
      {FILL_TOOL_TYPES.includes(activeToolItem) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>fill color</div>
          <div className={classes.colorsContainer}>
          {fillColor === null ? (
              <div
                className={cx(classes.colorPicker, classes.noFillColorBox)}
                onClick={() => changeFillHandler(activeToolItem, COLORS.BLACK)}
              ></div>
            ) : (
              <div>
                <input
                  className={classes.colorPicker}
                  type="color"
                  value={strokeColor}
                  onChange={(e) => changeFillHandler(activeToolItem, e.target.value)}
                ></input>
              </div>
            )}
            <div
              className={cx(classes.colorBox, classes.noFillColorBox, {
                [classes.activeColorBox]: fillColor === null,
              })}
              onClick={() => changeFillHandler(activeToolItem, null)}
            ></div>
            {Object.keys(COLORS).map((color) => {
              return (
                <div
                  key={color}
                  className={cx(classes.colorBox, {
                    [classes.activeColorBox]: fillColor === COLORS[color],
                  })}
                  style={{ backgroundColor: COLORS[color] }}
                  onClick={() => {
                    changeFillHandler(activeToolItem, COLORS[color]);
                  }}
                ></div>
              );
            })}
          </div>
        </div>
      )}

      {SIZE_TOOL_TYPES.includes(activeToolItem) && (
        <div className={classes.selectOptionContainer}>
          <div className={classes.toolBoxLabel}>{activeToolItem===TOOL_ITEMS.TEXT ?"Font Size":"Brush size"}</div>
          <input type="range" 
          step={1}
          min={activeToolItem===TOOL_ITEMS.TEXT ?12 :1}
          max={activeToolItem===TOOL_ITEMS.TEXT ?64 :10}
          value={size}
          onChange={(event)=>changeSize(activeToolItem,event.target.value)
          }
          />
        </div>
      )}
    </div>
  );
};

export default Toolbox;
