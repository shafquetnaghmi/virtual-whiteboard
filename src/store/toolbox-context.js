import { createContext } from "react";

const toolboxContext = createContext({
    toolboxState: {},
    changeStrokeHandler: () => {},
    changeFillHandler: () => {},
    changeSize: () => {},
});

export default toolboxContext;