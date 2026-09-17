# JavaScript Runtime and Async

This is a small JavaScript project for practicing closures, promises, async/await, the call stack, event loop, tasks and microtasks.

## 1. Closure

Each task is created using the `createTask()` function.

```javascript
const task = createTask("Load Users");
```

The task counter is stored inside the `createTask()` function:

```javascript
let count = 0;
```

The counter is private because it cannot be accessed directly from outside.

We can only use:

```javascript
task.getCount();
task.run();
task.reset();
```

Every task has its own counter because every call to `createTask()` creates a new closure.

## 2. Call Stack

The Call Stack is used to execute JavaScript functions.

For example, when we call:

```javascript
runOneTask(task1, 0);
```

JavaScript puts this function into the Call Stack.

When the function calls another function, that function is added to the stack.

After the function finishes, it is removed from the stack.

## 3. setTimeout

JavaScript does not stop completely while `setTimeout()` is waiting.

For example:

```javascript
setTimeout(() => {
    console.log("Timer");
}, 2000);

console.log("Hello");
```

The output is:

```text
Hello
Timer
```

JavaScript continues executing other code while the timer is waiting.

## 4. Event Loop

Before running the Event Loop Demo, I expected the output to be:

```text
Start
Async start
Promise 1
Promise 2
Async end
Timer 1
Timer 2
```

The actual output is:

```text
Start
Async start
End
Promise 1
Promise 2
Async end
Timer 1
Timer 2
```

The reason is that normal synchronous code is executed first.

Then microtasks are executed.

Promises and the continuation after `await` are microtasks.

After the microtasks are finished, timer callbacks can be executed.

The simplified order is:

```text
Call Stack
    ↓
Microtask Queue
    ↓
Task Queue
    ↓
Event Loop
```

## 5. Tasks and Microtasks

Tasks and microtasks are both asynchronous queues.

Examples of microtasks:

```javascript
Promise.resolve().then(...)
```

and the code after `await`.

Example of a task:

```javascript
setTimeout(...)
```

Microtasks are processed before the next task.

## 6. Multiple Promises and Errors

The application uses `Promise.all()` to wait for multiple tasks.

```javascript
await Promise.all(promises);
```

Each task can either complete or fail.

Errors are handled using:

```javascript
try {
    await task.run();
} catch (error) {
    // show Failed
}
```

Therefore, one failed task does not stop the whole application.

## 7. Sequential and Concurrent Execution

Sequential execution means that tasks are executed one after another:

```javascript
await task1.run();
await task2.run();
await task3.run();
```

The total time is approximately the sum of all task times.

Concurrent execution starts all tasks together:

```javascript
const p1 = task1.run();
const p2 = task2.run();
const p3 = task3.run();

await Promise.all([p1, p2, p3]);
```

The total time is approximately the time of the slowest task.

This is why concurrent execution is usually faster when the tasks can run independently.

## Conclusion

This project demonstrates basic JavaScript asynchronous programming using only HTML, CSS and vanilla JavaScript.
