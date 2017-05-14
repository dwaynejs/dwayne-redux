import { CLICK, TOGGLE } from './constants';

const initialState = {
  value: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case CLICK: {
      return {
        ...state,
        value: true
      };
    }

    case TOGGLE: {
      return {
        ...state,
        value: !state.value
      };
    }

    default: {
      return state;
    }
  }
};
