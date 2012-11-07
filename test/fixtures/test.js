var foo = bar

less = more;

function complexFunction(one, two, three, four, five, six) {
  if (one) {

  }
  else if (two) {
    var hello;
  }
  else if (three) {
    
  }
  else if (four) {
    
  }
  else if (five) {
    
  }
  else if (six) {
    
  }
  else {

  }
  return one
}

function simpleFunction(one, two) {
  return one = two
}

var nestedFunction = function() {
  if (true) {
    if (true) {
      if (true) {
        if (true) {
          return true;
        }
      }
    }
  }
  return false
}

complexFunction.prototype = {
  cbFunction: function(one, two, done) {
    done(null, one+two)
  },

  cbFunction2: function(one, two, done) {
    done(null, one+two);
  },
};


complexFunction.cbFunction(1, 2, function(err, result) {
  console.log(err, result)
});