import { use, useContext, useEffect, useRef } from "react";
import rough from "roughjs";
import boardcontext from "../../store/board-context";
import { TOOL_ACTION_TYPES } from "../../constant";
import toolboxContext from "../../store/toolbox-context";
import { TOOL_ITEMS } from "../../constant";
import classes from "./index.module.css"; 
function Board() {
  const canvasRef = useRef();
  const textAreaRef = useRef();
  const {
    elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    toolActionType,
    boardMouseUpHandler,
    textAreaBlurHandler,
  } = useContext(boardcontext);

  const { toolboxState } = useContext(toolboxContext);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }, []);

  useEffect(() => {
    //const ctx=canvas.getContext('2d');
    // ctx.fillStyle = "red";
    // ctx.fillRect(0,0,150,75);
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    context.save();
    const roughCanvas = rough.canvas(canvas);
    // const generator=roughCanvas.generator;
    // const rect1=generator.rectangle(10, 10, 100, 100);
    // let rect2 = generator.rectangle(10, 120, 100, 100, {fill: 'red',stroke:'blue'});
    // const c1=generator.circle(50, 280, 80)
    // roughCanvas.draw(rect1);
    // roughCanvas.draw(rect2);
    // roughCanvas.draw(c1)

    elements.forEach((element) => {
      switch (element.type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          roughCanvas.draw(element.roughEle);
          break;
        case TOOL_ITEMS.BRUSH:
          context.fillStyle = element.stroke;
          context.fill(element.path);
          context.restore();
        case TOOL_ITEMS.TEXT:
          context.textBaseline = "top";
          context.font = `${element.size}px Caveat`;
          context.fillStyle = element.stroke;
          context.fillText(element.text, element.x1, element.y1);
          context.restore();
        default:
          // return {
          // throw new Error("Type not recognized");}
          break;
      }
    });
    return () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    };
  }, [elements]);

  useEffect(() => {
    const textArea = textAreaRef.current;
    if(toolActionType===TOOL_ACTION_TYPES.WRITING){
      setTimeout(()=>{
        textArea.focus();
      },0);
    }
  },[toolActionType]);
  
  const handleMouseDown = (event) => {
    // const clientX=event.clientX;
    // const clientY=event.clientY;
    // console.log(clientX,clientY);
    boardMouseDownHandler(event, toolboxState);
  };
  const handleMouseMove = (event) => {
    //console.log("MouseMove:", event.clientX, event.clientY);
    // if(toolActionType===TOOL_ACTION_TYPES.DRAWING){
    //   boardMouseMoveHandler(event);
    // }
    boardMouseMoveHandler(event);
  };
  const handleMouseUp = () => {
    boardMouseUpHandler();
  };
  //console.log("ToolActionType:",toolActionType);
  return (
    <>
    
      {toolActionType === TOOL_ACTION_TYPES.WRITING && (
        <textarea
          type="text"
          ref={textAreaRef}
          className={classes.textElementBox}
          style={{
            top: elements[elements.length - 1].y1,
            left: elements[elements.length - 1].x1,
            fontSize: `$elements[elements.length-1]?.size}px`,
            color: elements[elements.length - 1]?.stroke,
          }}
          onBlur={(event)=>textAreaBlurHandler(event.target.value,toolboxState)}
        />
      )}

      <canvas
        ref={canvasRef}
        id="canvas"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </>
  );
}
export default Board;
