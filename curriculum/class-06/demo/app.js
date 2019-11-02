'use strict';

let people = {
    bob: { name: 'Bob Smith', age: 41 },
    larry: {name: 'Larry Schmidt', age: 72},
    theodor: { name: 'Teddy TheRed', age: 54 },
    mike: { name: 'Mike Jefferson', age: 40 }
}

let names = [];
let ages = [];

Object.keys(people).forEach( person => {
    names.push(people[person].name);
    ages.push(people[person].age);
});

console.log('People in order: ', names.sort().join(' -> '));
console.log('Ages in order: ', ages.sort().join(' -> '));
