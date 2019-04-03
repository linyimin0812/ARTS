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

## Share

## Tip

