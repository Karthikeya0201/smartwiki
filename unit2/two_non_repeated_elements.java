package unit2;
import java.util.*;

class Solution{
    public static void main(String[] args) {
        int[] arr = {2,2,1,3};

        int xor = 0;

        for(int x: arr){
            xor ^= x;
        }

        int ind = xor&(-xor);

        int ones = 0, zeros = 0;
        for(int x: arr){
            if((x&ind)!=0){
                ones ^= x;
            }else{
                zeros ^= x;
            }
        }
        System.out.println(ones + " " + zeros);
        
    }
}