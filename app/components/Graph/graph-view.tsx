import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { GraphModel } from './graph-model';
import './graph.less';

/**
 * Properties interface
 * @type {object}
 * @property {GraphModel=} model
 */
interface Props {
   model?: GraphModel
}

/**
 * State interface
 * @type {object}
 * @property {any=} canvas
 * @property {any=} ctx
 */
interface State {
   canvas?: any;
   ctx?: any;
}

/**
 * Class represents GraphView
 * @class
 * @param {GraphModel} model
 */
export class GraphView extends React.Component<Props, State> {
   private wrapper: any;
   private canvas: any;
   private ctx: any;
   private timeout: any; // rerender timeout
   private mouseDown: boolean = false; // is mouse down
   private startMousePointX: number; // mouse down coordinates ( start move point )
   private startMousePointY: number;
   private node: any; // current node
   private startNodePointX: number; // node coordinates on move start moment
   private startNodePointY: number;

   constructor( props: Props ) {
      super( props );
      this.state = {};
   }

   componentDidMount() {

      /* prepare canvas */
      this.canvas = this.refs.canvas;
      this.wrapper = ReactDOM.findDOMNode( this ).parentNode;
      this.ctx = this.canvas.getContext( '2d' )
      this.canvas.width = this.wrapper.clientWidth;
      this.canvas.height = this.wrapper.clientHeight;

      /* draw */
      this.draw();

      /* set listeners for move nodes */
      /* get current node*/
      this.canvas.onmousedown = ( e: any ) => {

         /* get canvas offset */
         const rect = this.canvas.getBoundingClientRect();
         this.startMousePointX = e.clientX - rect.left; // current mouse point
         this.startMousePointY = e.clientY - rect.top;

         /* get node on mouse down */
         for( let node of this.props.model.nodes ) {
            const beginX = node.pos[ 0 ] - node.width/2; // start point of node/box by axis x
            const endX = node.pos[ 0 ] + node.width/2; // end point of node/box by axis x
            const beginY = node.pos[ 1 ] - node.height/2; // start point of node/box by axis y
            const endY = node.pos[ 1 ] + node.height/2; // end point of node/box by axis y

            /* if event inside node/box */
            if( this.startMousePointX > beginX && this.startMousePointX < endX && this.startMousePointY > beginY && this.startMousePointY < endY ) {
               this.canvas.style.cursor = 'grabbing';
               this.mouseDown = true;
               this.node = node; // get current node
               this.startNodePointX = this.node.pos[ 0 ]; // remember start move point
               this.startNodePointY = this.node.pos[ 1 ];
            }
         }
         return;
      }

      /* end move */
      this.canvas.onmouseup = ( e: any ) => ( this.mouseDown = false, this.canvas.style.cursor = 'auto' );
      this.canvas.onmouseout = ( e: any ) => ( this.mouseDown = false, this.canvas.style.cursor = 'auto' );

      /* move node */
      this.canvas.onmousemove = ( e: any ) => {
         if( ! this.mouseDown ) {
            return;
         }

         /* get canvas offset for fix coordinates */
         const rect = this.canvas.getBoundingClientRect();
         const x = e.clientX - rect.left; // current coordinates
         const y = e.clientY - rect.top;

         /* update coordinates and redraw */
         this.node.pos[ 0 ] = this.startNodePointX - ( this.startMousePointX - x );
         this.node.pos[ 1 ] = this.startNodePointY - ( this.startMousePointY - y );
         this.draw();
         return;
      }

      /* for dynamically resize canvas */
      window.addEventListener( 'resize', () => this.onResize());
   }

   componentWillMount() {

      /* dynamically resize canvas */
      this.onResize();
      return;
   }

   componentWillUnmount() {

      /* for dynamically resize canvas */
      window.removeEventListener( 'resize', () => this.onResize());
      return;
   }

   /**
    * Resize canvas on resize window
    */
   onResize() {

      /* throttle resize event for performance issue */
      ! this.timeout && ( this.timeout = setTimeout(() => {
         this.timeout = null;
         this.canvas.width = this.wrapper.clientWidth;
         this.canvas.height = this.wrapper.clientHeight;
         this.draw();
      }, 50 ));
      return;
   }

   /**
    * Draw graph
    */
   draw() {
      this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height );

      /* draw links ( lines ) */
      for( let link of this.props.model.links ) {
         const from = this.props.model.nodes[ link.from - 1 ].pos; // fix index for from 0
         const to = this.props.model.nodes[ link.to - 1 ].pos;
         this.ctx.beginPath();
         this.ctx.moveTo( from[ 0 ], from[ 1 ]);
         this.ctx.lineWidth = 1;
         this.ctx.lineTo( to[ 0 ], to[ 1 ]);
         this.ctx.strokeStyle = '#444';
         this.ctx.stroke();
      }

      /* draw nodes ( boxes ) */
      for( let node of this.props.model.nodes ) {

         /* rectangle */
         this.ctx.shadowColor = '#BBB';
         this.ctx.shadowBlur = 1;
         this.ctx.shadowOffsetX = 3;
         this.ctx.shadowOffsetY = 3;
         this.ctx.fillStyle = node.color;
         this.ctx.fillRect( node.pos[ 0 ] - node.width/2, node.pos[ 1 ] - node.height/2, node.width, node.height );
         this.ctx.shadowOffsetX = 0;
         this.ctx.shadowOffsetY = 0;

         /* text label */
         this.ctx.fillStyle = 'white';
         this.ctx.textAlign = 'center';
         this.ctx.textBaseline = 'middle';
         this.ctx.font = ( node.height > 5 && ( node.height - 5 ) || node.height ) + 'px sans-serif'; // if node.height > 5px we can make font a bit smaller
         this.ctx.fillText( node.label, node.pos[ 0 ], node.pos[ 1 ]);
      }
   }

   render() {
      return <canvas ref = 'canvas' className = 'graph-canvas' ></canvas>;
   }
}
