> Time: 2019.06.03 - 2019.06.09
>
> Algorithm: 
>  
> Review: 
>
> Tip: Linux管道的使用
> 
> Share: 


## Algorithm

## Review

## Tip

### Linux管道的使用

管道的特点: 

1. 如果管道中没有数据,那么从管道中取数据操作会被阻塞,直到管道内写入数据
2. 写入管道操作没有读取操作,写入操作也会被阻塞,直到管道数据被读出

#### 匿名管道

1. 由shell自动创建,存在内核中
2. 单向字节流

我们经常使用的`|`就是管道,例如`cat text | grep abc`, 直接作为两个进程的数据通道.

#### 命名管道(FIFO: First In First Out)

1. 在文件系统中,`FIFO`拥有名称,存在文件系统中,以设备特殊文件的形式存在
2. 双向字节流

`mkfifo`命令可以创建一个管道,例如`mkfifo fifo_file`.

![](images/mkfifo.png)

**向管道中写入数据**

```
$ cat "data" > fifo_file
```

上述命令表示我们想向管道文件中写入数据`data`,由于没有任何进程对它进行读操作,所以进程一直被阻塞.

**从管道中读取数据**

```
$ cat fifo_file
```

上述命令表示我们想从管道文件`fifo_file`中读取文件,此时写进程完成并退出, 并在终端上打印管道文件中的数据`data`.

#### 参考链接

[shell中的多进程【并发】](https://blog.51cto.com/fuwenchao/1564573)
[linux shell命名管道FIFO（多进程动态并发）](https://blog.csdn.net/qq_32642039/article/details/78624210)

## Share