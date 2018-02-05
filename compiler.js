function Compiler () {};

Compiler.prototype.compile = function (program) {
  return this.pass3(this.pass2(this.pass1(program)));
};

Compiler.prototype.tokenize = function (program) {
  // Turn a program string into an array of tokens.  Each token
  // is either '[', ']', '(', ')', '+', '-', '*', '/', a variable
  // name or a number (as a string)
  var regex = /\s*([-+*/\(\)\[\]]|[A-Za-z]+|[0-9]+)\s*/g;
  return program.replace(regex, ":$1").substring(1).split(':').map( function (tok) {
    return isNaN(tok) ? tok : tok|0;
  });
};

Compiler.prototype.pass1 = function (program) {
  var tokens = this.tokenize(program);
  // return un-optimized AST
  return parse(tokens);
};

function calc(a,op,b){
  switch(op){
    case "*" : return parseFloat(a) * parseFloat(b);
    case "/" : return parseFloat(a) / parseFloat(b);
    case "+" : return parseFloat(a) + parseFloat(b);
    case "-" : return parseFloat(a) - parseFloat(b);
  }
}
Compiler.prototype.pass2 = function (ast) {
  // return AST with constant expressions reduced
  (function reduce(parent,program,arg){
      if( program && 'a' in program && 'b' in program)
      if(program.a.op === 'imm' && program.b.op ==='imm'){
        let result = calc(program.a.n,program.op,program.b.n);
        parent[arg] = {op: 'imm',n:result};
        reduce(ast, ast, "");
      }else{    
           reduce(program,program.b,'b');  
           reduce(program,program.a,'a');           
      }
   })(ast,ast);
   return ast;
};

Compiler.prototype.pass3 = function (ast) {
  // return assembly instructions
  let ins = {"+" : 'AD',"-":'SU',"*":'MU',"/":'DI'};
  let left = false;
  let right= false;
  function func(op){
    let result = [];
    if(op.a.op === 'imm'){
        result.push(`IM ${op.a.n}`);
        result.push("PU");
     }
    else if(op.a.op === 'arg'){
        result.push(`AR ${op.a.n}`);
        result.push("PU");
     }    
    else{
           result.push(...func(op.a));
    } 
    if(op.b.op === 'imm'){
        result.push(`IM ${op.b.n}`);
        result.push("PU");
    }
    else if(op.b.op === 'arg'){
        result.push(`AR ${op.b.n}`);
        result.push("PU");
    }     
    else{
           result.push(...func(op.b));
    } 
      result.push('PO');
      result.push("SW");   
      result.push('PO');
      result.push(ins[op.op]);
      result.push("PU");
      return result;  
  }
return (function assembler(ast){
             let asm =[];
             if(ast && ast.op === 'imm')
                    asm.push(`IM ${ast.n}`);
             else if (ast && ast.op === 'arg') 
                    asm.push(`AR ${ast.n}`)
             else { 
                    asm.push(...func(ast));
                    // asm.push("PO");
                    // asm.push("SW");   
                    // asm.push("PO"); 
                    // asm.push(ins[ast.op]); 
                    asm.push('PO');
              }
              console.log(asm);
             return asm;
})(ast);
};

function unit(program,argsList) {
      var match, expr;
       if (match = /^\d+\b/.exec(program[0]))
        expr = { op: 'imm', n: Number(match[0])}
      else if (match = /^[^\s(),"]+/.exec(program[0])){
        let variable = match[0];
        if(argsList && variable in argsList){
           expr = {op: "arg", n: argsList[variable]};
        }else if(argsList){
          throw new ReferenceError(`${variable}`);
        }else{
           expr = {op: "arg", n: variable}; // args-list
        }       
      }
      else if (program[0] === '(')
        expr = {type: "delimiter", value: '('};
      else
        throw new SyntaxError("Unexpected syntax: " + program[0]);
      program.shift();
      return expr;
}
function parse(program) {
      // var result = unit(program);
      var result = functionDef(program);
      if (program.length > 0)
        throw new SyntaxError("Unexpected text after program");
      return result;
}
function factor(program,argsList) {
      let expr = unit(program, argsList);
      if (expr.type != "delimiter")
          return expr;
      expr = expression(term(factor(program, argsList),program,argsList),program,argsList);
       if (program[0] != ")")
          throw new SyntaxError("Expected  ')'");
       program.shift();
       return expr;
}
function term(f,program,argsList){
   if(program[0] !== "*" && program[0] !== "/" )
         return f;
   let ex = {op: program.shift() , a:f, b:factor(program,argsList)}; 
   return term(ex,program,argsList);
}
function expression(t,program,argsList){
  if(program[0] !== "+" && program[0] !== "-" )
         return t;
  let expr = {op: program.shift() , a:t, b:term(factor(program, argsList),program,argsList)}; 
  return expression(expr,program,argsList);
}
function functionDef(program){
   if(program[0] !== '['){
      return factor(program);
   }else{
      let argsList ={};
      let nth = 0;
      program.shift();
      while(program.length > 0 && program[0] !== ']'){
          let arg = factor(program);
          if(arg.op !== 'arg')
               throw new SyntaxError(`Unexpected token ${arg.n}`);
          argsList[arg.n] = nth++; 
      }
      if(program[0] !== ']')
            throw new SyntaxError(`Invalid function definition`);
       program.shift();
      return expression(term(factor(program, argsList),program,argsList),program, argsList);
   } 
}




