/**
 * Node interface
 * @type {object}
 * @property {string} label
 * @property {Array.<number>} pos
 * @property {string} color
 * @property {number} width
 * @property {number} height
 */
export interface Node {
   label: string;
   pos: Array<number>;
   color: string;
   width: number;
   height: number;
}

/**
 * Link interface
 * @type {object}
 * @property {number} from
 * @property {number} to
 */
export interface Link {
   from: number; // index of first node
   to: number; // index of second node
}

/**
 * Class represents GraphModel
 * @class
 * @param {Array.<Node>} nodes
 * @param {Array.<Link>} links
 */
export class GraphModel {
   public nodes: Array<Node>;
   public links: Array<Link>;

   constructor( nodes: Array<Node>, links: Array<Link> ) {
      this.nodes = nodes;
      this.links = links;
   }

   /**
    * @return {Array.<Link>} Array of links
    */
   getLinks(): Array<Link> {
      return this.links;
   };

   /**
    * @return {Array.<Node>} Array of nodes
    */
   getNodes(): Array<Node> {
      return this.nodes;
   };

   /**
    * Set nodes and links
    * @param {Array.<Node>} nodes
    * @param {Array.<Link>} links
    */
   setNodesAndLinks( nodes: Array<Node>, links: Array<Link> ) {
      this.nodes = nodes;
      this.links = links;
   };
}
