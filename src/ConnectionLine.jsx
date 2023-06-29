/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */

// eslint-disable-next-line react-refresh/only-export-components
export default ({
    fromX, fromY, 
    fromPosition,
    toX,
    toY,
    toPosition,
    connectionLineType,
    connectionLineStyle
}) =>{

    return (
        <g>
           <path
           fill='none'
           stroke='#ff9600'
           strokeWidth={1.5}
           d={`M${fromX}, ${fromY} C${fromX},${fromY} ${fromX}, ${toY} ${toX}, ${toY} `}

        //    d={`M${fromX}, ${fromY} L ${toX}, ${toY}`}
           /> 
        </g>
    )
}