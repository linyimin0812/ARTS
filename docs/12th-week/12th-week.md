> Time: 2019.06.17 - 2019.06.23
>
> Algorithm: Sqrt(x)
>  
> Review: Steering the right course for AI
>
> Tip: 显示使用最多fd的进程PID
> 
> Share: 并发编程中常见的问题


## Algorithm

### Sqrt(x)

> Implement int sqrt(int x).
>
> Compute and return the square root of x, where x is guaranteed to be a non-negative integer.
>
> Since the return type is an integer, the decimal digits are truncated and only the integer part of the result is returned.

**Example 1:**

```
Input: 4
Output: 2
```

**Example 2:**

```
Input: 8
Output: 2
Explanation: The square root of 8 is 2.82842..., and since 
             the decimal part is truncated, 2 is returned.
```

### 解法1: 暴力循环发法

思路: 很明显,从1开始循环求平方值,使得`i * i <= x && (i+1)*(i+1) > x`及为所求.

<font color="#dd0000">这道题需要注意的是: 会存在溢出问题, 所以使用long修饰变量i</font>

```java 
class Solution {
    public int mySqrt(int x) {
        if (x == 0 || x == 1) {
            return x;
        }
        long i = 0;
        for (i = 0; i < x; i ++) {
            if (i * i <= x && (i+1)*(i+1) > x) {
                return (int)i;
            }
        }
        return (int)i; 
    }
}
```

### 解法二: 二分查找法

思路: 此题也很容易想到使用二分查找实现.需要注意的是二分查找的退出条件.

```java
class Solution {
    public int mySqrt(int x) {
        if ( x == 1) {
            return x;
        }
        
        long left = 1;
        long right = x;
        long mid = (left + right) / 2;
        
        while (true) {
            if (left == mid) {
                return (int)mid;
            }
            if (mid * mid == x) {
                return (int)mid;
            }
            if (mid * mid > x) {
                right = mid;
                mid = (left + mid) / 2;
            } else {
                left = mid;
                mid = (mid + right) / 2;
            }
        }
    }
}
```

## Review

### [Steering the right course for AI](https://cloud.google.com/blog/products/ai-machine-learning/steering-the-right-course-for-ai)

文章开始提出，AI发展的这些年给人类带了很多好处，像帮助医生诊断，智能翻译，智能客服等。但同时也引起了人类对这项技术的担忧，就像上世纪末互联网兴起，带来了邮件，短信这样拉近人与人距离的技术，但同时无法避免恶意软件和钓鱼邮件的传播。近年来AI技术的发展比当时互联网的发展要复杂的多，也会有各种各样的问题出现，笔者提出了4个AI技术发展中必须考虑到的问题：

- 不公平性: 我们如何保证AI训练出来的模型对于每个用户的表现是公平的？

AI或者ML训练模型时使用的数据是由人来准备的，这就意味着模型学习什么样的数据，决定权在于人，如果这个人有自己的偏好，很有可能丢进模型训练的数据是片面的，模型也会有“刻板印象”。举个例子，如果我们给一个职业推荐模型的训练数据是一些旧时代的言论，它在推荐时很可能的偏好是认为，“男性”应该做“医生”，“女性”就应该做“护士”。如果我们给它一些过激歧视性言论，甚至会有种族问题。为了避免这个问题，Google现在采用文档化模型的设计，将模型要解决的问题，提出的假设，performance评判的指标，甚至伦理道德方面的考量等，创造出对用户负责的模型。

- 可解释性: AI技术如何赢得人们的信任？

目前来说，很多模型都是“黑盒”的，哪怕是模型开发人员知道输入和输出数据的含义，但并不是100%的肯定为什么模型要给出这样的结果。这样的不透明性，很难让用户完全信任模型给出的结果，信任是来自于理解这个模型的运作原理。Google AI在尝试让模型输出一些让人类更好理解的解释，而不是一些数字，量化后的指标。例如在图像识别中，将一张图片归类为“斑马”，是因为找到了“条状”的特征，理想情况下，模型应该用人类的语言向人类解释它为什么这么做。

- 工作模式的改变: AI真的会代替人类的工作，让大部分人失业吗？

AI并不是用机器完全替代人类，是将重复简单的工作自动化，让人可以更加专注于需要创造力，更有挑战的任务，帮助人类更好的工作。但不得不承认，有些工作是可以被替代的，为了帮助这部分人，Google成立了一个基金，帮助非盈利性的组织利用AI技术从三个方面入手：

1. 提供继续教育和培训，帮助那些可能会失业的人可以找到新的工作方向
2. 根据工作能力和背景，帮助人们找到更加合适的工作
3. 为低收入的雇员提供帮助

- 做正确的事情: 并不是所有的AI技术都是运用在正确的事情上，也有人拿来做“坏事” 为了引导AI从业人员在设计模型时有更好的道德观念，Google发布了AI at Google: our principles一些在使用AI技术时应该考虑的准则。同时，也有Google AI的专家在给其他企业或个人提供AI方面咨询时，传播这些观念。

最后这个问题可能是最难用技术手段解决的，完全靠人的道德标准和互相的影响来改善。不过这样反应出值得欣慰的一点是，在思想观念层面，AI或许是无法替代人类的。

## Tip

### 显示使用最多fd的进程PID


```shell
sudo find /proc -print | grep -E '/proc/[0-9]+/fd/' | awk -F '/' '{print $3}' | unic -c | sort -nr | head
```

#### 命令解释

1. `sudo find /proc -print`: 查询`/proc`目录下所有文件
2. `grep -E '/proc/[0-9]+/fd/'`: 查找所有进程对应的所有`fd`目录
3. `uniq -c`: 在每列旁边显示每行重复出现的次数
4. `sort -nr`: 对每行的第一列按数值大小进行排序,并按从小到大进行排序
5. `head`: 打印前十行


## Share

### 并发编程中常见的问题

#### 相关概念

- 时间片： CPU分配给各个线程的时间
- 上下文切换： 保存当前任务状态，加载下一个任务状态

#### 常见问题

- 上下文切换问题
- 死锁问题
- 受限于硬件和软件的资源问题
  - 硬件
	    - 网络的带宽上传和下载速度
	    - 硬盘的读写速度
	    - CPU的处理速度
  - 软件
	    - 数据库的连接数
	    - socket的连接数

#### 解决方法


**避免死锁的常见方法：**

- 避免在一个线程中同时获取多个锁；
- 避免一个线程在锁内同时占用多个资源，尽量保证每个锁只占用一个资源
- 尝试使用锁时，使用lock.tryLock(timeout)代替使用内部锁机制
- 对于数据库锁，加锁和解锁必须在一个数据库连接里，否则会出现解锁失败的情况。



**解决资源限制的方法：**

- 硬件限制
  - 使用集群并行执行程序
    - 不同的机器处理不同的数据
- 软件限制
  - 使用资源池将资源进行复用
- 并发编程
  - 根据不同的资源限制调整程序的并发度


**减少上下文切换的次数的方法：**

- 无锁并发编程
  - 数据ID按照Hash算法取模分段，不同的线程处理不同段的数据
- CAS算法
  - 使用java的Atomic包


- 使用最少线程
- 使用协程
  - 下单线程里实现多任务的调度，并在单线程里维持多个任务间的切换



#### 相关知识

**锁机制**

- 互斥性： 在同一时间只允许一个线程持有某个对象锁(操作的原子性)
- 可见性： 在锁被释放之前，对共享变量所做的修改，对于随后获得该锁的另一个线程是可见的。

**synchronized关键字**

- 对象锁
  - synchronized(this|object){}
  - 修饰非静态方法
- 类锁
  - synchronized(类.class){}
  - 修饰静态方法

**对象锁：**

- 一个线程在访问对象的同步代码块，另一个访问对象的同步代码块的线程会被阻塞
- synchronized(this|object) {} 代码块 {} 之外的代码依然是异步的
- 类中 synchronized(this|object) {} 代码块和 synchronized 修饰非静态方法获取的锁是同一个锁，即该类的对象的对象锁。同一个对象锁会相互干扰
- 两个线程访问不同对象的 synchronized(this|object) {} 代码块和 synchronized 修饰非静态方法是异步的，同一个类的不同对象的对象锁互不干扰。

**类锁：**

- 类中 synchronized(类.class) {} 代码块和 synchronized 修饰静态方法获取的锁是类锁。对于同一个类的不同对象的类锁是同一个。是同步的。

对象锁和类锁的关系：**对象锁和类锁是独立的，互不干扰。**

synchronized关键字其他注意事项：

- synchronized关键字不能继承；
  - 对于父类中synchronized关键字修饰的方法，子类在覆盖改方法时，默认情况下不是同步的，必须显示使用synchronized关键字修饰才行。
- 在定义接口方法时，不能使用synchronized关键字修饰；
- 构造方法上不能使用synchronized关键字修饰，但是可以使用synchronized关键字进行同步操作。
