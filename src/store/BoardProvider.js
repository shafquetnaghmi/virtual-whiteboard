import React, { useReducer } from "react";
import boardcontext from "./board-context";
import { BOARD_ACTIONS, TOOL_ACTION_TYPES, TOOL_ITEMS } from "../constant";
import rough from "roughjs/bin/rough";
import { createRoughElement } from "../utils/element";
import getStroke from "perfect-freehand";
import { getSvgPathFromStroke } from "../utils/element";
import { isPointNearElement } from "../utils/element";  
const gen = rough.generator();
const boardReducer = (state, action) => {
  //updating state
  switch (action.type) {
    case BOARD_ACTIONS.CHANGE_TOOL: {
      return {
        ...state,
        activeToolItem: action.payload.tool,
      };
    }
    case BOARD_ACTIONS.CHANGE_ACTION_TYPE:{
        return{
            ...state,
            toolActionType:action.payload.actionType,//actionType naam se kuch bhejunga toh wahi yaha pe aayega
        }
    }
    case BOARD_ACTIONS.DRAW_DOWN: {
      const { clientX, clientY, stroke, fill, size } = action.payload;
      const newElement = createRoughElement(
        state.elements.length,
        clientX,
        clientY,
        clientX,
        clientY,
        { type: state.activeToolItem, stroke, fill, size }
      );
      const prevElements = [...state.elements];
      return {
        ...state,
        elements: [...prevElements, newElement],
        toolActionType:state.activeToolItem===TOOL_ITEMS.TEXT
        ?TOOL_ACTION_TYPES.WRITING
        :TOOL_ACTION_TYPES.DRAWING,
        //here we have set the toolActionType to DRAWING so that we can draw the line in "DRAW_MOVE" case
      };
    }
    case BOARD_ACTIONS.DRAW_MOVE: {
      const { clientX, clientY } = action.payload;
      const newElements = [...state.elements];
      const index = newElements.length - 1;
      const { type } = newElements[index];
      switch (type) {
        case TOOL_ITEMS.LINE:
        case TOOL_ITEMS.RECTANGLE:
        case TOOL_ITEMS.CIRCLE:
        case TOOL_ITEMS.ARROW:
          const { x1, y1, stroke, fill, size } = newElements[index];
          const newElement = createRoughElement(
            index,
            x1,
            y1,
            clientX,
            clientY,
            { type: state.activeToolItem, stroke, fill, size }
          );
          newElements[index] = newElement; //for line we need x1,x2,y1,y2 so at first we were giving x1,y1,x1,y1 but to make a
          // line we need different x2,y2 so on mouseup we go our new x2,y2 and now we are updating the last index with the updated value
          return {
            ...state, //returning the new state which has the updated elements array & new point also.
            elements: newElements,
          };
        case TOOL_ITEMS.BRUSH:
          newElements[index].points = [
            ...newElements[index].points,
            { x: clientX, y: clientY },
          ];
          newElements[index].path = new Path2D(
            getSvgPathFromStroke(getStroke(newElements[index].points))
          );
          return {
            ...state,
            elements: newElements,
          };
        
          
            default:
              break;
          }
    }
    case  BOARD_ACTIONS.CHANGE_TEXT:{
        const index=state.elements.length-1;
        const newElements=[...state.elements];
        newElements[index].text=action.payload.text;
        //newElements[index].stroke=action.payload.stroke;
        return {
            ...state,
            elements:newElements,
            toolActionType:TOOL_ACTION_TYPES.NONE,
        }
    }
    // case BOARD_ACTIONS.DRAW_UP: {
    //   return {
    //     ...state,
    //     toolActionType: TOOL_ACTION_TYPES.NONE,
    //   };
    // }
    case BOARD_ACTIONS.ERASE: {
        const { clientX, clientY } = action.payload;
        let newElements = [...state.elements];
        newElements = newElements.filter((element) => {
            return !(isPointNearElement(element,clientX,clientY));  //if the point is near the element then we will remove that element
        });
        return {
            ...state,
            elements: newElements, 
        }
    }
    default:
      return state;
  }
};
const initialBoardState = {
  // two states are here
  activeToolItem: TOOL_ITEMS.BRUSH, //to track the current tool
  elements: [],
  toolActionType: TOOL_ACTION_TYPES.NONE, //to track the current action type like if we are in drawing mode or not or in erasingn mode
};
const BoardProvider = ({ children }) => {
  const [boardState, dispatchBoardAction] = useReducer(
    boardReducer,
    initialBoardState
  );
  //boardStae is current state,dispatchBoardAction is function that will call BaordReducer to set the changed tool ,
  // boardReducer is a function that will change the tool ,initialBoardState is initial state
  //const [activeToolItem,setActiveToolItem]=useState(TOOL_ITEMS.LINE);

  const changeToolHandler = (tool) => {
    //function to set changed tool ,these are used as how we are using setstate
    //setActiveToolItem(tool);
    dispatchBoardAction({
      type: "CHANGE_TOOL",
      payload: {
        tool, //sending tool using payload to be set the changed tool
      },
    });
  };
  const boardMouseDownHandler = (event, toolboxState) => {
    //setState
    const { clientX, clientY } = event;
    //const roughEle=gen.line(clientX,clientY,clientX,clientY);
    // if(boardState.activeToolItem==TOOL_ITEMS.TEXT){
    //     dispatchBoardAction({
    //         type:BOARD_ACTIONS.CHANGE_ACTION_TYPE,
    //         payload:{
    //             actionType:TOOL_ACTION_TYPES.WRITING,
    //         }
    //     }); 
    // }
    if(boardState.toolActionType===TOOL_ACTION_TYPES.WRITING)return;
    if(boardState.activeToolItem===TOOL_ITEMS.ERASER){
        dispatchBoardAction({
            type:BOARD_ACTIONS.CHANGE_ACTION_TYPE,
            payload:{
                actionType:TOOL_ACTION_TYPES.ERASING,
            }
        })
        return;
    }
    dispatchBoardAction({
      type: "DRAW_DOWN",
      payload: {
        clientX,
        clientY,
        stroke: toolboxState[boardState.activeToolItem]?.stroke, //toolbox state is the state of toolbox
        fill: toolboxState[boardState.activeToolItem]?.fill,
        size: toolboxState[boardState.activeToolItem]?.size,
      },
    });
  };
  const boardMouseMoveHandler = (event) => {
    //setState
    const { clientX, clientY } = event;
    // toolActionype is a state which keeps track of the current action type and 
    // TOOL_ACTION_TYPES is a constant which has different action types like DRAWING,ERASING,NONE
    if(boardState.toolActionType===TOOL_ACTION_TYPES.WRITING)return;
    if (boardState.toolActionType === TOOL_ACTION_TYPES.DRAWING) {
      dispatchBoardAction({
        type: "DRAW_MOVE",
        payload: {
          clientX,
          clientY,
        },
      });
    }else if (boardState.toolActionType === TOOL_ACTION_TYPES.ERASING) {
      dispatchBoardAction({
        type: "ERASE",
        payload: {
          clientX,
          clientY,
        },
      });
    }
  };

  const boardMouseUpHandler = () => {
    //setState
    if(boardState.toolActionType===TOOL_ACTION_TYPES.WRITING)return;
    dispatchBoardAction({
    //   type: "DRAW_UP",
      type:BOARD_ACTIONS.CHANGE_ACTION_TYPE,
      payload:{
        actionType:TOOL_ACTION_TYPES.NONE,
      }
    });
  };
  const textAreaBlurHandler = (text,toolboxState) => {
    dispatchBoardAction({
        type:BOARD_ACTIONS.CHANGE_TEXT,
        payload:{
            text,
            // stroke:toolboxState[boardState.activeToolItem]?.stroke,
            // size:toolboxState[boardState.activeToolItem]?.size,
        }
    })
  };
  const boardContextValue = {
    //all the states are here or state handler(setState)
    activeToolItem: boardState.activeToolItem,
    changeToolHandler, //function to change the tool
    elements: boardState.elements,
    boardMouseDownHandler,
    boardMouseMoveHandler,
    toolActionType: boardState.toolActionType,
    boardMouseUpHandler,
    textAreaBlurHandler,
  };

  return (
    <div>
      <boardcontext.Provider value={boardContextValue}>
        {children}
      </boardcontext.Provider>
    </div>
  );
};
export default BoardProvider;
