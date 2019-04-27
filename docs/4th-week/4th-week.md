> Time: 2019.04.22 - 2019.04.28
>
> Algorithm: First Missing Positive
>  
> Review: 
> 
> Share: 
> 
> Tip: 


## Algorithm(First Missing Positive)

> Given an unsorted integer array, find the smallest missing positive integer.

**Example 1:**

```
Input: [1,2,0]
Output: 3
```

**Example 2:**

```
Input: [3,4,-1,1]
Output: 2
```

**Example 3:**

```
Input: [7,8,9,11,12]
Output: 1
```

**Note:**

Your algorithm should run in O(n) time and uses constant extra space.



### 解法1: 使用额外的数组空间

<font color="#dd0000">这种解法不符合题目的要求，但是也能AC</font>


#### 分析

由于是在数组中寻找缺失的最小正整数，不妨设数组长度为N, 那么缺失的最小正整数的区间必然在`[1, N+1]`中， 所以很容易想到使用一个额外的数组`temp`空间存储原数组中的正整数，使得`temp[i - 1] = i, 1 <= i <= N`, 然后遍历额外的数组空间，若存在`temp[i] != i + 1; 0 <= i < N;`则返回`i+1`, 否则返回`N+1`。

#### 代码实现

```C
int firstMissingPositive(int* nums, int numsSize){
  // 开辟额外的数组空间
  int * temp = malloc(numsSize * sizeof(int));
  // 初始化数组空间为0
  for (int i = 0; i < numsSize; i++) {
    temp[i] = 0;
  }
  
  // 填充数据,使得temp[i] = i + 1
  for (int i = 0; i < numsSize; i++) {
    // 对于小于0或者大于N的元素直接丢弃
    if (nums[i] >= 1 && nums[i] <= numsSize) {
        temp[nums[i] - 1] = nums[i];
    }
  }
  // 遍历找出最小正整数
  for (int i = 0; i < numsSize; i++) {
    if (temp[i] != i+1) {
        return i + 1;
    }
  }
  return numsSize + 1;
}
```

### 解法2


#### 分析

解法2和解法1基于相同的思想,区别在于: <font color="#dd0000">解法2在原数组上进行元素交换, 不需要开辟额外的数组空间</font>

#### 代码实现

```C
void swap(int *a, int *b) {
  int temp = *a;
  *a = *b;
  *b = temp;
}
int firstMissingPositive(int* nums, int numsSize){
  int i = 0;
  while (i < numsSize) {
    // 对于小于0或者大于N的元素直接丢弃
    if (nums[i] >=1 && nums[i] <= numsSize && nums[i] != i + 1 && nums[i] != nums[nums[i] - 1]) {
      // nums[nums[i] - 1] = nums[i],此时索引nums[i] - 1满足要求,但是索引i仍未满足nums[i] = i + 1
      swap(&nums[i], &nums[nums[i] - 1]);
    } else {
      i++;
    }
  }
  
  // 遍历找出最小正整数
  for (int i = 0; i < numsSize; i++) {
    if (nums[i] != i+1) {
        return i + 1;
    }
  }
  return numsSize + 1;
}
```

## Review

## Share

## Tip