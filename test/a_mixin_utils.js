var mixins = require('..');
var expect = require('expect.js');
var sinon = require('sinon');
var noop = function(){};

describe('mixin utilities', function(){
    describe('mixins.ONCE', function(){
        it('throws when both sides are passed', function(){
            expect(mixins.ONCE).withArgs(noop, noop, 'Foo').to.throwException(/Foo.*unique/g);
        });

        it('doesn\'t throw when one side is passed', function(){
            expect(mixins.ONCE).withArgs(noop, undefined, 'Foo').to.not.throwException();
            expect(mixins.ONCE).withArgs(undefined, 'Foo').to.not.throwException();
        });

        it('calls the correct function', function(){
            var left = sinon.stub().withArgs(7).returns(13), 
                right = sinon.stub().withArgs(8).returns(14);
            var res1 = mixins.ONCE(left, undefined, 'LeftTest')([7]);
            var res2 = mixins.ONCE(undefined, right, 'RightTest')([8]);

            expect(left.called).to.be.ok();
            expect(right.called).to.be.ok();
            expect(res1).to.be(13);
        });
    });

    describe('mixins.MANY', function(){
        it('calls both functions', function(){
            var left = sinon.stub().returns(13);
            var right = sinon.stub().returns(14);

            var res = mixins.MANY(left, right, "callsBoth")([9]);
            expect(left.called).to.be.ok();
            expect(right.called).to.be.ok();
            expect(res).to.be(13);
        });
    });

    describe('mixins.MANY_MERGED', function(){
        var test = function(leftRet, rightRet){
            var left = sinon.stub().returns(leftRet);
            var right = sinon.stub().returns(rightRet);
            mixins.MANY(left, right, "manyMerged");
            return function(){
                var res = fn([], function(e){ throw e }); 
                expect(left.called).to.be.ok();
                expect(right.called).to.be.ok();
                return res;
            };
        };

        it('calls both functions', function(){
            var res = test({}, {})();
            expect(res).to.eql({});
        });

        it('merges simple object keys', function(){
            var res = test({a: 1}, {b: 2})();
            expect(res).to.eql({a: 1, b: 2});
        });

        it('throws with duplicate keys', function(){
            expect(test({a: 1}, {a: 2})).to.throwException(/cannot merge.*both.*manyMerged/);
        });
    });
});
