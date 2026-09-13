import {test} from 'node:test';
import assert from 'node:assert/strict';
import {quote, available} from '../lib/prototype.mjs';
test('선택한 옷만 가격 계산하고 두 벌부터 할인',()=>{assert.deepEqual(quote([{price:9000},{price:11000}]),{subtotal:20000,discount:2000,total:18000});assert.equal(quote([{price:9000}]).total,9000);assert.equal(quote([]).total,0);});
test('판매된 옷이 다른 조합에 중복 노출되지 않음',()=>{assert.deepEqual(available([{id:1},{id:2}],[1]).map(x=>x.id),[2]);});
