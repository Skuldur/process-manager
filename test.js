function test(){
  console.log("voff");
  setTimeout(test, 10000);
}

console.log("I AM ALIVE ONCE MORE");
test();