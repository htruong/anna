 function inheritPrototype(childObject, parentObject) {
 	// As discussed above, we use the Crockford’s method to copy the properties and methods from the parentObject onto the childObject​
 	​// So the copyOfParent object now has everything the parentObject has ​
    var copyOfParent = Object.create(parentObject.prototype);
​
    //Then we set the constructor of this new object to point to the childObject.​
    ​// Why do we manually set the copyOfParent constructor here, see the explanation immediately following this code block.​
    copyOfParent.constructor = childObject;
​
    // Then we set the childObject prototype to copyOfParent, so that the childObject can in turn inherit everything from copyOfParent (from parentObject)​
    childObject.prototype = copyOfParent;
}


function Word(w) {
  this.w = w;
  this.attr = {};
}

Word.prototype = {
  constructor: Word,
  syls: function() {
    return _.map ( 
    	this.w.split(" ") , 
    	function (item) { 
    		return Word(item); 
    	} 
    );
  },
  slen: function() {
    return this.syls().length;
  },
  len: function() {
  	return this.w.length;
  },
  setattr: function(attr) {
  	this.attr = attr;
  },
  attr: function(key, value) {
  	if (value) {
  		this.attr[key] = value;
  		return;	
  	}
  	return this.attr[key];
  },
  reverse: function() {
  	var ret;
  	for (var i = 0; i < this.w.length; i ++) {
  		ret = this.w[i] + ret;
	}
	return ret;
  }
};

function ViWord(w) {
	Word.call(this, w);
	this.init();
};

​inheritPrototype(ViWord, Word);

ViWord.prototype.init = function() {
	this.attr('lang', 'vi');
	this.w = this.w.toLowerCase();
};

ViWord.prototype.head = function() {
	var ret = "";
	for (var i = 0; i < this.w.length; i ++) {
		switch (i) {
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
			case 'x':
			case 'z':
				ret += this.w[i];
		}
	}
};

ViWord.prototype.tail = function() {
	var h = this.head();
	return this.w.substr(this.head().length);
};

ViWord.prototype.removeTone = function() {
	var ret = "";
	for (var i = 0; i < this.w.length; i ++) {
		switch (i) {
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
			        ret += 'a';
			        break;
			case 'è':
			case 'ẻ':
			case 'ẽ':
			case 'é':
			case 'ẹ':
					ret += 'e';
			case 'ề':
			case 'ì':
			case 'ò':
			case 'ồ':
			case 'ờ':
			case 'ù':
			case 'ừ':
			case 'ỳ':
			
			case 'ỉ':
			case 'ỏ':
			case 'ổ':
			case 'ở':
			case 'ủ':
			case 'ử':
			case 'ỷ':
			        ret += '?';
			        break;
			case 'ầ':
			case 'ẩ':
			case 'ẫ':
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
			case 'ấ':
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
			case 'ậ':
			case 'ể':
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
		}
	}
	return "-";
};


ViWord.prototype.getTone = function() {
	for (var i = 0; i < this.w.length; i ++) {
		switch (i) {
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
		}
	}
	return "-";
};


