
import ReactFlow, { Controls, Panel, useStoreApi, useReactFlow, Background, BackgroundVariant } from 'reactflow';
// import { useStoreState} from 'react-flow-renderer';
import {shallow} from 'zustand/shallow';
import './App.css'
import DonwloadButton from './component/DownloadButton';
import useStore from './store.js';
// we need to import the React Flow styles to make it work
import 'reactflow/dist/style.css';

import MindMapNode from './MidMapNode/index';
import MindMapEdge from './MindMapEdge/index';
import { useRef } from 'react';
import { useCallback } from 'react';
import ConnectionLine from './ConnectionLine.jsx';




const nodeTypes = {
 mindmap: MindMapNode
}

const edgeTypes = {
  mindmap: MindMapEdge
}

const selector = (state) =>({
  nodes: state.nodes,
  edges:state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  addParentNode: state.addParentNode,
  handleSave: state.handleSave,
  handleRestore: state.handleRestore,
  exportToJson: state.exportToJson
})



function Flow() {
  const {nodes, edges, onNodesChange, onEdgesChange, addChildNode, addParentNode, handleSave,
    handleRestore,  exportToJson} = useStore(selector, shallow)
  const nodeOrigin = [0.5, 0.5]  


  const connectingNodeId = useRef(null)
  
  const store = useStoreApi();
  const { project } = useReactFlow();
  const getChildNodePosition = (event, parentNode) =>{
    const {domNode } = store.getState();

    console.log("store.getState()")
    console.log(store.getState());

     // we need to check if these properites exist, because when a node is not initialized yet,
    // it doesn't have a positionAbsolute nor a width or height
    if(!domNode || !parentNode?.positionAbsolute || !parentNode.width || !parentNode?.height ){
      return;
    }

    const {top, left} = domNode.getBoundingClientRect();


    const panePosition = project({
      x: event.clientX - left,
      y: event.clientY - top 
    })

    return {
      x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width /2,
      y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    }


  }
  
  const onConnectStart = useCallback((_, {nodeId}) =>{
    connectingNodeId.current = nodeId    
  }, []);

  const onConnectEnd = useCallback((event) =>{
    const {nodeInternals} = store.getState();
    const targetIsPane = (event.target).classList.contains('react-flow__pane');
    const node = event.target.closest('.react-flow__node')
    if(node){
      console.log('this is node')
      node.querySelector('input')?.focus({preventScroll: true})
    }else if(targetIsPane && connectingNodeId.current){
      const parentNode = nodeInternals.get(connectingNodeId.current)
      const childNodePosition = getChildNodePosition(event, parentNode);
      console.log(`add new node with parent node  ${connectingNodeId.current}`)

      if(parentNode && childNodePosition){
        addChildNode(parentNode, childNodePosition)
      }
    }

    
  }, [getChildNodePosition])

  function onNodeDoubleClick(event){
    const input = event.target.closest('.dragHandle')?.nextElementSibling;
    input?.focus({preventScroll: true})
  }

  function onPaneClick(event) {
    const {nodeInternals} = store.getState();
    //using project so that the position of the node, is in the right position where the use exactly click
    const position = project({
      x: event.clientX,
      y: event.clientY,
    })
    if(nodeInternals.size === 0){
      addParentNode(position)
    }
  }


  return (
    <ReactFlow 
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodeOrigin={nodeOrigin}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      onConnectStart={onConnectStart}
      onConnectEnd={onConnectEnd}
      connectionLineComponent={ConnectionLine}
      onNodeDoubleClick={onNodeDoubleClick}
      onPaneClick={onPaneClick}
      fitView
    >
      <Controls showInteractive={false} />
      <Panel position="top-left" className='panel-title'>React Flow Mind Map</Panel>
      <Panel position="top-right" className='react-flow__panel-save-restore'>    <DonwloadButton ></DonwloadButton> <button className='panel-save-restore__save-btn' onClick={handleSave}>Save</button><button className='panel-save-restore__restore-btn' onClick={handleRestore}>Restore </button> <button onClick={ exportToJson} className='panel-save-restore__export-btn'>Export</button> </Panel>
      
  
      <Background gap={20}  color='#eee' variant={BackgroundVariant.Lines}></Background>
    </ReactFlow>
  );
}

export default Flow;
