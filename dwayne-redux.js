const hasOwnProperty = {}.hasOwnProperty;

export function provider(store) {
  return function (Block) {
    return class extends Block {
      constructor(opts) {
        super(opts);

        this.global.__reduxStore__ = store;
      }
    };
  };
}

export function connect(mapStateToArgs) {
  return function (Block) {
    return class extends Block {
      constructor(opts) {
        super(opts);

        const store = this.global.__reduxStore__;

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
