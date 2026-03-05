import java.util.*;

class Solution{
    public static void main(String[] args){
        String s = "KaRtHikEyA";

        char[] arr = s.toCharArray();

        for(int i=0;i<arr.length;i++){
            arr[i]^=32;
        }
        System.out.println(new String(arr));
    }
}