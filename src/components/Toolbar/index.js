import React, { useContext, useState } from 'react'
import classes from "./index.module.css"
import cx from "classnames"
import { TOOL_ITEMS } from '../../constant';
import { LuRectangleHorizontal } from "react-icons/lu";
import {
  FaSlash,
  FaRegCircle,
  FaArrowRight,
  FaPaintBrush,
  FaEraser,
  FaUndoAlt,
  FaRedoAlt,
  FaFont,
  FaDownload,
} from "react-icons/fa";
import boardcontext from '../../store/board-context';

const handleDownloadClick=()=>{
  const canvas=document.getElementById("canvas");
  const data=canvas.toDataURL("image/png");
  const anchor=document.createElement("a"); 
  anchor.href=data;
  anchor.download="board.png";
  //document.write('<img src="'+img+'"/>');
  anchor.click();
}

const Toolbar = () => {
  const {activeToolItem,changeToolHandler,undo,redo}=useContext(boardcontext);
  return (
    <div className={classes.container}>
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.BRUSH})} 
      onClick={()=>changeToolHandler(TOOL_ITEMS.BRUSH)}><FaPaintBrush/></div>
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.LINE})} 
      onClick={()=>changeToolHandler(TOOL_ITEMS.LINE)}><FaSlash/></div>
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.RECTANGLE})} 
      onClick={()=>changeToolHandler(TOOL_ITEMS.RECTANGLE)}> <LuRectangleHorizontal/></div>
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.CIRCLE})} 
      onClick={()=>changeToolHandler(TOOL_ITEMS.CIRCLE)}> <FaRegCircle/></div>
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.ARROW})} 
      onClick={()=>changeToolHandler(TOOL_ITEMS.ARROW)}> <FaArrowRight/></div>
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.ERASER})} 
      onClick={()=>changeToolHandler(TOOL_ITEMS.ERASER)}> <FaEraser/></div>
      <div className={cx(classes.toolItem,{[classes.active]:activeToolItem===TOOL_ITEMS.TEXT})} 
      onClick={()=>changeToolHandler(TOOL_ITEMS.TEXT)}> <FaFont/></div>

      <div className={classes.toolItem} 
      onClick={()=>undo()}> <FaUndoAlt/></div>
      <div className={classes.toolItem} 
      onClick={()=>redo()}> <FaRedoAlt/></div>
      <div className={classes.toolItem} 
      onClick={handleDownloadClick}> <FaDownload/></div>
    </div>
  )
}
export default Toolbar