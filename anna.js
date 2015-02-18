function inheritPrototype(childObject, parentObject) {
	// As discussed above, we use the Crockford’s method to copy the properties and methods from the parentObject onto the childObject​
	// So the copyOfParent object now has everything the parentObject has ​
	var copyOfParent = Object.create(parentObject.prototype);

	//Then we set the constructor of this new object to point to the childObject.​
	// Why do we manually set the copyOfParent constructor here, see the explanation immediately following this code block.​
	copyOfParent.constructor = childObject;

	// Then we set the childObject prototype to copyOfParent, so that the childObject can in turn inherit everything from copyOfParent (from parentObject)​
	childObject.prototype = copyOfParent;
}

function Dict() {
	this.words = [];
}

Dict.prototype = {
	constructor: Dict,
	add: function (w, attr) {
		var word = new Word(w);
		this.words.push(word);
	},
	get: function (w) {
		for (var i = 0; i < this.words.length; i++) {
			if (this.words[i].w == w) {
				return this.words[i];
			} else {
				return new Word(w);
			}
		}
		return null;
	},
	pairs: function (cond, limit) {
		if (! limit) { limit = 10; }
		var ret = [];
		for (var i = 0; i < this.words.length; i++) {
			var w1 = this.words[i];
			if (i % Math.ceil(this.words.length / 100 * 5) == 0) {
				console.log("Searching... " + i / Math.ceil(this.words.length / 100) + "%");
			}
			for (var j = 0; j < this.words.length; j++) {
				var w2 = this.words[j];
				if (i != j) {
					if (eval(cond)) {
						ret.push([w1, w2]);
						if (limit && ret.length >= limit) return ret; 
					}
				}
			}
		}
		return ret;
	},
	search: function (cond, limit) {
		if (! limit) { limit = 10; }
		var ret = [];
		for (var i = 0; i < this.words.length; i++) {
			if (i % Math.ceil(this.words.length / 100 * 5) == 0) {
				console.log("Searching... " + i / Math.ceil(this.words.length / 100) + "%");
			}
			
			var w = this.words[i];
			if (eval(cond)) {
				ret.push(w);
				if (limit && ret.length >= limit) return ret; 
			}
		}
		return ret;
	}
};


function ViDict() {
	Dict.call(this);
}

inheritPrototype(ViDict, Dict);


function Word(w) {
	this.w = w.toLowerCase();
}

Word.prototype = {
	constructor: Word,
	len: function() {
		return this.w.length;
	},
	string: function() {
		return this.w;
	},
	reverse: function() {
		var ret = "";
		for (var i = 0; i < this.w.length; i ++) {
			ret = this.w[i] + ret;
		}
		return ret;
	},
	joinSyls: function() {
		return new Word(this.w.split(" ").join(""));
	},
	anagram: function() {
		var seen = [];
		for (var i = 0; i < this.w.length; i ++) {
			if ( this.w[i] == " " ) {
				continue;
			}
			if ( ! _.contains(seen, this.w[i])) {
				seen.push (this.w[i]);
			}
		}
		return seen.sort().join();
	}
};


function ViWord(w) {
	Word.call(this, w);
}

inheritPrototype(ViWord, Word);


ViDict.prototype.add = function(w, attr) {
	this.words.push(new ViWord(w));
};


ViWord.prototype.head = function() {
	var ret = "";
	for (var i = 0; i < this.w.length; i ++) {
		switch (this.w[i]) {
			case 'b':
			case 'c':
			case 'd':
			case 'đ':
			case 'f':
			case 'g':
			case 'h':
			case 'j':
			case 'k':
			case 'l':
			case 'm':
			case 'n':
			case 'p':
			case 'q':
			case 'r':
			case 's':
			case 't':
			case 'v':
			case 'x':
			case 'z':
			ret += this.w[i];
			break;
			default:
			return new ViWord(ret);
			break;
		}
	}
	return new ViWord(ret);
};

ViWord.prototype.tail = function() {
	var h = this.head();
	return new ViWord(this.w.substr(this.head().string().length));
};


ViWord.prototype.syls = function(i) {
	var ret = _.map ( 
		this.w.split(" ") , 
		function (item) { 
			return new ViWord(item); 
		} 
	);
	if (typeof i === "undefined") {
		return ret;
	} else {
		return ret[i];
	}
};

ViWord.prototype.slen = function() {
	return this.syls().length;
};


ViWord.prototype.removeTones = function() {
	var ret = "";
	for (var i = 0; i < this.w.length; i ++) {
		switch (this.w[i]) {
			case 'à':
			case 'ả':
			case 'ã':
			case 'á':
			case 'ạ':
			ret += 'a';
			break;
			case 'ằ':
			case 'ẳ':
			case 'ẵ':
			case 'ắ':
			case 'ặ':
			ret += 'ă';
			break;
			case 'ầ':
			case 'ẩ':
			case 'ẫ':
			case 'ấ':
			case 'ậ':
			ret += 'â';
			break;
			case 'è':
			case 'ẻ':
			case 'ẽ':
			case 'é':
			case 'ẹ':
			ret += 'e';
			break;
			case 'ề':
			case 'ễ':
			case 'ế':
			case 'ể':
			case 'ệ':
			ret += 'ê';
			break;
			case 'ì':
			case 'ỉ':
			case 'ĩ':
			case 'í':
			case 'ị':
			ret += 'i';
			break;
			case 'ò':
			case 'ỏ':
			case 'õ':
			case 'ó':
			case 'ọ':
			ret += 'o';
			break;
			case 'ồ':
			case 'ổ':
			case 'ỗ':
			case 'ố':
			case 'ộ':
			ret += 'ô';
			break;
			case 'ờ':
			case 'ở':
			case 'ỡ':
			case 'ớ':
			case 'ợ':
			ret += 'ơ';
			break;
			case 'ù':
			case 'ủ':
			case 'ũ':
			case 'ú':
			case 'ụ':
			ret += 'u';
			break;
			case 'ừ':
			case 'ử':
			case 'ữ':
			case 'ứ':
			case 'ự':
			ret += 'ư';
			break;
			case 'ỳ':
			case 'ỷ':
			case 'ỹ':
			case 'ý':
			case 'ỵ':
			ret += 'y';
			break;
			default:
				ret += this.w[i];
			break;
		}
		//console.log(ret);
	}
	return new ViWord(ret);
};


ViWord.prototype.toAscii = function(w) {
	var ret = "";
	var tmp = this.removeTones().w;
	for (var i = 0; i < tmp.length; i ++) {
		switch (tmp[i]) {
			case 'â':
			case 'ă':
			ret += 'a';
			break;
			case 'ê':
			ret += 'e';
			break;
			case 'ô':
			case 'ơ':
			ret += 'o';
			break;
			case 'ư':
			ret += 'u';
			break;
			case 'đ':
			ret += 'd';
			break;
			default:
				ret += tmp[i];
			break;
		}
	}
	return new ViWord(ret);
};


ViWord.prototype.getTone = function() {
	for (var i = 0; i < this.w.length; i ++) {
		switch (this.w[i]) {
			case 'à':
			case 'ằ':
			case 'ầ':
			case 'è':
			case 'ề':
			case 'ì':
			case 'ò':
			case 'ồ':
			case 'ờ':
			case 'ù':
			case 'ừ':
			case 'ỳ':
			return "`";
			break;
			case 'ả':
			case 'ẳ':
			case 'ẩ':
			case 'ẻ':
			case 'ể':
			case 'ỉ':
			case 'ỏ':
			case 'ổ':
			case 'ở':
			case 'ủ':
			case 'ử':
			case 'ỷ':
			return "?";
			break;
			case 'ã':
			case 'ẵ':
			case 'ẫ':
			case 'ẽ':
			case 'ễ':
			case 'ĩ':
			case 'õ':
			case 'ỗ':
			case 'ỡ':
			case 'ũ':
			case 'ữ':
			case 'ỹ':
			return "~";
			break;
			case 'á':
			case 'ắ':
			case 'ấ':
			case 'é':
			case 'ế':
			case 'í':
			case 'ó':
			case 'ố':
			case 'ớ':
			case 'ú':
			case 'ứ':
			case 'ý':
			return "'";
			break;
			case 'ạ':
			case 'ặ':
			case 'ậ':
			case 'ẹ':
			case 'ệ':
			case 'ị':
			case 'ọ':
			case 'ộ':
			case 'ợ':
			case 'ụ':
			case 'ự':
			case 'ỵ':
			return ".";
			break;
			default:
			break;
		}
	}
	return "-";
};


