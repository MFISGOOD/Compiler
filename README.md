# Compiler
A compiler for a simple programming language into a small assembly language.
The programming language has this syntax:

    function   ::= '[' arg-list ']' expression

    arg-list   ::= /* nothing */
                 | variable arg-list

    expression ::= term
                 | expression '+' term
                 | expression '-' term

    term       ::= factor
                 | term '*' factor
                 | term '/' factor

    factor     ::= number
                 | variable
                 | '(' expression ')'
Variables are strings of alphabetic characters. Numbers are strings of decimal digits representing integers. So, for example, a function which computes a2 + b2 might look like:

    [ a b ] a*a + b*b
A function which computes the average of two numbers might look like:
 The Abstract Syntax Tree use the following representations:

    { 'op': '+', 'a': a, 'b': b }    // add subtree a to subtree b
    { 'op': '-', 'a': a, 'b': b }    // subtract subtree b from subtree a
    { 'op': '*', 'a': a, 'b': b }    // multiply subtree a by subtree b
    { 'op': '/', 'a': a, 'b': b }    // divide subtree a from subtree b
    { 'op': 'arg', 'n': n }          // reference to n-th argument, n integer
    { 'op': 'imm', 'n': n }          // immediate value n, n integer
    
[ x y ] ( x + y ) / 2 would look like:

    { 'op': '/', 'a': { 'op': '+', 'a': { 'op': 'arg', 'n': 0 },
                                   'b': { 'op': 'arg', 'n': 1 } },
                 'b': { 'op': 'imm', 'n': 2 } }

 The the assembler takes in an Abstract Syntax Tree and returns an array of strings. Each string is an assembly directive. You are working on a small processor with two registers (R0 and R1), a stack, and an array of input arguments. The result of a function is expected to be in R0. The processor supports the following instructions:

    "IM n"     // load the constant value n into R0
    "AR n"     // load the n-th input argument into R0
    "SW"       // swap R0 and R1
    "PU"       // push R0 onto the stack
    "PO"       // pop the top value off of the stack into R0
    "AD"       // add R1 to R0 and put the result in R0
    "SU"       // subtract R1 from R0 and put the result in R0
    "MU"       // multiply R0 by R1 and put the result in R0
    "DI"       // divide R0 by R1 and put the result in R0
