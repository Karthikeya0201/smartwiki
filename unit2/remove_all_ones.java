//  Remove All Ones with Row and Column Flips 
// We are given an m x n binary matrix grid. 
// In one operation, you can choose any row or column and flip each value in that row or column (i.e., 
// changing all 0's to 1's, and all 1's to 0's). 
// Return true if it is possible to remove all 1’s from the grid using any number of operations or false 
// otherwise. 
// Example 1: 
// Input: grid = [[0,1,0],[1,0,1],[0,1,0]] 
// Output: true 
// Explanation: One possible way to remove all 1's from grid is to: - Flip the middle row - Flip the middle column 
// Example 2: 
// Input: grid = [[1,1,0],[0,0,0],[0,0,0]] 
// Output: false 
// Explanation: It is impossible to remove all 1's from grid. 
// Example 3: 
// Input: grid = [[0]] 
// Output: true 
// Explanation: There are no 1's in grid. 


import java.util.*;

class Solution{

    public static boolean isZero(int[][] grid){
        
        int m = grid.length;
        int n = grid[0].length;

        for(int i=0;i<n;i++){
            if(grid[0][i] == 1){
                for(int j=0;j<m;j++){
                    grid[j][i] ^=1;
                }
            }
        }

        for(int i=1;i<m;i++){
            int s = 0;
            for(int j=0;j<n;j++){
                s+=grid[i][j];
            }
            if(s != 0 && s != n) return false;
        }

        return true;
    }
    public static void main(String[] args) {
        int[][] grid = {{0,1,0},{1,0,1},{0,1,0}};
        
        System.out.println(isZero(grid));
    }
}