function calculate(S: string): number {
  const length = S.length;

  if (length > 100) {
    return 0;
  }

  const count = Array(100).fill(0);

  for (let i = 0; i < length - 1; i++) {
    const num = parseInt(S.substring(i, i + 2));
    count[num] = 1;
  }

  return count.reduce((a, b) => a + b, 0);
}

function solution(): string {
  const k = 10; // digits 0-9
  const n = 2;

  const a: number[] = Array(k * n).fill(0);
  const sequence: number[] = [];

  function db(t: number, p: number) {
    if (t > n) {
      if (n % p === 0) {
        for (let i = 1; i <= p; i++) {
          sequence.push(a[i]);
        }
      }
    } else {
      a[t] = a[t - p];
      db(t + 1, p);
      for (let j = a[t - p] + 1; j < k; j++) {
        a[t] = j;
        db(t + 1, t);
      }
    }
  }

  db(1, 1);

  // Convert to string and limit length to 100
  return sequence.join("").substring(0, 100);
}

let testString = solution();
// let testString =
//   "1020304050607080911213141516171818293343536373839445464748495565758596676869778798899";

console.log("Generated String:", testString);

let score = calculate(testString);
console.log("Score:", score);
