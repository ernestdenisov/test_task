var game = new Phaser.Game(
	640,
	480,
	Phaser.AUTO,
	'my_canvas'
);

window.onload = function(){

	var mainScreen = null;
	var graphics = null;
	var sky = null;
	var shapeColor = null;
	var shapes = null;
	var shapesCounter = 0;

	var shapesAmountText = document.getElementsByClassName("shapes_amount");
	var surfaceAreaText = document.getElementsByClassName("surface_area");
	var numberPerSecText = document.getElementsByClassName("number_per_sec");
	var gravityValueText = document.getElementsByClassName("gravity_value");

	var minusNumberBtn = document.getElementsByClassName("minus")[0];
	var plusNumberBtn = document.getElementsByClassName("plus")[0];
	var minusGravityBtn = document.getElementsByClassName("minus")[1];
	var plusGravityBtn = document.getElementsByClassName("plus")[1];

	var numberPerSec = 1;
	var gravityValue = 100;
	var commonShapesArea = 0;

	mainScreen = function(){}
	mainScreen.prototype = {

		//preload background image
		preload: function(){
			game.load.image('sky', 'assets/sky.png');
		},

		//create the stage
		create: function(){
			sky = game.add.tileSprite(0, - game.height, game.width, game.height, 'sky');
    		sky.scale.setTo(1, 2);
			sky.inputEnabled = true;
			sky.events.onInputDown.add(addShapeByClick, this);
			game.physics.startSystem(Phaser.Physics.ARCADE);
			game.physics.arcade.gravity.y = gravityValue;
			shapes = game.add.group();
		},

		//update the stage 60 times per second
		update: function(){
			shapes.forEach(destroy, this);
			shapes.forEach(display, this);
			shapesAmountText[0].textContent = "Number of current shapes: " + shapesCounter;
			surfaceAreaText[0].textContent = "Surface area occupied by shapes: " + commonShapesArea;
			numberPerSecText[0].textContent = "Number of shapes per sec: " + numberPerSec;
			gravityValueText[0].textContent = "Gravity Value: " + gravityValue;
			game.physics.arcade.gravity.y = gravityValue;
		},
	}

	//////////////////////////////////////////////
	//				  BUTTONS					//
	//////////////////////////////////////////////
	minusNumberBtn.addEventListener("click",
		function () {
			if (numberPerSec > 1) {
				numberPerSec--;
			}
			clearInterval(shapesInterval);
			shapesInterval = setInterval(
				function () {
					let deltaX = Math.floor(Math.random() * 400 + 100);
					let deltaY = -150;
					addShape(deltaX, deltaY);
				}, 1000/numberPerSec
			);
		}
	);
	plusNumberBtn.addEventListener("click",
		function () {
			numberPerSec++;
			clearInterval(shapesInterval);
			shapesInterval = setInterval(
				function () {
					let deltaX = Math.floor(Math.random() * 400 + 100);
					let deltaY = -150;
					addShape(deltaX, deltaY);
				}, 1000/numberPerSec
			);
		}
	);
	minusGravityBtn.addEventListener("click",
		function () {
			gravityValue--;
		}
	);
	plusGravityBtn.addEventListener("click",
		function () {
			gravityValue++;
		}
	);

	var shapesInterval = setInterval(
		function () {
			let deltaX = Math.floor(Math.random() * 400 + 100);
			let deltaY = -150;
			addShape(deltaX, deltaY);
		}, 1000/numberPerSec
	);

	function addShapeByClick() {
		let cursorX = game.input.x;
		let cursorY = game.input.y;
		addShape(cursorX, cursorY);
	}

	//////////////////////////////////////////////
	//			SHAPE ADDING FUNCTION			//
	//////////////////////////////////////////////
	function addShape(deltaX, deltaY){
		let _deltaX = deltaX;
		let _deltaY = deltaY;
		graphics = game.add.graphics(0, 0);
		graphics.inputEnabled = true;
		graphics.events.onInputDown.add(destroyByClick, graphics);
		graphics.input.priorityID = 1;
		shapeColor = makeRandomHex();
		graphics.beginFill(shapeColor);		
		graphics.lineStyle(1, 0x000000, 1);
		let type = Math.floor(Math.random() * 4);
		switch (type){
			case 0:
				graphics.drawPolygon(_deltaX, _deltaY,
			 	_deltaX + 100, _deltaY + 50, _deltaX + 50, _deltaY + 100);
				graphics.square = commonShapesArea - shapeSquare([
					[_deltaX, _deltaY], [_deltaX + 100, _deltaY + 50],
					[_deltaX + 50, _deltaY + 100]
				]);
				graphics.squareIsChecked = false;
				graphics.isInScreen = false;
				break;
			case 1:
				graphics.drawPolygon(_deltaX, _deltaY,
			 	_deltaX + 100, _deltaY,
				_deltaX + 100, _deltaY + 100,
				_deltaX, _deltaY + 100);
				graphics.square = commonShapesArea - shapeSquare([
					[_deltaX, _deltaY], [_deltaX + 100, _deltaY],
					[_deltaX + 100, _deltaY + 100], [_deltaX, _deltaY + 100]
				]);
				graphics.squareIsChecked = false;
				graphics.isInScreen = false;
				break;
			case 2:
				graphics.drawPolygon(_deltaX, _deltaY,
			 	_deltaX + 80, _deltaY + 50, _deltaX + 50, _deltaY + 100,
				_deltaX - 50, _deltaY + 100, _deltaX - 80, _deltaY + 50);
				graphics.square = commonShapesArea - shapeSquare([
					[_deltaX, _deltaY], [_deltaX + 80, _deltaY + 50],
					[_deltaX + 50, _deltaY + 100], [_deltaX - 50, _deltaY + 100],
					[_deltaX - 80, _deltaY + 50]
				]);
				graphics.squareIsChecked = false;
				graphics.isInScreen = false;
				break;
			case 3:
				graphics.drawPolygon(_deltaX, _deltaY,
			 	_deltaX + 60, _deltaY + 50, _deltaX + 60, _deltaY + 100,
				_deltaX, _deltaY + 150, _deltaX - 60, _deltaY + 100,
				_deltaX - 60, _deltaY + 50);
				graphics.square = commonShapesArea - shapeSquare([
					[_deltaX, _deltaY], [_deltaX + 60, _deltaY + 50],
					[_deltaX + 60, _deltaY + 100], [_deltaX, _deltaY + 150],
					[_deltaX - 60, _deltaY + 100], [_deltaX - 60, _deltaY + 50]
				]);
				graphics.squareIsChecked = false;
				graphics.isInScreen = false;
				break;
		}
		graphics.endFill();
		game.physics.enable(graphics, Phaser.Physics.ARCADE);
		shapes.add(graphics);
	}

	//////////////////////////////////////////////
	//			CONVERT RGB TO HEX	  			//
	//////////////////////////////////////////////
	function makeRandomHex(){
		let r, g, b;
		r = Math.floor(Math.random()*256).toString(16);
		g = Math.floor(Math.random()*256).toString(16);
		b = Math.floor(Math.random()*256).toString(16);
		return parseInt("0x" + r + g + b);
	}

	//////////////////////////////////////////////
	//			 SHAPE DESTROY					//
	//////////////////////////////////////////////
	function destroy(graphics){
		let _graphics = graphics;
		if(_graphics.y > 640){
			_graphics.scale.x = 0;
			_graphics.scale.y = 0;
			if(!_graphics.squareIsChecked){
				updateOccupiedArea(_graphics.square);
				_graphics.squareIsChecked = true;
				shapesCounter--;
			}
			_graphics = null;
		}
	}
	
	//////////////////////////////////////////////
	//			 SHAPE DISPLAY					//
	//////////////////////////////////////////////
	function display(graphics){
		let _graphics = graphics;
		if(_graphics.y > 10){
			if(!_graphics.isInScreen){
				_graphics.isInScreen = true;
				shapesCounter++;
			}
		}
	}

	function destroyByClick(){
		this.scale.x = 0;
		this.scale.y = 0;
		if(!this.squareIsChecked){
			updateOccupiedArea(this.square);
			this.squareIsChecked = true;
		}
		shapesCounter--;
	}

	function updateOccupiedArea(_graphicsSquare) {
		commonShapesArea += _graphicsSquare;
	}

	//////////////////////////////////////////////
	//				SHAPE SQUARE				//
	//////////////////////////////////////////////
	function shapeSquare(array){
		for(let i = 0; i < array.length; i++){
			if (i == array.length - 1) {
				commonShapesArea += (array[i][0] * array[0][1] - array[i][1] * array[0][0])/2;
			}else {
				commonShapesArea += (array[i][0] * array[i+1][1] - array[i][1] * array[i+1][0])/2;
			}
		}
		return commonShapesArea;
	}
	
	game.state.add('mainScreen', mainScreen);
	game.state.start('mainScreen');
}
