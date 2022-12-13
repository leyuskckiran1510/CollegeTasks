;CArry is quit not right need some subroutine to handel carry bit only will do later after learning subroutine
lda 2000h;
mov b,a
mvi c,02h
mvi h,00h;
mov d,a
i: mvi m,00h;
lda 2000h;
mov b,a;
mvi a,00h;
j:sta 2020h;
mov a,h;
sta 2030h;
lda 2020h;
add d;
jnc con;
inr h;
con:sta 2021h;
lda 2030h;
add h;
mov h,a;
lda 2021h;
dcr b;
jnz j;
mov d,a;
dcr c;
jnz i;
sta 2011H;
hlt
