/**
 * validation.js
 * input,select要素に対してバリデーションを行い、エラーの表示/非表示を制御
 */

function ValidModel(attrs) {
  this.val = "";
  this.attrs = {
    required : attrs.required  || false,
    maxlength: attrs.maxlength || 8,
    minlength: attrs.minlength || 4
  };
  this.listenners = {
    valid: [],
    invalid: []
  };
}

// オブザーバー機能 - イベントの登録メソッド
ValidModel.prototype.on = function (event, func) {
  this.listenners[event].push(func);
};

// オブザーバー機能 - イベントの発火メソッド
ValidModel.prototype.trigger = function (event) {
  this.listenners[event].forEach(function (fn) {
    fn();
  });
};

// validation pattern - 引数valとthis.valに差分があればvalidateメソッドを実行
// 各種validation patternは正しい場合trueを返す
ValidModel.prototype.set = function (val) {
  if (this.val === val) return;
  this.val = val;
  this.validate();
};

// validation pattern - 値が空か判定
ValidModel.prototype.required = function () {
  return this.val !== "";
};

// validation pattern - 値が引数num以上か判定
ValidModel.prototype.maxlength = function (num) {
  return num >= this.val.length;
};

// 値が引数num以下か判定
ValidModel.prototype.minlength = function (num) {
  return num <= this.val.length;
};

ValidModel.prototype.validate = function () {
  var val;
  this.errors = [];

  // this.attrを走査して、ValidModelのメソッドにval引数を渡して実行
  // 各種validation patternは正しくない場合falseを返す
  for (var key in this.attrs) {
    val = this.attrs[key];
    if (!this[key](val)) this.errors.push(key);
  }

  // this.errorsが空であればvalid、無ければinvalidイベントを通知する
  this.trigger(!this.errors.length ? "valid" : "invalid");
};


/**
 * viewコンストラクタ
 */
export default function ValidView(el) {
  this.initialize(el);
  this.handleEvents();
}

// インスタンスから初期化メソッドを実行(引数としてinput要素を渡す)
ValidView.prototype.initialize = function (el) {
  this.el = el;
  this.list = el.nextElementSibling.children;

  // 要素のdata属性を取得
  var obj = this.el.dataset;

  // required属性が存在する場合は先ほどのobjにマージ
  if (this.el.required) {
    obj['required'] = '';
  }

  // ValidViewからValidModelのメソッドを呼び出せるようにする
  this.model = new ValidModel(obj);
};

// DOMに対してイベントを登録するメソッド
ValidView.prototype.handleEvents = function () {
  var that = this;

  // keyuoイベントのハンドラとしてonKeyupを登録
  // イベント発火時にイベントオブジェクトeを受け取る
  this.el.addEventListener('keyup', function(e) {
    that.onKeyup(e);
  });

  // model用のイベント登録
  this.model.on("valid", function() {
    that.onValid();
  });

  this.model.on("invalid", function() {
    that.onInvalid();
  });
};

ValidView.prototype.onKeyup = function (e) {
  var target = e.currentTarget;
  // inputの値をmodelにセットする
  this.model.set(target.value);
};

ValidView.prototype.onValid = function () {
  this.el.classList.remove('error');

  var listEach = [].forEach.bind(this.list);
  listEach(function(item) {
    item.style.display = 'none';
  });

};

ValidView.prototype.onInvalid = function () {
  var that = this;

  this.el.classList.add('error');

  var listEach = [].forEach.bind(this.list);
  listEach(function(item) {
    item.style.display = 'none';
  });

  this.model.errors.forEach(function (val) {
    listEach(function (item) {
      if (item.dataset['error'] == val) {
        item.style.display = 'block';
      }
    });
  });
};
