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

Compiler.prototype.pass2 = function (ast) {
  // return AST with constant expressions reduced
  return ast;
};

Compiler.prototype.pass3 = function (ast) {
  // return assembly instructions
  return ast;
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
      return factor(expr, program,argsList);
}
function parse(program) {
      // var result = unit(program);
      var result = functionDef(program);
      if (program.length > 0)
        throw new SyntaxError("Unexpected text after program");
      return result;
}
function factor(expr, program,argsList) {
      if (expr.type != "delimiter")
          return term(expr,program,argsList);
      expr = expression(unit(program,argsList),program);
       if (program[0] != ")")
          throw new SyntaxError("Expected  ')'");
       program.shift();
       return term(expr, program,argsList);
}
function term(expr,program,argsList){
   if(program[0] !== "*" && program[0] !== "/" )
         return expression(expr,program,argsList); 
   expr = {op: program.shift() , a:expr, b:unit(program,argsList)}; 
   return expression(expr,program,argsList);
}
function expression(expr,program,argsList){
  if(program[0] !== "+" && program[0] !== "-" )
         return expr; 
   expr = {op: program.shift() , a:expr, b:unit(program,argsList)}; 
   return expression(expr,program,argsList);
}
function functionDef(program){
   if(program[0] !== '['){
      return unit(program);
   }else{
      let argsList ={};
      let nth = 0;
      program.shift();
      while(program.length > 0 && program[0] !== ']'){
          let arg = unit(program);
          if(arg.op !== 'arg')
               throw new SyntaxError(`Unexpected token ${arg.n}`);
          argsList[arg.n] = nth++; 
      }
      if(program[0] !== ']')
            throw new SyntaxError(`Invalid function definition`);
       program.shift();
      return unit(program,argsList);
   } 
}
function evaluate(expr){
  if(expr.type === 'value'){
    return parseFloat(expr.value);
  }else{
      return reduce(expr.value);
  }
}
function reduce(expr){
  if(expr.length === 3)
  switch(expr[1]){
     case '+' : return evaluate(expr[0]) + evaluate(expr[2]);
     case '-'  : return evaluate(expr[0]) - evaluate(expr[2]);
     case '*' :  return evaluate(expr[0]) * evaluate(expr[2]);
     case '/'  :  return evaluate(expr[0]) / evaluate(expr[2]);
  }
  return expr;
}



