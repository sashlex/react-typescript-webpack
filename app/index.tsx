import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './styles.less';

import { GraphView } from './components/GraphView/graph-view';
import { GraphModel } from './components/GraphView/graph-model';

ReactDOM.render( <GraphView model={ new GraphModel([
   { label: 'A', pos: [ 50, 50 ], width: 40, height: 20, color: '#888' },
   { label: 'B', pos: [ 100, 100 ], width: 50, height: 30, color: 'green' },
   { label: 'C', pos: [ 150, 150 ], width: 30, height: 30, color: 'blue' }
], [
   { from: 1, to: 2 },
   { from: 2, to: 3 }
])} />, document.getElementById( 'wrapper' ));
