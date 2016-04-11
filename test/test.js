'use strict';

var chai = require('chai'),
    os = require('os'),
    findInFiles = require('../index'),
    stringOne = 'dolor sit amet',
    stringTwo = 'Träumen',
    stringThree = 'This is in both files',
    stringFour = 'This is duplicate',
    ObjectOne = {
        'term': "dolor sit amet",
        'flags': "ig"
    };

chai.should();

['find', 'findSync'].forEach(function(method) {
    describe('find some test strings (using "' + method + '")', function() {
        this.timeout(15000);
        it('should find stringOne only in fileOne exactly one time', function(done) {
            findInFiles[method](stringOne, '.', '.txt$')
                .then(function(result) {
                    var paths = constructPaths({
                        first: "fileOne.txt",
                        second: "fileTwo.txt"
                    })
                    result[paths.first].count.should.equal(1);
                    result.should.not.have.property(paths.second);
                    done();
                });
        });

        it('should find stringTwo only in fileTwo exactly one time', function(done) {
            findInFiles[method](stringTwo, '.', '.txt$')
                .then(function(result) {
                    var paths = constructPaths({
                        first: "fileTwo.txt",
                        second: "fileOne.txt"
                    })
                    result[paths.first].count.should.equal(1);
                    result.should.not.have.property(paths.second);
                    done();
                });
        });

        it('should find stringThree in both files exactly one time', function(done) {
            findInFiles[method](stringThree, '.', '.txt$')
                .then(function(result) {
                    var paths = constructPaths({
                        first: "fileOne.txt",
                        second: "fileTwo.txt"
                    })
                    result[paths.first].count.should.equal(1);
                    result[paths.second].count.should.equal(1);
                    done();
                });
        });

        it('should find stringFour 2 times in fileOne and 3 times in fileTwo', function(done) {
            findInFiles[method](stringFour, '.', '.txt$')
                .then(function(result) {
                    var paths = constructPaths({
                        first: "fileOne.txt",
                        second: "fileTwo.txt"
                    })
                    result[paths.first].count.should.equal(2);
                    result[paths.second].count.should.equal(3);
                    done();
                });
        });

        it('should not find strings in the .js file', function(done) {
            findInFiles[method](stringOne, '.', '.txt$')
                .then(function(result) {
                    var paths = constructPaths({
                        first: "fileOne.txt",
                        second: "fileOne.md"
                    })
                    result[paths.first].count.should.equal(1);
                    result.should.not.have.property(paths.second);
                    done();
                });
        });

        it('should accept a regex object for fileFilter', function(done) {
            findInFiles[method](stringOne, '.', /.txt$/)
                .then(function(result) {

                    var paths = constructPaths({
                        first: "fileOne.txt",
                        second: "fileOne.md"
                    })
                    result[paths.first].count.should.equal(1);
                    result.should.not.have.property(paths.second);
                    done();
                });
        });

        it('should find strings in all files', function(done) {
            findInFiles[method](stringOne, 'test/')
                .then(function(result) {
                    var paths = constructPaths({
                        first: "fileOne.txt",
                        second: "fileOne.md"
                    })
                    result[paths.first].count.should.equal(1);
                    result[paths.second].count.should.equal(1);
                    done();
                });
        });

        it('should find stringOne twice in fileOne since we are case insensative', function(done) {
            findInFiles[method](ObjectOne, '.', '.txt$')
                .then(function(result) {
                    var paths = constructPaths({
                        first: "fileOne.txt",
                        second: "fileOne.md"
                    })
                    result[paths.first].count.should.equal(2);
                    result.should.not.have.property(paths.second);
                    done();
                });
        });
    });
});

function constructPaths(data) {

    var result = {};

    if (os.platform() == 'win32') {
        result.first = 'test\\' + data.first;
        result.second = 'test\\' + data.second;
    } else {
        result.first = 'test/' + data.first;
        result.second = 'test/' + data.second;
    }

    return result;
}
