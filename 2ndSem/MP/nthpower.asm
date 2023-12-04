;These Is the Code is my effort to translate the below commented python code into asm for 8085 MP.
;/////////////////////////////////////////////////////////////////////////////////////
;num = n
;numA=0
;sumA=0
;pow = x
;for i in range(pow):
; sumA=0
; for j in range(num):
;   sumA+=numA
; numA=sumA
;print(f"{num} power {pow} == {sumA}")
;////////////////////////////////////////////////////////////////////////////////////////
;Translations begins  . ..


;memory location 2000h
lda 2000h;
mov b,a; num=4
mvi c,03h; c=02h but it's power 3,ie n=i then power = n+1
mvi h,00h;
mov d,a;numA=num
i: mvi m,00h;
lda 2000h;
mov b,a;
mvi a,00h;
j:add d;
jnc con;
inr h;
con:dcr b;
jnz j;
mov d,a;
dcr c;
jnz i;
sta 2011H;
hlt
