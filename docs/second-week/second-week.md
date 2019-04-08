> Time: 2019.04.08 - 2019.04.15

> Algorithm: 3Sum
>  
> Review: Overview of Blocking vs Non-Blocking
> 
> Share: HEAP
> 
> Tip: Returns a power of two size for the given target capacity



## Algorithm

> Given an array nums of n integers, are there elements a, b, c in nums such that a + b + c = 0? Find all unique triplets in the array which gives the sum of zero.

Note:

The solution set must not contain duplicate triplets.

Example:

```
Given array nums = [-1, 0, 1, 2, -1, -4],

A solution set is:
[
  [-1, 0, 1],
  [-1, -1, 2]
]
```


### 实现思路

由于三个元素相加和为0可以转换成两个元素相加等于第三个元素的负数.`a+b+c=0 => a+b=-c`, 所以可以采用以下方式完成:

1. 对数组元素进行排序
2. 遍历有序序列,每次取出一个元素作为第三个元素,然后在剩下的元素中找出其他两个元素.

```C

int** threeSum(int* nums, int numsSize, int* returnSize) {
  // 对数组元素进行排序(从小到大)
  qsort(nums, numsSize);
  // 存储结果, 由于不知道有几个,所以按照最大需求开辟内存空间
  int **result = (int **) malloc(sizeof(int*) * numsSize * numsSize);
  int count = 0; // 记录一共有多少对值
  for (int i = 0; i < numsSize - 2; i++) {
    int left = i + 1;
    int right = numsSize - 1;
    while (left < right) {
      if (nums[left] + nums[right] == -nums[i]) {
        result[count] = (int *) malloc(sizeof(int) * 3);
        result[count][0] = nums[i];
        result[count][1]= nums[left];
        result[count][2] = nums[right];
        count++;
        left++;
        right--;
      } else if (nums[left] + nums[right] > -nums[i]) {
        right--;
      } else {
        left++;
      }
    }
  }
  *returnSize = count;
  return result;
}
```

3. 去重
   1. 第一个元素存在连续相同时,只计算一次
   2. 当存在nums[left]+nums[right]=-nums[i]时, 两个游动时要跳过相等的元素

```C
int** threeSum(int* nums, int numsSize, int* returnSize) {
  // 对数组元素进行排序(从小到大)
  qsort(nums, numsSize);
  // 存储结果, 由于不知道有几个,所以按照最大需求开辟内存空间
  int **result = (int **) malloc(sizeof(int*) * numsSize * numsSize);
  int count = 0; // 记录一共有多少对值
  for (int i = 0; i < numsSize - 2; i++) {
    int left = i + 1;
    int right = numsSize - 1;
    while (left < right) {
      // 1. 第一个元素存在连续相同时,只计算一次
      if (i == 0 || nums[i - 1] != nums[i]) {
        if (nums[left] + nums[right] == -nums[i]) {
          result[count] = (int *) malloc(sizeof(int) * 3);
          result[count][0] = nums[i];
          result[count][1]= nums[left];
          result[count][2] = nums[right];
          count++;
          // 两个游标跳过相等的元素
          while(left < right && nums[left] == nums[left + 1]) {
            left++;
          }
          while (left < right && nums[right] == right[right - 1]) {
            right--;
          }
          left++;
          right--;
        } else if (nums[left] + nums[right] > -nums[i]) {
          right--;
        } else {
          left++;
        }
      }
    }
  }
  *returnSize = count;
  return result;
}
```

### 完整代码

```C
/**
 * Return an array of arrays of size *returnSize.
 * Note: The returned array must be malloced, assume caller calls free().
 */

// 快速排序
void swap (int *arr, int i, int j) {
  int temp = arr[i];
  arr[i] = arr[j];
  arr[j] = temp;
}

int partition(int *arr, int left, int right) {
  int pivot = left;
  for (int i = left; i< right; i++) {
    if (arr[i] < arr[right]) {
      swap (arr, pivot, i);
      pivot++;
    }
  }
  swap (arr, pivot, right);
  return pivot;
}

void __qsort(int *arr, int left, int right) {
  if (left >= right) {
    return;
  }
  int mid = partition(arr, left, right);
  __qsort(arr, left, mid - 1);
  __qsort(arr, mid + 1, right);
}

void sort(int * arr, int size) {
  __qsort(arr, 0, size - 1);
}

int** threeSum(int* nums, int numsSize, int* returnSize) {
  // 对数组元素进行排序(从小到大)
  sort(nums, numsSize);
  // 存储结果, 由于不知道有几个,所以按照最大需求开辟内存空间
  int **result = (int **) malloc(sizeof(int*) * numsSize * numsSize);
  int count = 0; // 记录一共有多少对值
  for (int i = 0; i < numsSize - 2; i++) {
    int left = i + 1;
    int right = numsSize - 1;
    while (left < right) {
      // 1. 第一个元素存在连续相同时,只计算一次
      if (i == 0 || nums[i - 1] != nums[i]) {
        if (nums[left] + nums[right] == -nums[i]) {
          result[count] = (int *) malloc(sizeof(int) * 3);
          result[count][0] = nums[i];
          result[count][1]= nums[left];
          result[count][2] = nums[right];
          count++;
          // // 两个游标跳过相等的元素
          while(left < right && nums[left] == nums[left + 1]) {
            left++;
          }
          while (left < right && nums[right] == nums[right - 1]) {
            right--;
          }
          left++;
          right--;
        } else if (nums[left] + nums[right] > -nums[i]) {
          right--;
        } else {
          left++;
        }
      } else {
          break;
      }
    }
  }
  *returnSize = count;
  return result;
}

```

### 参考链接

[Concise O(N^2) Java solution](https://leetcode.com/problems/3sum/discuss/7380/Concise-O(N2)-Java-solution)