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
  return tokens;
};

Compiler.prototype.pass2 = function (ast) {
  // return AST with constant expressions reduced
};

Compiler.prototype.pass3 = function (ast) {
  // return assembly instructions
};


function unit(program) {
      var match, expr;
       if (match = /^\d+\b/.exec(program[0]))
        expr = {type: "value", value: Number(match[0])};
      // else if (program[0] === '-' || program[0] === '+')
      //   expr = {type: "signe", value: program[0]};
      else if (match = /^[^\s(),"]+/.exec(program[0]))
        expr = {type: "variable", name: match[0]};
      else if (program[0] === '(')
        expr = {type: "delimiter", value: '('};
      else
        throw new SyntaxError("Unexpected syntax: " + program[0]);
      program.shift();
      return factor(expr, program);
}
function parse(program) {
      var result = unit(program);
      if (program.length > 0)
        throw new SyntaxError("Unexpected text after program");
      return result;
}
function factor(expr, program) {
      // if(expr.type === 'signe') {
      //  let signed = unit(program);
      //   signed.negatif = expr.value === "-";
      //   return signed;
      // }
      if (expr.type != "delimiter")
          return term(expr,program);
      expr = expression(unit(program),program);
       if (program[0] != ")")
          throw new SyntaxError("Expected  ')'");
       program.shift();
       return term(expr, program);
}
function term(expr,program){
   if(program[0] !== "*" && program[0] !== "/" )
         return expression(expr,program); 
   expr = {type: "operation", value: [expr,program.shift(),unit(program)]}; 
   return expression(expr,program);
}
function expression(expr,program){
  if(program[0] !== "+" && program[0] !== "-" )
         return expr; 
   expr = {type: "operation", value: [expr,program.shift(),unit(program)]}; 
   return expression(expr,program);
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


