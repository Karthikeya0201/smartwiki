// Kth Smallest Subarray Sum: 
// Given an integer array nums of length n and an integer k, return the k-th smallest subarray 
// sum. A subarray is defined as a non-empty contiguous sequence of elements in an array.  
// A subarray sum is the sum of all elements in the subarray. 
// Example 1: 
// Input: nums = [2,1,3], k = 4 
// Output: 3 
// Explanation: The subarrays of [2,1,3] are: 
//  [2] with sum 2 
//  [1] with sum 1 
//  [3] with sum 3 
//  [2,1] with sum 3 
//  [1,3] with sum 4 
//  [2,1,3] with sum 6 
// Ordering the sums from smallest to largest gives 1, 2, 3, 3, 4, 6. The 4th smallest is 3. 
// Example 2: 
// Input: nums = [3,3,5,5], k = 7 
// Output: 10 
// Explanation: The subarrays of [3,3,5,5] are: 
//  [3] with sum 3 
//  [3] with sum 3 
//  [5] with sum 5 
//  [5] with sum 5 
//  [3,3] with sum 6 
//  [3,5] with sum 8 
//  [5,5] with sum 10 
//  [3,3,5], with sum 11 
//  [3,5,5] with sum 13 
//  [3,3,5,5] with sum 16 
// Ordering the sums from smallest to largest gives 3, 3, 5, 5, 6, 8, 10, 11, 13, 16. The 7th smallest is 
// 10.


import java.util.*;


class Solution{
    public static int count(int[] arr, int mid){
        int l = 0, curr = 0, c = 0;

        for(int r = 0; r<arr.length;r++){
            curr += arr[r];

            while(curr>mid){
                curr -= arr[l++];
            }
            c += (r-l+1);
        }

        return c;
    }

    public static void main(String[] args){
        int[] arr = {3,3,5,5};
        int k = 7;
        int l = Integer.MAX_VALUE, r = 0;

        for(int x: arr){
            l = Math.min(l, x);
            r += x;
        }

        int res = -1;
        while(l<=r){
            int mid = l + (r-l)/2;

            if(count(arr, mid) >= k){
                res = mid;
                r = mid-1;
            }else{
                l = mid+1;
            }
        }

        System.out.println(res);

    }
}