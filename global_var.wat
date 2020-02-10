(module
  (import "console" "log" (func $log (param i32)))
  (global $g (import "js" "global") (mut i32))
  (func (export "getGlobal") (result i32)
    (global.get $g))
  (func (export "incGlobal")
    (global.set $g
      (i32.add (global.get $g) (i32.const 1))))
  (func (export "logIt") (param i32)
    local.get 0
    call $log)
  (func $getAnswer (result i32) i32.const 42)
  (func (export "getAnswerPlus1") (result i32)
    call $getAnswer
    i32.const 1
    i32.add))
