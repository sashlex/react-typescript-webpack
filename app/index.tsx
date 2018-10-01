import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles.less';

import { GraphView } from './components/GraphView/graph-view';
import { GraphModel } from './components/GraphView/graph-model';

ReactDOM.render( <GraphView model = { new GraphModel([
   { label: 'first', pos: [ 100, 50 ], width: 50, height: 25, color: '#F9B642' },
   { label: 'second', pos: [ 100, 120 ], width: 100, height: 30, color: '#E82950' },
   { label: 'third', pos: [ 200, 120 ], width: 80, height: 40, color: '#1C74BA' },
   { label: 'fourth', pos: [ 100, 200 ], width: 80, height: 20, color: '#3C3F92' },
   { label: 'fifth', pos: [ 200, 200 ], width: 80, height: 30, color: '#4C7233' }
], [
   { from: 1, to: 2 },
   { from: 2, to: 3 },
   { from: 2, to: 4 },
   { from: 4, to: 5 },
])} />, document.getElementById( 'wrapper' ));
