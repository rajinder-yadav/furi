/**
 * Class method overloading.
 */
class Hello {
  static foo(message?: string): void;
  static foo(message?: string, count?: number): void;
  static foo(message?: string, count?: number): void {
    count = count || 1;
    for (let i = 0; i < count; i++) {
      console.log(`Hello, ${message}`);
    }
  }
}

Hello.foo("World!"); // Hello, World
Hello.foo("Three", 3); // Hello, World

/**
 * Function overload.
 */
function foo(message?: string): void;
function foo(message?: string, count?: number): void;
function foo(message?: string, count?: number): void {
  count = count || 1;
  for (let i = 0; i < count; i++) {
    console.log(`Hello, ${message}`);
  }
}

foo("World!"); // Hello, World
foo("Three", 3); // Hello, World
