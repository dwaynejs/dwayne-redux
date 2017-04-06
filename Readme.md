# dwayne-redux

Dwayne bindings for [Redux](http://redux.js.org/ "Redux").

## Installation

You can install dwayne-redux using npm.

```bash
$ npm install --save dwayne-redux
```

Also you have to use a module bundler
like [Webpack](http://webpack.github.io/ "Webpack")
or [Browserify](http://browserify.org/ "Browserify").

## Usage

You have to wrap your root block which uses Redux like this:

```javascript
import { Block } from 'dwayne';
import { provider } from 'dwayne-redux';
import { createStore } from 'redux';
import template from 'templatePath';
import RootReducer from 'RootReducerPath';

const store = createStore(RootReducer);

class MyApp extends Block {
  static template = template;
  
  // this will also work (instead of specifying the argument in provider):
  static reduxStore = store;
}

Block.block('MyApp', MyApp.wrap(
  // if you don't specify a static property you have to specify the argument here
  provider(store)
));
```

And then you have to wrap the block
which uses the redux store like this:

```javascript
import { Block } from 'dwayne';
import { connect } from 'dwayne-redux';
import template from 'templatePath';

class MyBlock extends Block {
  static template = template;
  
  // this will also work (instead of specifying the argument in connect):
  static mapStateToArgs(state) {
    return {
      prop: state.prop
    };
  }
  
  static mapDispatchToArgs(dispatch) {
    return {
      onClick() {
        dispatch({
          type: 'CLICKED'
        });
      }
    };
  }
}

function mapStateToArgs(state) {
  return {
    prop: state.prop
  };
}

function mapDispatchToArgs(dispatch) {
  return {
    onClick(elem) {
      dispatch({
        type: 'CLICKED',
        elem
      });
    }
  };
}

Block.block('MyBlock', MyBlock.wrap(
  // if you don't specify a static property you have to specify the argument here
  connect(mapStateToArgs, mapDispatchToArgs)
));
```

And then the block will have specified properties
from the `mapStateToArgs` plus the props from the
`mapDispatchToArgs` function (if `mapDispatchToArgs` not provided
`store.dispatch` is passed as `dispatch`).
