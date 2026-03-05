import java.util.*;

class Solution{
    
    static class Node{
        int val;
        Node next;
        public Node(int val){
            this.val = val;
            this.next = null;
        }
    
    }
    public static Node reverse(Node head){
        Node prev = null;
        Node curr = head;

        while(curr != null){
            Node next = curr.next;
            curr.next = prev;

            prev = curr;
            curr = next;
        }

        return prev;
    }
    public static boolean isPal(Node head){
        if(head == null || head.next == null) return true;

        Node slow = head;
        Node fast = head;

        while(fast != null && fast.next != null){
            slow = slow.next;
            fast = fast.next.next;
        }

        Node second = reverse(slow.next);
        Node first = head;

        while(second != null){
            if(first.val != second.val){
                return false;
            }

            first = first.next;
            second = second.next;
        }

        return true;

    }
    public static void main(String[] args) {
      Scanner sc = new Scanner(System.in);
      
      String[] inp = sc.nextLine().split(" ");

        Node head = null;
        Node temp = null;

      for(String s: inp){
        int val = Integer.parseInt(s);
        Node newNode = new Node(val);
        
        if(head == null){
            head = newNode;
            temp = head;
        }else{
            temp.next = newNode;
            temp = temp.next;
        }
      }

      System.out.println(isPal(head));
    }
}