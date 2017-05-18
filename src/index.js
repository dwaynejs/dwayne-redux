import { Block } from 'dwayne';

const { hasOwnProperty } = {};

export function provider(store) {
  return (Block) => {
    store = store || Block.reduxStore;

    return class extends Block {
      constructor(opts) {
        super(opts);

        this.globals.__reduxStore__ = store;
      }
    };
  };
}

export function connect(mapStateToArgs, mapDispatchToArgs) {
  return (Block) => {
    mapStateToArgs = mapStateToArgs || Block.mapStateToArgs;
    mapDispatchToArgs = mapDispatchToArgs || Block.mapDispatchToArgs;

    if (!mapStateToArgs && !mapDispatchToArgs) {
      return;
    }

    return class extends Block {
      constructor(opts) {
        super(opts);

        this::construct(mapStateToArgs, mapDispatchToArgs);
      }

      beforeRemove() {
        this.__reduxStoreUnsubscribe__();
        super.beforeRemove();
      }
    };
  };
}

export class Connected extends Block {
  constructor(opts) {
    super(opts);

    const {
      mapStateToArgs,
      mapDispatchToArgs
    } = this.getConstructor();

    if (!mapStateToArgs && !mapDispatchToArgs) {
      return this;
    }

    this::construct(mapStateToArgs, mapDispatchToArgs);
  }

  _beforeRemove() {
    if (this.__reduxStoreUnsubscribe__) {
      this.__reduxStoreUnsubscribe__();
    }

    super._beforeRemove();
  }
}

function assign(target, object) {
  iterate(object, (value, key) => {
    target[key] = value;
  });
}

function iterate(object, callback) {
  for (const key in object) {
    if (object::hasOwnProperty(key)) {
      callback(object[key], key);
    }
  }
}

function construct(mapStateToArgs, mapDispatchToArgs) {
  const store = this.globals.__reduxStore__;
  const { dispatch } = store;
  let oldArgs = {};

  if (mapStateToArgs) {
    assign(oldArgs, mapStateToArgs(store.getState()));
  }

  if (mapDispatchToArgs) {
    assign(oldArgs, mapDispatchToArgs(dispatch));
  } else {
    oldArgs.dispatch = dispatch;
  }

  assign(this.args, oldArgs);

  this.__reduxStoreUnsubscribe__ = store.subscribe(() => {
    const newArgs = {};

    if (mapStateToArgs) {
      assign(newArgs, mapStateToArgs(store.getState()));
    }

    if (mapDispatchToArgs) {
      assign(newArgs, mapDispatchToArgs(dispatch));
    } else {
      newArgs.dispatch = dispatch;
    }

    iterate(oldArgs, (value, key) => {
      if (!newArgs::hasOwnProperty(key)) {
        this.args[key] = undefined;
      }
    });

    iterate(newArgs, (value, key) => {
      if (oldArgs[key] !== value) {
        this.args[key] = value;
      }
    });

    oldArgs = newArgs;
  });
}
