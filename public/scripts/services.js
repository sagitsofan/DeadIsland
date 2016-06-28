mainApp.factory('DataModel', ['$http',
     function ($http) {

        var data = {};
        
        data.login = function (_username, _password) {
            return $http.post('/api/player/login', {
                username: _username,
                password: _password
            });
        }
        
        data.getActiveGames = function () {
            return $http.get('/api/game/getactivegames');
        }
        
        data.getGame = function (_id) {
            return $http.get('/api/game/' + _id);
        }

        return data;
    }]);

mainApp.service('$Player', function () {
    
    var LSKEY = "DeadPlayer";
    
    //user manager
    this.set = function (user) {
        localStorage.setItem(LSKEY, JSON.stringify(user));
    }
    
    this.get = function () {
        
        var user = localStorage.getItem(LSKEY);
        
        if (user === null)
            return null;
        else
            return JSON.parse(user);
    }
    
    this.logout = function () {
        
        localStorage.removeItem(LSKEY);
        
        document.location.href = "/";
    }
});

mainApp.service('$Cards', function () {
    
    this.ranks = {
        ace: {
            name: 'ace',
            template: '<div  class="playing-card card-ace {{suit}}">\n    <div class="corner top"><span class="number">A</span><span>{{symbol}}</span></div><span class="suit middle_center">{{symbol}}</span>\n    <div class="corner bottom"><span class="number">A</span><span>{{symbol}}</span></div>\n</div>'
        },
        two: {
            name: 'two',
            template: '<div class="playing-card card-two {{suit}}">\n    <div class="corner top"><span class="number">2</span><span>{{symbol}}</span></div>\n    <span class="suit top_center">{{symbol}}</span>\n    <span class="suit bottom_center"></span>\n    <div class="corner bottom"><span class="number">2</span><span>{{symbol}}</span></div>\n</div>'
        },
        three: {
            name: 'three',
            template: '<div class="playing-card card-three {{suit}}">\n    <div class="corner top"><span class="number">3</span><span>{{symbol}}</span></div>\n    <span class="suit top_center">{{symbol}}</span>\n    <span class="suit middle_center"></span>\n    <span class="suit bottom_center"></span>\n    <div class="corner bottom"><span class="number">3</span><span ng-bind-html-unsafe="suit.symbol"></span></div>\n</div>'
        },
        four: {
            name: 'four',
            template: '<div  class="playing-card card-four {{suit}}">\n    <div class="corner top"><span class="number">4</span><span>{{symbol}}</span></div><span class="suit top_left">{{symbol}}</span><span class="suit top_right"></span><span class="suit bottom_left"></span><span class="suit bottom_right"></span>\n    <div class="corner bottom"><span class="number">4</span><span>{{symbol}}</span></div>\n</div>'
        },
        five: {
            name: 'five',
            template: '<div class="playing-card card-five {{suit}}">\n    <div class="corner top"><span class="number">5</span><span>{{symbol}}</span></div>\n    <span class="suit top_left">{{symbol}}</span>\n    <span class="suit top_right"></span>\n    <span class="suit middle_center"></span>\n    <span class="suit bottom_left"></span>\n    <span class="suit bottom_right"></span>\n    <div class="corner bottom"><span class="number">5</span><span>{{symbol}}</span></div>\n</div>'
        },
        six: {
            name: 'six',
            template: '<div class="playing-card card-six {{suit}}">\n    <div class="corner top"><span class="number">6</span><span>{{symbol}}</span></div><span class="suit top_left">{{symbol}}</span><span class="suit top_right"></span><span class="suit middle_left"></span><span class="suit middle_right"></span><span class="suit bottom_left"></span><span class="suit bottom_right"></span>\n    <div class="corner bottom"><span class="number">6</span><span>{{symbol}}</span></div>\n</div>'
        },
        seven: {
            name: 'seven',
            template: '<div class="playing-card card-seven {{suit}}">\n    <div class="corner top"><span class="number">7</span><span>{{symbol}}</span></div><span class="suit top_left">{{symbol}}</span><span class="suit top_right"></span><span class="suit middle_left"></span><span class="suit middle_top"></span><span class="suit middle_right"></span><span class="suit bottom_left"></span><span class="suit bottom_right"></span>\n    <div class="corner bottom"><span class="number">7</span><span>{{symbol}}</span></div>\n</div>'
        },
        eight: {
            name: 'eight',
            template: '<div class="playing-card card-eight {{suit}}">\n    <div class="corner top"><span class="number">8</span><span>{{symbol}}</span></div><span class="suit top_left">{{symbol}}</span><span class="suit top_right"></span><span class="suit middle_left"></span><span class="suit middle_top"></span><span class="suit middle_right"></span><span class="suit middle_bottom"></span><span class="suit bottom_left"></span><span class="suit bottom_right"></span>\n    <div class="corner bottom"><span class="number">8</span><span>{{symbol}}</span></div>\n</div>'
        },
        nine: {
            name: 'nine',
            template: '<div class="playing-card card-nine {{suit}}">\n    <div class="corner top"><span class="number">9</span><span>{{symbol}}</span></div><span class="suit top_left">{{symbol}}</span><span class="suit top_right"></span><span class="suit middle_top_left"></span><span class="suit middle_center"></span><span class="suit middle_top_right"></span><span class="suit bottom_left"></span><span class="suit bottom_right"></span><span class="suit middle_bottom_left"></span><span class="suit middle_bottom_right"></span>\n    <div class="corner bottom"><span class="number">9</span><span>{{symbol}}</span></div>\n</div>'
        },
        ten: {
            name: 'ten',
            template: '<div class="playing-card card-ten {{suit}}">\n    <div class="corner top"><span class="number">10</span><span>{{symbol}}</span></div><span class="suit top_left"></span><span class="suit top_right">{{symbol}}</span><span class="suit middle_top_left">{{symbol}}</span><span class="suit middle_top_center"></span><span class="suit middle_top_right"></span><span class="suit bottom_left"></span><span class="suit bottom_right"></span><span class="suit middle_bottom_center"></span><span class="suit middle_bottom_left"></span><span class="suit middle_bottom_right"></span>\n    <div class="corner bottom"><span class="number">10</span><span>{{symbol}}</span></div>\n</div>'
        },
        jack: {
            name: 'jack',
            template: '<div class="playing-card card-jack {{suit}}">\n    <div class="corner top"><span class="number">J</span><span>{{symbol}}</span></div><span class="face middle_center"></span>\n    <div class="corner bottom"><span class="number">J</span><span>{{symbol}}</span></div>\n</div>'
        },
        queen: {
            name: 'queen',
            template: '<div class="playing-card card-queen {{suit}}">\n    <div class="corner top"><span class="number">Q</span><span>{{symbol}}</span></div><span class="face middle_center"></span>\n    <div class="corner bottom"><span class="number">Q</span><span>{{symbol}}</span></div>\n</div>'
        },
        king: {
            name: 'king',
            template: '<div class="playing-card card-king {{suit}}">\n    <div class="corner top"><span class="number">K</span><span>{{symbol}}</span></div><span class="face middle_center"></span>\n    <div class="corner bottom"><span class="number">K</span><span>{{symbol}}</span></div>\n</div>'
        },
        back: {
            name: 'card back',
            template: '<div class="playing-card card-back"><span class="face"></span></div>'
        }
    };
    
    this.suits = {
        club: {
            name: 'club',
            symbol: '&#9827;',
        },
        diamond: {
            name: 'diamond',
            symbol: '&diams;',
        },
        spade: {
            name: 'spade',
            symbol: '&spades;',
        },
        heart: {
            name: 'heart',
            symbol: '&hearts;',
        }
    };
    
    this.translateCardSuit = function (card) {
        
        var suit = card.slice(card.length - 1, card.length).toLowerCase();
        
        switch (suit) {
            case "s":
                return "spade";
            case "c":
                return "club";
            case "d":
                return "diamond";
            case "h":
                return "heart";
        }
    }

    this.translateCardRank = function (card) {
        
        var rank = card.substring(0, card.length - 1).toLowerCase();
        
        switch (rank) {
            case "2":
                return "two";
            case "3":
                return "three";
            case "4":
                return "four";
            case "5":
                return "five";
            case "6":
                return "six";
            case "7":
                return "seven";
            case "8":
                return "eight";
            case "9":
                return "nine";
            case "10":
                return "ten";
            case "j":
                return "jack";
            case "q":
                return "queen";
            case "k":
                return "king";
            case "a":
                return "ace";
        }
    }
});