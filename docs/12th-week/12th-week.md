> Time: 2019.06.17 - 2019.06.23
>
> Algorithm: Sqrt(x)
>  
> Review: 
>
> Tip: 
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