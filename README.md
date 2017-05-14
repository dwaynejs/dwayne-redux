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

```js
import { Block } from 'dwayne';
import { provider } from 'dwayne-redux';
import { createStore } from 'redux';
import html from './index.html';
import RootReducer from 'RootReducerPath';

const store = createStore(RootReducer);

class MyApp extends Block {
  static html = html;
  
  // this will also work (instead of specifying the argument in provider):
  static reduxStore = store;
}

export default MyApp.wrap(
  // if you don't specify a static property you have to specify the argument here
  provider(store)
);
```

And then you have to wrap the block
which uses the Redux store like this:

```js
import { Block } from 'dwayne';
import { connect } from 'dwayne-redux';
import html from './index.html';

class MyBlock extends Block {
  static html = html;
  
  // this will also work (instead of specifying the argument in connect):
  static mapStateToArgs(state) {
    return {
      prop: state.prop
    };
  }
  
  static mapDispatchToArgs(dispatch) {
    return {
      onClick(elem) {
        dispatch({
          type: 'CLICKED',
          elem
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

export default MyBlock.wrap(
  // if you don't specify a static property you have to specify the arguments here
  connect(mapStateToArgs, mapDispatchToArgs)
);
```

And then the block will have specified properties
from the `mapStateToArgs` plus the props from the
`mapDispatchToArgs` function (if `mapDispatchToArgs` not provided
`store.dispatch` is passed as `dispatch`).
