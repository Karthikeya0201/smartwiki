// Java Program for Maximum subarray sum with k size using Slidng windowApproach 


import java.util.*;

class Solution{
    public static void main(String[] args) {
        int[] arr = {5,2,4,6,3,1};
        int k = 3;

        int max = Integer.MIN_VALUE;
        int curr = 0;
        for(int i=0;i<arr.length;i++){
            curr += arr[i];

            if(i<k-1) continue;

            max = Math.max(curr, max);
            curr -= arr[i-k+1];
        }
        System.out.println(max);
    }
}