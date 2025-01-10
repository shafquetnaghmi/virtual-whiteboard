import React, { useReducer } from "react";
import toolboxContext from "./toolbox-context";
import { TOOL_ITEMS, COLORS, TOOLBOX_ACTIONS } from "../constant";

const toolboxReducer = (state, action) => {
  switch(action.type){
      case TOOLBOX_ACTIONS.CHANGE_STROKE:{
          const {tool,stroke}=action.payload;
          const newState={...state};
          newState[action.payload.tool].stroke=action.payload.stroke; //updating the state
          return newState;}
      case TOOLBOX_ACTIONS.CHANGE_FILL:{
            const {tool,stroke}=action.payload;
            const newState={...state};
            newState[action.payload.tool].fill=action.payload.fill; //updating the state
            return newState;}
      case TOOLBOX_ACTIONS.CHANGE_SIZE:{
            const {tool,size}=action.payload;
            const newState={...state};
            newState[action.payload.tool].size=action.payload.size; //updating the state
            return newState;
        }
      default:
          return state;
    }
};
const initialToolboxState = {
  [TOOL_ITEMS.BRUSH]: {
    stroke: COLORS.BLACK,
    siz1: 1,
  },
  [TOOL_ITEMS.LINE]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.RECTANGLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.CIRCLE]: {
    stroke: COLORS.BLACK,
    fill: null,
    size: 1,
  },
  [TOOL_ITEMS.ARROW]: {
    stroke: COLORS.BLACK,
    size: 1,
  },
  [TOOL_ITEMS.TEXT]: {
    stroke: COLORS.BLACK,
    size: 32,
  },
};

const ToolboxProvider = ({ children }) => {
  const [ toolboxState, dispatchToolboxAction ] = useReducer(
    toolboxReducer,
    initialToolboxState
  );

  const changeStrokeHandler=(tool,stroke)=>{
    dispatchToolboxAction({
      type:"CHANGE_STROKE",
      payload:{
        tool,
        stroke,
      }})
  }

  const changeFillHandler=(tool,fill)=>{
    dispatchToolboxAction({
      type:"CHANGE_FILL",
      payload:{
        tool,
        fill,
      }})
  }
  const changeSizeHandler=(tool,size)=>{
    dispatchToolboxAction({
      type:"CHANGE_SIZE",
      payload:{
        tool,
        size,
      }})
  }
  const toolboxContextValue = {
    toolboxState,
    changeStrokeHandler,
    changeFillHandler,
    changeSize:changeSizeHandler,

  };
  return (
    <toolboxContext.Provider value={toolboxContextValue}>
      {children}
    </toolboxContext.Provider>
  );
};

export default ToolboxProvider;
