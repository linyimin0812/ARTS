## Algorithm

### Two Sum

> Given an array of integers, return indices of the two numbers such that they add up to a specific target. You may assume that each input would have exactly one solution, and you may not use the same element twice.


**Example**

```
Given nums = [2, 7, 11, 15], target = 9,

Because nums[0] + nums[1] = 2 + 7 = 9,
return [0, 1].
```

### 解法1: 暴力法

使用双重循环,计算任意两个数之和,如果和等于target,则直接返回两个数在数组中的索引.

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    for(let i = 0; i < nums.length; i++) {
        for (let j = i + 1; j < nums.length; j++) {
            if (nums[i] + nums[j] === target) {
                return [i, j]
            }
        }
    }
};

```

```c
/**
 * Note: The returned array must be malloced, assume caller calls free().
 */
int* twoSum(int* nums, int numsSize, int target) {
    int *result = (int *) malloc(2 * sizeof(int));
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                result[0] = i;
                result[1] = j;
            }
        }
    }
    return result;
}
```

### 两重Map

```javascript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map()
    for (let i = 0; i < nums.length; i++) {
        map.set(nums[i], i)
    }
    
    for (let i = 0; i < nums.length; i++) {
        let value = target - nums[i]
        if (map.has(value) && map.get(value) != i) {
            return [i, map.get(value)]
        }
    }
};
```

### 一重Map

```JavaScript
/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    const map = new Map()
    for (let i = 0; i < nums.length; i++) {
        let value = target - nums[i]
        if (map.has(value)) {
            return [i, map.get(value)]
        } else {
            map.set(nums[i], i)
        }
    }
};
```

## Review

[Overview of Blocking vs Non-Blocking](https://nodejs.org/en/docs/guides/blocking-vs-non-blocking/)

**阻塞和非阻塞概览**

- Node中的IO表示与`libuv`支持的系统磁盘和网络进行的相关交互.

- **阻塞**: 当有阻塞操作正在执行时,事件循环机制(Event Loop)不能继续执行JS代码.

- NodeJS对CPU密集型的运算性能很差.

- 在Node中所有的IO操作都提供了异步版本(非阻塞).

在使用同步方法时,若抛出异常,需要我们主动去捕获,否则整个Node进程会崩溃,程序中止.而对于异步方法来说,异常错误以回调函数参数的形式返回,用户可以根据需求对异常错误进行定制化处理,不会引起进程的崩溃.

**并发和吞吐量**

Node是单进程的,其并发能力是指事件循环机制(Event Loop)在完成其他工作之后执行回调函数的能力.任何代码如果期望以并发的方式执行,则必须满足:

<font color="#dd0000">在发生非JS操作时(IO), 事件循环(Event Loop)能继续运行</font>

需要注意的是:<font color="#dd0000">阻塞代码和非阻塞代码混合可能会引起错误, 并非会按照代码的顺序执行,这一点在编码的时候应该特别注意.</font>

## Share

> C语言实现一个HashMap

散列表由数组扩展而来,使用数组支持一下标的方式随机访问数据的特性.所以散列表的相关操作——插入、查找、删除时间复杂度均为O(1).

基本思想: 

- 使用`键`或者`关键字`标识相关数据
- 使用散列函数(Hash函数或者哈希函数)对`键`或者`关键词`进行计算获取相关数据所在的索引.

所以对于散列表来说，核心部分是**散列函数**的实现。由于散列函数的作用是根据键值计算相关数据所属数组的索引，所以散列函数应该满足以下条件：

1. 散列函数计算得到的散列值应该是非负整数；
2. 若key1 = key2,则hash(key1) = hash(key2)
3. 若key1 != key2，则hash(key1) != hash(key2)

但是，在真实情况下，任意不同key对应不同的散列值的散列函数是不存在的。即存在<font color="#dd0000">散列冲突</font>.

为了区分不同key对应相同散列值时键值对应的数值，需要使用相关技术解决散列冲突。

### 解决散列冲突的方法

1. 开放寻执法
   1. 线性探测法
   2. 二次探测法
   3. 双重散列法
2. 链表法

#### 线性探测法

某个键值经过散列之后，如果存储位置已经被占用，则从当前位置开始，依次往后查找空闲位置。

**使用线性探测法解决散列冲突的散列表下的相关操作**

1. 查找

使用hash函数计算出键值对应的散列值之后，使用散列值对应的键值与查找的元素进行比较，若相等则说明查找成功，返回键值对应的value，否则，顺序依次往后查找，继续比较，当遍历完成之后如果仍不与查找的键值相等，说明键值在散列表中不存在。

2. 删除

<font color="#dd0000">不能直接将键值对应的value设为空</font>因为这样会引起其他键值在查找时失败。正确的做法是: <font color="#dd0000">将要删除的元素特殊标记为`delete`, 表示此元素已经被删除</font>。这样其他键值在查找的时候，遇到`delete`标记的空间时，才能继续往下继续探测。而不会认为探测已经结束而返回对应元素不存在。

**时间复杂度分析**

- 最差情况： 当所有的键值对应的散列值都相同时，所有操作的时间复杂度为O(n)
- 最好情况： 当不存在散列冲突时，所有的操作时间复杂度为O(1)
- 一般情况： 与散列函数的实现相关

**优点**

1. 数据都存在数组中，可以有效使用CPU缓存加速查询速度
2. 序列化简单

**缺点**

1. 删除数据比较麻烦，需要特殊标记已删除数据
2. 比起链表法，解决冲突的代价更高


**使用场景**

<font color="#dd0000">数据量较小，装载因子较小的情况下，使用开放寻址法</font>

#### 二次探测

探测序列为: $$hash(key) + 0^2、hash(key) + 1^2、hash(key) + 2^2、hash(key) + 3^2 ...$$

即： 对于每个键值，没有冲突时直接使用hash(key)，第一次冲突时使用往下1个存储单位，第二次冲突时往下4个存储单位，以此类推，直至找到没有冲突的位置。

其他的分析与线性探测分析一致，不再重复。

#### 双重散列

使用一组hash函数，先用第一个hash函数，若有冲突，则使用第二个hash函数，直至找到一个空闲位置。

其他的分析与线性探测分析一致，不再重复。

### 链表法

基本思想： 在散列表中，数组每个元素指向一条链表，所有散列值相同的元素放在相同槽位对应的链表中。

![链表法](./images/链表法.jpg)

**使用链表法解决散列冲突的散列表下的相关操作**

1.插入

使用hash函数计算键值得到散列值后，直接将元素插入槽位对应链表的头部

2. 查找

使用hash函数计算键值得到散列值后，遍历槽位对应的链表，比较查找键值，若存在相等，说明查找成功，返回结果，否则说明对应键值不存在

3. 删除

使用hash函数计算键值得到散列值后，遍历槽位对应的链表，比较查找键值，若存在相等，则删除此节点，否则说明要删除的键值不存在，直接返回进行任何操作


**时间复杂度分析**

1. 插入操作的时间复杂度为O(1)
2. 删除和查找的时间复杂度为O(k), k为对应槽位的链表长度，与散列函数的实现有关。

**优点**

1. 内存使用率高

**缺点**

1. 指针需要消耗额外的内存空间
2. 链表对CPU缓存不友好
3. 由于存在指针，所以序列化相对困难

**使用场景**

适用于存储大对象，大数据量的散列表，而且很灵活，可以支持多种优化策略：如使用跳表、红黑树替代链表，提高删除和查找的效率。


### 散列表的实现

在实现之前，我们先说一下实现散列表过程中需要注意的东西。

> 散列函数的实现要求

1. 不能太过复杂，过于复杂，会消耗过多的计算时间，影响散列表的整体性能
2. 散列函数生成的值尽可能随机，且分布均匀。

> 散列表的动态扩容

散列表之所以有如此高的效率，主要原因是基于数组以下标随机访问元素的特性，由于数组在初始化时需要确定数组长度，同时由于散列表中插入的元素越多，装载因子越大，越容易产生冲突，为了支持插入更多的元素及避免大量冲突引起的性能下降，需要进行动态扩容。

但是<font color="#dd0000">散列表的动态扩容相对要复杂，不能直接搬移数据</font>，因为散列函数在返回计算结果之前会与数组的长度进行一个取余操作，所以扩容之后，对同一键值散列函数计算出的结果是不一样的，需要<font color="#dd0000">使用散列函数重新计算每个元素的存储位置</font>

可以发现，对于支持动态扩容的散列表，在插入时，如果不需要扩容，则时间复杂度为O(1)，若需要扩容，则时间复杂度为O(n).使用均摊分析，平均复杂度为O(1)。

为了避免某一次插入时间复杂度为O(n)，可以进行一下优化：

<font color="#dd0000">分批完成数据的迁移</font>： 新数据插入新的散列表中，并从老散列表中去除一个数据插入新表中，重复多次之后即可完成数据的搬移。

<font color="#dd0000">注意</font>: 为了兼容新老散列表中的数据，查找和删除操作先从新散列表中查找，若没有找到再去旧散列表查找。

#### 散列函数的实现

Java中借用hashCode的返回值实现了一版散列函数。

```java
public int hashCode() {
  int var1 = this.value;
  if (var1 == 0 && this.value.length > 0) {
    char[] var2 = this.value;
    for (int var3 = 0; var3 < this.value.length; var3++) {
      var1 = 31 * var1 + var2[var3]
    }
    this.hash = var1
  }
  return var1;
}

public int hash(Object key) {
  int h = ket.hashCode();
  return (h ^ (h >>> 16)) & (capicity - 1); // capicity表示散列表的容量
}
```

**C语言实现如下**

```c
// capacity为散列表容量
int hash(int capacity, void *key) {
  char *string = (char *) key;
  int length = strlen(string);
  int hash = 0;
  for (int i = 0; i < length; i++) {
    hash = hash * 31 + string[i];
  }
  // A % B == A & (B - 1) if B is power of 2
  return (hash ^ (hash >> 16)) & (tableSizeFor(capacity) - 1); 
}
```

[具体实现](https://github.com/linyimin-bupt/The-Beauty-of-Data-Structures-and-Algorithms/blob/master/src/hash-map/hashMap.c)

### 参考链接

[散列表（上）：Word文档中的单词拼写检查功能是如何实现的？](https://time.geekbang.org/column/article/64233)

[散列表（中）：如何打造一个工业级水平的散列表？](https://time.geekbang.org/column/article/64586)

[C语言实现HashMap](https://zhuanlan.zhihu.com/p/54017133)

## Tip

在使用`C`语言实现HashMap的时候, 在指定创建Map容量时需要将`capacity`转换成距离`capacity`最近的2的幂.刚开始直接使用循环求解.

```C
unsigned int tableSizeFor(unsigned int capacity) {
  int n = 1;
  while(n < capacity) {
    n <<= 1;
  }
  return n > MAX_CAPACITY ? MAX_CAPACITY : n;
}
```

时间复杂度为O(logn), 由于这个函数只会调用一次(创建Map时使用),所以对性能影响不大.

> 在Java中提供一种很优雅的算法,时间复杂度为O(1)

这里把它使用C实现了一遍, 其实也没有多大变化.

```C
unsigned int tableSizeFor (unsigned int capacity) {
  int n = capacity - 1;
  n |= n >> 1;
  n |= n >> 2;
  n |= n >> 4;
  n |= n >> 8;
  n |= n >> 16;
  
  return n < 0 ? 1 : n > MAX_CAPACITY ? MAX_CAPACITY : (n + 1);
}
```

原理分析:

将最高位的1后面的位全部变成1,最后在让结果+1,即可得到最接近且大于`capacity`的2的整数次幂的值.