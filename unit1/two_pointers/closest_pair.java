// Find the Closest pair from two sorted arrays: 
 
//  Given two sorted arrays and a number x, find the pair whose sum is closest to x and the pair 
// has an element from each array.  
//  We are given two arrays ar1[0…m-1] and ar2[0..n-1] and a number x, we need to find the 
// pair ar1[i] + ar2[j] such that absolute value of (ar1[i] + ar2[j] – x) is minimum. 
 
// Example-1:  
// Input:  ar1[] = {1, 4, 5, 7}; 
//             ar2[] = {10, 20, 30, 40}; 
//     x = 32       
// Output:  1 and 30 
// Example-2:  
// Input:  ar1[] = {1, 4, 5, 7}; 
//                    ar2[] = {10, 20, 30, 40}; 
//            x = 50       
// Output:  7 and 40 


import java.util.*;

class Solution{

    public static void main(String[] args) {
        int[] arr1 = {1, 4, 5, 7};
        int[] arr2 = {10, 20, 30, 40};

        int l = 0;
        int r = arr2.length-1;
        int target = 32;
        int[] res  = {-1, -1};
        int diff = Integer.MAX_VALUE;
        
        while(l<arr1.length && r>=0){
            
            if(Math.abs(arr1[l] + arr2[r] - target)<diff){
                res[0] = arr1[l];
                res[1] = arr2[r];
                diff = Math.abs(arr1[l] + arr2[r] - target);
            }

            if(arr1[l] + arr2[r] > target){
                r--;
            }else{
                l++;
            }

        }

        System.out.println(Arrays.toString(res));
    }
}