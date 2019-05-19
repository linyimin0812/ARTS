> Time: 2019.05.13 - 2019.05.19
>
> Algorithm: Valid parentheses
>  
> Review: File I/O
>
> Tip: `wc`统计文件的行数,单词数及字节数
> 
> Share: 优于select的epoll


## Algorithm

### Valid parentheses

> Given a string containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
>
> An input string is valid if:
>
> Open brackets must be closed by the same type of brackets.
> Open brackets must be closed in the correct order.
> Note that an empty string is also considered valid.

**Example 1:**

```
Input: "()"
Output: true
```

**Example 2:**

```
Input: "()[]{}"
Output: true
```

**Example 3:**

```
Input: "(]"
Output: false
```

**Example 4:**

```
Input: "([)]"
Output: false
```

**Example 5:**

```
Input: "{[]}"
Output: true
```

### 解法

很明显,使用栈数据结构即可完成.

遍历字符串,左括号入栈, 右括号则取出栈顶元素进行比较, 若匹配这继续遍历,否则是非法括号.遍历完成之后,若栈为空则返回`true`,否则返回`false`.

```C++
class Solution {
public:
    bool isValid(string s) {
        stack<char> left;
        
        for (int i = 0; i < s.size(); i++) {
            if (s[i] == '(' || s[i] == '{' || s[i] == '[') {
                left.push(s[i]);
                continue;
            }
            if (left.empty()) {
                return false;
            }
            char leftChar = left.top(); left.pop();
            switch (s[i]) {
                case ')':
                    if (leftChar != '(') {
                        return false;
                    }
                    break;
                    
                case '}':
                    if (leftChar != '{') {
                        return false;
                    }
                    break;
                case ']': 
                    if (leftChar != '[') {
                        return false;
                    }
                    break;
                default: 
                    return false;
            }
        }
        if (left.empty()) {
            return true;
        }
        return false;
    }
};
```

## 文件I/O

### 综述

本章讲讲解的文件I/O是非缓冲IO(`unbuffered IO`),所谓的非缓冲IO是指每次调用`read`或者`write`函数,都会引发系统调用.非缓冲IO属于POSIX标准.

本章主要解决的问题:

1. 文件IO常用的5个函数`open`, `write`, `read`, `lseek`和`close`.

2. 非缓冲IO`read`及`write`函数`nbytes`对读写性能的影响

3. 内核如何维护多进程同时操作一个文件

### 文件描述符

对于内核来说,所有打开的文件都由文件描述符表示.对于文件的操作也通过文件操作符完成.文件描述符通常是一个非负整数.

在Unix系统中, 0通常代表标准输入, 1表示标准输出, 2表示标准错误,为了程序的可读性,一般不在程序中直接使用魔法数.所以`unistd.h`文件为这些数定义了符号常量:

- `STDIN_FILENO`
- `STDOUT_FILENO`
- `STDERR_FILENO`

文件描述符的值范围为: 0~FILE_MAX-1

Linux系统可以通过一下命令查看`FILE_MAX`的值

```bash
cat /proc/sys/fs/file-max
```

### `open` 和 `openat`函数

打开文件或者创建文件

```objectivec
#include <fcntl.h>

int open(const char *path, int oflag, .../* mode_t mode*/);
int openat(int fd, const char *path, int oflag, .../*mode_t mode*/);
```

其中path指定文件的路径, oflag指定打开模式;

常用打开模式:

|模式|描述|
|:---:|:---|
|O_RDONLY|以只读的方式|
|O_WRONLY|以只写的方式|
|O_RDWR|以既可读又可写的方式|
|O_APPEND|已追加写的方式|
|O_CREAT|如果打开的文件不存在就重新创建|
|O_NOBLOCK|以非阻塞的方式打开|
|O_SYNC|每次调用写都要刷新到磁盘|

`openat`函数与`open`函数的不同之处在于:

1. 在当前文件夹下使用相对路径, 而`open`函数只能使用当前路径或者绝对路径
2. 可以避免`TOCTTOU`错误

### `creat` 函数

用于创建新文件

```C
#include<fcntl.h>
int creat(const char *path, mode_t mode);
```

这个方法不足之处在于: <font color="#dd0000">创建相应文件之后返回的描述符只支持写操作</font>

与`open(path, O_RDONLY | O_CREAT | O_TRUNC, node)`是等价的.所以推荐直接使用`open`函数, 可以支持读操作.

### `close` 函数

关闭打开的文件.

```C
#include<unistd.h>

int close(int fd);
```

关闭文件描述符对应的文件.

当进程结束时, 打开的文件也会由内核自动关闭.

### `lseek` 函数

指定文件的偏移量.当文件打开时, 一般文件偏移量为0, 若指定了`O_APPEND`,文件偏移量指向文件的末尾.

```C
#include<unistd.h>
off_t lseek(int fd, off_t offset, int whence);
```

`whence`: `offset`的含义由`whence`决定

- `SEEK_SET`: 从文件头开始, 直接返回`offset`
- `SEEK_CUR`: 从当前偏移量开始, 返回`当前偏移量`+`offset`
- `SEEK_END`: 从文件尾开始, 返回`文件尾对应的偏移量` + `offset`(offset既可以为正数,也可为负数)

<font color="#dd0000">查看当前的文件偏移量</font>

```C
off_t cur = lseek(fd, 0, SEEK_CUR);
``` 

### `read` 函数

### `write` 函数

### I/O的效率

### 文件共享

### 原子操作

### `dup` 和 `dup2` 函数

### `sync`, `fsync` 和 `fdatasync` 函数

### `fcntl` 函数

### 总结

## Tip 

### `wc`统计文件的行数,单词数及字节数

`wc`命令用于统计文件的行数,单词数或字节数

#### 常用选项

|参数选项|解释说明|
|:---:|:---:|
|-c|统计字节数|
|-l|统计行数|
|-m|统计字符数|
|-w|统计单词数|
|-L|统计最长行的长度|

#### 使用范例

1. 查看字节数

```shell
$ wc -c /etc/hosts
```

2. 查看行数

```shell
$ wc -l /etc/hosts
```

3. 查看字符数

```shell
wc -m /etc/hosts
```

4. 查看单词数

```shell
$ wc -w /etc/hosts
```

5. 查看最长行的长度

```shell
$ wc -L /etc/hosts
```

##### 实际例子: 查看登录系统的用户数

```shell
$ who | wc -l
```

## Share

### IO复用

实现I/O复用的方法主要有: `select`函数和`epoll`函数.下面主要根据《TCP/IP网络编程》中的讲解,做一个总结分析.

#### 基于`select`函数的I/O复用

使用select函数可以将多个描述符集中到一起统一监视.

##### 设置文件描述符

使用`fd_set`数据结构保存需要监视的文件描述符.针对`fd_set`变量的操作是基于位实现的.自己实现难度较大,可以使用相关的宏完成.

- `FD_ZERO(fd_set *fds)`: 将fd_set变量的所有位初始化为0.
- `FD_SET(int fd, fd_set *fds)`: 在参数`fds`中注册文件描述符`fd`的信息
- `FD_CLR(fd_set *fds)`: 清空`fd_set`变量中注册的文件描述符信息
- `FD_ISSET(int fd, fd_set *fds)`: 若`fd_set`参数中包含文件描述符`fd`的信息,则返回真,否则返回假

##### 调用`select函数监控多个文件描述符

```C
#include<sys/select.h>
#include<sys/time.h>

int select(int maxfd, fd_set *readset, fd_set *writeset, fd_set *exceptset, const struct timeval *timeout);
```

参数:

- `maxfd`: 监控对象文件描述符数量
- `readset`: 是否存在待读取数据的文件描述符集合
- `writeset`: 是否可以传输无阻塞数据的文件描述符集合
- `exceptset`: 是否发生异常的文件描述符集合
- `timeout`: 若超过timeout指定的时间还没有相关事件发生,则`select`函数直接返回不在阻塞等待

返回值:

- `-1`: 发生错误
- `0`: 超时
- `> 0`: 有相关事件发生


##### 查看`select`函数返回后的结果

`select`函数调用完成之后, `fd_set`参数会发生变化,发生变化的文件描述符不变,仍为1, 而其他位全部设为0.所以我们需要遍历监控的文件描述符集合,然后使用`ISSET(int fd, fd_set *fds)`找出变化的文件描述符,然后进行相应的IO操作.

<font color="#dd0000">由于`select`函数直接改变了`fd_set`变量,所以下次监视的时候需要重新设置,为了方便起见,应该复制一份副本作为参数传送给`select`函数.</font>

##### 实现I/O复用服务器端

```c
#include <stdlib.h>
#include <stdio.h>
#include <arpa/inet.h>
#include <sys/select.h>
#include <sys/time.h>
#include <unistd.h>

#define BUF_SIZE 1024

void error_handling(char *message);

int main(int argc, char *argv[]) {

    struct sockaddr_in server_addr;
    struct sockaddr_in client_addr;

    int server_sock;
    int client_sock;

    char message[BUF_SIZE];

    if (argc != 2) {
        printf("Usage: %s <port>\n", argv[0]);
        exit(1);
    }

    server_sock = socket(PF_INET, SOCK_STREAM, 0);

    if (server_sock == -1) {
        error_handling("socket() error!");
    }

    server_addr.sin_family = AF_INET;
    server_addr.sin_port = htons(atoi(argv[1]));
    server_addr.sin_addr.s_addr = htonl(INADDR_ANY);

    if (bind(server_sock, (const struct sockaddr *) &server_addr, sizeof(server_addr)) == -1) {
        error_handling("bind() error");
    }

    if (listen(server_sock, 5) == -1) {
        error_handling("listen() error");
    }

    // 使用多路复用处理来自客户端的请求
   fd_set reads, temps;
   struct timeval timeout;

   FD_ZERO(&reads);
   FD_SET(server_sock, &reads);
   int fd_max = server_sock;

   while (1) {
       temps = reads;
       timeout.tv_usec = 200;
       timeout.tv_sec = 200;
       int result = select(fd_max + 1, &temps, 0, 0, &timeout);

       if (result == -1) {
           error_handling("select() error");
           break;
       }

       if (result == 0) {
           puts("Time-out");
           continue;
       } else {
           for (int i = 0; i < fd_max + 1; i++) {
               if (FD_ISSET(i, &temps)) {
                   // connection request

                   if (i == server_sock) {
                       socklen_t client_addr_size = sizeof(client_addr);
                       client_sock = accept(server_sock, (struct sockaddr *) &client_addr, &client_addr_size);
                       FD_SET(client_sock, &reads);
                       if (client_sock > fd_max) {
                           fd_max = client_sock;
                       }

                       printf("Connected client: %d \n", client_sock);
                   } else {
                       int str_len = read(i, message, BUF_SIZE);

                       if (str_len == 0) {
                           FD_CLR(i, &reads);
                           close(i);
                           printf("closed client: %d \n", i);
                       } else {
                           // echo!
                           write(i, message, str_len);
                       }
                   }
               }
           }
       }
   }
    close(server_sock);
    return 0;
}

void error_handling(char *message) {
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
```

#### 优于`select`的`epoll`