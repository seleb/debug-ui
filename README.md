# debug-ui
WIP imgui-esque thing

## use

```js
import debugUi from 'debug-ui';

const objToDebug = {
  foo: 'bar',
  bar: {
    baz: 'i only know four programmer words',
  },
};

// value display
debugUi('foo', () => objToDebug.foo);
// value getter + setter
debugUi('foo', () => objToDebug.foo, v => objToDebug.foo = v);
// recursive obj debugger
debugUi('objToDebug', () => objToDebug);
