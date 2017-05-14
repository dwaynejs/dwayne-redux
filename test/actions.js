import { CLICK, TOGGLE } from './constants';

export function click() {
  return {
    type: CLICK
  };
}

export function toggle() {
  return {
    type: TOGGLE
  };
}
