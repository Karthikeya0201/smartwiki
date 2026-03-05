import java.util.*;

class Solution{
    public static boolean isValid(String s, String abbr){
        int m = s.length(), n = abbr.length();
        int i=0, j = 0;
        while(i<m && j<n){

            
            if(Character.isDigit(abbr.charAt(j))){
                if(abbr.charAt(j) == '0'){
                    return false;
                }
                int num = 0;
                
                while(j<n && Character.isDigit(abbr.charAt(j))){
                    num = num*10 + (abbr.charAt(j) - '0');
                    j++;
                }
                i+=num;

            }else{
                if(s.charAt(i) != abbr.charAt(j)) return false;
                i++;
                j++;
            }
        }
        return i == m && j == n;
    }
    public static void main(String[] args) {
        String s = "apple";
        String abbr = "a2e";

        System.out.println(isValid(s, abbr));
    }
}