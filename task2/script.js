// 1. creating task using closure, we cannot access the count variable outside this function

function createTask(name) {
    let count = 0;
    function run() {
        count++;
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const loadingTime =
                Math.floor(Math.random() * 1500) + 500;
            setTimeout(() => {
                const endTime = Date.now();
                const time = endTime - startTime;
                const failed = Math.random() < 0.2;
                if (failed) {
                    reject({
                        name: name,
                        time: time
                    });
                } else {
                    resolve({
                        name: name,
                        time: time
                    });
                }
            }, loadingTime);
        });
    }
    function getCount() { return count; }
    function reset() { count = 0; }
    return {
        run,
        getCount,
        reset
    };
}

const task1 = createTask("Load Users");
const task2 = createTask("Load Posts");
const task3 = createTask("Load Comments");
const tasks = [task1, task2, task3];


const tasksContainer = document.getElementById("tasks");
function showTasks() {
    tasksContainer.innerHTML = "";
    const names = [
        "Load Users",
        "Load Posts",
        "Load Comments"
    ];

    tasks.forEach((task, index) => {
        const div = document.createElement("div");
        div.className = "task";
        div.innerHTML = `
            <strong>${names[index]}</strong>
            <p>Status: Ready</p>
            <p>Execution count: ${task.getCount()}</p>
        `;
        tasksContainer.appendChild(div);
    });
}
showTasks();



async function runOneTask(task, index) {
    const names = [
        "Load Users",
        "Load Posts",
        "Load Comments"
    ];
    const taskDiv = tasksContainer.children[index];
    taskDiv.innerHTML = `
        <strong>${names[index]}</strong>
        <p class="loading">Status: Loading...</p>
        <p>Execution count: ${task.getCount() + 1}</p>
    `;
    const start = Date.now();
    try {
        const result = await task.run();
        const totalTime = Date.now() - start;
        taskDiv.innerHTML = `
            <strong>${names[index]}</strong>
            <p class="completed">
                Status: Completed
            </p>
            <p>Execution count: ${task.getCount()}</p>
            <p>Loading time: ${result.time} ms</p>
        `;
        return {
            success: true,
            time: totalTime
        };
    } catch (error) {
        const totalTime = Date.now() - start;
        taskDiv.innerHTML = `
            <strong>${names[index]}</strong>
            <p class="failed">
                Status: Failed
            </p>
            <p>Execution count: ${task.getCount()}</p>
            <p>Loading time: ${error.time} ms</p>
        `;

        return {
            success: false,
            time: totalTime
        };
    }
}



// run all tasks
document.getElementById("runAll").addEventListener("click", async () => { 
    showTasks();
    const start = Date.now();
    const promises = tasks.map((task, index) => {
        return runOneTask(task, index);
    });
    await Promise.all(promises);
    const totalTime = Date.now() - start;
    document.getElementById("result").innerHTML =
        `All tasks finished in ${totalTime} ms`;
});



document.getElementById("runSequential")
    .addEventListener("click", async () => {
        showTasks();
        const start = Date.now();
        await runOneTask(task1, 0);
        await runOneTask(task2, 1);
        await runOneTask(task3, 2);
        const totalTime = Date.now() - start;
        document.getElementById("result").innerHTML =
            `Sequential execution: ${totalTime} ms`;
    });



document.getElementById("runConcurrent")
    .addEventListener("click", async () => {
        showTasks();
        const start = Date.now();
        const p1 = runOneTask(task1, 0);
        const p2 = runOneTask(task2, 1);
        const p3 = runOneTask(task3, 2);
        await Promise.all([p1, p2, p3]);
        await Promise.resolve(p1,p3);
        const totalTime = Date.now() - start;
        document.getElementById("result").innerHTML =
            `Concurrent execution: ${totalTime} ms`;
    });



document.getElementById("runEventLoop")
    .addEventListener("click", async () => {
        console.clear();
        console.log("Start");
        setTimeout(() => {
            console.log("Timer 1");
        }, 1);
        setTimeout(() => {
            console.log("Timer 2");
        }, 0);
        Promise.resolve().then(() => {
            console.log("Promise 1");
        });
        Promise.resolve().then(() => {
            console.log("Promise 2");
        });
        async function myAsyncFunction() {
            console.log("Async start");
            await Promise.resolve();
            console.log("Async end");
        }
        myAsyncFunction();
        console.log("End");
    });

