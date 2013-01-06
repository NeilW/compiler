
Elm.Keyboard = { Raw : function() {
  var keysDown = Elm.Signal.constant(["Nil"]);
  keysDown.defaultNumberOfKids = 2;

  var charPressed = Elm.Signal.constant(["Nothing"]);

  function remove(x,xs) {
	if (xs[0] === "Nil") return xs;
	if (xs[1] === x) return xs[2];
	return ["Cons", xs[1], remove(x,xs[2])];
  }
  function has(x,xs) {
	while (xs[0] !== "Nil") {
	  if (xs[1] === x) return true;
	  xs = xs[2];
	}
	return false;
  }
  Value.addListener(document, 'keydown', function(e) {
	  if (has(e.keyCode, keysDown.value)) return;
	  var hasListener = Dispatcher.notify(keysDown.id, ["Cons", e.keyCode, keysDown.value]);
	  if (!hasListener)
		this.removeEventListener('keydown',arguments.callee,false);
	});
  Value.addListener(document, 'keyup', function(e) {
	  var codes = remove(e.keyCode, keysDown.value);
	  var hasListener = Dispatcher.notify(keysDown.id, codes);
	  if (!hasListener)
		this.removeEventListener('keyup',arguments.callee,false);
	});
  Value.addListener(window, 'blur', function(e) {
	  var hasListener = Dispatcher.notify(keysDown.id, ["Nil"]);
	  if (!hasListener)
		this.removeEventListener('blur',arguments.callee,false);
	});
  Value.addListener(document, 'keypress', function(e) {
	  var hasListener = Dispatcher.notify(charPressed.id, ["Just",e.charCode || e.keyCode]);
	  Dispatcher.notify(charPressed.id, ["Nothing"]);
	  if (!hasListener)
		this.removeEventListener('keypress',arguments.callee,false);
	});
  return {keysDown:keysDown,
	  charPressed:charPressed};
    }()
};

(function() {
  function dir(left,right,up,down) {
      function f(ks) {
	  var x = 0, y = 0;
	  while (ks[0] == "Cons") {
	      switch (ks[1]) {
	      case left : --x; break;
	      case right: ++x; break;
	      case up   : ++y; break;
	      case down : --y; break;
	      }
	      ks = ks[2];
	  }
	  return { _:[true], x:[x], y:[y] };
      }
      return Elm.Signal.lift(f)(Elm.Keyboard.Raw.keysDown);
  }
  var arrows = dir(37,39,38,40);
  arrows.defaultNumberOfKids = 0;
  var wasd = dir(65,68,87,83);
  wasd.defaultNumberOfKids = 0;

  Elm.Keyboard.arrows = arrows;
  Elm.Keyboard.wasd   = wasd;
}());
