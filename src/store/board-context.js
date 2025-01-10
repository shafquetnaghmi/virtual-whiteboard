import { createContext } from "react";

const boardcontext=createContext({
    activeToolItem:"",
    elements:[],
    boardMouseDownHandler:()=>{},
    changeToolHandler:()=>{},
    boardMouseMoveHandler:()=>{},
    toolActionType:"",
    boardMouseUpHandler:()=>{},
})

export default boardcontext;