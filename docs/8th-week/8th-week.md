> Time: 2019.05.20 - 2019.05.26
>
> Algorithm: 
>  
> Review: 
>
> Tip: `man`命令的使用
> 
> Share: 


## Algorithm

## Review

## Tip

### `man`命令的使用

Linux下学会使用`man`命令十分重要.

1. `man`命令提供了9中类型的帮助文档, 可以通过命令`man man`查看

```
1   Executable programs or shell commands(可执行程序或shell命令帮助)
2   System calls (functions provided by the kernel)(系统调用帮助)
3   Library calls (functions within program libraries)(库函数调用帮助)
4   Special files (usually found in /dev)(特殊文件帮助)
5   File formats and conventions eg /etc/passwd(文件格式帮助, 文件中各个字段的含义)
6   Games
7   Miscellaneous (including macro packages and conventions), e.g. man(7), groff(7)(其他)
8   System administration commands (usually only for root)(系统管理命令帮助)
9   Kernel routines [Non standard]
```

有时候可能会存在同名的命令, 系统调用等, 可以使用`man 2 command`进行区分

2. 在命令行描述中,通过关键词查找相关命令

如下想查找创建文件夹的命令:

```shell
$ man -k directory | grep create
```

![](images/man-k.png)

可以发现`mkdir`就是我们需要查找的命令.

3. 使用`cheat`命令查看相关命令常用例子

**安装**

```shell
sudo apt-get install python-pip git
sudo pip install docopt pygments
git clone https://github.com/chrisallenlane/cheat.git
cd cheat
sudo python setup.py install
```

例子: 查看命令`ls`的常用例子

```shell
$ cheat ls
```

![](images/cheat.png)

## Share