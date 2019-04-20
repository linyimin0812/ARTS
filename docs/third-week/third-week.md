> Time: 2019.04.15 - 2019.04.21
>
> Algorithm: Majority Element
>  
> Review: Majority Voting Algorithm: Find the majority element in a list of values
> 
> Share: Typescript实现一个DedupeAPI类
> 
> Tip: Markdown TO插件生成markdown目录

<!-- TOC -->

- [Algorithm(Majority Element)](#algorithmmajority-element)
  - [实现思路1: 排序](#%E5%AE%9E%E7%8E%B0%E6%80%9D%E8%B7%AF1-%E6%8E%92%E5%BA%8F)
    - [代码实现](#%E4%BB%A3%E7%A0%81%E5%AE%9E%E7%8E%B0)
  - [实现思路2: 多数投票算法](#%E5%AE%9E%E7%8E%B0%E6%80%9D%E8%B7%AF2-%E5%A4%9A%E6%95%B0%E6%8A%95%E7%A5%A8%E7%AE%97%E6%B3%95)
  - [代码实现](#%E4%BB%A3%E7%A0%81%E5%AE%9E%E7%8E%B0-1)
- [Review](#review)
  - [多数投票算法: 找出序列中的众数](#%E5%A4%9A%E6%95%B0%E6%8A%95%E7%A5%A8%E7%AE%97%E6%B3%95-%E6%89%BE%E5%87%BA%E5%BA%8F%E5%88%97%E4%B8%AD%E7%9A%84%E4%BC%97%E6%95%B0)
    - [问题陈述](#%E9%97%AE%E9%A2%98%E9%99%88%E8%BF%B0)
    - [原理分析](#%E5%8E%9F%E7%90%86%E5%88%86%E6%9E%90)
      - [第一次遍历](#%E7%AC%AC%E4%B8%80%E6%AC%A1%E9%81%8D%E5%8E%86)
      - [第二次遍历](#%E7%AC%AC%E4%BA%8C%E6%AC%A1%E9%81%8D%E5%8E%86)
    - [解释](#%E8%A7%A3%E9%87%8A)
  - [分布式多数投票算法](#%E5%88%86%E5%B8%83%E5%BC%8F%E5%A4%9A%E6%95%B0%E6%8A%95%E7%A5%A8%E7%AE%97%E6%B3%95)
- [Tip](#tip)
  - [Markdown TOC](#markdown-toc)
- [Share](#share)
  - [Typescript实现一个DedupeAPI类](#typescript%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AAdedupeapi%E7%B1%BB)
    - [主要实现功能](#%E4%B8%BB%E8%A6%81%E5%AE%9E%E7%8E%B0%E5%8A%9F%E8%83%BD)
    - [代码实现](#%E4%BB%A3%E7%A0%81%E5%AE%9E%E7%8E%B0-2)

<!-- /TOC -->

## Algorithm(Majority Element)

> Given an array of size n, find the majority element. The majority element is the element that appears more than ⌊ n/2 ⌋ times.
> You may assume that the array is non-empty and the majority element always exist in the array.

Example 1:

Input: [3,2,3]
Output: 3
Example 2:

Input: [2,2,1,1,1,2,2]
Output: 2

### 实现思路1: 排序

由于众数的定义是出现次数大于数组元素的一半，很明显，如果这个数组有序的话，数组中间元素一定是众数。所以对数组进行排序，即可得到答案。

使用快排进行排序，所以时间复杂度为O(n * lgn), 空间复杂度为O(1).


#### 代码实现

1. 快排的递归实现

```C
void quickSort(int* nums, int numsSize) {
    __qsort(nums, 0, numsSize - 1);
}

// 递归排序
__qsort(int* nums, int l, int r) {
    if (l >= r) {
        return;
    }
    int pivot = partition(nums, l, r);
    __qsort(nums, l, pivot - 1);
    __qsort(nums, pivot + 1, r);
}

// 寻找基准点的位置索引
int partition(int* nums, int l, int r) {
    int pivot = nums[r];
    int i = l;
    for (int j = l; j <= r; j++) {
        if (nums[j] < pivot) {
            swap(nums, i, j);        
            i++;
        }
    }
    swap(nums, i, r);
    return i;
}
// 交换数组中两个元素的位置
void swap(int* nums, int i, int j) {
    int temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
}
```

2. 具体实现

```C
int majorityElement(int* nums, int numsSize) {
    quickSort(nums, numsSize);
    return nums[numsSize / 2];
    
}
```

### 实现思路2: 多数投票算法

具体分析[Review](#review)部分

### 代码实现

```C
int majorityElement(int* nums, int numsSize) {
    int condidate =0;
    int count = 0;
    for (int i = 0; i < numsSize; i++) {
        if (nums[i] == condidate) {
            count++;
        } else if (count > 0) {
            count -= 1;
        } else {
            condidate = nums[i];
        }
    }
    return condidate;
    
}
```

## Review

[Majority Voting Algorithm: Find the majority element in a list of values](https://gregable.com/2013/10/majority-vote-algorithm-find-majority.html)

### 多数投票算法: 找出序列中的众数

#### 问题陈述

如果有一个未排序的序列，你想知道序列中是否有超过一半的元素值相等。如果存在对应的值是什么。`多数投票算法`高效地解决了这个问题。

这个算法可以应用在容错性计算中。在执行完多个冗余计算后，使用`多数投票算法`判断是否大多数结果是否一致。

#### 原理分析

`多数投票算法`需要遍历两次序列。

1. 第一次遍历： 产生一个`候选值(condidate)`，如果存在众数，则`condidate`为众数
2. 第二次遍历： 验证`候选值(conditate)`是否为众数

##### 第一次遍历

首先，我们需要初始化两个值: `condidate = any`和`count = 0`，然后遍历序列：

对于序列中的每个元素：
1. 检查`count`的值，如果`count == 0`，将当前元素设为`condidate`
2. 比较当前元素的值和`condidate`，如果相等，`count++`，否则`count--`。

**代码实现如下**

```C
int condidate = 0;
int count = 0;
for (int i = 0; i < numsSize; i++) {
  if (count == 0) {
    condidate = nums[i];
  }
  if (condidate == nums[i]) {
    count++;
  } else {
    count--;
  }
}
```
 
##### 第二次遍历
 
这个步骤比较简单，就是判断第一次遍历序列得到的`condidate`是否为众数。
 
实现思路：
 
首先设置一个计数器`count = 0`，然后遍历序列，对于序列的每个元素，判断是否与`condidate`相等，如果相等`count++`。否则直接跳过。遍历完成之后，检查`count`是否大于序列中元素个数的一半。

**代码实现如下**

```C
int count = 0;
for (int i = 0; i < numsSize; i++) {
  if (condidate == nums[i]) {
    count++;
  }
}
if (count > numsSize / 2) {
  return true;
}
return false;
```

#### 解释

在这里只考虑存在众数的情况，因为不存在众数时，第二次遍历即可解决。

以序列为例：`[5, 5, 0, 0, 0, 5, 0, 0, 5]`

根据上诉算法，遍历到第一个元素`5`时，`condidate = 5; count = 1`，由于`5`不是众数，所以在某一点时，`count`一定会变为`0`。在上面的序列中，在遍历到第4个元素的时候`count = 0`。`count`对应的值为: `[1, 2, 1, 0, ...]`。在`count = 0`时，有其他两个元素和两个`5`元素消耗了。下面我们考虑两种情况：

1. 两个元素是众数，根据众数的定义，剩下元素组成的序列中，仍会保持不变。
2. 两个元素并非都是众数，答案就更明显了。

也就是<font color="#dd0000">序列中从condidate被赋值到count被减为0的那一段可以被去除，剩下部分的多数元素依然是原数组的多数元素</font>。这样我们可以不断重复这个过程，直至扫描到序列尾部，那么`count`的肯定大于0，而这个`count`对应的`condidate`就是众数元素。

### 分布式多数投票算法

多数投票算法可以在多和处理器的并行计算中。对于序列`[1, 1, 1, 2, 1, 2, 1, 2, 2]`我们分为: `split1: [1, 1, 1, 2, 1]`和`split2: [2, 1, 2, 2]`两个子序列然后并行处理，得到的结果为:

**split1: [1, 1, 1, 2, 1]**

> condidate: 1 
> 
> count: 3

**split2: [2, 1, 2, 2]**

> condidate: 2
> 
> count: 2

split1的结果还可以理解为：`[1, 1, 1]`
split2的结果则可以理解为：`[2, 2]`

理解了这个，可以使用一下代码完成合并：

```C
struct Reuslt {
  int condidate;
  int count;
}
int condidate = 0;
int count = 0;

for (int i = 0; i < resultsSize; i++) {
  if (results[i].condidate == condidate) {
    count += results[i].count;
  } else if (count < results[i].count) {
    count = results[i] - count;
    condidate = results[i].condidate;
  } else {
    count = count - results[i].count;
  }
}
```

## Tip

### Markdown TOC

VS Code markdown文档目录生成插件, 在VS Code中安装了这个插件之后可以自动生成markdown目录, 极大简化了markdown文档目录的编写. 

## Share

### Typescript实现一个DedupeAPI类

#### 主要实现功能

对用一些调用时间比较长，且结果在一段时间内结果不会发生变化的API，如果在短时间内多次被调用的话，实际上是不需要每次都要真实调用的，只需完成一次调用之后，将结果缓存下来，对于之后的调用就可以直接返回结果了。要实现这个功能，需要解决两个问题：

1. 在缓存为空，多个请求同时来的时候，如何只处理其中的一个，其他的请求直接等待结果再直接返回即可
2. 缓存的失效时间，因为API在一段时间后结果会发生变化，一直使用旧缓存，会得不到最新数据。

#### 代码实现

```typescript
interface PendingApiCall {
  resolve: (data: any) => void
  reject : (e: any) => void
}
interface ApiCall {
  timestamp: number            // 函数的调用时间
  returned : boolean           // 是否已经响应
  result?  : any               // 函数调用结果
  listener : PendingApiCall[]  // Promise的性质, 等待函数执行完并获得结果
}

// 缓存过期时间， 默认只保持20秒
const EXPIRE_TIME = 20 * 1000
const PRE         = 'DedupeApi'

/**
 * This class will dedupe api calls
 * Multiple calls within a period of time will only fire up one api call to the server,
 * all the other calls will get the same response as the fired one
 *
 * Only api calls in the DEDUPE_API list will be affected.
 */
export class DedupeApi {

  private static instance: DedupeApi

  private cache: {
    [key: string]: ApiCall
  }

  private cleaner: NodeJS.Timer

  // 使单例设计模式，保证所有方法使用同一个缓存
  public static get Instance () {
    return this.instance || (this.instance = new DedupeApi())
  }
  private constructor () {
    this.cache = {}
    // 定期清空缓存
    this.cleaner = setInterval(this.cleanData, EXPIRE_TIME)
  }
  
  // 核心函数
  public async dedupe<T, TResult>(func: (this: T, args?: any) => Promise<TResult>, thisArg: T, args?: any): Promise<TResult> {
    const key = func.name + '_' + args
    log.silly (PRE, `dedupeApi(${key})`)
    const existCall: ApiCall = this.cache[key]
    const now: number         = new Date().getTime()
    // 之前访问过,并且没有过期
    if(existCall && now - existCall.timestamp < EXPIRE_TIME) {
      // 前一个访问已经访问完成
      if (existCall.returned) {
        log.silly(PRE, `dedupeApi(${key}) dedeped api call with existing results.`)
        return existCall.result
      } else {
        // 前一个访问正在访问, 使用Promise的特性,等待数据返回
        log.silly(PRE, `dedepuApi(${key}) deduped api call with pending listeners.`)
        return new Promise<TResult>((resolve, reject)=> {
          existCall.listener.push({
            resolve,
            reject,
          })
        })
      }
    } else {
      // 第一次访问
      log.silly(PRE, `dedupedApi(${key}) deduped api call missed, call the external service.`)

      this.cache[key] = {
        listener : [],
        returned : false,
        timestamp: now,
      }

      let result: TResult
      try {
        result = await func.call(thisArg, args)
      } catch (e) {
        // 访问失败, 调用Promise的reject返回
        log.warn (PRE, `dedupeApi(${key}) failed from external service, reject ${this.cache[key].listener.length} deplicate api calls.`)
        this.cache[key].listener.map(listener => {
          listener.reject(e)
        })
        throw e
      }
      // 调用成功, 调用Promise的resolve返回
      this.cache[key].result = result
      this.cache[key].returned = true
      log.silly(PRE, `depudeApi(${key}) got results from external service, resolve ${this.cache[key].listener.length} deplicate api calls.`)
      this.cache[key].listener.map(listener => {
        listener.resolve(result)
      })
      return result
    }
  }

  /**
   * Get rid of data in pool that exists for more than EXPIRE_TIME
   */
  private cleanData () {
    const now = new Date().getTime()
    for (const key in this.cache) {
      if (this.cache.hasOwnProperty(key)) {
        const apiCache = this.cache[key]
        if (apiCache.timestamp - now > EXPIRE_TIME) {
          delete this.cache[key]
        }
      }
    }
  }
  /**
   * destory when logout
   */
  public destroy() {
    for (const key in this.cache) {
      if (this.cache.hasOwnProperty(key)) {
        delete this.cache[key]
      }
    }
    clearInterval(this.cleaner)
  }
}

```


