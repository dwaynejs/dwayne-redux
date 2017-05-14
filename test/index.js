import { initApp } from 'dwayne-test-utils';
import { strictEqual } from 'assert';
import { Block } from 'dwayne';
import { createStore } from 'redux';
import { provider, connect } from '../src';
import { click, toggle } from './actions';
import reducer from './reducer';

const store = createStore(reducer);
let remove;
let block1;
let block2;

let MyBlock = class extends Block {
  static mapDispatchToArgs(dispatch) {
    return {
      onClick() {
        dispatch(click());
      }
    };
  }

  afterRender() {
    block1 = this;
  }
};

function mapStateToArgsMyBlock(state) {
  return {
    value: state.value
  };
}

MyBlock = MyBlock.wrap(
  connect(mapStateToArgsMyBlock)
);

let MyBlock2 = class extends Block {
  static mapStateToArgs(state) {
    return {
      value: state.value
    };
  }

  afterRender() {
    block2 = this;
  }
};

MyBlock2 = MyBlock2.wrap(
  connect()
);

let App = class extends Block {
  static html = html`
    <MyBlock/>
    <MyBlock2/>
  `;
  static reduxStore = store;
};

App = App.wrap(
  provider(store)
);

describe('it should test provider and connect wrappers', () => {
  before(remove = initApp(App));
  after(remove);

  it('should test injecting args', () => {
    strictEqual(block1.args.value, false);
    strictEqual(typeof block1.args.onClick, 'function');
    strictEqual(block2.args.value, false);
  });
  it('should test changing of the args', () => {
    block1.args.onClick();

    strictEqual(block1.args.value, true);
    strictEqual(block2.args.value, true);
  });
  it('should test default dispatch arg', () => {
    block2.args.dispatch(toggle());

    strictEqual(block1.args.value, false);
    strictEqual(block2.args.value, false);
  });
});
