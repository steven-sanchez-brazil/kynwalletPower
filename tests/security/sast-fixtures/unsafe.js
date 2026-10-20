// Synthetic fixture; never imported or executed.
// ruleid: kynwallet-no-eval
eval('1 + 1');
// ruleid: kynwallet-no-function-constructor
new Function('return 1');
// ruleid: kynwallet-no-inner-html
element.innerHTML = value;
// ruleid: kynwallet-no-password-logging
console.log(form.password);

