
import { BaseEdge, getStraightPath} from "reactflow";

function MindMapEdge(props){
  
    // eslint-disable-next-line react/prop-types
    const {sourceX, sourceY, targetX, targetY } = props;
    const [edgePath] = getStraightPath({
        sourceX, sourceY, targetX, targetY 
    })

    return(
        <BaseEdge path={edgePath} {...props}/>
        ) 
}

export default MindMapEdge;