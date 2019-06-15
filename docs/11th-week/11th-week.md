> Time: 2019.06.10 - 2019.06.16
>
> Algorithm: 
>  
> Review: Understanding process.nextTick()
>
> Tip: shell进程`jobs`,`fg`,`bg`,`wait`命令的使用
> 
> Share: 

## Algorithm

## Review

[Understanding process.nextTick()](https://howtonode.org/understanding-process-next-tick)

`process.nextTick()`函数的作用: 将函数推迟到一个全新的堆栈再执行

如何使用`process.nextTick()`函数?

1. 交叉执行CPU密集型任务与其他事件.

```JavaScript
var http = require('http');

function compute() {
    // performs complicated calculations continuously
    // ...
    process.nextTick(compute);
}

http.createServer(function(req, res) {
     res.writeHead(200, {'Content-Type': 'text/plain'});
     res.end('Hello World');
}).listen(5000, '127.0.0.1');

compute();
```

2. 保持回调函数真正地异步执行

3. `EventEmitter`触发事件

一个类继承了 EventEmitter，而且想在实例化的时候触发一个事件：

```javascript
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);
  this.emit('event');
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});
```

不能直接在构造函数里执行 this.emit('event')，因为这样的话后面的回调就永远无法执行。把 this.emit('event') 放在 process.nextTick() 里，后面的回调就可以执行，这才是我们预期的行为：

```javascript
const EventEmitter = require('events');
const util = require('util');

function MyEmitter() {
  EventEmitter.call(this);

  // use nextTick to emit the event once a handler is assigned
  process.nextTick(() => {
    this.emit('event');
  });
}
util.inherits(MyEmitter, EventEmitter);

const myEmitter = new MyEmitter();
myEmitter.on('event', () => {
  console.log('an event occurred!');
});

```


### 参考链接

[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)

[Event Loop、计时器、nextTick](https://juejin.im/post/5ab7677f6fb9a028d56711d0#heading-12)

## Tip

### shell进程`jobs`, `fg`, `bg`, `wait`命令的使用

当在终端运行某作业时,终端会被该作业占据,若再想重新运行其他作业则需要重新打开一个终端.为了避免这种不方便的操作,我们可以把作业放到后台运行,主要有两种方式:

1. `command` &

命令将脚本放到后台执行，但是标准输出还是会显示到当前终端，影响用户操作，所以最好是将输出重定向到其他文件:

`command &> /dev/null`

2. 首先使用`CTRL + Z`将作业中止,然后使用`bg`命令放到后台中运行

如果一个作业已经在前台执行，可以通过`ctrl+z`将该作业放到后台并挂起。然后通过jobs命令查看在后台执行的作业并找到对应的作业ID，执行`bg %n`(n为通过jobs查到的作业ID)唤醒该作业继续执行。

该方式也存在结果会输出到终端上的情况，同样可以用重定向的方法解决.


### jobs

`jobs`命令用于显示当前终端关联的后台任务情况

#### 常用选项

|选项|功能描述|
|-l|列出进程ID及其他信息|
|-p|只显示进程的ID|
|-n|仅列出上次显示进程后发生变化的进程信息|
|-r|只显示运行着的进程信息|
|-s|只显示停止状态的进程信息|

#### 例子

```shell
$ jobs -l
```

![](images/jobs-l.png)

### `fg`, `bg`命令

`ctrl+z`: 在前台执行的进程,放到后台并挂起.

`ctrl+c`: 前台进程终止

`fg %n`: 将后台执行进程n调到前台执行，n表示jobnumber

`bg %n`: 将在后台挂起的进程，继续执行

`kill %n`: 杀掉后台运行的进程.

### 避免终端退出影响后台进程的运行

当用户注销或网络中断时,终端收到`SIGHUP`信号,从而关闭终端下的所有进程.如果我们需要作业在后台执行并不受终端退出的影响，可以用下面两种方式:

1. `nohup`命令

nohup命令会忽略SIGHUP信号，从而终端退出时不会影响到后台作业

2. 将作业挂到新的会话下面

`(command &> /dev/null &)`或者将`command &> /dev/null&`放到另一个脚本中运行都可以实现.



### 参考链接

[jobs 命令示例](https://codingstandards.iteye.com/blog/780581)

## Share