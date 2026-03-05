import java.util.*;

class Solution{
    public static void main(String[] args) {
        int a = 2, b = 6, c = 5;

        int res = 0;

        for(int i=0;i<32;i++){
            
            int x = ((a>>i) & 1);
            int y = ((b>>i) & 1);
            int z = ((c>>i) & 1);

            if((x | y) != z){
                if(z == 0){

                    if(x == 1 && y == 1){
                        res+=2;
                    }else{
                        res+=1;
                    }
                }
                else{
                    res+=1;
                }
            }
        }

        System.out.println(res);
    }
}