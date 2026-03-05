// Write a Java Program to determine if a permutation of a string is a palindrome or not 

import java.util.*;

class Solution{
    public static boolean isPal(String s){
        int bitMask = 0;

        for(int i=0;i<s.length();i++){
            char ch = s.charAt(i);
            bitMask ^= (1<<(ch-'a'));
        }

        return bitMask == 0 || (bitMask&(bitMask-1)) == 0;
    }
    public static void main(String[] args) {
        String s = "karthihtra";

        System.out.println(isPal(s));
    }
}