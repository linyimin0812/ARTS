> Time: 2019.05.27 - 2019.06.02
>
> Algorithm: 数组中重复的数字
>  
> Review: Overview of Blocking vs Non-Blocking
>
> Tip: 对`read`及`write`函数的封装
> 
> Share: 理解软中断

<!-- TOC -->

- [Algorithm](#algorithm)
  - [数组中重复的数字](#数组中重复的数字)
  - [实现思路](#实现思路)
  - [代码实现](#代码实现)
- [Review](#review)
- [Tip](#tip)
  - [对`read`及`write`函数的封装](#对read及write函数的封装)
    - [封装实现每次调用`read`或`write`函数都输入或输出与请求字节相同的数据](#封装实现每次调用read或write函数都输入或输出与请求字节相同的数据)
      - [`readn`函数](#readn函数)
      - [`writen`函数](#writen函数)
- [Share](#share)
  - [理解软中断](#理解软中断)
  - [查看软中断和内核线程](#查看软中断和内核线程)
  - [案例分析](#案例分析)
    - [使用的工具](#使用的工具)
    - [启动应用](#启动应用)

<!-- /TOC -->

## Algorithm

### 数组中重复的数字

在一个长度为 n 的数组里的所有数字都在 0 到 n-1 的范围内。数组中某些数字是重复的，但不知道有几个数字是重复的，也不知道每个数字重复几次。请找出数组中任意一个重复的数字。

```
Input:
{2, 3, 1, 0, 2, 5}
```

```
Output:
2
```

### 实现思路

由于要求时间复杂度为`O(n)`且空间复杂度为`O(1)`.因此不能使用排序的方法，也不能使用额外的标记数组。

对于数组元素在[0, n-1]范围内的问题，可以将值i的元素调整到第i个元素上求解。

类似思路：[First Missing Positive](../4th-week/4th-week.md#algorithm)

### 代码实现

```C++
bool duplicate(int numbers[], int length, int* duplication) {
  if (numbers == NULL || length <= 1) {
    return false;
  }
  for (int i = 0; i < length; i++) {
    while(numbers[i] != i) {
      if (numbers[i] == numbers[nuqq  ```mbers[i]]) {
          *duplication = numbers[i];
          return true;
      }
      int temp = 0;
      temp = numbers[i];
      numbers[i] = numbers[temp];
      numbers[temp] = temp;
    }
  }
  return false;
}
```

## Review

[Overview of Blocking vs Non-Blocking](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/)

阻塞和非阻塞概览

Node中的IO表示与libuv支持的系统磁盘和网络进行的相关交互.

阻塞: 当有阻塞操作正在执行时,事件循环机制(Event Loop)不能继续执行JS代码.

NodeJS对CPU密集型的运算性能很差.

在Node中所有的IO操作都提供了异步版本(非阻塞).

在使用同步方法时,若抛出异常,需要我们主动去捕获,否则整个Node进程会崩溃,程序中止.而对于异步方法来说,异常错误以回调函数参数的形式返回,用户可以根据需求对异常错误进行定制化处理,不会引起进程的崩溃.

并发和吞吐量

Node是单进程的,其并发能力是指事件循环机制(Event Loop)在完成其他工作之后执行回调函数的能力.任何代码如果期望以并发的方式执行,则必须满足:

在发生非JS操作时(IO), 事件循环(Event Loop)能继续运行

需要注意的是:阻塞代码和非阻塞代码混合可能会引起错误, 并非会按照代码的顺序执行,这一点在编码的时候应该特别注意.

## Tip

### 对`read`及`write`函数的封装

在字节流套接字上调用`read`或`write`函数，输入或输出的字节数可能比请求的数量少。

- `read`函数
  - 内核中套接字的缓存字节数小于请求的数量
  - 请求的字节数大于内核套接字中缓冲区的大小
  
- `write`函数<font color="#dd0000">非阻塞的情况下出现</font>
  - 请求的字节数大于内核中套接字的缓冲区大小
  
#### 封装实现每次调用`read`或`write`函数都输入或输出与请求字节相同的数据

##### `readn`函数

```c
ssize_t readn(int fd, void *vptr, size_t n) {
  size_t nleft = n;
  size_t nread = 0;
  char *ptr = vptr;
  
  while(nleft > 0) {
    if ((nread = read(fd, ptr, nleft)) < 0) {
      if (errno == EINTR) {
        nread = 0;        // and call read agin
      } else {
        return (-1);
      }
    } else if (nread == 0){
      break;        // EOF
    }
    nleft -= nread;
    ptr += nread;
  }
  
  return (n - nleft);
}
```

##### `writen`函数

```c
ssize_t writen(int fd, char *vptr, size_t n) {
  size_t nleft = n;
  size_t nwritten = 0;
  const char *ptr = vptr;
  while (nleft > 0) {
    if ((nwritten = write(fd, ptr, nleft)) < 0) {
      if (errno == EINTR) {
        nwritten = 0;       // call write() again
      } else {
        return -1;
      }
    }
    
    nleft -= nwritten;
    ptr += nwritten;
  }
}
```

## Share

### 理解软中断

前面[不可中断进程和僵尸进程](http://blog.linyimin.club/blog/uninrruptible-process-and-zombie.html)我们说过进程的不可中断状态是系统的一种保护机制，<font color="#dd000">是系统响应硬件设备请求的一种机制，会打断进程的正常调度和执行，调用内核中的中断处理程序来响应设备的请求</font>，这个交互过程不被意外（中断或者其他进程）打断，所以短时间的不可中断状态是正常的。但是进程长时间处于不可中断状态可能是IO出现了问题。

根据[CPU使用率过高分析及优化](http://blog.linyimin.club/blog/CPU-100-analysis.html)我们可以知道除了iowait，`irq`硬中断和`softirq`软中断使CPU使用率升高也是最常见的一种性能问题。

<font color="#dd0000">中断是一种异步的事件处理机制，可以提高系统的并发处理能力。</font>中断处理程序会打断其他进程的运行，所以为了减少对正常进程运行调度的影响，中断处理程序需要尽可能快的执行。如果中断处理程序运行的时间过长可能会引起**中断丢失的问题**。


为了解决中断处理程序运行时间过长和中断丢失的问题，Linux将中断处理过程分为两个阶段：

- 上部分： 快速处理中断，在**中断禁止模式**下运行，主要处理与硬件相关和时间敏感的工作（直接处理硬件请求，硬中断，快速执行）
- 下部分： 用来延迟处理上部分未完成的工作，通常以内核进程的方式运行。（由内核触发，软中断，延迟执行）

相关例子： **网卡接收数据包**

网卡接收到数据之后，会通过硬件中断的方式通知内核，内核调用中断处理程序进行相关的处理：

- 上部分： 将网卡数据拷贝到内存，并更新相关寄存器状态（表示数据已经读取完毕），最后发送一个软中断信号
- 下部分： 由软中断信号唤醒，读取内存数据，按照网络协议栈对数据进行逐层解析和处理，最后交付给应用进程。

对于多核CPU来说，每个CPU都对应着一个软中断内核进程（ksoftirqd/CPU编号），同时软中断还包含了内核自定义的一些事件，例如内核调度和RCU锁等。

### 查看软中断和内核线程

- 软中断的运行情况

```shell
$ cat /proc/softirqs
```

![](../../images/posts/linux-analysis/2019-05-28-interrupt/softirqs.png)

- 应中断的运行情况

```shell
$ cat /proc/interrupts
```

![](../../images/posts/linux-analysis/2019-05-28-interrupt/interrupt.png)

- 内核线程

```shell
$ ps -aux | grep ksoftirqd
```

![](../../images/posts/linux-analysis/2019-05-28-interrupt/kernel-thread.png)

### 案例分析

使用两台虚机，其中虚机1运行Nginx服务器，虚机2用作客户端，用来给Nginx施加压力（SYN FLOOD攻击）。

![](../../images/posts/linux-analysis/2019-05-28-interrupt/example.png)


#### 使用的工具

- sar： 收集、查看及保存系统活动信息的工具
- hping3： 构造TCP/IP协议数据包的工具
- tcpdump： 常用的网络抓包工具


#### 启动应用

**虚机1：**

启动Nginx服务

```shell
# 运行nginx服务器，并对外开放81端口
$ sudo docker run -itd --name=nginx -p 81:80 nginx
```

**虚机2：**

1. 测试Nginx服务

```shell
$ curl http://182.92.4.200:81
```

![](../../images/posts/linux-analysis/2019-05-28-interrupt/nginx-service.png)

2. 使用`hping3`命令模拟Nginx的客户端请求

```shell
# -S 设置tcp协议的SYN标志
# -p 设置目标端口
# -i u100 每个100微秒发送一个网络帧
 
$ hping3 -S -p 81 u100 182.92.4.200
```


这时候转到虚机1的终端，会发现系统响应明显变慢。下面我们具体来分析：

1. 使用`top`命令查看系统的资源使用情况

![](../../images/posts/linux-analysis/2019-05-28-interrupt/top-info.png)

![](../../images/posts/linux-analysis/2019-05-28-interrupt/process-info.png)

可以发现：

- 平均负载全变为0
- 每个CPU使用率都很低
- 占用CPU最多的是软中断进程

所以，系统响应变慢可能是软中断引起的。所以我们需要查看软中断的变化的情况：

```shell
$ watch -d cat /proc/softirqs
```

![](../../images/posts/linux-analysis/2019-05-28-interrupt/sofirqs-vary.png)

可以发现，网络数据包接收的软中断变化速率最快。所以我们从网络数据包接收的软中断入手，首先观察网络数据包的接收情况：

```shell
# -n DEV 表示显示网络收发的报告
$ sar -n DEV 1
```

![](../../images/posts/linux-analysis/2019-05-28-interrupt/sar.png)

根据结果，我们可以知道：

- 网卡eth1每秒收到的网络帧数最大为13279，千字节数为518.77，而发送网络帧数比较少为8250，千字节数为480.06，接收的数据帧平均大小为：518.77 × 1024 / 13279 = 40字节。显然这是一个非常小的数据帧，也就是我们经常所说的小包问题。

接下来我们需要确认接收的数据帧类型以及从是哪里发过来的。要确定一个网络数据包的类型，我们需要使用`tcpdump`进行抓包分析。

```shell
# -i eth1 只抓取eth1网卡
# -n 不解析协议名和主机名
$ tcpdump -i eth1 -n tcp
```

![](../../images/posts/linux-analysis/2019-05-28-interrupt/tcpdump.png)

可以发现虚机1收到来自`106.120.206.146:55134`客户端的请求连接数据包（Flags[S]表示该包是一个SYN包）

结合之前`sar`命令的结果，我们可以判断这是一个`SYN FLOOD`攻击。

解决`SYN FLOOD`攻击最简单的方法是：<font color="#dd0000">在交换机或者防火墙中封掉来源IP</font>

需要注意的是：之前的系统响应变慢是指<font color="#dd0000">由于大量的软中断引起的网络延迟增大，我们通过ssh连接虚机，所以会觉得系统响应变慢，实际上是网络传输引起的，而并非虚机系统本身响应变慢</font>
