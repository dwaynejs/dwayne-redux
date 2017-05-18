import { initApp } from 'dwayne-test-utils';
import { strictEqual } from 'assert';
import { Block } from 'dwayne';
import { createStore } from 'redux';
import { provider, connect, Connected } from '../src';
import { click, toggle } from './actions';
import reducer from './reducer';

const store1 = createStore(reducer);
const store2 = createStore(reducer);
let remove;
let block1;
let block2;
let block3;
let block4;

let MyBlock1 = class extends Block {
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

MyBlock1 = MyBlock1.wrap(
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

class ConnectedProto extends Block {}

ConnectedProto.extend(Connected);

class MyBlock3 extends ConnectedProto {
  static mapStateToArgs(state) {
    return {
      value: state.value
    };
  }
  static mapDispatchToArgs(dispatch) {
    return {
      onClick() {
        dispatch(click());
      }
    };
  }

  afterRender() {
    block3 = this;
  }
}

class MyBlock4 extends ConnectedProto {
  static mapStateToArgs(state) {
    return {
      value: state.value
    };
  }

  afterRender() {
    block4 = this;
  }
}

let App1 = class extends Block {
  static html = html`
    <MyBlock1/>
    <MyBlock2/>
  `;
};

App1 = App1.wrap(
  provider(store1)
);

let App2 = class extends Block {
  static html = html`
    <MyBlock3/>
    <MyBlock4/>
  `;
  static reduxStore = store2;
};

App2 = App2.wrap(
  provider()
);

describe('it should test provider and connect wrappers', () => {
  before(remove = initApp(App1));
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

describe('it should test connected extending class', () => {
  before(remove = initApp(App2));
  after(remove);

  it('should test injecting args', () => {
    strictEqual(block3.args.value, false);
    strictEqual(typeof block3.args.onClick, 'function');
    strictEqual(block4.args.value, false);
  });
  it('should test changing of the args', () => {
    block3.args.onClick();

    strictEqual(block3.args.value, true);
    strictEqual(block4.args.value, true);
  });
  it('should test default dispatch arg', () => {
    block4.args.dispatch(toggle());

    strictEqual(block3.args.value, false);
    strictEqual(block4.args.value, false);
  });
});
