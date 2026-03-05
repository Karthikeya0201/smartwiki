// Java Program for Maximum subarray sum with k size using Naïve Approach 


import java.util.*;

class Solution{
    public static int maxSub(int[] arr, int k){
        
        int max = Integer.MIN_VALUE;

        for(int i=0;i<arr.length-k+1;i++){
            int s = 0;
            for(int j=i;j<i+k;j++){
                s+=arr[j];
            }
            max = Math.max(s, max);
        }   
        return max;
    }
    public static void main(String[] args){
        int[] arr = {4,5,2,6,3,1};
        int k = 3;

        System.out.println(maxSub(arr, k));
    }
}