// Generated by CoffeeScript 1.6.2
(function() {
  Tinytest.add("ReactiveObject - Basic", function(test) {
    var obj, prop, val;

    obj = new ReactiveObject();
    for (prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        test.fail({
          message: 'Object should be empty and not contain ' + prop
        });
      }
    }
    obj.defineProperty('test');
    test.isTrue('test' in obj);
    test.isUndefined(obj[test]);
    val = ['test'];
    obj.defineProperty(2, val);
    test.isTrue(2 in obj, 'Integer as prop');
    test.equal(obj[2], val);
    test.equal(_.intersection(_.keys(obj), ['test', '2']).length, 2, 'The properties of the object are incorrect');
    obj.undefineProperty(2);
    test.isFalse(2 in obj, 'Integer as prop');
    test.isTrue('test' in obj);
    test.isUndefined(obj[2]);
    obj.defineProperty(2);
    test.isTrue(2 in obj, 'Integer as prop');
    test.isUndefined(obj[2]);
    delete obj['test'];
    test.isUndefined(obj['test']);
  });

  Tinytest.add("ReactiveObject - Deps", function(test) {
    var fooVal, obj, x;

    fooVal = 'bar';
    obj = new ReactiveObject({
      'foo': fooVal,
      'try': 1
    });
    test.equal(_.intersection(_.keys(obj), ['foo', 'try']).length, 2, 'The properties of the object are incorrect');
    x = 0;
    Deps.autorun(function() {
      test.equal(fooVal, obj.foo);
      return ++x;
    });
    Deps.flush();
    test.equal(fooVal, obj.foo);
    test.equal(x, 1);
    obj.foo = fooVal = 'beer';
    Deps.flush();
    test.equal(x, 2);
    obj["try"] = 2;
    Deps.flush();
    test.equal(x, 2);
    delete obj.foo;
    obj.defineProperty('foo', fooVal);
    Deps.flush();
    test.equal(x, 3, 'Dependency should still exists if delete is used');
    fooVal = void 0;
    obj.undefineProperty('foo');
    Deps.flush();
    test.equal(x, 4, 'Dependency should be trigger on undefineProperty');
    fooVal = '2';
    obj.defineProperty('foo', fooVal);
    Deps.flush();
    test.equal(x, 4, 'Dependency should be removed by undefineProperty');
  });

  Tinytest.add("ReactiveObject - EJSON", function(test) {
    var dolly, obj, objJson;

    obj = new ReactiveObject({
      'foo': 'test',
      'try': 1
    });
    dolly = obj.clone();
    test.isTrue(obj.equals(dolly), 'Clone should return a equal');
    objJson = EJSON.fromJSONValue(EJSON.toJSONValue(obj));
    test.isTrue(obj.equals(objJson), 'JSON from, to should return a equal object');
    obj.defineProperty('me', {
      title: 'developer'
    });
    test.isFalse(obj.equals(objJson), 'Obj was changed this should not effect a JSON created version');
    test.isFalse(obj.equals(dolly), 'Obj was changed this should not effect a clone');
  });

}).call(this);