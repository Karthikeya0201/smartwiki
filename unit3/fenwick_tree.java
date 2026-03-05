import java.util.*;


class Solution{
    static class FenwickTree{
        int[] tree;
        int n;
        public FenwickTree(int n){
            this.n = n;
            this.tree = new int[n+1];
        }

        public void build(int[] arr){
            for(int i=1;i<=n;i++){
                update(i, arr[i]);
            }
        }

        public void update(int i, int val){
            while(i<=n){
                tree[i] += val;
                i += i&(-i);
            }
        }

        public int sum(int i){
            int s = 0;

            while(i>0){
                s+=tree[i];
                i-= i&(-i);
            }
            return s;
        }

        public int rangeSum(int l, int r){
            return sum(r)- sum(l-1);
        }
        public void print(){
            System.out.println(Arrays.toString(tree));
        }
    }
    public static void main(String[] args) {
        

        int[] arr = {0, 3, 2, 4, 5, 1, 1, 5, 3};
        int n = arr.length-1;

        FenwickTree ft = new FenwickTree(n);

        ft.build(arr);

        System.out.println("Fenwick Tree:");
        ft.print();

        // Prefix sum
        System.out.println("Sum of first 5 elements: " + ft.sum(5));

        // Range sum
        System.out.println("Sum from 3 to 7: " + ft.rangeSum(3, 7));

        // Update
        ft.update(3, 5); // add 5 at index 3

        System.out.println("After update:");
        System.out.println("Sum from 3 to 7: " + ft.rangeSum(3, 7));
    }
}