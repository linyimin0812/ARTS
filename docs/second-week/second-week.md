> Time: 2019.04.01 - 2019.04.07

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

```C
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


void qsort(int * arr, int size) {
  __qsort(arr, 0, size - 1);
}


```