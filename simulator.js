function simulate(asm, args) {
      var r0 = undefined;
      var r1 = undefined;
      var stack = [];
      asm.forEach(function (instruct) {
        var match = instruct.match(/(IM|AR)\s+(\d+)/) || [ 0, instruct, 0 ];
        var ins = match[1];
        var n = match[2] | 0;

        if (ins == 'IM')   { r0 = n; }
        else if (ins == 'AR') { r0 = args[n]; }
        else if (ins == 'SW') { var tmp = r0; r0 = r1; r1 = tmp; }
        else if (ins == 'PU') { stack.push(r0); }
        else if (ins == 'PO') { r0 = stack.pop(); }
        else if (ins == 'AD') { r0 += r1; }
        else if (ins == 'SU') { r0 -= r1; }
        else if (ins == 'MU') { r0 *= r1; }
        else if (ins == 'DI') { r0 /= r1; }
      });
      return r0;
 }