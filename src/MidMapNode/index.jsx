/* eslint-disable react/prop-types */
import { Handle, Position } from "reactflow";

import useStore from "../store";
import { useEffect, useLayoutEffect, useRef } from "react";

function MindMapNode({
  // eslint-disable-next-line react/prop-types
  id,
  data,
}) {
  const inputRef = useRef()
  useLayoutEffect(() =>{
    if(inputRef.current){
      inputRef.current.style.width = `${data.label.length * 8}px`
    }
  }, [data.label.length])

  useEffect(()=>{
    setTimeout(() => {
      if(inputRef.current){
        inputRef.current.focus({preventScroll:true})
      }
    }, 1) ;
  }, [])
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  return (
    <>
      <div className="inputWrapper">
        <div className="dragHandle">
          {/* icon taken from grommet https://icons.grommet.io */}
          <svg viewBox="0 0 24 24">
            <path
              fill="#333"
              stroke="#333"
              strokeWidth="1"
              d="M15 5h2V3h-2v2zM7 5h2V3H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2zm8 8h2v-2h-2v2zm-8 0h2v-2H7v2z"
            />
          </svg>
        </div>
        <input
          value={data.label}
          onChange={(evt) => updateNodeLabel(id, evt.target.value)}
          className="input"
          ref={inputRef}
        />
      </div>
        <Handle type="target" position={Position.Top} />
        <Handle type="source" position={Position.Bottom} />
    </>
  );
}

export default MindMapNode;
