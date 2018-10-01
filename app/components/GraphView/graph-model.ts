export interface Node {
   label: string;
   pos: Array<number>;
   color: string;
   width: number;
   height: number;
}

export interface Link {
   from: number; // index of first node
   to: number; // index of second node
}

export class GraphModel {
   public nodes: Array<Node>;
   public links: Array<Link>;

   constructor( nodes: Array<Node>, links: Array<Link> ) {
      this.nodes = nodes;
      this.links = links;
   }

   getLinks(): Array<Link> {
      return this.links;
   };

   getNodes(): Array<Node> {
      return this.nodes;
   };

   setNodesAndLinks( nodes: Array<Node>, links: Array<Link> ) {
      this.nodes = nodes;
      this.links = links;
   };
}
