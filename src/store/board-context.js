import { createContext } from "react";

const boardcontext=createContext({
    activeToolItem:"",
    elements:[],
    history:[[]],
    index:0,
    boardMouseDownHandler:()=>{},
    changeToolHandler:()=>{},
    boardMouseMoveHandler:()=>{},
    toolActionType:"",
    boardMouseUpHandler:()=>{},
})

export default boardcontext;