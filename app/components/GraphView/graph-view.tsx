import * as React from 'react';
import { GraphModel } from './graph-model';
import './graph.less';

interface Props {
   model?: GraphModel
}

interface State {
   canvas?: any;
   ctx?: any;
}

export class GraphView extends React.Component<Props, State> {
   private wrapper: any = document.getElementById( 'wrapper' );
   private canvas: any;
   private ctx: any;
   private timeout: any;
   private mouseDown: boolean = false;
   private pointX: number;
   private pointY: number;
   private node: any;
   private nodePointX: number;
   private nodePointY: number;

   constructor( props: Props ) {
      super( props );
      this.state = {};

      /* set data */
      props.model.setNodesAndLinks( props.model.nodes, props.model.links );
   }

   draw() {
      this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

      /* draw links */
      for( let link of this.props.model.links ) {
         const from = this.props.model.nodes[ link.from - 1 ].pos;
         const to = this.props.model.nodes[ link.to - 1 ].pos;
         this.ctx.beginPath();
         this.ctx.moveTo( from[ 0 ], from[ 1 ]);
         this.ctx.lineWidth = 3;
         this.ctx.lineTo( to[ 0 ], to[ 1 ]);
         this.ctx.strokeStyle = 'gray';
         this.ctx.stroke();
      }

      /* draw nodes */
      for( let node of this.props.model.nodes ) {

         /* rectangle */
         this.ctx.fillStyle = node.color;
         this.ctx.fillRect( node.pos[ 0 ] - node.width/2, node.pos[ 1 ] - node.height/2, node.width, node.height );

         /* label */
         this.ctx.fillStyle = 'white';
         this.ctx.textAlign = 'center';
         this.ctx.textBaseline = 'middle';
         this.ctx.font = node.height + 'px sans-serif';
         this.ctx.fillText( node.label, node.pos[ 0 ], node.pos[ 1 ]);
      }
   }

   componentDidMount() {
      this.canvas = this.refs.canvas;
      this.ctx = this.canvas.getContext( '2d' )
      this.canvas.width = this.wrapper.clientWidth;
      this.canvas.height = this.wrapper.clientHeight;
      this.draw();
      this.canvas.onmousedown = ( e: any ) => {
         const rect = this.canvas.getBoundingClientRect();
         this.pointX = e.clientX - rect.left;
         this.pointY = e.clientY - rect.top;

         /* get node */
         for( let node of this.props.model.nodes ) {
            const beginX = node.pos[ 0 ] - node.width/2;
            const endX = node.pos[ 0 ] + node.width/2;
            const beginY = node.pos[ 1 ] - node.height/2;
            const endY = node.pos[ 1 ] + node.height/2;
            if( this.pointX > beginX && this.pointX < endX && this.pointY > beginY && this.pointY < endY ) {
               this.canvas.style.cursor = 'grabbing';
               this.mouseDown = true;
               this.node = node;
               this.nodePointX = this.node.pos[ 0 ];
               this.nodePointY = this.node.pos[ 1 ];
            }
         }
      }
      this.canvas.onmouseup = ( e: any ) => ( this.mouseDown = false, this.canvas.style.cursor = 'auto' );
      this.canvas.onmouseout = ( e: any ) => ( this.mouseDown = false, this.canvas.style.cursor = 'auto' );
      this.canvas.onmousemove = ( e: any ) => {
         if( ! this.mouseDown ) {
            return;
         }
         const rect = this.canvas.getBoundingClientRect();
         const x = e.clientX - rect.left;
         const y = e.clientY - rect.top;

         /* update coordinates and redraw */
         this.node.pos[ 0 ] = this.nodePointX - ( this.pointX - x );
         this.node.pos[ 1 ] = this.nodePointY - ( this.pointY - y );
         this.draw();
         return;
      }

      /* for dynamically resize canvas */
      window.addEventListener( 'resize', () => this.onResize());
   }

   componentWillMount() {

      /* dynamically resize canvas */
      this.onResize();
   }

   componentWillUnmount() {

      /* for dynamically resize canvas */
      window.removeEventListener( 'resize', () => this.onResize());
   }

   onResize() {

      /* throttle resize event */
      ! this.timeout && ( this.timeout = setTimeout(() => {
         this.timeout = null;
         this.canvas.width = this.wrapper.clientWidth;
         this.canvas.height = this.wrapper.clientHeight;
         this.draw();
      }, 50 ));
   }

   render() {
      return <canvas ref = 'canvas' className = 'graph' ></canvas>;
   }
}
