'use strict';

const expect = require('chai').expect;

describe('path defs with {path, fn}', function () {

    it('checks', function () {
        const pathDefs = require('../index');


        const data = {
            type: 'person',
            // name 'required string',
            profile: {
                firstName: 'Shaopeng',
                lastName: 'Zhang',
                age: '30', // wrong type
                male: true,
                female: true, // what???
                hobby: [ // only validate when `age` is $valid
                    'tv',
                    'photography',
                    'sesame street',
                ]
            },
            address: {
                street: 'Sesame st',
                city: 'Princeton',
                state: 'NY',
                country: 'US',
            }
        };


        const defs = [{
            path: 'type',
            fn: (val) => val === 'person' || val === 'stuff'
        }, {
            path: 'profile.name',
            fn: (val) => val && typeof val === 'string'
        }, {
            path: 'profile.age',
            fn: (val) => typeof val === 'number' && val >= 0
        }, {
            path: 'profile._gener',
            fn: (val, body) =>
                typeof body.profile.male === 'boolean' &&
                typeof body.profile.female === 'boolean' &&
                body.profile.male !== body.profile.female
        }, {
            path: 'profile.hobby',
            fn: (val) => {return Array.isArray(val) && val.length}
        }, {
            path: ['address', 'country'],
            fn: (val) => val === 'US'
        }, {
            path: ['address', 'state'],
            fn: (val, body, current) =>
                current.address.country.$valid ?
                val === 'NJ' : true
        }];


        var checkFn = pathDefs(defs);
        var result = checkFn(data);


        expect(result.$valid).to.be.false;

        expect(result.type.$valid).to.be.true;
        expect(result.profile.name.$valid).to.be.false;
        expect(result.profile.age.$valid).to.be.false;
        expect(result.profile._gener.$valid).to.be.false;
        expect(result.profile.hobby.$valid).to.be.true;
        expect(result.address.country.$valid).to.be.true;
        expect(result.address.state.$valid).to.be.false;
    });

});
