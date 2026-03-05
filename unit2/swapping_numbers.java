import java.util.*;

class Solution{
    public static void main(String[] args) {
        int a = 7;
        int b = 9;

        a = a^b;
        b = a^b;
        a = a^b;

        System.out.println(a + " " + b);
    }
}