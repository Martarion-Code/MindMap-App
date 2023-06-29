import { useReactFlow, getRectOfNodes, getTransformForBounds} from 'reactflow';

import {toPng } from 'html-to-image';


function downloadImage(dataUrl){
    const a = document.createElement('a');
    a.setAttribute('download', 'reactflow-mindmap.png');
    a.setAttribute('href',dataUrl);
    a.click();
}

const imageWidth  = 1600;
const imageHeight  = 900;

function DonwloadButton(){
    const {getNodes} = useReactFlow();
    const onClick = () =>{
        const nodesBounds = getRectOfNodes(getNodes());

        //[x, y, zoom]
        const transform = getTransformForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

        toPng(document.querySelector('.react-flow__viewport'), {
            backgroundColor: '#fff',
            width: imageWidth,
            height: imageHeight,
            style :{
                width: imageWidth,
                height: imageHeight,
                transform: `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`,
            }

        }).then(downloadImage)


    }

    return (

            <button className='panel-save-restore__download-btn' onClick={onClick} > Download Image</button>
     
    )
}


export default DonwloadButton;

