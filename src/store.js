import {
    applyNodeChanges,
    applyEdgeChanges,
  } from 'reactflow';

  import { create } from 'zustand';
 
  import {nanoid} from 'nanoid/non-secure';
  export const RFState = {
    nodes: [],
    edges: [],
    onNodesChange: null,
    onEdgesChange: null,
  };

  const initialNode =  {
    id: 'root',
    type: 'mindmap',
    data: { label: 'React Flow Mind Map' },
    position: { x: 0, y: 0 },
  }
  
  const useStore = create((set, get) => ({
    nodes: [
      initialNode
    ],
    edges: [],
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    addParentNode: ( position)=> {
      const newNode = {
        ...initialNode, position
      }

      
      set({
        nodes: [...get().nodes, newNode]
      })
    },
    addChildNode : (parentNode, position) =>{
      const newNode = {
        id: nanoid(),
        type : 'mindmap',
        data: {label: 'New Node'},
        position, 
        parentNode: parentNode.id
      }

      const newEdge = {
        id: nanoid(),
        source : parentNode.id,
        target: newNode.id,
        style: {
          stroke: '#ff9600',
          strokeWidth: "2px",
        }
      };

      set({
        nodes: [...get().nodes, newNode],
        edges: [...get().edges, newEdge]
      });
    },
    updateNodeLabel: (nodeId, label) =>{
      set({
        nodes : get().nodes.map(node =>{
          if(node.id === nodeId) {
                  // it's important to create a new object here, to inform React Flow about the changes
            node.data = {...node.data, label};
          }
          return node;
        }),

      })
    },
    handleSave: () =>{

      const mindmapJSON = JSON.stringify([get().nodes, get().edges]);
      try {
        localStorage.setItem('data-mindmap', mindmapJSON);
        alert('Save data in local storage successfull!');
      } catch (error) {
        console.error('Error storing item in local storage', error)
      }
    },
    handleRestore: () =>{
      try {
        const mindmapJSON = localStorage.getItem('data-mindmap');
        if(mindmapJSON === null){
          alert("You haven't save a mind map!");
          return;
        }
        const [nodes, edges] = JSON.parse(mindmapJSON);
        console.log(mindmapJSON)
        set({
          nodes: nodes,
          edges: edges
        })
      } catch (error) {
        console.error('Error restoring item in local storage', error)
      }
    },
    exportToJson :() =>{
        const filename = 'data.json';
        const mindmapJSON = JSON.stringify([get().nodes, get().edges]);

        let element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(mindmapJSON))
        element.setAttribute('download', filename);
        element.style.display = 'none'
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    },
  }));
  
  export default useStore;


  