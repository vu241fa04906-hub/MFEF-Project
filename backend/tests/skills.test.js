import test from 'node:test';
import assert from 'node:assert/strict';
import {detectSkills,compareSkills} from '../services/skills.js';

test('detects supported skills without substring matches',()=>{
 const skills=detectSkills('React, JavaScript and Node.js experience; no SQLAlchemy mentioned.');
 assert.ok(skills.includes('React'));
 assert.ok(skills.includes('JavaScript'));
 assert.ok(skills.includes('Node.js'));
 assert.ok(!skills.includes('SQL'));
});

test('calculates explainable required skill match',()=>{
 const result=compareSkills(['React','Node.js'],{requiredSkills:[{name:'React'},{name:'Node.js'},{name:'MongoDB'}]});
 assert.deepEqual(result.matched,['React','Node.js']);
 assert.deepEqual(result.missing.map(x=>x.name),['MongoDB']);
 assert.equal(result.score,67);
 assert.match(result.explanation,/matched required skills/);
});

test('handles empty requirements without dividing by zero',()=>{
 const result=compareSkills([], {requiredSkills:[]});
 assert.equal(result.score,0);
 assert.equal(result.requiredCount,0);
});
