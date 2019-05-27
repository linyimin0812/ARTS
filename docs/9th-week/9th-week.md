> Time: 2019.05.27 - 2019.06.02
>
> Algorithm: 数组中重复的数字
>  
> Review:
>
> Tip: 
> 
> Share: 


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

## Tip

## Share


