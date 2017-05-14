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

    return class extends Block {
      constructor(opts) {
        super(opts);

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

      beforeRemove() {
        this.__reduxStoreUnsubscribe__();
        super.beforeRemove();
      }
    };
  };
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
