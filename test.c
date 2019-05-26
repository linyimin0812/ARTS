#include<stdlib.h>
int main() {
    char *p = "hello";
    char q[] = "world";
    char *r = (char *)malloc(sizeof(char)*6);
    return 0;
}
