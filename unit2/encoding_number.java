//  Encode Number 
// Given a non-negative integer num, Return its encoding string. 
// The encoding is done by converting the integer to a string using a secret function that you should 
// deduce from the following table: 
// N 
// f(n) 
// 0 
// “ ” 
// 1 
// “0” 
// 2 
// “1” 
// 3 
// “00” 
// 4 
// “01” 
// 5 
// “10” 
// 6 
// “11” 
// 7 
// “000” 
// Example 1: 
// Input: num = 23 
// Output: “1000” 
// Example 2: 
// Input: num = 107 
// Output: “101100” 
// If n is 0, then f(n) is "".  
// If 1 <= n < 3, then f(n) is a binary string with length 1.  
// If 3 <= n < 7, then f(n) is a binary string with length 2.  
// If 7 <= n < 15, then `f(n) is a binary string with length 3. 
// Procedure 
// 1. The problem requires us to: 
// o Convert num + 1 to binary. 
// o Remove the leading 1 from the binary representation. 
// o Return the remaining binary string. 
// 2. Instead of using Integer.toBinaryString(), we can manually extract bits using bit 
// manipulation.


import java.util.*;

class Solution{
    public static void main(String[] args) {
        int num = 23;

        num++;
        StringBuilder sb = new StringBuilder();
        
        while(num>1){
            sb.append(num&1);
            num>>=1;
        }
        System.out.println(sb.reverse().toString());

    }
}