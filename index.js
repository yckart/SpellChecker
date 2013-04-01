/**
 * A javascript spell-correction
 * https://github.com/yckart/SpellChecker
 *
 * Copyright (c) 2013 Yannick Albert (http://yckart.com)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013/04/01
 */

 (function (window, undefined) {

    /**
     * The SpellChecker constructor
     *
     * @constructor
     * @param  {String/Array} words - Your dictionary
     */

    function SpellChecker(words) {
        this.wordlist = {};
        this.add(words);
    }



    /**
     * Add words to your dictionary
     *
     * @param {String} words
     */

    SpellChecker.prototype.add = function (words) {
        words = String(words);

        var match, regex = /[\w']+/g;
        while ((match = regex.exec(words))) {
            var word = match[0];
            if (this.caseSensitive) word.toLowerCase();
            this.wordlist[word] = 1;
        }
    };



    /**
     * Corrects the given string
     *
     * @param  {String} words
     * @return {Array}
     */

    SpellChecker.prototype.correct = function (word) {

        if (!word) return;

        word = String(word);
        if (this.caseSensitive) word.toLowerCase();

        if (this.wordlist[word]) return word;

        var candidates = [],
            edits = this.edits(word),
            num = edits.length;

        while (num--) if (this.wordlist[edits[num]]) candidates.push(edits[num]);

        if (candidates.length) return this.closest(candidates, word);

        num = edits.length;
        while (num--) {
            var edits2 = this.edits(edits[num]);
            var num2 = edits2.length;
            while (num2--) {
                if (this.wordlist[edits2[num2]]) {
                    candidates.push(edits2[num2]);
                }
            }
        }

        return candidates.length ? this.closest(candidates, word) : null;
    };



    /**
     * Get the closest corrections
     *
     * @param  {Array} candidates
     * @param {String} word
     * @return {Array}
     */

    SpellChecker.prototype.closest = function (candidates, word) {
        candidates = Object.getOwnPropertyNames(
        candidates.reduce(function (p, n) {
            p[n] = 1;
            return p;
        }, {}));

        return candidates.sort();
    };



    /**
     * Test for the closest candidates
     *
     * @param {String} word
     * @return {Array}
     */

    SpellChecker.prototype.edits = function (word) {

        var letters = "aäbcdefghijklmnoöpqrsßtuüvwxyz".split(""),
            lettersLen = letters.length,
            wordLen = word.length,
            edits = [],
            i = wordLen,
            j = lettersLen;


        while (i--) { /* Delete */
            edits.push(word.slice(0, i) + word.slice(i + 1));
        }


        i = wordLen - 1;
        while (i--) { /* Transpose */
            edits.push(word.slice(0, i) + word.charAt(i + 1) + word.charAt(i) + word.slice(i + 2));
        }


        i = wordLen;
        while (i--) { /* Replace */
            j = lettersLen;
            while (j--) {
                edits.push(word.slice(0, i) + letters[j] + word.slice(i + 1));
            }
        }


        i = wordLen + 1;
        while (i--) { /* Insert */
            j = lettersLen;
            while (j--) {
                edits.push(word.slice(0, i) + letters[j] + word.slice(i)); // Insert
            }
        }

        return edits;
    };

    /**
     * Expose SpellChecker
     */
    if(typeof exports !== 'undefined') {
        // Node.js
        exports.SpellChecker = SpellChecker;
    } else if(typeof define !== 'undefined') {
        // RequireJS
        define(SpellChecker);
    } else if(typeof window !== 'undefined') {
        // Browser
        window.SpellChecker = SpellChecker;
    }

}(this));