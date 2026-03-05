import java.util.*;

class Solution{
    public static void main(String[] args) {
        
        int[] arr = {1,3,-1,-3,5,3,6,7};
        int k = 3;
        int[] res = new int[arr.length-k+1];

        Deque<Integer> dq = new LinkedList<>();

        int idx = 0;

        for(int i=0;i<arr.length;i++){
            
            if(!dq.isEmpty() && dq.peek() <= i-k){
                dq.poll();
            }
            while(!dq.isEmpty() && arr[dq.peekLast()]<arr[i]){
                dq.pollLast();
            }
            
            dq.offer(i);

            if(i>=k-1){
                res[idx++] = arr[dq.peek()];
            }
        }

        System.out.print(Arrays.toString(res));
    }
}