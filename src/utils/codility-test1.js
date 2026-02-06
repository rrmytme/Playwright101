function calculate(S) {
    var length = S.length;
    if (length > 100) {
        return 0;
    }
    var count = Array(100).fill(0);
    for (var i = 0; i < length - 1; i++) {
        var num = parseInt(S.substring(i, i + 2));
        count[num] = 1;
    }
    return count.reduce(function (a, b) { return a + b; }, 0);
}
function solution() {
    var k = 10; // digits 0-9
    var n = 2;
    var a = Array(k * n).fill(0);
    var sequence = [];
    function db(t, p) {
        if (t > n) {
            if (n % p === 0) {
                for (var i = 1; i <= p; i++) {
                    sequence.push(a[i]);
                }
            }
        }
        else {
            a[t] = a[t - p];
            db(t + 1, p);
            for (var j = a[t - p] + 1; j < k; j++) {
                a[t] = j;
                db(t + 1, t);
            }
        }
    }
    db(1, 1);
    // Convert to string and limit length to 100
    return sequence.join("").substring(0, 100);
}
var testString = solution();
// let testString =
//   "1020304050607080911213141516171818293343536373839445464748495565758596676869778798899";
console.log("Generated String:", testString);
var score = calculate(testString);
console.log("Score:", score);
