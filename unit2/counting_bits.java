import java.util.*;

class Solution{
    public static void main(String[] args){
        int n = 3;

        int[] res = new int[n+1];

        for(int i=0;i<=n;i++){
            int c = 0;
            int t = i;
            while(t>0){
                c += (t&1);
                t = t>>1;
            }
            res[i] = c;
        }
        System.out.println(Arrays.toString(res));
    }
}