// Note: the simulate(asm,args) function is pre-loaded.

var prog = '[ x y z ] ( 2*3*x + 5*y - 3*z ) / (1 + 3 + 2*2)';
var t1 = JSON.stringify({"op":"/","a":{"op":"-","a":{"op":"+","a":{"op":"*","a":{"op":"*","a":{"op":"imm","n":2},"b":{"op":"imm","n":3}},"b":{"op":"arg","n":0}},"b":{"op":"*","a":{"op":"imm","n":5},"b":{"op":"arg","n":1}}},"b":{"op":"*","a":{"op":"imm","n":3},"b":{"op":"arg","n":2}}},"b":{"op":"+","a":{"op":"+","a":{"op":"imm","n":1},"b":{"op":"imm","n":3}},"b":{"op":"*","a":{"op":"imm","n":2},"b":{"op":"imm","n":2}}}});
var t2 = JSON.stringify({"op":"/","a":{"op":"-","a":{"op":"+","a":{"op":"*","a":{"op":"imm","n":6},"b":{"op":"arg","n":0}},"b":{"op":"*","a":{"op":"imm","n":5},"b":{"op":"arg","n":1}}},"b":{"op":"*","a":{"op":"imm","n":3},"b":{"op":"arg","n":2}}},"b":{"op":"imm","n":8}});

var c = new Compiler();
report("Able to construct compiler");
report(c,'{}');

var p1 = c.pass1(prog);
report("Pass1");
report(JSON.stringify(p1) ,t1);

var p2 = c.pass2(p1);
report("Pass2");
report(JSON.stringify(p2) ,t2);

var p3 = c.pass3(p2);
report('prog(4,0,0) == 3');
report(simulate(p3,[4,0,0]),"3");
report("prog(4,8,0) == 8");
report(simulate(p3,[4,8,0]) , "8");
report("prog(4,8,6) == 2");
report(simulate(p3,[4,8,16]) ,"2");
