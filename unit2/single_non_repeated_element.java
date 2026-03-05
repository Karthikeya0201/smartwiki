import java.util.*;

class Solution{
    public static void main(String[] args) {
        int[] arr = {2,2,1};

        int res = 0;

        for(int x: arr){
            res ^= x;
        }
        System.out.println(res);
    }
}