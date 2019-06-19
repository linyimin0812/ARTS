> Time: 2019.06.17 - 2019.06.23
>
> Algorithm: Sqrt(x)
>  
> Review: 
>
> Tip: 显示使用最多fd的进程PID
> 
> Share: 


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