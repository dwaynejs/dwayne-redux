const hasOwnProperty = {}.hasOwnProperty;

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

export function connect(mapStateToArgs) {
  return (Block) => {
    mapStateToArgs = mapStateToArgs || Block.mapStateToArgs;

    return class extends Block {
      constructor(opts) {
        super(opts);

        const store = this.globals.__reduxStore__;

        assign(this.args, mapStateToArgs(store.getState()));

        this.args.dispatch = store.dispatch;
        this.__reduxStoreUnsubscribe__ = store.subscribe(() => {
          assign(this.args, mapStateToArgs(store.getState()));
        });
      }

      beforeRemove() {
        this.__reduxStoreUnsubscribe__();
      }
    };
  };
}

function assign(target, object) {
  for (const key in object) {
    if (hasOwnProperty.call(object, key)) {
      target[key] = object[key];
    }
  }
}
