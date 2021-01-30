// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"../../node_modules/process/browser.js":[function(require,module,exports) {

// shim for using process in browser
var process = module.exports = {}; // cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
  throw new Error('setTimeout has not been defined');
}

function defaultClearTimeout() {
  throw new Error('clearTimeout has not been defined');
}

(function () {
  try {
    if (typeof setTimeout === 'function') {
      cachedSetTimeout = setTimeout;
    } else {
      cachedSetTimeout = defaultSetTimout;
    }
  } catch (e) {
    cachedSetTimeout = defaultSetTimout;
  }

  try {
    if (typeof clearTimeout === 'function') {
      cachedClearTimeout = clearTimeout;
    } else {
      cachedClearTimeout = defaultClearTimeout;
    }
  } catch (e) {
    cachedClearTimeout = defaultClearTimeout;
  }
})();

function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    //normal enviroments in sane situations
    return setTimeout(fun, 0);
  } // if setTimeout wasn't available but was latter defined


  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}

function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    //normal enviroments in sane situations
    return clearTimeout(marker);
  } // if clearTimeout wasn't available but was latter defined


  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }

  try {
    // when when somebody has screwed with setTimeout but no I.E. maddness
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
      return cachedClearTimeout.call(null, marker);
    } catch (e) {
      // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
      // Some versions of I.E. have different rules for clearTimeout vs setTimeout
      return cachedClearTimeout.call(this, marker);
    }
  }
}

var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }

  draining = false;

  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }

  if (queue.length) {
    drainQueue();
  }
}

function drainQueue() {
  if (draining) {
    return;
  }

  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;

  while (len) {
    currentQueue = queue;
    queue = [];

    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }

    queueIndex = -1;
    len = queue.length;
  }

  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}

process.nextTick = function (fun) {
  var args = new Array(arguments.length - 1);

  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }

  queue.push(new Item(fun, args));

  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}; // v8 likes predictible objects


function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}

Item.prototype.run = function () {
  this.fun.apply(null, this.array);
};

process.title = 'browser';
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues

process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) {
  return [];
};

process.binding = function (name) {
  throw new Error('process.binding is not supported');
};

process.cwd = function () {
  return '/';
};

process.chdir = function (dir) {
  throw new Error('process.chdir is not supported');
};

process.umask = function () {
  return 0;
};
},{}],"../../node_modules/es6-promise/dist/es6-promise.js":[function(require,module,exports) {
var define;
var global = arguments[3];
var process = require("process");
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   v4.2.8+1e68dce6
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}



var _isArray = void 0;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = void 0;
var customSchedulerFn = void 0;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var vertx = Function('return this')().require('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = void 0;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;


  if (_state) {
    var callback = arguments[_state - 1];
    asap(function () {
      return invokeCallback(_state, child, callback, parent._result);
    });
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(2);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    var then$$1 = void 0;
    try {
      then$$1 = value.then;
    } catch (error) {
      reject(promise, error);
      return;
    }
    handleMaybeThenable(promise, value, then$$1);
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;


  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = void 0,
      callback = void 0,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = void 0,
      error = void 0,
      succeeded = true;

  if (hasCallback) {
    try {
      value = callback(detail);
    } catch (e) {
      succeeded = false;
      error = e;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
    resolve(promise, value);
  } else if (succeeded === false) {
    reject(promise, error);
  } else if (settled === FULFILLED) {
    fulfill(promise, value);
  } else if (settled === REJECTED) {
    reject(promise, value);
  }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

var Enumerator = function () {
  function Enumerator(Constructor, input) {
    this._instanceConstructor = Constructor;
    this.promise = new Constructor(noop);

    if (!this.promise[PROMISE_ID]) {
      makePromise(this.promise);
    }

    if (isArray(input)) {
      this.length = input.length;
      this._remaining = input.length;

      this._result = new Array(this.length);

      if (this.length === 0) {
        fulfill(this.promise, this._result);
      } else {
        this.length = this.length || 0;
        this._enumerate(input);
        if (this._remaining === 0) {
          fulfill(this.promise, this._result);
        }
      }
    } else {
      reject(this.promise, validationError());
    }
  }

  Enumerator.prototype._enumerate = function _enumerate(input) {
    for (var i = 0; this._state === PENDING && i < input.length; i++) {
      this._eachEntry(input[i], i);
    }
  };

  Enumerator.prototype._eachEntry = function _eachEntry(entry, i) {
    var c = this._instanceConstructor;
    var resolve$$1 = c.resolve;


    if (resolve$$1 === resolve$1) {
      var _then = void 0;
      var error = void 0;
      var didError = false;
      try {
        _then = entry.then;
      } catch (e) {
        didError = true;
        error = e;
      }

      if (_then === then && entry._state !== PENDING) {
        this._settledAt(entry._state, i, entry._result);
      } else if (typeof _then !== 'function') {
        this._remaining--;
        this._result[i] = entry;
      } else if (c === Promise$1) {
        var promise = new c(noop);
        if (didError) {
          reject(promise, error);
        } else {
          handleMaybeThenable(promise, entry, _then);
        }
        this._willSettleAt(promise, i);
      } else {
        this._willSettleAt(new c(function (resolve$$1) {
          return resolve$$1(entry);
        }), i);
      }
    } else {
      this._willSettleAt(resolve$$1(entry), i);
    }
  };

  Enumerator.prototype._settledAt = function _settledAt(state, i, value) {
    var promise = this.promise;


    if (promise._state === PENDING) {
      this._remaining--;

      if (state === REJECTED) {
        reject(promise, value);
      } else {
        this._result[i] = value;
      }
    }

    if (this._remaining === 0) {
      fulfill(promise, this._result);
    }
  };

  Enumerator.prototype._willSettleAt = function _willSettleAt(promise, i) {
    var enumerator = this;

    subscribe(promise, undefined, function (value) {
      return enumerator._settledAt(FULFILLED, i, value);
    }, function (reason) {
      return enumerator._settledAt(REJECTED, i, reason);
    });
  };

  return Enumerator;
}();

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {Function} resolver
  Useful for tooling.
  @constructor
*/

var Promise$1 = function () {
  function Promise(resolver) {
    this[PROMISE_ID] = nextId();
    this._result = this._state = undefined;
    this._subscribers = [];

    if (noop !== resolver) {
      typeof resolver !== 'function' && needsResolver();
      this instanceof Promise ? initializePromise(this, resolver) : needsNew();
    }
  }

  /**
  The primary way of interacting with a promise is through its `then` method,
  which registers callbacks to receive either a promise's eventual value or the
  reason why the promise cannot be fulfilled.
   ```js
  findUser().then(function(user){
    // user is available
  }, function(reason){
    // user is unavailable, and you are given the reason why
  });
  ```
   Chaining
  --------
   The return value of `then` is itself a promise.  This second, 'downstream'
  promise is resolved with the return value of the first promise's fulfillment
  or rejection handler, or rejected if the handler throws an exception.
   ```js
  findUser().then(function (user) {
    return user.name;
  }, function (reason) {
    return 'default name';
  }).then(function (userName) {
    // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
    // will be `'default name'`
  });
   findUser().then(function (user) {
    throw new Error('Found user, but still unhappy');
  }, function (reason) {
    throw new Error('`findUser` rejected and we're unhappy');
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
    // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
  });
  ```
  If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
   ```js
  findUser().then(function (user) {
    throw new PedagogicalException('Upstream error');
  }).then(function (value) {
    // never reached
  }).then(function (value) {
    // never reached
  }, function (reason) {
    // The `PedgagocialException` is propagated all the way down to here
  });
  ```
   Assimilation
  ------------
   Sometimes the value you want to propagate to a downstream promise can only be
  retrieved asynchronously. This can be achieved by returning a promise in the
  fulfillment or rejection handler. The downstream promise will then be pending
  until the returned promise is settled. This is called *assimilation*.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // The user's comments are now available
  });
  ```
   If the assimliated promise rejects, then the downstream promise will also reject.
   ```js
  findUser().then(function (user) {
    return findCommentsByAuthor(user);
  }).then(function (comments) {
    // If `findCommentsByAuthor` fulfills, we'll have the value here
  }, function (reason) {
    // If `findCommentsByAuthor` rejects, we'll have the reason here
  });
  ```
   Simple Example
  --------------
   Synchronous Example
   ```javascript
  let result;
   try {
    result = findResult();
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
  findResult(function(result, err){
    if (err) {
      // failure
    } else {
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findResult().then(function(result){
    // success
  }, function(reason){
    // failure
  });
  ```
   Advanced Example
  --------------
   Synchronous Example
   ```javascript
  let author, books;
   try {
    author = findAuthor();
    books  = findBooksByAuthor(author);
    // success
  } catch(reason) {
    // failure
  }
  ```
   Errback Example
   ```js
   function foundBooks(books) {
   }
   function failure(reason) {
   }
   findAuthor(function(author, err){
    if (err) {
      failure(err);
      // failure
    } else {
      try {
        findBoooksByAuthor(author, function(books, err) {
          if (err) {
            failure(err);
          } else {
            try {
              foundBooks(books);
            } catch(reason) {
              failure(reason);
            }
          }
        });
      } catch(error) {
        failure(err);
      }
      // success
    }
  });
  ```
   Promise Example;
   ```javascript
  findAuthor().
    then(findBooksByAuthor).
    then(function(books){
      // found books
  }).catch(function(reason){
    // something went wrong
  });
  ```
   @method then
  @param {Function} onFulfilled
  @param {Function} onRejected
  Useful for tooling.
  @return {Promise}
  */

  /**
  `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
  as the catch block of a try/catch statement.
  ```js
  function findAuthor(){
  throw new Error('couldn't find that author');
  }
  // synchronous
  try {
  findAuthor();
  } catch(reason) {
  // something went wrong
  }
  // async with promises
  findAuthor().catch(function(reason){
  // something went wrong
  });
  ```
  @method catch
  @param {Function} onRejection
  Useful for tooling.
  @return {Promise}
  */


  Promise.prototype.catch = function _catch(onRejection) {
    return this.then(null, onRejection);
  };

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @return {Promise}
  */


  Promise.prototype.finally = function _finally(callback) {
    var promise = this;
    var constructor = promise.constructor;

    if (isFunction(callback)) {
      return promise.then(function (value) {
        return constructor.resolve(callback()).then(function () {
          return value;
        });
      }, function (reason) {
        return constructor.resolve(callback()).then(function () {
          throw reason;
        });
      });
    }

    return promise.then(callback, callback);
  };

  return Promise;
}();

Promise$1.prototype.then = then;
Promise$1.all = all;
Promise$1.race = race;
Promise$1.resolve = resolve$1;
Promise$1.reject = reject$1;
Promise$1._setScheduler = setScheduler;
Promise$1._setAsap = setAsap;
Promise$1._asap = asap;

/*global self*/
function polyfill() {
  var local = void 0;

  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }

  var P = local.Promise;

  if (P) {
    var promiseToString = null;
    try {
      promiseToString = Object.prototype.toString.call(P.resolve());
    } catch (e) {
      // silently ignored
    }

    if (promiseToString === '[object Promise]' && !P.cast) {
      return;
    }
  }

  local.Promise = Promise$1;
}

// Strange compat..
Promise$1.polyfill = polyfill;
Promise$1.Promise = Promise$1;

return Promise$1;

})));





},{"process":"../../node_modules/process/browser.js"}],"../../node_modules/es6-promise/auto.js":[function(require,module,exports) {
// This file can be required in Browserify and Node.js for automatic polyfill
// To use it:  require('es6-promise/auto');
'use strict';
module.exports = require('./').polyfill();

},{"./":"../../node_modules/es6-promise/dist/es6-promise.js"}],"../../node_modules/url-search-params-polyfill/index.js":[function(require,module,exports) {
var global = arguments[3];
/**
 *
 *
 * @author Jerry Bendy <jerry@icewingcc.com>
 * @licence MIT
 *
 */

(function(self) {
    'use strict';

    var nativeURLSearchParams = (self.URLSearchParams && self.URLSearchParams.prototype.get) ? self.URLSearchParams : null,
        isSupportObjectConstructor = nativeURLSearchParams && (new nativeURLSearchParams({a: 1})).toString() === 'a=1',
        // There is a bug in safari 10.1 (and earlier) that incorrectly decodes `%2B` as an empty space and not a plus.
        decodesPlusesCorrectly = nativeURLSearchParams && (new nativeURLSearchParams('s=%2B').get('s') === '+'),
        __URLSearchParams__ = "__URLSearchParams__",
        // Fix bug in Edge which cannot encode ' &' correctly
        encodesAmpersandsCorrectly = nativeURLSearchParams ? (function() {
            var ampersandTest = new nativeURLSearchParams();
            ampersandTest.append('s', ' &');
            return ampersandTest.toString() === 's=+%26';
        })() : true,
        prototype = URLSearchParamsPolyfill.prototype,
        iterable = !!(self.Symbol && self.Symbol.iterator);

    if (nativeURLSearchParams && isSupportObjectConstructor && decodesPlusesCorrectly && encodesAmpersandsCorrectly) {
        return;
    }


    /**
     * Make a URLSearchParams instance
     *
     * @param {object|string|URLSearchParams} search
     * @constructor
     */
    function URLSearchParamsPolyfill(search) {
        search = search || "";

        // support construct object with another URLSearchParams instance
        if (search instanceof URLSearchParams || search instanceof URLSearchParamsPolyfill) {
            search = search.toString();
        }
        this [__URLSearchParams__] = parseToDict(search);
    }


    /**
     * Appends a specified key/value pair as a new search parameter.
     *
     * @param {string} name
     * @param {string} value
     */
    prototype.append = function(name, value) {
        appendTo(this [__URLSearchParams__], name, value);
    };

    /**
     * Deletes the given search parameter, and its associated value,
     * from the list of all search parameters.
     *
     * @param {string} name
     */
    prototype['delete'] = function(name) {
        delete this [__URLSearchParams__] [name];
    };

    /**
     * Returns the first value associated to the given search parameter.
     *
     * @param {string} name
     * @returns {string|null}
     */
    prototype.get = function(name) {
        var dict = this [__URLSearchParams__];
        return this.has(name) ? dict[name][0] : null;
    };

    /**
     * Returns all the values association with a given search parameter.
     *
     * @param {string} name
     * @returns {Array}
     */
    prototype.getAll = function(name) {
        var dict = this [__URLSearchParams__];
        return this.has(name) ? dict [name].slice(0) : [];
    };

    /**
     * Returns a Boolean indicating if such a search parameter exists.
     *
     * @param {string} name
     * @returns {boolean}
     */
    prototype.has = function(name) {
        return hasOwnProperty(this [__URLSearchParams__], name);
    };

    /**
     * Sets the value associated to a given search parameter to
     * the given value. If there were several values, delete the
     * others.
     *
     * @param {string} name
     * @param {string} value
     */
    prototype.set = function set(name, value) {
        this [__URLSearchParams__][name] = ['' + value];
    };

    /**
     * Returns a string containg a query string suitable for use in a URL.
     *
     * @returns {string}
     */
    prototype.toString = function() {
        var dict = this[__URLSearchParams__], query = [], i, key, name, value;
        for (key in dict) {
            name = encode(key);
            for (i = 0, value = dict[key]; i < value.length; i++) {
                query.push(name + '=' + encode(value[i]));
            }
        }
        return query.join('&');
    };

    // There is a bug in Safari 10.1 and `Proxy`ing it is not enough.
    var forSureUsePolyfill = !decodesPlusesCorrectly;
    var useProxy = (!forSureUsePolyfill && nativeURLSearchParams && !isSupportObjectConstructor && self.Proxy);
    /*
     * Apply polifill to global object and append other prototype into it
     */
    Object.defineProperty(self, 'URLSearchParams', {
        value: (useProxy ?
            // Safari 10.0 doesn't support Proxy, so it won't extend URLSearchParams on safari 10.0
            new Proxy(nativeURLSearchParams, {
                construct: function(target, args) {
                    return new target((new URLSearchParamsPolyfill(args[0]).toString()));
                }
            }) :
            URLSearchParamsPolyfill)
    });

    var USPProto = self.URLSearchParams.prototype;

    USPProto.polyfill = true;

    /**
     *
     * @param {function} callback
     * @param {object} thisArg
     */
    USPProto.forEach = USPProto.forEach || function(callback, thisArg) {
        var dict = parseToDict(this.toString());
        Object.getOwnPropertyNames(dict).forEach(function(name) {
            dict[name].forEach(function(value) {
                callback.call(thisArg, value, name, this);
            }, this);
        }, this);
    };

    /**
     * Sort all name-value pairs
     */
    USPProto.sort = USPProto.sort || function() {
        var dict = parseToDict(this.toString()), keys = [], k, i, j;
        for (k in dict) {
            keys.push(k);
        }
        keys.sort();

        for (i = 0; i < keys.length; i++) {
            this['delete'](keys[i]);
        }
        for (i = 0; i < keys.length; i++) {
            var key = keys[i], values = dict[key];
            for (j = 0; j < values.length; j++) {
                this.append(key, values[j]);
            }
        }
    };

    /**
     * Returns an iterator allowing to go through all keys of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.keys = USPProto.keys || function() {
        var items = [];
        this.forEach(function(item, name) {
            items.push(name);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all values of
     * the key/value pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.values = USPProto.values || function() {
        var items = [];
        this.forEach(function(item) {
            items.push(item);
        });
        return makeIterator(items);
    };

    /**
     * Returns an iterator allowing to go through all key/value
     * pairs contained in this object.
     *
     * @returns {function}
     */
    USPProto.entries = USPProto.entries || function() {
        var items = [];
        this.forEach(function(item, name) {
            items.push([name, item]);
        });
        return makeIterator(items);
    };


    if (iterable) {
        USPProto[self.Symbol.iterator] = USPProto[self.Symbol.iterator] || USPProto.entries;
    }


    function encode(str) {
        var replace = {
            '!': '%21',
            "'": '%27',
            '(': '%28',
            ')': '%29',
            '~': '%7E',
            '%20': '+',
            '%00': '\x00'
        };
        return encodeURIComponent(str).replace(/[!'\(\)~]|%20|%00/g, function(match) {
            return replace[match];
        });
    }

    function decode(str) {
        return str
            .replace(/[ +]/g, '%20')
            .replace(/(%[a-f0-9]{2})+/ig, function(match) {
                return decodeURIComponent(match);
            });
    }

    function makeIterator(arr) {
        var iterator = {
            next: function() {
                var value = arr.shift();
                return {done: value === undefined, value: value};
            }
        };

        if (iterable) {
            iterator[self.Symbol.iterator] = function() {
                return iterator;
            };
        }

        return iterator;
    }

    function parseToDict(search) {
        var dict = {};

        if (typeof search === "object") {
            // if `search` is an array, treat it as a sequence
            if (isArray(search)) {
                for (var i = 0; i < search.length; i++) {
                    var item = search[i];
                    if (isArray(item) && item.length === 2) {
                        appendTo(dict, item[0], item[1]);
                    } else {
                        throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
                    }
                }

            } else {
                for (var key in search) {
                    if (search.hasOwnProperty(key)) {
                        appendTo(dict, key, search[key]);
                    }
                }
            }

        } else {
            // remove first '?'
            if (search.indexOf("?") === 0) {
                search = search.slice(1);
            }

            var pairs = search.split("&");
            for (var j = 0; j < pairs.length; j++) {
                var value = pairs [j],
                    index = value.indexOf('=');

                if (-1 < index) {
                    appendTo(dict, decode(value.slice(0, index)), decode(value.slice(index + 1)));

                } else {
                    if (value) {
                        appendTo(dict, decode(value), '');
                    }
                }
            }
        }

        return dict;
    }

    function appendTo(dict, name, value) {
        var val = typeof value === 'string' ? value : (
            value !== null && value !== undefined && typeof value.toString === 'function' ? value.toString() : JSON.stringify(value)
        );

        // #47 Prevent using `hasOwnProperty` as a property name
        if (hasOwnProperty(dict, name)) {
            dict[name].push(val);
        } else {
            dict[name] = [val];
        }
    }

    function isArray(val) {
        return !!val && '[object Array]' === Object.prototype.toString.call(val);
    }

    function hasOwnProperty(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

})(typeof global !== 'undefined' ? global : (typeof window !== 'undefined' ? window : this));

},{}],"../../node_modules/@kenrick95/c4/src/utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showMessage = showMessage;
exports.isCoordOnColumn = isCoordOnColumn;
exports.getColumnFromCoord = getColumnFromCoord;
exports.getRandomColumnNumber = getRandomColumnNumber;
exports.choose = choose;
exports.animationFrame = animationFrame;
exports.clone = clone;
exports.getMockPlayerAction = getMockPlayerAction;
exports.onresize = onresize;
exports.BIG_NEGATIVE_NUMBER = exports.BIG_POSITIVE_NUMBER = void 0;

var _base = require("./board/base");

var BIG_POSITIVE_NUMBER = Math.pow(10, 9) + 7;
exports.BIG_POSITIVE_NUMBER = BIG_POSITIVE_NUMBER;
var BIG_NEGATIVE_NUMBER = -BIG_POSITIVE_NUMBER;
exports.BIG_NEGATIVE_NUMBER = BIG_NEGATIVE_NUMBER;

function showMessage(message) {
  if (message === void 0) {
    message = '';
  }

  var messageDOM = document.querySelector('.message');

  if (!messageDOM) {
    console.error('Message DOM is null!');
    return;
  }

  messageDOM.classList.remove('hidden');
  var messageContentDOM = document.querySelector('.message-body-content');

  if (!messageContentDOM) {
    console.error('Message body content DOM is null!');
    return;
  }

  messageContentDOM.innerHTML = message;
  var messageDismissDOM = document.querySelector('.message-body-dismiss');

  if (!messageDismissDOM) {
    console.error('Message body dismiss DOM is null!');
    return;
  }

  var dismissHandler = function dismissHandler() {
    messageDOM.classList.add('invisible');
    messageDOM.addEventListener('transitionend', function () {
      messageDOM.classList.add('hidden');
      messageDOM.classList.remove('invisible');
    });
    messageDismissDOM.removeEventListener('click', dismissHandler);
  };

  messageDismissDOM.addEventListener('click', dismissHandler);
}

function isCoordOnColumn(coord, columnXBegin, radius) {
  return (coord.x - columnXBegin) * (coord.x - columnXBegin) <= radius * radius;
}

function getColumnFromCoord(coord) {
  for (var i = 0; i < _base.BoardBase.COLUMNS; i++) {
    if (isCoordOnColumn(coord, 3 * _base.BoardBase.PIECE_RADIUS * i + _base.BoardBase.MASK_X_BEGIN + 2 * _base.BoardBase.PIECE_RADIUS, _base.BoardBase.PIECE_RADIUS)) {
      return i;
    }
  }

  return -1;
}

function getRandomColumnNumber() {
  return Math.floor(Math.random() * _base.BoardBase.COLUMNS);
}

function choose(choice) {
  return choice[Math.floor(Math.random() * choice.length)];
}

function animationFrame() {
  var resolve = null;
  var promise = new Promise(function (r) {
    return resolve = r;
  });

  if (resolve) {
    window.requestAnimationFrame(resolve);
  }

  return promise;
}

function clone(array) {
  var arr = [];

  for (var i = 0; i < array.length; i++) {
    arr[i] = array[i].slice();
  }

  return arr;
}

function getMockPlayerAction(map, boardPiece, column) {
  var clonedMap = clone(map);

  if (clonedMap[0][column] !== _base.BoardPiece.EMPTY || column < 0 || column >= _base.BoardBase.COLUMNS) {
    return {
      success: false,
      map: clonedMap
    };
  }

  var isColumnEverFilled = false;
  var row = 0;

  for (var i = 0; i < _base.BoardBase.ROWS - 1; i++) {
    if (clonedMap[i + 1][column] !== _base.BoardPiece.EMPTY) {
      isColumnEverFilled = true;
      row = i;
      break;
    }
  }

  if (!isColumnEverFilled) {
    row = _base.BoardBase.ROWS - 1;
  }

  clonedMap[row][column] = boardPiece;
  return {
    success: true,
    map: clonedMap
  };
}

function onresize() {
  var callbacks = [],
      running = false;

  function resize() {
    if (!running) {
      running = true;

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(runCallbacks);
      } else {
        setTimeout(runCallbacks, 66);
      }
    }
  }

  function runCallbacks() {
    callbacks.forEach(function (callback) {
      callback();
    });
    running = false;
  }

  function addCallback(callback) {
    if (callback) {
      callbacks.push(callback);
    }
  }

  return {
    add: function add(callback) {
      if (!callbacks.length) {
        window.addEventListener('resize', resize);
      }

      addCallback(callback);
    }
  };
}
},{"./board/base":"../../node_modules/@kenrick95/c4/src/board/base.ts"}],"../../node_modules/@kenrick95/c4/src/board/base.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BoardBase = exports.BoardPiece = void 0;

var _utils = require("../utils");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var BoardPiece;
exports.BoardPiece = BoardPiece;

(function (BoardPiece) {
  BoardPiece[BoardPiece["EMPTY"] = 0] = "EMPTY";
  BoardPiece[BoardPiece["PLAYER_1"] = 1] = "PLAYER_1";
  BoardPiece[BoardPiece["PLAYER_2"] = 2] = "PLAYER_2";
  BoardPiece[BoardPiece["DRAW"] = 3] = "DRAW";
})(BoardPiece || (exports.BoardPiece = BoardPiece = {}));

var BoardBase = function () {
  function BoardBase() {
    this.map = [];
    this.winnerBoardPiece = BoardPiece.EMPTY;
    this.initConstants();
    this.reset();
  }

  BoardBase.prototype.reset = function () {
    this.map = [];

    for (var i = 0; i < BoardBase.ROWS; i++) {
      this.map.push([]);

      for (var j = 0; j < BoardBase.COLUMNS; j++) {
        this.map[i].push(BoardPiece.EMPTY);
      }
    }

    this.winnerBoardPiece = BoardPiece.EMPTY;
  };

  BoardBase.prototype.initConstants = function () {
    BoardBase.CANVAS_HEIGHT = BoardBase.SCALE * 480;
    BoardBase.CANVAS_WIDTH = BoardBase.SCALE * 640;
    BoardBase.PIECE_RADIUS = BoardBase.SCALE * 25;
    BoardBase.MASK_X_BEGIN = Math.max(0, BoardBase.CANVAS_WIDTH - (3 * BoardBase.COLUMNS + 1) * BoardBase.PIECE_RADIUS) / 2;
    BoardBase.MASK_Y_BEGIN = Math.max(0, BoardBase.CANVAS_HEIGHT - (3 * BoardBase.ROWS + 1) * BoardBase.PIECE_RADIUS) / 2;
    BoardBase.MESSAGE_WIDTH = BoardBase.SCALE * 400;
    BoardBase.MESSAGE_X_BEGIN = (BoardBase.CANVAS_WIDTH - BoardBase.MESSAGE_WIDTH) / 2;
    BoardBase.MESSAGE_Y_BEGIN = BoardBase.SCALE * 20;
  };

  BoardBase.prototype.applyPlayerAction = function (player, column) {
    return __awaiter(this, void 0, Promise, function () {
      var _a, actionSuccessful, nextState;

      return __generator(this, function (_b) {
        _a = (0, _utils.getMockPlayerAction)(this.map, player.boardPiece, column), actionSuccessful = _a.success, nextState = _a.map;
        this.map = nextState;
        return [2, actionSuccessful];
      });
    });
  };

  BoardBase.prototype.debug = function () {
    console.log(this.map.map(function (row) {
      return row.join(' ');
    }).join('\n'));
  };

  BoardBase.prototype.getWinner = function () {
    var _this = this;

    if (this.winnerBoardPiece !== BoardPiece.EMPTY) {
      return this.winnerBoardPiece;
    }

    var direction = [[0, -1], [0, 1], [-1, -1], [-1, 0], [-1, 1], [1, -1], [1, 0], [1, 1]];

    var isWinningSequence = function isWinningSequence(i, j, playerPiece, dir, count) {
      if (count >= 4) {
        return true;
      }

      if (i < 0 || j < 0 || i >= BoardBase.ROWS || j >= BoardBase.COLUMNS || _this.map[i][j] !== playerPiece) {
        return false;
      }

      return isWinningSequence(i + dir[0], j + dir[1], playerPiece, dir, count + 1);
    };

    var countEmpty = 0;

    for (var i = 0; i < BoardBase.ROWS; i++) {
      for (var j = 0; j < BoardBase.COLUMNS; j++) {
        var playerPiece = this.map[i][j];

        if (playerPiece !== BoardPiece.EMPTY) {
          for (var k = 0; k < direction.length; k++) {
            var isWon = isWinningSequence(i + direction[k][0], j + direction[k][1], playerPiece, direction[k], 1);

            if (isWon) {
              return this.winnerBoardPiece = playerPiece;
            }
          }
        } else {
          countEmpty++;
        }
      }
    }

    if (countEmpty === 0) {
      return this.winnerBoardPiece = BoardPiece.DRAW;
    }

    return BoardPiece.EMPTY;
  };

  BoardBase.prototype.getPlayerColor = function (boardPiece) {
    switch (boardPiece) {
      case BoardPiece.PLAYER_1:
        return BoardBase.PLAYER_1_COLOR;

      case BoardPiece.PLAYER_2:
        return BoardBase.PLAYER_2_COLOR;

      default:
        return 'transparent';
    }
  };

  BoardBase.ROWS = 6;
  BoardBase.COLUMNS = 7;
  BoardBase.PLAYER_1_COLOR = '#ef453b';
  BoardBase.PLAYER_2_COLOR = '#0059ff';
  BoardBase.PIECE_STROKE_STYLE = 'black';
  BoardBase.MASK_COLOR = '#d8d8d8';
  return BoardBase;
}();

exports.BoardBase = BoardBase;
},{"../utils":"../../node_modules/@kenrick95/c4/src/utils.ts"}],"../../node_modules/@kenrick95/c4/src/board/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _base = require("./base");

Object.keys(_base).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _base[key];
    }
  });
});
},{"./base":"../../node_modules/@kenrick95/c4/src/board/base.ts"}],"../../node_modules/@kenrick95/c4/src/player/player.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Player = void 0;

var Player = function () {
  function Player(boardPiece) {
    this.boardPiece = boardPiece;
  }

  return Player;
}();

exports.Player = Player;
},{}],"../../node_modules/@kenrick95/c4/src/player/player-ai.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerAi = void 0;

var _player = require("./player");

var _board = require("../board");

var _utils = require("../utils");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var PlayerAi = function (_super) {
  __extends(PlayerAi, _super);

  function PlayerAi(boardPiece) {
    var _this = _super.call(this, boardPiece) || this;

    _this.ownBoardPieceValue = _this.getBoardPieceValue(boardPiece);
    _this.enemyBoardPiece = boardPiece === _board.BoardPiece.PLAYER_1 ? _board.BoardPiece.PLAYER_2 : _board.BoardPiece.PLAYER_1;
    return _this;
  }

  PlayerAi.prototype.getBoardPieceValue = function (boardPiece) {
    return boardPiece === _board.BoardPiece.EMPTY ? 0 : boardPiece === this.boardPiece ? 1 : -1;
  };

  PlayerAi.prototype.getStateValue = function (state) {
    var winnerBoardPiece = _board.BoardPiece.EMPTY;
    var chainValue = 0;

    for (var i = 0; i < _board.BoardBase.ROWS; i++) {
      for (var j = 0; j < _board.BoardBase.COLUMNS; j++) {
        var tempRight = 0,
            tempBottom = 0,
            tempBottomRight = 0,
            tempTopRight = 0;

        for (var k = 0; k <= 3; k++) {
          if (j + k < _board.BoardBase.COLUMNS) {
            tempRight += this.getBoardPieceValue(state[i][j + k]);
          }

          if (i + k < _board.BoardBase.ROWS) {
            tempBottom += this.getBoardPieceValue(state[i + k][j]);
          }

          if (i + k < _board.BoardBase.ROWS && j + k < _board.BoardBase.COLUMNS) {
            tempBottomRight += this.getBoardPieceValue(state[i + k][j + k]);
          }

          if (i - k >= 0 && j + k < 7) {
            tempTopRight += this.getBoardPieceValue(state[i - k][j + k]);
          }
        }

        chainValue += tempRight * tempRight * tempRight;
        chainValue += tempBottom * tempBottom * tempBottom;
        chainValue += tempBottomRight * tempBottomRight * tempBottomRight;
        chainValue += tempTopRight * tempTopRight * tempTopRight;

        if (Math.abs(tempRight) === 4) {
          winnerBoardPiece = tempRight > 0 ? this.boardPiece : this.enemyBoardPiece;
        } else if (Math.abs(tempBottom) === 4) {
          winnerBoardPiece = tempBottom > 0 ? this.boardPiece : this.enemyBoardPiece;
        } else if (Math.abs(tempBottomRight) === 4) {
          winnerBoardPiece = tempBottomRight > 0 ? this.boardPiece : this.enemyBoardPiece;
        } else if (Math.abs(tempTopRight) === 4) {
          winnerBoardPiece = tempTopRight > 0 ? this.boardPiece : this.enemyBoardPiece;
        }
      }
    }

    return {
      winnerBoardPiece: winnerBoardPiece,
      chain: chainValue
    };
  };

  PlayerAi.prototype.transformValues = function (returnValue, winnerBoardPiece, depth) {
    var isWon = winnerBoardPiece === this.boardPiece;
    var isLost = winnerBoardPiece === this.enemyBoardPiece;

    if (isWon) {
      returnValue = _utils.BIG_POSITIVE_NUMBER - 100;
    } else if (isLost) {
      returnValue = _utils.BIG_NEGATIVE_NUMBER + 100;
    }

    returnValue -= depth * depth;
    return returnValue;
  };

  PlayerAi.prototype.getMove = function (state, depth, alpha, beta) {
    var stateValue = this.getStateValue(state);
    var isWon = stateValue.winnerBoardPiece === this.boardPiece;
    var isLost = stateValue.winnerBoardPiece === this.enemyBoardPiece;

    if (depth >= PlayerAi.MAX_DEPTH || isWon || isLost) {
      return {
        value: this.transformValues(stateValue.chain * this.ownBoardPieceValue, stateValue.winnerBoardPiece, depth),
        move: -1
      };
    }

    return depth % 2 === 0 ? this.minState(state, depth + 1, alpha, beta) : this.maxState(state, depth + 1, alpha, beta);
  };

  PlayerAi.prototype.maxState = function (state, depth, alpha, beta) {
    var value = _utils.BIG_NEGATIVE_NUMBER;
    var moveQueue = [];

    for (var column = 0; column < _board.BoardBase.COLUMNS; column++) {
      var _a = (0, _utils.getMockPlayerAction)(state, this.boardPiece, column),
          actionSuccessful = _a.success,
          nextState = _a.map;

      if (actionSuccessful) {
        var nextValue = this.getMove(nextState, depth, alpha, beta).value;

        if (nextValue > value) {
          value = nextValue;
          moveQueue = [column];
        } else if (nextValue === value) {
          moveQueue.push(column);
        }

        if (value > beta) {
          return {
            value: value,
            move: (0, _utils.choose)(moveQueue)
          };
        }

        alpha = Math.max(alpha, value);
      }
    }

    return {
      value: value,
      move: (0, _utils.choose)(moveQueue)
    };
  };

  PlayerAi.prototype.minState = function (state, depth, alpha, beta) {
    var value = _utils.BIG_POSITIVE_NUMBER;
    var moveQueue = [];

    for (var column = 0; column < _board.BoardBase.COLUMNS; column++) {
      var _a = (0, _utils.getMockPlayerAction)(state, this.enemyBoardPiece, column),
          actionSuccessful = _a.success,
          nextState = _a.map;

      if (actionSuccessful) {
        var nextValue = this.getMove(nextState, depth, alpha, beta).value;

        if (nextValue < value) {
          value = nextValue;
          moveQueue = [column];
        } else if (nextValue === value) {
          moveQueue.push(column);
        }

        if (value < alpha) {
          return {
            value: value,
            move: (0, _utils.choose)(moveQueue)
          };
        }

        beta = Math.min(beta, value);
      }
    }

    return {
      value: value,
      move: (0, _utils.choose)(moveQueue)
    };
  };

  PlayerAi.prototype.getAction = function (board) {
    return __awaiter(this, void 0, Promise, function () {
      var state, action;
      return __generator(this, function (_a) {
        state = (0, _utils.clone)(board.map);
        action = this.maxState(state, 0, _utils.BIG_NEGATIVE_NUMBER, _utils.BIG_POSITIVE_NUMBER);
        console.log("AI " + this.boardPiece + " choose column " + action.move + " with value of " + action.value);
        return [2, action.move];
      });
    });
  };

  PlayerAi.MAX_DEPTH = 4;
  return PlayerAi;
}(_player.Player);

exports.PlayerAi = PlayerAi;
},{"./player":"../../node_modules/@kenrick95/c4/src/player/player.ts","../board":"../../node_modules/@kenrick95/c4/src/board/index.ts","../utils":"../../node_modules/@kenrick95/c4/src/utils.ts"}],"../../node_modules/@kenrick95/c4/src/player/player-human.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerHuman = void 0;

var _player = require("./player");

var _board = require("../board");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var PlayerHuman = function (_super) {
  __extends(PlayerHuman, _super);

  function PlayerHuman(boardPiece) {
    var _this = _super.call(this, boardPiece) || this;

    _this.clickPromiseResolver = null;
    return _this;
  }

  PlayerHuman.prototype.doAction = function (column) {
    if (this.clickPromiseResolver && 0 <= column && column < _board.BoardBase.COLUMNS) {
      this.clickPromiseResolver(column);
    }
  };

  PlayerHuman.prototype.getAction = function (board) {
    return __awaiter(this, void 0, Promise, function () {
      var _this = this;

      return __generator(this, function (_a) {
        return [2, new Promise(function (r) {
          return _this.clickPromiseResolver = r;
        })];
      });
    });
  };

  return PlayerHuman;
}(_player.Player);

exports.PlayerHuman = PlayerHuman;
},{"./player":"../../node_modules/@kenrick95/c4/src/player/player.ts","../board":"../../node_modules/@kenrick95/c4/src/board/index.ts"}],"../../node_modules/@kenrick95/c4/src/player/player-shadow.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PlayerShadow = void 0;

var _player = require("./player");

var _board = require("../board");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var PlayerShadow = function (_super) {
  __extends(PlayerShadow, _super);

  function PlayerShadow(boardPiece) {
    var _this = _super.call(this, boardPiece) || this;

    _this.actionPromiseResolver = null;
    return _this;
  }

  PlayerShadow.prototype.doAction = function (column) {
    if (this.actionPromiseResolver && 0 <= column && column < _board.BoardBase.COLUMNS) {
      this.actionPromiseResolver(column);
    }
  };

  PlayerShadow.prototype.getAction = function (board) {
    return __awaiter(this, void 0, Promise, function () {
      var _this = this;

      return __generator(this, function (_a) {
        return [2, new Promise(function (r) {
          return _this.actionPromiseResolver = r;
        })];
      });
    });
  };

  return PlayerShadow;
}(_player.Player);

exports.PlayerShadow = PlayerShadow;
},{"./player":"../../node_modules/@kenrick95/c4/src/player/player.ts","../board":"../../node_modules/@kenrick95/c4/src/board/index.ts"}],"../../node_modules/@kenrick95/c4/src/player/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _player = require("./player");

Object.keys(_player).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _player[key];
    }
  });
});

var _playerAi = require("./player-ai");

Object.keys(_playerAi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _playerAi[key];
    }
  });
});

var _playerHuman = require("./player-human");

Object.keys(_playerHuman).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _playerHuman[key];
    }
  });
});

var _playerShadow = require("./player-shadow");

Object.keys(_playerShadow).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _playerShadow[key];
    }
  });
});
},{"./player":"../../node_modules/@kenrick95/c4/src/player/player.ts","./player-ai":"../../node_modules/@kenrick95/c4/src/player/player-ai.ts","./player-human":"../../node_modules/@kenrick95/c4/src/player/player-human.ts","./player-shadow":"../../node_modules/@kenrick95/c4/src/player/player-shadow.ts"}],"board/utils.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.drawCircle = drawCircle;
exports.drawMask = drawMask;
exports.clearCanvas = clearCanvas;

var _index = require("./index");

function drawCircle(context, _a) {
  var _b = _a.x,
      x = _b === void 0 ? 0 : _b,
      _c = _a.y,
      y = _c === void 0 ? 0 : _c,
      _d = _a.r,
      r = _d === void 0 ? 0 : _d,
      _e = _a.fillStyle,
      fillStyle = _e === void 0 ? '' : _e,
      _f = _a.strokeStyle,
      strokeStyle = _f === void 0 ? '' : _f;
  context.save();
  context.fillStyle = fillStyle;
  context.strokeStyle = strokeStyle;
  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fill();
  context.restore();
}

function drawMask(board) {
  var context = board.context;
  context.save();
  context.fillStyle = _index.Board.MASK_COLOR;
  context.beginPath();
  var doubleRadius = 2 * _index.Board.PIECE_RADIUS;
  var tripleRadius = 3 * _index.Board.PIECE_RADIUS;

  for (var y = 0; y < _index.Board.ROWS; y++) {
    for (var x = 0; x < _index.Board.COLUMNS; x++) {
      context.arc(tripleRadius * x + _index.Board.MASK_X_BEGIN + doubleRadius, tripleRadius * y + _index.Board.MASK_Y_BEGIN + doubleRadius, _index.Board.PIECE_RADIUS, 0, 2 * Math.PI);
      context.rect(tripleRadius * x + _index.Board.MASK_X_BEGIN + 2 * doubleRadius, tripleRadius * y + _index.Board.MASK_Y_BEGIN, -2 * doubleRadius, 2 * doubleRadius);
    }
  }

  context.fill();
  context.restore();
}

function clearCanvas(board) {
  board.context.clearRect(0, 0, board.canvas.width, board.canvas.height);
}
},{"./index":"board/index.ts"}],"board/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Board = void 0;

var _board = require("@kenrick95/c4/src/board");

var _utils = require("@kenrick95/c4/src/utils");

var _utils2 = require("./utils");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var Board = function (_super) {
  __extends(Board, _super);

  function Board(canvas) {
    var _this = _super.call(this) || this;

    _this.canvas = canvas;
    _this.context = canvas.getContext('2d');

    _this.getBoardScale();

    _this.initConstants();

    _this.reset();

    _this.onresize();

    return _this;
  }

  Board.prototype.getBoardScale = function () {
    return window.innerWidth < 640 ? _board.BoardBase.SCALE = 0.5 : _board.BoardBase.SCALE = 1.0;
  };

  Board.prototype.onresize = function () {
    var _this = this;

    var prevBoardScale = _board.BoardBase.SCALE;
    (0, _utils.onresize)().add(function () {
      _this.getBoardScale();

      if (prevBoardScale !== _board.BoardBase.SCALE) {
        prevBoardScale = _board.BoardBase.SCALE;

        _this.initConstants();

        (0, _utils2.clearCanvas)(_this);

        _this.render();
      }
    });
  };

  Board.prototype.reset = function () {
    _super.prototype.reset.call(this);

    if (this.canvas) {
      (0, _utils2.clearCanvas)(this);
      this.render();
    }
  };

  Board.prototype.initConstants = function () {
    _super.prototype.initConstants.call(this);

    if (this.canvas) {
      var dpr = self.devicePixelRatio || 1;
      this.canvas.width = Board.CANVAS_WIDTH * dpr;
      this.canvas.height = Board.CANVAS_HEIGHT * dpr;
      this.context.scale(dpr, dpr);
      this.canvas.style.width = Board.CANVAS_WIDTH + 'px';
      this.canvas.style.height = Board.CANVAS_HEIGHT + 'px';
    }
  };

  Board.prototype.animateAction = function (newRow, column, boardPiece) {
    return __awaiter(this, void 0, Promise, function () {
      var fillStyle, currentY, doAnimation;

      var _this = this;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            fillStyle = this.getPlayerColor(boardPiece);
            currentY = 0;

            doAnimation = function doAnimation() {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  (0, _utils2.clearCanvas)(this);
                  (0, _utils2.drawCircle)(this.context, {
                    x: 3 * _board.BoardBase.PIECE_RADIUS * column + _board.BoardBase.MASK_X_BEGIN + 2 * _board.BoardBase.PIECE_RADIUS,
                    y: currentY + _board.BoardBase.MASK_Y_BEGIN + 2 * _board.BoardBase.PIECE_RADIUS,
                    r: _board.BoardBase.PIECE_RADIUS,
                    fillStyle: fillStyle,
                    strokeStyle: _board.BoardBase.PIECE_STROKE_STYLE
                  });
                  this.render();
                  currentY += _board.BoardBase.PIECE_RADIUS;
                  return [2];
                });
              });
            };

            _a.label = 1;

          case 1:
            if (!(newRow * 3 * _board.BoardBase.PIECE_RADIUS >= currentY)) return [3, 3];
            return [4, (0, _utils.animationFrame)()];

          case 2:
            _a.sent();

            doAnimation();
            return [3, 1];

          case 3:
            return [2];
        }
      });
    });
  };

  Board.prototype.render = function () {
    (0, _utils2.drawMask)(this);

    for (var y = 0; y < _board.BoardBase.ROWS; y++) {
      for (var x = 0; x < _board.BoardBase.COLUMNS; x++) {
        (0, _utils2.drawCircle)(this.context, {
          x: 3 * _board.BoardBase.PIECE_RADIUS * x + _board.BoardBase.MASK_X_BEGIN + 2 * _board.BoardBase.PIECE_RADIUS,
          y: 3 * _board.BoardBase.PIECE_RADIUS * y + _board.BoardBase.MASK_Y_BEGIN + 2 * _board.BoardBase.PIECE_RADIUS,
          r: _board.BoardBase.PIECE_RADIUS,
          fillStyle: this.getPlayerColor(this.map[y][x]),
          strokeStyle: _board.BoardBase.PIECE_STROKE_STYLE
        });
      }
    }
  };

  Board.prototype.applyPlayerAction = function (player, column) {
    return __awaiter(this, void 0, Promise, function () {
      var isColumnEverFilled, row, i;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (this.map[0][column] !== _board.BoardPiece.EMPTY || column < 0 || column >= _board.BoardBase.COLUMNS) {
              return [2, false];
            }

            isColumnEverFilled = false;
            row = 0;

            for (i = 0; i < _board.BoardBase.ROWS - 1; i++) {
              if (this.map[i + 1][column] !== _board.BoardPiece.EMPTY) {
                isColumnEverFilled = true;
                row = i;
                break;
              }
            }

            if (!isColumnEverFilled) {
              row = _board.BoardBase.ROWS - 1;
            }

            return [4, this.animateAction(row, column, player.boardPiece)];

          case 1:
            _a.sent();

            this.map[row][column] = player.boardPiece;
            this.debug();
            return [4, (0, _utils.animationFrame)()];

          case 2:
            _a.sent();

            this.render();
            return [2, true];
        }
      });
    });
  };

  return Board;
}(_board.BoardBase);

exports.Board = Board;
},{"@kenrick95/c4/src/board":"../../node_modules/@kenrick95/c4/src/board/index.ts","@kenrick95/c4/src/utils":"../../node_modules/@kenrick95/c4/src/utils.ts","./utils":"board/utils.ts"}],"../../node_modules/@kenrick95/c4/src/game/game-base.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GameBase = void 0;

var _board = require("../board");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var GameBase = function () {
  function GameBase(players, board) {
    this.isMoveAllowed = false;
    this.isGameWon = false;
    this.board = board;
    this.players = players;
    this.currentPlayerId = 0;
    this.reset();
  }

  GameBase.prototype.reset = function () {
    this.isMoveAllowed = false;
    this.isGameWon = false;
    this.board.reset();
  };

  GameBase.prototype.start = function () {
    return __awaiter(this, void 0, void 0, function () {
      var winner;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            this.isMoveAllowed = true;
            _a.label = 1;

          case 1:
            if (!!this.isGameWon) return [3, 3];
            return [4, this.move()];

          case 2:
            _a.sent();

            winner = this.board.getWinner();

            if (winner !== _board.BoardPiece.EMPTY) {
              console.log('[GameBase] Game over: winner is player ', winner);
              this.isGameWon = true;
              this.isMoveAllowed = false;
              this.announceWinner(winner);
              return [3, 3];
            }

            return [3, 1];

          case 3:
            return [2];
        }
      });
    });
  };

  GameBase.prototype.move = function () {
    return __awaiter(this, void 0, void 0, function () {
      var currentPlayer, actionSuccesful, action;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.isMoveAllowed) {
              return [2];
            }

            currentPlayer = this.players[this.currentPlayerId];
            actionSuccesful = false;
            _a.label = 1;

          case 1:
            if (!!actionSuccesful) return [3, 4];
            this.waitingForMove();
            return [4, currentPlayer.getAction(this.board)];

          case 2:
            action = _a.sent();
            this.isMoveAllowed = false;
            this.beforeMoveApplied(action);
            return [4, this.board.applyPlayerAction(currentPlayer, action)];

          case 3:
            actionSuccesful = _a.sent();
            this.isMoveAllowed = true;

            if (!actionSuccesful) {
              console.log('Move not allowed! Try again.');
            } else {
              this.afterMove(action);
            }

            return [3, 1];

          case 4:
            this.currentPlayerId = this.getNextPlayer();
            return [2];
        }
      });
    });
  };

  GameBase.prototype.announceWinner = function (winnerPiece) {
    var _a;

    var winner = (_a = {}, _a[_board.BoardPiece.DRAW] = 'draw', _a[_board.BoardPiece.PLAYER_1] = 'Player 1', _a[_board.BoardPiece.PLAYER_2] = 'Player 2', _a[_board.BoardPiece.EMPTY] = 'none', _a)[winnerPiece];
    console.log('[GameBase] Game over: winner is ', winner, winnerPiece);
  };

  GameBase.prototype.getNextPlayer = function () {
    return this.currentPlayerId === 0 ? 1 : 0;
  };

  return GameBase;
}();

exports.GameBase = GameBase;
},{"../board":"../../node_modules/@kenrick95/c4/src/board/index.ts"}],"../../node_modules/@kenrick95/c4/src/game/game-online/shared.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.constructMessage = constructMessage;
exports.parseMessage = parseMessage;
exports.MESSAGE_TYPE = void 0;
var MESSAGE_TYPE;
exports.MESSAGE_TYPE = MESSAGE_TYPE;

(function (MESSAGE_TYPE) {
  MESSAGE_TYPE["NEW_PLAYER_CONNECTION_REQUEST"] = "NEW_PLAYER_CONNECTION_REQUEST";
  MESSAGE_TYPE["NEW_PLAYER_CONNECTION_OK"] = "NEW_PLAYER_CONNECTION_OK";
  MESSAGE_TYPE["NEW_MATCH_REQUEST"] = "NEW_MATCH_REQUEST";
  MESSAGE_TYPE["NEW_MATCH_OK"] = "NEW_MATCH_OK";
  MESSAGE_TYPE["GAME_READY"] = "GAME_READY";
  MESSAGE_TYPE["GAME_ENDED"] = "GAME_ENDED";
  MESSAGE_TYPE["GAME_RESET"] = "GAME_RESET";
  MESSAGE_TYPE["CONNECT_MATCH_REQUEST"] = "CONNECT_MATCH_REQUEST";
  MESSAGE_TYPE["CONNECT_MATCH_OK"] = "CONNECT_MATCH_OK";
  MESSAGE_TYPE["CONNECT_MATCH_FAIL"] = "CONNECT_MATCH_FAIL";
  MESSAGE_TYPE["HUNG_UP"] = "HUNG_UP";
  MESSAGE_TYPE["OTHER_PLAYER_HUNGUP"] = "OTHER_PLAYER_HUNGUP";
  MESSAGE_TYPE["MOVE_MAIN"] = "MOVE_MAIN";
  MESSAGE_TYPE["MOVE_SHADOW"] = "MOVE_SHADOW";
})(MESSAGE_TYPE || (exports.MESSAGE_TYPE = MESSAGE_TYPE = {}));

function constructMessage(type, payload) {
  console.log('[ws] send: ', type, payload);
  return JSON.stringify({
    type: type,
    payload: payload || {}
  });
}

function parseMessage(message) {
  var parsedMessage = JSON.parse(message);
  console.log('[ws] receive: ', parsedMessage);
  return parsedMessage;
}
},{}],"../../node_modules/@kenrick95/c4/src/game/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gameBase = require("./game-base");

Object.keys(_gameBase).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _gameBase[key];
    }
  });
});

var _shared = require("./game-online/shared");

Object.keys(_shared).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _shared[key];
    }
  });
});
},{"./game-base":"../../node_modules/@kenrick95/c4/src/game/game-base.ts","./game-online/shared":"../../node_modules/@kenrick95/c4/src/game/game-online/shared.ts"}],"game/game-local.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGameLocal = initGameLocal;
exports.GameLocal = void 0;

var _board = require("../board");

var _board2 = require("@kenrick95/c4/src/board");

var _game = require("@kenrick95/c4/src/game");

var _player = require("@kenrick95/c4/src/player");

var _utils = require("@kenrick95/c4/src/utils");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var statusbox = document.querySelector('.statusbox');
var statusboxBodyGame = document.querySelector('.statusbox-body-game');
var statusboxBodyConnection = document.querySelector('.statusbox-body-connection');
var statusboxBodyPlayer = document.querySelector('.statusbox-body-player');

var GameLocal = function (_super) {
  __extends(GameLocal, _super);

  function GameLocal(players, board) {
    return _super.call(this, players, board) || this;
  }

  GameLocal.prototype.beforeMoveApplied = function () {
    if (statusboxBodyGame) {
      statusboxBodyGame.textContent = "Dropping " + (this.currentPlayerId === 0 ? '🔴' : '🔵') + " disc";
    }
  };

  GameLocal.prototype.waitingForMove = function () {
    if (!this.isMoveAllowed || this.isGameWon) {
      return;
    }

    if (statusboxBodyGame) {
      statusboxBodyGame.textContent = 'Wating for move';
    }

    if (statusboxBodyPlayer) {
      statusboxBodyPlayer.textContent = this.currentPlayerId === 0 ? "Player 1 \uD83D\uDD34" : "Player 2 \uD83D\uDD35";
    }
  };

  GameLocal.prototype.afterMove = function () {};

  GameLocal.prototype.announceWinner = function (winnerBoardPiece) {
    _super.prototype.announceWinner.call(this, winnerBoardPiece);

    if (winnerBoardPiece === _board2.BoardPiece.EMPTY) {
      return;
    }

    var message = '<h1>Thank you for playing.</h1>';

    if (winnerBoardPiece === _board2.BoardPiece.DRAW) {
      message += "It's a draw";
    } else {
      message += "Player " + winnerBoardPiece + " wins";
    }

    message += '.<br />After dismissing this message, click the board to reset game.';
    (0, _utils.showMessage)(message);

    if (statusboxBodyGame) {
      statusboxBodyGame.textContent = 'Game over';
    }

    if (statusboxBodyPlayer) {
      statusboxBodyPlayer.textContent = winnerBoardPiece === _board2.BoardPiece.DRAW ? "It's a draw" : "Player " + (winnerBoardPiece === _board2.BoardPiece.PLAYER_1 ? '1 🔴' : '2 🔵') + " wins";
    }
  };

  return GameLocal;
}(_game.GameBase);

exports.GameLocal = GameLocal;

function initGameLocal(GameLocalCosntructor, secondPlayer) {
  var _this = this;

  var canvas = document.querySelector('canvas');

  if (!canvas) {
    console.error('Canvas DOM is null');
    return;
  }

  var board = new _board.Board(canvas);
  var firstPlayer = new _player.PlayerHuman(_board2.BoardPiece.PLAYER_1);
  var game = new GameLocalCosntructor([firstPlayer, secondPlayer], board);
  statusbox === null || statusbox === void 0 ? void 0 : statusbox.classList.remove('hidden');
  statusboxBodyConnection === null || statusboxBodyConnection === void 0 ? void 0 : statusboxBodyConnection.classList.add('hidden');
  game.start();

  if (statusboxBodyGame) {
    statusboxBodyGame.textContent = 'Wating for move';
  }

  if (statusboxBodyPlayer) {
    statusboxBodyPlayer.textContent = "Player 1 \uD83D\uDD34";
  }

  canvas.addEventListener('click', function (event) {
    return __awaiter(_this, void 0, void 0, function () {
      var rect, x, y, column;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!game.isGameWon) return [3, 2];
            game.reset();
            return [4, (0, _utils.animationFrame)()];

          case 1:
            _a.sent();

            game.start();
            return [3, 3];

          case 2:
            rect = canvas.getBoundingClientRect();
            x = event.clientX - rect.left;
            y = event.clientY - rect.top;
            column = (0, _utils.getColumnFromCoord)({
              x: x,
              y: y
            });

            if (game.currentPlayerId === 0) {
              firstPlayer.doAction(column);
            } else if (game.currentPlayerId === 1 && secondPlayer instanceof _player.PlayerHuman) {
              secondPlayer.doAction(column);
            }

            _a.label = 3;

          case 3:
            return [2];
        }
      });
    });
  });
}
},{"../board":"board/index.ts","@kenrick95/c4/src/board":"../../node_modules/@kenrick95/c4/src/board/index.ts","@kenrick95/c4/src/game":"../../node_modules/@kenrick95/c4/src/game/index.ts","@kenrick95/c4/src/player":"../../node_modules/@kenrick95/c4/src/player/index.ts","@kenrick95/c4/src/utils":"../../node_modules/@kenrick95/c4/src/utils.ts"}],"game/game-local-2p.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGameLocal2p = initGameLocal2p;

var _board = require("@kenrick95/c4/src/board");

var _player = require("@kenrick95/c4/src/player");

var _gameLocal = require("./game-local");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var GameLocal2p = function (_super) {
  __extends(GameLocal2p, _super);

  function GameLocal2p() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return GameLocal2p;
}(_gameLocal.GameLocal);

function initGameLocal2p() {
  (0, _gameLocal.initGameLocal)(GameLocal2p, new _player.PlayerHuman(_board.BoardPiece.PLAYER_2));
}
},{"@kenrick95/c4/src/board":"../../node_modules/@kenrick95/c4/src/board/index.ts","@kenrick95/c4/src/player":"../../node_modules/@kenrick95/c4/src/player/index.ts","./game-local":"game/game-local.ts"}],"game/game-local-ai.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGameLocalAi = initGameLocalAi;

var _board = require("@kenrick95/c4/src/board");

var _player = require("@kenrick95/c4/src/player");

var _gameLocal = require("./game-local");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var GameLocalAi = function (_super) {
  __extends(GameLocalAi, _super);

  function GameLocalAi() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  return GameLocalAi;
}(_gameLocal.GameLocal);

function initGameLocalAi() {
  (0, _gameLocal.initGameLocal)(GameLocalAi, new _player.PlayerAi(_board.BoardPiece.PLAYER_2));
}
},{"@kenrick95/c4/src/board":"../../node_modules/@kenrick95/c4/src/board/index.ts","@kenrick95/c4/src/player":"../../node_modules/@kenrick95/c4/src/player/index.ts","./game-local":"game/game-local.ts"}],"game/game-online-2p.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initGameOnline2p = initGameOnline2p;
exports.GameOnline2p = void 0;

var _board = require("../board");

var _board2 = require("@kenrick95/c4/src/board");

var _game = require("@kenrick95/c4/src/game");

var _player = require("@kenrick95/c4/src/player");

var _utils = require("@kenrick95/c4/src/utils");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var GAME_MODE;

(function (GAME_MODE) {
  GAME_MODE[GAME_MODE["FIRST"] = _board2.BoardPiece.PLAYER_1] = "FIRST";
  GAME_MODE[GAME_MODE["SECOND"] = _board2.BoardPiece.PLAYER_2] = "SECOND";
})(GAME_MODE || (GAME_MODE = {}));

var statusbox = document.querySelector('.statusbox');
var statusboxBodyGame = document.querySelector('.statusbox-body-game');
var statusboxBodyConnection = document.querySelector('.statusbox-body-connection');
var statusboxBodyPlayer = document.querySelector('.statusbox-body-player');
var C4_SERVER_ENDPOINT = "development" === 'production' ? undefined ? undefined : "wss://c4-server.herokuapp.com/" : "ws://" + location.hostname + ":8080";

var GameOnline2p = function (_super) {
  __extends(GameOnline2p, _super);

  function GameOnline2p(players, board, _a) {
    var gameMode = _a.gameMode;

    var _this = _super.call(this, players, board) || this;

    _this.connectionPlayerId = null;
    _this.connectionMatchId = null;
    _this.ws = null;

    _this.initMatch = function () {
      if (_this.ws) {
        _this.ws.send((0, _game.constructMessage)(_game.MESSAGE_TYPE.NEW_MATCH_REQUEST, {
          playerId: _this.connectionPlayerId
        }));
      }
    };

    _this.connectToMatch = function (matchId) {
      if (!_this.ws) {
        return;
      }

      _this.ws.send((0, _game.constructMessage)(_game.MESSAGE_TYPE.CONNECT_MATCH_REQUEST, {
        playerId: _this.connectionPlayerId,
        matchId: matchId
      }));
    };

    _this.messageActionHandler = function (message) {
      var _a;

      switch (message.type) {
        case _game.MESSAGE_TYPE.NEW_PLAYER_CONNECTION_OK:
          {
            _this.connectionPlayerId = message.payload.playerId;

            if (_this.gameMode === GAME_MODE.FIRST) {
              _this.initMatch();
            } else if (_this.gameMode === GAME_MODE.SECOND) {
              var searchParams = new URLSearchParams(location.search);
              var connectionMatchId = searchParams.get('matchId');

              if (!connectionMatchId) {
                return;
              }

              _this.connectToMatch(connectionMatchId);
            }
          }
          break;

        case _game.MESSAGE_TYPE.NEW_MATCH_OK:
          {
            _this.connectionMatchId = message.payload.matchId;
            var shareUrl = location.href + "?matchId=" + _this.connectionMatchId;
            console.log('[url] Share this', shareUrl);
            (0, _utils.showMessage)("<h1>Share this URL</h1>" + "Please share this URL to your friend to start the game: " + ("<input type=\"text\" id=\"copy-box\" class=\"copy-box\" readonly value=\"" + shareUrl + "\" />") + "<button type=\"button\" id=\"copy-button\">Copy</button>");
            var copyBox_1 = document.getElementById('copy-box');
            copyBox_1.focus();
            copyBox_1.select();
            (_a = document.getElementById('copy-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
              copyBox_1 === null || copyBox_1 === void 0 ? void 0 : copyBox_1.select();
              copyBox_1 === null || copyBox_1 === void 0 ? void 0 : copyBox_1.setSelectionRange(0, 99999);
              document.execCommand('copy');
            });
          }
          break;

        case _game.MESSAGE_TYPE.CONNECT_MATCH_OK:
          {
            _this.connectionMatchId = message.payload.matchId;
          }
          break;

        case _game.MESSAGE_TYPE.CONNECT_MATCH_FAIL:
          {
            (0, _utils.showMessage)("<h1>Error</h1> Failed to connect to match.");

            if (statusboxBodyConnection) {
              statusboxBodyConnection.textContent = 'Connection error';
            }
          }
          break;

        case _game.MESSAGE_TYPE.GAME_READY:
          {
            (0, _utils.showMessage)("<h1>Game started</h1> The first piece should be dropped by " + (_this.isCurrentMoveByCurrentPlayer() ? 'you' : 'the other player'));

            if (statusboxBodyGame) {
              statusboxBodyGame.textContent = 'Wating for move';
            }

            if (statusboxBodyPlayer) {
              statusboxBodyPlayer.textContent = (_this.currentPlayerId === 0 ? "Player 1 \uD83D\uDD34" : "Player 2 \uD83D\uDD35") + " " + (_this.isCurrentMoveByCurrentPlayer() ? "(you)" : "(the other player)");
            }

            _this.start();
          }
          break;

        case _game.MESSAGE_TYPE.MOVE_SHADOW:
          {
            _this.playerShadow.doAction(message.payload.column);
          }
          break;

        case _game.MESSAGE_TYPE.GAME_ENDED:
          {
            var winnerBoardPiece = message.payload.winnerBoardPiece;
            var messageWinner = winnerBoardPiece === _board2.BoardPiece.DRAW ? "It's a draw" : "Player " + (winnerBoardPiece === _board2.BoardPiece.PLAYER_1 ? '1 🔴' : '2 🔵') + " wins";
            (0, _utils.showMessage)("<h1>Thank you for playing</h1>" + messageWinner + "<br />Next game will be started in 10 seconds.");

            if (statusboxBodyGame) {
              statusboxBodyGame.textContent = 'Game over';
            }

            if (statusboxBodyPlayer) {
              statusboxBodyPlayer.textContent = messageWinner;
            }
          }
          break;

        case _game.MESSAGE_TYPE.GAME_RESET:
          {
            _this.reset();
          }
          break;

        case _game.MESSAGE_TYPE.OTHER_PLAYER_HUNGUP:
          {
            (0, _utils.showMessage)("<h1>Other player disconnected</h1> Please reload the page to start a new match");
          }
          break;
      }
    };

    _this.beforeMoveApplied = function () {
      if (statusboxBodyGame) {
        statusboxBodyGame.textContent = "Dropping " + (_this.currentPlayerId === 0 ? '🔴' : '🔵') + " disc";
      }
    };

    _this.waitingForMove = function () {
      if (statusboxBodyGame) {
        statusboxBodyGame.textContent = 'Wating for move';
      }

      if (statusboxBodyPlayer) {
        statusboxBodyPlayer.textContent = (_this.currentPlayerId === 0 ? "Player 1 \uD83D\uDD34" : "Player 2 \uD83D\uDD35") + " " + (_this.isCurrentMoveByCurrentPlayer() ? "(you)" : "(the other player)");
      }
    };

    _this.afterMove = function (action) {
      if (_this.ws && _this.isCurrentMoveByCurrentPlayer()) {
        _this.ws.send((0, _game.constructMessage)(_game.MESSAGE_TYPE.MOVE_MAIN, {
          playerId: _this.connectionPlayerId,
          matchId: _this.connectionMatchId,
          column: action
        }));
      }
    };

    _this.gameMode = gameMode;

    if (gameMode === GAME_MODE.FIRST) {
      _this.playerMain = players[0];
      _this.playerShadow = players[1];
    } else {
      _this.playerMain = players[1];
      _this.playerShadow = players[0];
    }

    _this.initConnection();

    return _this;
  }

  GameOnline2p.prototype.initConnection = function () {
    var _this = this;

    this.connectionPlayerId = null;
    this.connectionMatchId = null;

    if (this.ws) {
      this.ws.close();
    }

    var setStatusDisconnected = function setStatusDisconnected() {
      _this.isMoveAllowed = false;

      if (statusboxBodyConnection) {
        statusboxBodyConnection.textContent = 'Disconnected from server';
      }

      if (statusboxBodyGame) {
        statusboxBodyGame.textContent = "Game over";
      }

      if (statusboxBodyPlayer) {
        statusboxBodyPlayer.textContent = "Disconnected from match";
      }
    };

    this.ws = new WebSocket(C4_SERVER_ENDPOINT);
    this.ws.addEventListener('message', function (event) {
      _this.messageActionHandler((0, _game.parseMessage)(event.data));
    });
    this.ws.addEventListener('open', function () {
      if (_this.ws) {
        _this.ws.send((0, _game.constructMessage)(_game.MESSAGE_TYPE.NEW_PLAYER_CONNECTION_REQUEST));
      }

      if (statusboxBodyConnection) {
        statusboxBodyConnection.textContent = 'Connected to server';
      }
    });
    this.ws.addEventListener('close', function (event) {
      console.log('[ws] close event', event);
      setStatusDisconnected();
    });
    this.ws.addEventListener('error', function () {
      console.log('[ws] error event', event);
      setStatusDisconnected();
    });
  };

  GameOnline2p.prototype.isCurrentMoveByCurrentPlayer = function () {
    return this.currentPlayerId + 1 === this.gameMode;
  };

  GameOnline2p.prototype.announceWinner = function (winnerBoardPiece) {
    _super.prototype.announceWinner.call(this, winnerBoardPiece);
  };

  return GameOnline2p;
}(_game.GameBase);

exports.GameOnline2p = GameOnline2p;

function initGameOnline2p() {
  var _this = this;

  var canvas = document.querySelector('canvas');

  if (!canvas) {
    console.error('Canvas DOM is null');
    return;
  }

  var searchParams = new URLSearchParams(location.search);
  var connectionMatchId = searchParams.get('matchId');
  var gameMode = !!connectionMatchId ? GAME_MODE.SECOND : GAME_MODE.FIRST;
  var board = new _board.Board(canvas);
  var players = gameMode === GAME_MODE.FIRST ? [new _player.PlayerHuman(_board2.BoardPiece.PLAYER_1), new _player.PlayerShadow(_board2.BoardPiece.PLAYER_2)] : [new _player.PlayerShadow(_board2.BoardPiece.PLAYER_1), new _player.PlayerHuman(_board2.BoardPiece.PLAYER_2)];
  var game = new GameOnline2p(players, board, {
    gameMode: gameMode
  });
  statusbox === null || statusbox === void 0 ? void 0 : statusbox.classList.remove('hidden');
  canvas.addEventListener('click', function (event) {
    return __awaiter(_this, void 0, void 0, function () {
      var rect, x, y, column;
      return __generator(this, function (_a) {
        if (!game.isGameWon) {
          rect = canvas.getBoundingClientRect();
          x = event.clientX - rect.left;
          y = event.clientY - rect.top;
          column = (0, _utils.getColumnFromCoord)({
            x: x,
            y: y
          });
          game.playerMain.doAction(column);
        }

        return [2];
      });
    });
  });
}
},{"../board":"board/index.ts","@kenrick95/c4/src/board":"../../node_modules/@kenrick95/c4/src/board/index.ts","@kenrick95/c4/src/game":"../../node_modules/@kenrick95/c4/src/game/index.ts","@kenrick95/c4/src/player":"../../node_modules/@kenrick95/c4/src/player/index.ts","@kenrick95/c4/src/utils":"../../node_modules/@kenrick95/c4/src/utils.ts"}],"game/index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gameLocal2p = require("./game-local-2p");

Object.keys(_gameLocal2p).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _gameLocal2p[key];
    }
  });
});

var _gameLocalAi = require("./game-local-ai");

Object.keys(_gameLocalAi).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _gameLocalAi[key];
    }
  });
});

var _gameOnline2p = require("./game-online-2p");

Object.keys(_gameOnline2p).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _gameOnline2p[key];
    }
  });
});
},{"./game-local-2p":"game/game-local-2p.ts","./game-local-ai":"game/game-local-ai.ts","./game-online-2p":"game/game-online-2p.ts"}],"../../node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"../../node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"../../node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"style.css":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"../../node_modules/parcel-bundler/src/builtins/css-loader.js"}],"app.ts":[function(require,module,exports) {
"use strict";

require("es6-promise/auto");

require("url-search-params-polyfill");

var Game = _interopRequireWildcard(require("./game"));

var _board = require("./board");

require("./style.css");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

document.addEventListener('DOMContentLoaded', function () {
  var canvas = document.querySelector('canvas');

  if (!canvas) {
    console.error('Canvas DOM is null');
    return;
  }

  var board = new _board.Board(canvas);
  board.render();
  var searchParams = new URLSearchParams(location.search);
  var connectionMatchId = searchParams.get('matchId');

  if (!!connectionMatchId) {
    Game.initGameOnline2p();
    var modeDOM = document.querySelector('.mode');

    if (modeDOM) {
      modeDOM.classList.add('hidden');
    }
  }

  var modeChooser = document.querySelector('.mode-chooser-submit');

  if (modeChooser) {
    modeChooser.addEventListener('click', function () {
      var modeDOM = document.querySelector('.mode');

      if (modeDOM) {
        var modeInputDOMs = document.querySelectorAll('.mode-chooser-input');
        var chosenMode = null;

        for (var i = 0; i < modeInputDOMs.length; i++) {
          chosenMode = modeInputDOMs[i].checked ? modeInputDOMs[i].value : null;

          if (chosenMode) {
            break;
          }
        }

        if (!chosenMode) {
          chosenMode = 'offline-ai';
        }

        if (chosenMode === 'offline-human') {
          Game.initGameLocal2p();
        } else if (chosenMode === 'offline-ai') {
          Game.initGameLocalAi();
        } else if (chosenMode === 'online-human') {
          Game.initGameOnline2p();
        }

        modeDOM.classList.add('invisible');
        modeDOM.addEventListener('transitionend', function () {
          modeDOM.classList.add('hidden');
        });
      }
    });
  }
});
},{"es6-promise/auto":"../../node_modules/es6-promise/auto.js","url-search-params-polyfill":"../../node_modules/url-search-params-polyfill/index.js","./game":"game/index.ts","./board":"board/index.ts","./style.css":"style.css"}],"../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "38195" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","app.ts"], null)
//# sourceMappingURL=/app.c61986b1.js.map