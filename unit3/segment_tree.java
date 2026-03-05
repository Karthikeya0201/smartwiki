import java.util.*;


class Solution{
    static class SegmentTree{
        int[] tree;
        int n;
        public SegmentTree(int[] arr){
            this.n = arr.length;
            this.tree = new int[4*n];
            build(arr, 0, 0, n-1);
        }
    
        public void build(int[] arr, int node, int start, int end){
            if(start == end){
                tree[node] = arr[start];
                return;
            }
    
            int mid = start + (end-start)/2;
    
            build(arr, 2*node+1, start, mid);
            build(arr, 2*node+2, mid+1, end);
    
            tree[node] = tree[2*node+1] + tree[2*node+2];
            
        }
    
        public int query(int node, int start, int end, int l, int r){
            
            if(r<start || l>end){
                return 0;
            }
    
            if(l<=start && r>=end){
                return tree[node];
            }
    
            int mid = (start + end)/2;
            int left = query(2*node+1, start, mid, l, r);
            int right = query(2*node+2, mid+1, end, l, r);
            return left + right;
    
        }
    
        public void update(int node, int start, int end, int idx, int val){
            if(start == end){
                tree[node] = val;
                return;
            }
    
            int mid = (start + end)/2;
    
            if(idx<=mid){
                update(2*node+1, start, mid, idx, val);
            }else{
                update(2*node+2, mid+1, end, idx, val);
            }
    
            tree[node] = tree[2*node+1] + tree[2*node+2];
        }
    }
    public static void main(String[] args) {
        int[] arr = {1, 3, 5, 7, 9, 11};

        SegmentTree st = new SegmentTree(arr);

        st.update(0, 0, arr.length-1, 2, 10);

        int newSum = st.query(0, 0, arr.length-1, 1, 3);

        System.out.println(newSum);
    }
}