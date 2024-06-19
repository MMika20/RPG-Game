"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _phaser = _interopRequireDefault(require("phaser"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var Charakter =
/*#__PURE__*/
function (_Phaser$Physics$Arcad) {
  _inherits(Charakter, _Phaser$Physics$Arcad);

  function Charakter(scene, x, y, texture, frame) {
    var _this;

    _classCallCheck(this, Charakter);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Charakter).call(this, scene, x, y, texture, frame));
    scene.add.existing(_assertThisInitialized(_this));
    scene.physics.add.existing(_assertThisInitialized(_this));

    _this.setCollideWorldBounds(true);

    _this.body.setSize(_this.width * 0.12, _this.height * 0.16);

    _this.cursors = scene.input.keyboard.createCursorKeys();
    _this.healthStates = {
      IDLE: 'IDLE',
      DAMAGE: 'DAMAGE'
    };
    _this.healthState = _this.healthStates.IDLE;
    _this.damageTime = 0;
    return _this;
  }

  _createClass(Charakter, [{
    key: "handleDamage",
    value: function handleDamage(dir) {
      if (this.healthState === this.healthStates.DAMAGE) {
        return;
      }

      this.setVelocity(dir.x, dir.y);
      this.setTint(0xff0000);
      this.healthState = this.healthStates.DAMAGE;
      this.damageTime = 0;
    }
  }, {
    key: "preUpdate",
    value: function preUpdate(t, delta) {
      _get(_getPrototypeOf(Charakter.prototype), "preUpdate", this).call(this, t, delta);

      switch (this.healthState) {
        case this.healthStates.IDLE:
          break;

        case this.healthStates.DAMAGE:
          this.damageTime += delta;

          if (this.damageTime >= 250) {
            this.healthState = this.healthStates.IDLE;
            this.setTint(0xffffff);
            this.damageTime = 0;
          }

          break;
      }
    }
  }, {
    key: "update",
    value: function update() {
      if (this.healthState === this.healthStates.DAMAGE) {
        return;
      }

      var speed = 70;
      var animKey = 'charakter-idle';

      if (this.cursors.left.isDown) {
        this.setVelocity(-speed, 0);
        this.scaleX = -1;
        this.body.offset.x = 56;
        animKey = 'charakter-walk';
      } else if (this.cursors.right.isDown) {
        this.setVelocity(speed, 0);
        this.scaleX = 1;
        this.body.offset.x = 44;
        animKey = 'charakter-walk';
      } else if (this.cursors.up.isDown) {
        this.setVelocity(0, -speed);
        animKey = 'charakter-walk';
      } else if (this.cursors.down.isDown) {
        this.setVelocity(0, speed);
        animKey = 'charakter-walk';
      } else {
        this.setVelocity(0, 0);
      }

      this.anims.play(animKey, true);
    }
  }]);

  return Charakter;
}(_phaser["default"].Physics.Arcade.Sprite);

var _default = Charakter;
exports["default"] = _default;